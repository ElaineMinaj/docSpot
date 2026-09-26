Put Elaine's cleaned export here as physicians.js:

const REAL_PHYSICIANS = [
  {"provider_full_name": "...", "primary_taxonomy_description": "...",
   "full_practice_address": "...", "primary_practice_phone": "...",
   "primary_practice_fax": "...", "npi": "..."},
  ...
];

---

access_sample.json: fictional telehealth and clinical-trial sample data for the
"Telehealth & clinical trials" feature. The app loads it through access.js
(browsers block reading .json files when index.html is opened from disk).
After editing the JSON, regenerate access.js from the frontend/data folder:

python3 -c "import json; d=json.load(open('access_sample.json')); open('access.js','w').write('// GENERATED from access_sample.json. Edit the JSON, then regenerate (see data/README.md).\n// Fictional sample data for the telehealth and clinical-trial access feature.\nconst ACCESS_DATA = '+json.dumps(d,indent=1,ensure_ascii=False)+';\n')"

---

The app works without physicians.js (demo physicians only). With it, real
Atlanta-area clinicians appear in recommendations and are reached by
simulated fax. Clinicians without a fax number, or with a specialty the
app doesn't use, are skipped.
