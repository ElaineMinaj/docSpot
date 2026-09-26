# Colleague Connect

Colleague Connect is a browser-based prototype for helping physicians find colleagues, coordinate referrals, and ask clinical questions. It combines a specialty-grouped physician connection map with guided referral and messaging workflows. The sender reviews each draft before the prototype simulates sending it.

> **Prototype notice:** This repository is a demonstration, not a production clinical communication system. The included patient records and access data are sample data. Do not enter real patient information or use the app to send real referrals or clinical messages.

## What the app includes

- **Specialty-grouped connection map:** the physician is at the center, with colleague groups arranged into specialty segments. Larger, separated physician nodes, segment labels, and short connection lines help distinguish specialties. A compact key identifies connected, joining, and pending relationships.
- **Physician network and recommendations:** browse colleagues, see relationship and practice context, and find suggested physicians for a patient's specialty. If `frontend/data/physicians.js` is present, eligible clinicians from the cleaned NPI export can also appear as outside-network recommendations.
- **Referral workflow:** choose a patient and physician, review the recipient and referral purpose, edit the fax draft, review the privacy check, and approve it. The simulated delivery flow includes status tracking and an audit trail.
- **Telehealth and clinical-trial discovery:** browse the fictional access specialists and studies supplied in `frontend/data/access_sample.json`.
- **Clinical questions and connection invitations:** route a question to a likely specialty or invite a physician to connect. The prototype includes a simulated recipient response flow.
- **Privacy checks:** local pattern rules check drafts for identifiers and prohibited patient details. When the backend and an AI provider are configured, the server can add an AI-assisted check and generate referral or connection drafts. Drafts fall back to local templates when AI is unavailable.

## Repository layout

```text
frontend/
  index.html             Browser entry point
  css/styles.css         Layout, map, and component styles
  data/physicians.js     Optional cleaned clinician export (not required)
  data/access_sample.json
  data/access.js         Generated JavaScript copy of access sample data
  js/data.js             Demo network, patient seeds, and data helpers
  js/logic.js            Recommendations and workflow logic
  js/views.js            HTML and SVG rendering
  js/main.js             Startup, rendering, and user interactions
  js/api.js              Backend calls and browser-side privacy fallback
  vendor/qrcode.js       QR-code library used by the fax preview
backend/
  main.py                FastAPI health, draft, and privacy-check endpoints
  ai.py                  OpenAI/Anthropic provider wrapper
  privacy.py             Server-side pattern privacy checks
  requirements.txt       Python dependencies
  .env.example           Optional AI configuration template
pipeline/
  NPI_Processed (2).ipynb Data-cleaning notebook
```

The frontend uses plain JavaScript and CSS; there is no frontend package manager or build step. Script order in `frontend/index.html` matters: `main.js` must remain last.

## Run locally

### 1. Start the frontend

From the repository root, serve the `frontend/` directory with any static HTTP server. For example:

```bash
python3 -m http.server 5500 --directory frontend
```

Then open <http://localhost:5500> in a browser. Serving over HTTP (instead of opening `index.html` as a `file://` URL) lets the browser load the JSON-backed app data correctly.

### 2. Optional: start the backend

The frontend works without the backend: referral drafts use local templates, and privacy checks use browser-side pattern rules. To enable server-side privacy checks and optional AI-generated referral/connection drafts, open a second terminal:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The backend health endpoint is <http://127.0.0.1:8000/health>. The browser client currently calls this local URL, so run the backend on port `8000` when using it.

### 3. Optional: configure an AI provider

Copy `backend/.env.example` to `backend/.env`, then set **one** provider key:

```dotenv
OPENAI_API_KEY=your-key
# OPENAI_MODEL=gpt-4.1-mini

# Or use Anthropic instead:
# ANTHROPIC_API_KEY=your-key
# CLAUDE_MODEL=claude-opus-5
```

If both keys are present, the backend selects OpenAI. Keep `.env` private; it is excluded by `.gitignore`. Without a key, the backend still serves local privacy rules and reports that AI drafting is unavailable. With the backend stopped, the browser uses its own privacy rules and draft templates.

## Data notes

### Demo network and patient records

`frontend/js/data.js` contains the built-in physician and patient examples. The patient records are fictional seed data used to demonstrate the workflows. Keep them fictional and avoid replacing them with identifiable patient data.

### Optional clinician export

Place a cleaned NPI export at `frontend/data/physicians.js` using the `REAL_PHYSICIANS` array format documented in [frontend/data/README.md](frontend/data/README.md). The file is optional; without it, the app uses the built-in demo physician network. The app maps supported taxonomy descriptions to its specialty categories and skips records without a usable fax number or supported specialty. Exported clinician information appears as outside-network recommendation data; fax delivery remains simulated.

### Telehealth and clinical-trial sample data

Edit `frontend/data/access_sample.json` as needed. After editing, regenerate the JavaScript data file from the `frontend/data/` directory:

```bash
python3 -c "import json; d=json.load(open('access_sample.json')); open('access.js','w').write('// GENERATED from access_sample.json. Edit the JSON, then regenerate (see data/README.md).\\n// Fictional sample data for the telehealth and clinical-trial access feature.\\nconst ACCESS_DATA = '+json.dumps(d,indent=1,ensure_ascii=False)+';\\n')"
```

`access.js` is loaded directly by the browser because browsers restrict a page opened from disk from reading local JSON files. The provided access specialists, locations, and clinical-trial records are fictional examples.

## Backend endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /health` | Reports backend availability and configured AI provider/model. |
| `POST /ai/draft` | Generates a constrained referral or connection draft when an AI provider is configured. The request schema intentionally accepts structured professional and request metadata, not a patient chart or free-text topic. |
| `POST /ai/privacy-check` | Runs server-side pattern checks and, when configured, supplements them with an AI privacy review. |

The browser has a matching privacy-rule implementation in `frontend/js/api.js`; keep it aligned with `backend/privacy.py` when changing privacy behavior. AI draft checks and privacy checks are separate from the prototype's simulated send flow.

## Main workflow locations

- Connection map and home view: `frontend/js/views.js` (`graphSVG`, `viewNetwork`)
- Review step, fax preview, and privacy panel: `frontend/js/views.js` (`stepReview`, `privacyBox`)
- Event handling and rendering startup: `frontend/js/main.js`
- Recommendations, draft creation, and privacy request shaping: `frontend/js/logic.js`
- Browser-to-backend API and browser privacy fallback: `frontend/js/api.js`
- Backend API and request validation: `backend/main.py`
- Server privacy rules: `backend/privacy.py`

## Development notes

- The frontend is intentionally dependency-light and has no compile step. Edit the source files and refresh the browser.
- The backend allows cross-origin requests for this local prototype so the static frontend can call it from a separate local port.
- Requests and delivery statuses are simulated in the browser. The prototype does not connect to a fax service, a clinical record system, or a production physician directory.
- Do not commit `backend/.env`, API keys, real patient information, or unreviewed exports containing personal information.
