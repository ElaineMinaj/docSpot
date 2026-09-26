"""Colleague Connect backend: AI features for the e-fax workflow (OpenAI or Claude).

Run from the backend/ folder:  uvicorn main:app --reload --port 8000
The API key lives in backend/.env (never in the browser).
"""
import re
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

from typing import List, Optional  # noqa: E402

from fastapi import FastAPI  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from pydantic import BaseModel  # noqa: E402

import ai  # noqa: E402
from privacy import pattern_check  # noqa: E402

app = FastAPI(title="Colleague Connect AI")
# Local prototype: the page is opened from Live Server or straight from disk
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"ok": True, "ai": ai.available(), "provider": ai.provider(), "model": ai.model()}


# ---------- Draft ----------

class Person(BaseModel):
    name: str
    specialty: str = ""
    practice: str = ""
    city: str = ""
    npi: str = ""


class DraftRequest(BaseModel):
    type: str                      # referral | collab | question | connect
    channel: str = "fax"           # fax | in-app
    recipient: Person
    recipient_on_impiricus: bool = False
    sender: Person
    topic: str = ""
    question: str = ""
    # ONLY the patient fields the physician checked. Identifiers are never sent here.
    shared: dict = {}


DRAFT_SYSTEM = """You write short, professional physician-to-physician correspondence for Colleague Connect, a feature of Impiricus.
The sending physician reviews and approves every draft before it is sent.

Rules:
- Write only the body: start with a greeting to the recipient (e.g. "Dr. Sato,") and stop before any sign-off. The app adds the signature and the reply instructions.
- Under 120 words.
- Use ONLY the information provided. Never invent or infer symptoms, history, doses, dates, lab values, or findings.
- Include every piece of shared patient information given, stated plainly.
- Never include a patient name, date of birth, record number, address, or phone number. Refer to "a patient" or "the patient".
- Do not include any numbers other than the ones in the information provided.
- No clinical advice, no treatment recommendations, no claims about any drug's effectiveness or safety.
- For a clinical question: include the question exactly as written, in quotation marks, and ask for the colleague's perspective. Never answer or comment on the question yourself.
- Plain text, no markdown."""

TYPE_ASK = {
    "referral": "a referral asking the recipient to evaluate the patient",
    "collab": "a request for a short discussion about coordinating care for a shared patient or a treatment the recipient has experience with",
    "question": "a colleague question asking for the recipient's perspective",
    "connect": "an invitation to connect on Colleague Connect, a secure way for physicians to share referrals and questions",
}
FIELD_LABEL = {"agesex": "Age and sex", "dx": "Relevant diagnoses", "meds": "Current medications",
               "labs": "Recent labs", "support": "Patient support (include this sentence exactly as written)"}


def _numbers(s):
    return set(re.findall(r"\d+(?:\.\d+)?", s))


def _signature(s: Person):
    return f"Thank you,\n{s.name}, {s.specialty}\n{s.practice}, {s.city}\nNPI {s.npi}"


@app.post("/ai/draft")
def draft(req: DraftRequest):
    if req.type not in TYPE_ASK:
        return {"text": None, "reason": "unknown type"}
    if not ai.available():
        return {"text": None, "reason": "no API key"}
    shared_lines = []
    for key, label in FIELD_LABEL.items():
        v = req.shared.get(key)
        if v:
            shared_lines.append(f"{label}: {'; '.join(v) if isinstance(v, list) else v}")
    user = (
        f"Write {TYPE_ASK[req.type]}.\n"
        f"Delivery: {'secure fax' if req.channel == 'fax' else 'secure in-app message'}\n"
        f"From: {req.sender.name}, {req.sender.specialty}, {req.sender.practice}\n"
        f"To: {req.recipient.name}, {req.recipient.specialty}\n"
        + (f"Topic: {req.topic}\n" if req.topic and req.type != "question" else "")
        + (f'Question: "{req.question}"\n' if req.type == "question" else "")
        + ("Shared patient information (use all of it, nothing else):\n" + "\n".join(shared_lines) if shared_lines
           else "No patient information is shared.")
    )
    body = ai.ask_text(DRAFT_SYSTEM, user, timeout=5.5)
    if not body:
        return {"text": None, "reason": "AI unavailable or too slow"}
    # Guardrails: reject drafts with numbers that weren't in the input, or that drop the question
    extra = _numbers(body) - _numbers(user)
    if extra:
        return {"text": None, "reason": f"draft added details not in the input ({', '.join(sorted(extra))})"}
    if req.type == "question" and req.question.strip() and req.question.strip() not in body:
        return {"text": None, "reason": "draft did not quote the question exactly"}
    closing = ""
    if not req.recipient_on_impiricus:
        closing = ("\n\nYou can reply through the secure link on this fax, no account needed. "
                   "You may also choose to join Impiricus (free, verified physicians only).")
    return {"text": f"{body.strip()}{closing}\n\n{_signature(req.sender)}", "model": ai.model()}


# ---------- Privacy check ----------

class Patient(BaseModel):
    """Mock patient record from the prototype (fictional data only)."""
    name: Optional[str] = None
    dob: Optional[str] = None
    mrn: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    dx: List[str] = []
    meds: List[str] = []
    labs: List[str] = []


class PrivacyRequest(BaseModel):
    text: str
    patient: Optional[Patient] = None
    approved: List[str] = []   # ids of the fields the physician checked
    topic: str = ""
    allowed: List[str] = []    # contact details that are fine to include (sender/recipient fax)


PRIVACY_SYSTEM = """You review a fax or message that one physician is about to send to another.
Your only job is to flag text that should not be sent. You never give clinical advice.

Flag text that:
- identifies the patient (name, date of birth, record number, phone, address, email, employer, or other unique detail), or
- states a clinical detail (diagnosis, medication, dose, lab, symptom, history) that is NOT in the approved information and NOT in the topic.

Do not flag: the approved information, the topic, the sender's own name/practice/NPI, the recipient's name, generic invitation or sign-off text.
Each flag's "text" must be copied exactly, character for character, from the draft. Return an empty list if nothing should be flagged."""

PRIVACY_SCHEMA = {
    "type": "object",
    "properties": {
        "flags": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {"text": {"type": "string"}, "reason": {"type": "string"}},
                "required": ["text", "reason"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["flags"],
    "additionalProperties": False,
}

FIELD_NAMES = {"agesex": "age and sex", "dx": "diagnoses", "meds": "medications", "labs": "labs"}


def _approved_summary(req):
    """What the physician approved, in words. Identifiers are never sent to the model."""
    p, lines = req.patient, []
    if p:
        if "agesex" in req.approved and p.age:
            lines.append(f"Age and sex: {p.age}, {'female' if p.sex == 'F' else 'male'}")
        if "dx" in req.approved:
            lines.append("Diagnoses: " + "; ".join(p.dx))
        if "meds" in req.approved:
            lines.append("Medications: " + "; ".join(p.meds))
        if "labs" in req.approved:
            lines.append("Labs: " + "; ".join(p.labs))
    not_approved = [FIELD_NAMES[k] for k in FIELD_NAMES if p and k not in req.approved]
    return lines, not_approved


@app.post("/ai/privacy-check")
def privacy_check(req: PrivacyRequest):
    patient = req.patient.model_dump() if req.patient else None
    flags = [dict(f, source="pattern") for f in pattern_check(req.text, patient, req.approved, req.topic, req.allowed)]
    used_ai = False
    if ai.available():
        lines, not_approved = _approved_summary(req)
        user = (
            f"Topic (always shared): {req.topic or 'none'}\n"
            f"Approved patient information:\n" + ("\n".join(lines) or "none") + "\n"
            f"Not approved for sharing: {', '.join(not_approved) or 'nothing'}\n\n"
            f"Draft:\n<<<\n{req.text}\n>>>"
        )
        out = ai.ask_json(PRIVACY_SYSTEM, user, PRIVACY_SCHEMA, timeout=8)
        if out is not None:
            used_ai = True
            have = {f["text"].lower() for f in flags}
            for f in out.get("flags", []):
                t = (f.get("text") or "").strip()
                # Keep only flags that quote the draft exactly and that the patterns didn't already catch
                if t and t in req.text and t.lower() not in have and not any(t.lower() in h or h in t.lower() for h in have):
                    flags.append({"text": t, "reason": f.get("reason", "Flagged by the AI check."), "kind": "ai", "source": "ai"})
                    have.add(t.lower())
    return {"flags": flags, "mode": "ai" if used_ai else "patterns"}
