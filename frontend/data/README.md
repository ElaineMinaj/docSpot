Put Elaine's cleaned export here as physicians.js:

const REAL_PHYSICIANS = [
  {"provider_full_name": "...", "primary_taxonomy_description": "...",
   "full_practice_address": "...", "primary_practice_phone": "...",
   "primary_practice_fax": "...", "npi": "..."},
  ...
];

The app works without this file (demo physicians only). With it, real
Atlanta-area clinicians appear in recommendations and are reached by
simulated fax. Clinicians without a fax number, or with a specialty the
app doesn't use, are skipped.
