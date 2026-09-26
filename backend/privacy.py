"""Pattern-based privacy check for fax drafts.

Runs with no API key. Flags patient identifiers (name, initials, date of birth,
MRN), contact details (phone, fax, email, street address), demographics, and
clinical details beyond the selected general concern. The frontend has a matching copy in
frontend/js/api.js for when this server is off; keep the two in step.
"""
import re

PHONE = re.compile(r"\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b")
EMAIL = re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.]+\b")
SSN = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
DATE = re.compile(r"\b\d{1,2}[/-]\d{1,2}[/-](?:\d{4}|\d{2})\b")
MRN = re.compile(r"\b(?:MRN|medical record(?: number)?)\b[\s:#.]*[\w…-]*", re.I)
# "Dr" is left out on purpose: "6 patients to Dr. Sato" would look like an address.
ADDRESS = re.compile(
    r"\b\d{1,6}[ \t]+(?:[A-Za-z0-9.]+[ \t]+){0,4}"
    r"(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Drive|Ln|Lane|Way|Ct|Court|Pkwy|Parkway|Hwy|Highway|Pl|Place)\b\.?"
)
BROAD_CONCERNS = {
    "inflammatory_arthritis": "inflammatory arthritis",
    "type_2_diabetes": "type 2 diabetes",
    "atrial_fibrillation": "atrial fibrillation",
    "kidney_disease": "kidney disease",
    "plaque_psoriasis": "plaque psoriasis",
    "chronic_migraine": "chronic migraine",
    "crohns_disease": "crohn's disease",
    "specialty_concern": "a concern requiring specialty care",
}


def _norm(s):
    return re.sub(r"\s+", " ", str(s or "")).strip().lower().replace("’", "'").replace("‘", "'")


def pattern_check(text, patient=None, approved=None, topic="", allowed=None):
    """Return a list of {text, reason, kind} flags found in `text`.

    patient:  local patient record used only for the pattern comparison, or None
    approved: currently only the selected broad concern (dx) can be approved
    topic:    context only; it never makes patient details exempt from checking
    allowed:  strings that are fine to include (the sender's and recipient's fax numbers, etc.)
    """
    approved = set(approved or [])
    allowed_norm = {_norm(a) for a in (allowed or []) if a}
    allowed_digits = {re.sub(r"\D", "", a) for a in (allowed or []) if a}
    flags, seen = [], set()

    def add(snippet, reason, kind):
        key = (_norm(snippet), kind)
        if snippet and key not in seen:
            seen.add(key)
            flags.append({"text": snippet, "reason": reason, "kind": kind})

    def find_phrase(phrase):
        """Case-insensitive whole-phrase search; returns the matching text as written, or None."""
        if not phrase or len(phrase.strip()) < 2:
            return None
        m = re.search(r"(?<!\w)" + re.escape(phrase.strip()) + r"(?!\w)", text, re.I)
        return m.group(0) if m else None

    # 1. Patient identifiers (never allowed in a draft; released only after acceptance)
    if patient:
        initials = patient.get("initials") or ""
        if initials and find_phrase(initials):
            add(find_phrase(initials), "Patient initials are not permitted in this fax.", "identifier")
        name = patient.get("name") or ""
        for part in [name] + name.split():
            if len(part) < 3:
                continue
            # Skip "Dr. Price" when the patient's surname is also a physician's name
            for m in re.finditer(r"(?<!\w)" + re.escape(part) + r"(?!\w)", text, re.I):
                if not re.search(r"\bDr\.?\s*$", text[:m.start()]):
                    add(m.group(0), "Patient name. Identifiers are released only after the patient consents.", "identifier")
                    break
        dob = patient.get("dob")
        if dob and find_phrase(dob):
            add(find_phrase(dob), "Patient date of birth. Released only after the patient consents.", "identifier")
        mrn_digits = re.sub(r"\D", "", patient.get("mrn") or "")
        if len(mrn_digits) >= 3:
            m = re.search(r"(?<!\d)" + mrn_digits + r"(?!\d)", text)
            if m:
                add(m.group(0), "Looks like the patient's medical record number.", "identifier")
    for m in MRN.finditer(text):
        add(m.group(0).strip(), "Medical record number. Don't include record numbers in the fax.", "identifier")
    for m in DATE.finditer(text):
        add(m.group(0), "A full date could be a date of birth. Use age instead.", "identifier")
    for m in SSN.finditer(text):
        add(m.group(0), "Looks like a Social Security number.", "identifier")

    # 2. Contact details that aren't the sender's or recipient's own
    for m in PHONE.finditer(text):
        if re.sub(r"\D", "", m.group(0))[-10:] not in {d[-10:] for d in allowed_digits}:
            add(m.group(0), "Phone or fax number that isn't yours or the recipient's. It could identify the patient.", "contact")
    for m in EMAIL.finditer(text):
        if _norm(m.group(0)) not in allowed_norm:
            add(m.group(0), "Email address. It could identify the patient.", "contact")
    for m in ADDRESS.finditer(text):
        add(m.group(0).strip(), "Street address. It could identify the patient.", "contact")

    # Only the selected broad concern may appear. Demographics, medications, labs,
    # and any more detailed diagnosis are never faxed, even if a client marks them approved.
    if patient:
        age = patient.get("age")
        m = re.search(rf"\b{age}[- ]?(?:year|yo\b|y/o)", text, re.I) if age else None
        if m:
            add(m.group(0), "Patient age is not permitted in this fax.", "unapproved")
        sex_label = {"F": "female", "M": "male"}.get(patient.get("sex"))
        if sex_label and find_phrase(sex_label):
            add(find_phrase(sex_label), "Patient sex is not permitted in this fax.", "unapproved")
        for items, reason in [
            (patient.get("meds") or [], "Medication information is not permitted in this fax."),
            (patient.get("labs") or [], "Lab results are not permitted in this fax."),
        ]:
            for item in items:
                candidates = [item, re.split(r"\s(?=\d)|,", item)[0].strip()]
                for candidate in candidates:
                    hit = find_phrase(candidate)
                    if hit:
                        add(hit, reason, "unapproved")
                        break
        allowed_concern = _norm(BROAD_CONCERNS.get(patient.get("general_concern"), ""))
        for item in patient.get("dx") or []:
            general = re.split(r"[,;]|\b(?:suspected|about|new|with)\b", item, maxsplit=1, flags=re.I)[0].strip()
            full_hit, general_hit = find_phrase(item), find_phrase(general)
            if full_hit and _norm(item) != _norm(general):
                add(full_hit, "Detailed diagnosis information is not permitted; share only the selected general concern.", "unapproved")
            if general_hit and _norm(general) != allowed_concern:
                add(general_hit, "Only the selected general concern may be shared.", "unapproved")
            if general_hit and "dx" not in approved:
                add(general_hit, "The general concern was not approved for sharing.", "unapproved")
    # Drop a flag when a longer flag already covers it ("Reyes" inside "Maria Reyes")
    return [f for f in flags if not any(
        g is not f and len(g["text"]) > len(f["text"]) and f["text"].lower() in g["text"].lower() for g in flags)]
