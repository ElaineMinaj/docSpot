"""Pattern-based privacy check for fax and message drafts.

Runs with no API key. Flags patient identifiers (name, date of birth, MRN),
contact details (phone, fax, email, street address), and clinical details from
fields the physician did NOT check. The frontend has a matching copy in
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


def _norm(s):
    return re.sub(r"\s+", " ", str(s or "")).strip().lower()


def pattern_check(text, patient=None, approved=None, topic="", allowed=None):
    """Return a list of {text, reason, kind} flags found in `text`.

    patient:  mock patient record (name, dob, mrn, age, sex, dx, meds, labs), or None
    approved: ids of the fields the physician checked (agesex, dx, meds, labs, ...)
    topic:    the reason for referral or discussion topic (always shared, so never flagged)
    allowed:  strings that are fine to include (the sender's and recipient's fax numbers, etc.)
    """
    approved = set(approved or [])
    allowed_norm = {_norm(a) for a in (allowed or []) if a}
    allowed_digits = {re.sub(r"\D", "", a) for a in (allowed or []) if a}
    low_topic = _norm(topic)
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
        name = patient.get("name") or ""
        for part in [name] + name.split():
            if len(part) < 3:
                continue
            # Skip "Dr. Price" when the patient's surname is also a physician's name
            for m in re.finditer(r"(?<!\w)" + re.escape(part) + r"(?!\w)", text, re.I):
                if not re.search(r"\bDr\.?\s*$", text[:m.start()]):
                    add(m.group(0), "Patient name. Identifiers are released through the secure link only after the physician accepts.", "identifier")
                    break
        dob = patient.get("dob")
        if dob and find_phrase(dob):
            add(find_phrase(dob), "Patient date of birth. Released only after the physician accepts.", "identifier")
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

    # 3. Clinical details from fields the physician left unchecked
    if patient:
        if "agesex" not in approved:
            age = patient.get("age")
            m = re.search(rf"\b{age}[- ]?(?:year|yo\b|y/o)", text, re.I) if age else None
            if m:
                add(m.group(0), "Age wasn't checked for sharing.", "unapproved")
        checks = [
            ("dx", patient.get("dx") or [], "Diagnosis wasn't checked for sharing."),
            ("meds", patient.get("meds") or [], "Medications weren't checked for sharing."),
            ("labs", patient.get("labs") or [], "Labs weren't checked for sharing."),
        ]
        for field, items, reason in checks:
            if field in approved:
                continue
            for item in items:
                # The full item, and for meds and labs the leading name (e.g. "Prednisone", "CRP")
                candidates = [item]
                if field in ("meds", "labs"):
                    lead = re.split(r"\s(?=\d)|,", item)[0].strip()
                    candidates.append(lead)
                for c in candidates:
                    if _norm(c) in low_topic:
                        continue  # the topic is always shared, so it's fine
                    hit = find_phrase(c)
                    if hit:
                        add(hit, reason, "unapproved")
                        break
    # Drop a flag when a longer flag already covers it ("Reyes" inside "Maria Reyes")
    return [f for f in flags if not any(
        g is not f and len(g["text"]) > len(f["text"]) and f["text"].lower() in g["text"].lower() for g in flags)]
