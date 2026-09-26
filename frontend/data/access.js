// GENERATED from access_sample.json. Edit the JSON, then regenerate (see data/README.md).
// Fictional sample data for the telehealth and clinical-trial access feature.
const ACCESS_DATA = {
 "_meta": {
  "name": "Colleague Connect: telehealth and clinical-trial access sample data",
  "purpose": "Demo data for finding specialists who can reach patients in hospital deserts through telehealth, or through clinical trials that support travel.",
  "disclaimer": "ALL RECORDS ARE FICTIONAL SAMPLE DATA for the HackGT demo. Physicians, practices, fax numbers, trials, and sponsors are made up. Trial IDs start with DEMO- so they can't be confused with real ClinicalTrials.gov NCT numbers. City names and coordinates are real Georgia locations.",
  "distance_note": "miles_to_nearest_in_person_specialist is straight-line distance to the nearest specialist in this file who is accepting new patients",
  "patient_ids_match": "patient_locations[].patient_id matches PATIENTS_SEED ids in frontend/js/data.js",
  "ranking_rule": "Sponsor funding (including travel support) is a filter the physician chooses for the patient's benefit. It must never raise a physician's ranking.",
  "future_sources": [
   {
    "field": "Physician identity, specialty, practice address, fax",
    "source": "NPPES NPI Registry",
    "cost": "Free (public)",
    "status": "Already used in the prototype for 56 real Atlanta clinicians"
   },
   {
    "field": "Clinical trials, conditions, recruiting status, site locations, site contacts",
    "source": "ClinicalTrials.gov API",
    "cost": "Free (public)",
    "status": "Candidate. Travel support is usually not a structured field and would need sponsor or site confirmation"
   },
   {
    "field": "Whether a clinician offers telehealth",
    "source": "CMS Doctors and Clinicians national downloadable file (Care Compare)",
    "cost": "Free (public)",
    "status": "Candidate. Verify the telehealth field and how current it is before relying on it"
   },
   {
    "field": "Referral patterns, prescribing and treatment experience, physician affiliations",
    "source": "Commercial healthcare data providers (e.g., Symphony Health, IQVIA, Definitive Healthcare)",
    "cost": "Paid, licensed",
    "status": "Candidate partners to evaluate; contract and data-use terms needed"
   },
   {
    "field": "Hospital deserts / specialist shortage areas",
    "source": "HRSA Health Professional Shortage Areas (HPSA) data",
    "cost": "Free (public)",
    "status": "Candidate for flagging patients far from specialty care"
   },
   {
    "field": "Travel support offered by a trial",
    "source": "Trial sponsors and site coordinators (direct partnership)",
    "cost": "Partnership",
    "status": "Candidate; not reliably available in public data"
   }
  ]
 },
 "patient_locations": [
  {
   "patient_id": "pt1",
   "initials": "M.R.",
   "general_condition": "suspected rheumatoid arthritis",
   "needs": "Rheumatology",
   "home_city": "Blakely",
   "county": "Early",
   "state": "GA",
   "lat": 31.3777,
   "lng": -84.9341,
   "rural": true,
   "miles_to_nearest_in_person_specialist": 48,
   "notes": "No rheumatologist in the county; nearest accepting option is in Albany"
  },
  {
   "patient_id": "pt2",
   "initials": "J.T.",
   "general_condition": "type 2 diabetes above goal",
   "needs": "Endocrinology",
   "home_city": "Hazlehurst",
   "county": "Jeff Davis",
   "state": "GA",
   "lat": 31.8696,
   "lng": -82.5943,
   "rural": true,
   "miles_to_nearest_in_person_specialist": 82,
   "notes": "Limited specialty care nearby"
  },
  {
   "patient_id": "pt3",
   "initials": "A.K.",
   "general_condition": "declining kidney function",
   "needs": "Nephrology",
   "home_city": "Atlanta",
   "county": "Fulton",
   "state": "GA",
   "lat": 33.749,
   "lng": -84.388,
   "rural": false,
   "miles_to_nearest_in_person_specialist": 0,
   "notes": "Urban; included for contrast"
  },
  {
   "patient_id": "pt4",
   "initials": "D.L.",
   "general_condition": "plaque psoriasis",
   "needs": "Dermatology",
   "home_city": "Toccoa",
   "county": "Stephens",
   "state": "GA",
   "lat": 34.5773,
   "lng": -83.3321,
   "rural": true,
   "miles_to_nearest_in_person_specialist": 43,
   "notes": "The local dermatologist is not accepting new patients; next option is Athens"
  },
  {
   "patient_id": "pt5",
   "initials": "S.P.",
   "general_condition": "chronic migraine",
   "needs": "Neurology",
   "home_city": "Cuthbert",
   "county": "Randolph",
   "state": "GA",
   "lat": 31.7713,
   "lng": -84.7894,
   "rural": true,
   "miles_to_nearest_in_person_specialist": 40,
   "notes": "Randolph County has very limited specialty care"
  },
  {
   "patient_id": "pt6",
   "initials": "R.W.",
   "general_condition": "Crohn's disease with new joint pain",
   "needs": "Rheumatology",
   "home_city": "Waycross",
   "county": "Ware",
   "state": "GA",
   "lat": 31.2136,
   "lng": -82.354,
   "rural": true,
   "miles_to_nearest_in_person_specialist": 95,
   "notes": "Nearest accepting rheumatologist is in Savannah, about 95 miles away"
  }
 ],
 "specialists": [
  {
   "id": "acc-01",
   "name": "Dr. Lena Okoro",
   "credentials": "MD",
   "specialty": "Rheumatology",
   "practice": "Albany Arthritis and Rheumatology",
   "city": "Albany",
   "state": "GA",
   "lat": 31.5785,
   "lng": -84.1557,
   "fax": "(555) 013-2201",
   "accepting_new_patients": true,
   "typical_wait_days": 21,
   "languages": [
    "English",
    "Yoruba"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video",
     "phone"
    ],
    "licensed_states": [
     "GA",
     "AL"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": [
    "DEMO-RA-101"
   ]
  },
  {
   "id": "acc-02",
   "name": "Dr. Marcus Bell",
   "credentials": "MD",
   "specialty": "Rheumatology",
   "practice": "Columbus Rheumatology Center",
   "city": "Columbus",
   "state": "GA",
   "lat": 32.461,
   "lng": -84.9877,
   "fax": "(555) 013-2202",
   "accepting_new_patients": true,
   "typical_wait_days": 35,
   "languages": [
    "English"
   ],
   "telehealth": {
    "offered": false,
    "modalities": [],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": false
   },
   "trial_ids": []
  },
  {
   "id": "acc-03",
   "name": "Dr. Priya Natarajan",
   "credentials": "MD",
   "specialty": "Rheumatology",
   "practice": "Coastal Georgia Rheumatology",
   "city": "Savannah",
   "state": "GA",
   "lat": 32.0809,
   "lng": -81.0912,
   "fax": "(555) 013-2203",
   "accepting_new_patients": true,
   "typical_wait_days": 28,
   "languages": [
    "English",
    "Tamil"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video"
    ],
    "licensed_states": [
     "GA",
     "SC"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": [
    "DEMO-RA-102"
   ]
  },
  {
   "id": "acc-04",
   "name": "Dr. Samuel Ortega",
   "credentials": "DO",
   "specialty": "Rheumatology",
   "practice": "Metro Atlanta Inflammatory Arthritis Clinic",
   "city": "Atlanta",
   "state": "GA",
   "lat": 33.749,
   "lng": -84.388,
   "fax": "(555) 013-2204",
   "accepting_new_patients": false,
   "typical_wait_days": 60,
   "languages": [
    "English",
    "Spanish"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video"
    ],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": false
   },
   "trial_ids": [
    "DEMO-RA-101",
    "DEMO-RA-102"
   ]
  },
  {
   "id": "acc-05",
   "name": "Dr. Hannah Whitfield",
   "credentials": "MD",
   "specialty": "Endocrinology",
   "practice": "South Georgia Diabetes and Endocrine",
   "city": "Valdosta",
   "state": "GA",
   "lat": 30.8327,
   "lng": -83.2785,
   "fax": "(555) 013-2205",
   "accepting_new_patients": true,
   "typical_wait_days": 14,
   "languages": [
    "English"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video",
     "phone"
    ],
    "licensed_states": [
     "GA",
     "FL"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": []
  },
  {
   "id": "acc-06",
   "name": "Dr. Victor Amadi",
   "credentials": "MD",
   "specialty": "Endocrinology",
   "practice": "Macon Endocrinology Associates",
   "city": "Macon",
   "state": "GA",
   "lat": 32.8407,
   "lng": -83.6324,
   "fax": "(555) 013-2206",
   "accepting_new_patients": true,
   "typical_wait_days": 30,
   "languages": [
    "English",
    "Igbo"
   ],
   "telehealth": {
    "offered": false,
    "modalities": [],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": false
   },
   "trial_ids": [
    "DEMO-T2D-201"
   ]
  },
  {
   "id": "acc-07",
   "name": "Dr. Claire Donnelly",
   "credentials": "MD",
   "specialty": "Endocrinology",
   "practice": "Augusta Metabolic Health",
   "city": "Augusta",
   "state": "GA",
   "lat": 33.4735,
   "lng": -82.0105,
   "fax": "(555) 013-2207",
   "accepting_new_patients": true,
   "typical_wait_days": 18,
   "languages": [
    "English"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video"
    ],
    "licensed_states": [
     "GA",
     "SC"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": [
    "DEMO-T2D-201"
   ]
  },
  {
   "id": "acc-08",
   "name": "Dr. Ibrahim Haddad",
   "credentials": "MD",
   "specialty": "Nephrology",
   "practice": "Peachtree Kidney Specialists",
   "city": "Atlanta",
   "state": "GA",
   "lat": 33.749,
   "lng": -84.388,
   "fax": "(555) 013-2208",
   "accepting_new_patients": true,
   "typical_wait_days": 20,
   "languages": [
    "English",
    "Arabic"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video",
     "phone"
    ],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": [
    "DEMO-CKD-301"
   ]
  },
  {
   "id": "acc-09",
   "name": "Dr. Rebecca Tolliver",
   "credentials": "MD",
   "specialty": "Nephrology",
   "practice": "Middle Georgia Nephrology",
   "city": "Dublin",
   "state": "GA",
   "lat": 32.5404,
   "lng": -82.9038,
   "fax": "(555) 013-2209",
   "accepting_new_patients": true,
   "typical_wait_days": 25,
   "languages": [
    "English"
   ],
   "telehealth": {
    "offered": false,
    "modalities": [],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": false
   },
   "trial_ids": []
  },
  {
   "id": "acc-10",
   "name": "Dr. Sofia Marchetti",
   "credentials": "MD",
   "specialty": "Dermatology",
   "practice": "Classic City Dermatology",
   "city": "Athens",
   "state": "GA",
   "lat": 33.9519,
   "lng": -83.3576,
   "fax": "(555) 013-2210",
   "accepting_new_patients": true,
   "typical_wait_days": 30,
   "languages": [
    "English",
    "Italian"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video",
     "store-and-forward photos"
    ],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": [
    "DEMO-PSO-401"
   ]
  },
  {
   "id": "acc-11",
   "name": "Dr. Kwame Asante",
   "credentials": "MD",
   "specialty": "Dermatology",
   "practice": "North Georgia Skin Center",
   "city": "Toccoa",
   "state": "GA",
   "lat": 34.5773,
   "lng": -83.3321,
   "fax": "(555) 013-2211",
   "accepting_new_patients": false,
   "typical_wait_days": 75,
   "languages": [
    "English",
    "Twi"
   ],
   "telehealth": {
    "offered": false,
    "modalities": [],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": false
   },
   "trial_ids": []
  },
  {
   "id": "acc-12",
   "name": "Dr. Nora Lindqvist",
   "credentials": "MD",
   "specialty": "Dermatology",
   "practice": "Atlanta Psoriasis and Skin Research",
   "city": "Atlanta",
   "state": "GA",
   "lat": 33.749,
   "lng": -84.388,
   "fax": "(555) 013-2212",
   "accepting_new_patients": true,
   "typical_wait_days": 40,
   "languages": [
    "English",
    "Swedish"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video",
     "store-and-forward photos"
    ],
    "licensed_states": [
     "GA",
     "TN"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": [
    "DEMO-PSO-401"
   ]
  },
  {
   "id": "acc-13",
   "name": "Dr. Elijah Moreland",
   "credentials": "MD",
   "specialty": "Neurology",
   "practice": "Southwest Georgia Neurology",
   "city": "Albany",
   "state": "GA",
   "lat": 31.5785,
   "lng": -84.1557,
   "fax": "(555) 013-2213",
   "accepting_new_patients": true,
   "typical_wait_days": 45,
   "languages": [
    "English"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video"
    ],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": []
  },
  {
   "id": "acc-14",
   "name": "Dr. Mei-Ling Chou",
   "credentials": "MD",
   "specialty": "Neurology",
   "practice": "Atlanta Headache Center",
   "city": "Atlanta",
   "state": "GA",
   "lat": 33.749,
   "lng": -84.388,
   "fax": "(555) 013-2214",
   "accepting_new_patients": true,
   "typical_wait_days": 50,
   "languages": [
    "English",
    "Mandarin"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video",
     "phone"
    ],
    "licensed_states": [
     "GA",
     "NC",
     "SC"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": [
    "DEMO-MIG-501"
   ]
  },
  {
   "id": "acc-15",
   "name": "Dr. Thomas Greer",
   "credentials": "MD",
   "specialty": "Neurology",
   "practice": "Americus Neurology Clinic",
   "city": "Americus",
   "state": "GA",
   "lat": 32.0724,
   "lng": -84.2327,
   "fax": "(555) 013-2215",
   "accepting_new_patients": false,
   "typical_wait_days": 90,
   "languages": [
    "English"
   ],
   "telehealth": {
    "offered": false,
    "modalities": [],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": false
   },
   "trial_ids": []
  },
  {
   "id": "acc-16",
   "name": "Dr. Aisha Rahman",
   "credentials": "MD",
   "specialty": "Gastroenterology",
   "practice": "Savannah Digestive Disease Center",
   "city": "Savannah",
   "state": "GA",
   "lat": 32.0809,
   "lng": -81.0912,
   "fax": "(555) 013-2216",
   "accepting_new_patients": true,
   "typical_wait_days": 21,
   "languages": [
    "English",
    "Bengali"
   ],
   "telehealth": {
    "offered": true,
    "modalities": [
     "video"
    ],
    "licensed_states": [
     "GA",
     "SC"
    ],
    "new_patients_by_telehealth": true
   },
   "trial_ids": [
    "DEMO-IBD-601"
   ]
  },
  {
   "id": "acc-17",
   "name": "Dr. Jonah Pruitt",
   "credentials": "MD",
   "specialty": "Gastroenterology",
   "practice": "Waycross Gastroenterology",
   "city": "Waycross",
   "state": "GA",
   "lat": 31.2136,
   "lng": -82.354,
   "fax": "(555) 013-2217",
   "accepting_new_patients": true,
   "typical_wait_days": 16,
   "languages": [
    "English"
   ],
   "telehealth": {
    "offered": false,
    "modalities": [],
    "licensed_states": [
     "GA"
    ],
    "new_patients_by_telehealth": false
   },
   "trial_ids": []
  }
 ],
 "clinical_trials": [
  {
   "id": "DEMO-RA-101",
   "title": "Sample study of a new oral therapy for early rheumatoid arthritis",
   "condition": "Rheumatoid arthritis",
   "specialty": "Rheumatology",
   "phase": "Phase 3",
   "status": "Recruiting",
   "sponsor": {
    "name": "Sample Sponsor A (fictional)",
    "type": "Industry"
   },
   "site_specialist_ids": [
    "acc-01",
    "acc-04"
   ],
   "remote_visits_allowed": true,
   "travel_support": {
    "offered": true,
    "covers": [
     "mileage",
     "lodging for in-person visits"
    ],
    "note": "Sponsor reimburses travel for participants living more than 50 miles from a site"
   },
   "eligibility_summary": "Adults 18 to 75 with a recent rheumatoid arthritis diagnosis",
   "contact": "Site coordinator, by fax or phone through the site physician"
  },
  {
   "id": "DEMO-RA-102",
   "title": "Sample registry of inflammatory arthritis outcomes in rural patients",
   "condition": "Inflammatory arthritis",
   "specialty": "Rheumatology",
   "phase": "Observational",
   "status": "Recruiting",
   "sponsor": {
    "name": "Sample Academic Consortium (fictional)",
    "type": "Academic"
   },
   "site_specialist_ids": [
    "acc-03",
    "acc-04"
   ],
   "remote_visits_allowed": true,
   "travel_support": {
    "offered": false,
    "covers": [],
    "note": "Most visits are remote; no travel needed"
   },
   "eligibility_summary": "Adults with inflammatory arthritis living in rural counties",
   "contact": "Site coordinator through the site physician"
  },
  {
   "id": "DEMO-T2D-201",
   "title": "Sample study of a once-weekly therapy for type 2 diabetes above goal",
   "condition": "Type 2 diabetes",
   "specialty": "Endocrinology",
   "phase": "Phase 3",
   "status": "Recruiting",
   "sponsor": {
    "name": "Sample Sponsor B (fictional)",
    "type": "Industry"
   },
   "site_specialist_ids": [
    "acc-06",
    "acc-07"
   ],
   "remote_visits_allowed": false,
   "travel_support": {
    "offered": true,
    "covers": [
     "mileage",
     "meals on visit days"
    ],
    "note": "Sponsor covers travel costs for each study visit"
   },
   "eligibility_summary": "Adults with type 2 diabetes above their treatment goal",
   "contact": "Site coordinator through the site physician"
  },
  {
   "id": "DEMO-CKD-301",
   "title": "Sample study of kidney function monitoring with home testing",
   "condition": "Chronic kidney disease",
   "specialty": "Nephrology",
   "phase": "Phase 2",
   "status": "Recruiting",
   "sponsor": {
    "name": "Sample Sponsor C (fictional)",
    "type": "Industry"
   },
   "site_specialist_ids": [
    "acc-08"
   ],
   "remote_visits_allowed": true,
   "travel_support": {
    "offered": true,
    "covers": [
     "mileage"
    ],
    "note": "Home test kits shipped; travel covered for two in-person visits"
   },
   "eligibility_summary": "Adults with stage 3 chronic kidney disease",
   "contact": "Site coordinator through the site physician"
  },
  {
   "id": "DEMO-PSO-401",
   "title": "Sample study of a new injectable therapy for moderate plaque psoriasis",
   "condition": "Plaque psoriasis",
   "specialty": "Dermatology",
   "phase": "Phase 3",
   "status": "Recruiting",
   "sponsor": {
    "name": "Sample Sponsor D (fictional)",
    "type": "Industry"
   },
   "site_specialist_ids": [
    "acc-10",
    "acc-12"
   ],
   "remote_visits_allowed": true,
   "travel_support": {
    "offered": true,
    "covers": [
     "mileage",
     "lodging",
     "caregiver travel"
    ],
    "note": "Sponsor covers travel for the screening visit and quarterly check-ins"
   },
   "eligibility_summary": "Adults with moderate to severe plaque psoriasis",
   "contact": "Site coordinator through the site physician"
  },
  {
   "id": "DEMO-MIG-501",
   "title": "Sample study of a preventive treatment for chronic migraine",
   "condition": "Chronic migraine",
   "specialty": "Neurology",
   "phase": "Phase 3",
   "status": "Recruiting",
   "sponsor": {
    "name": "Sample Sponsor E (fictional)",
    "type": "Industry"
   },
   "site_specialist_ids": [
    "acc-14"
   ],
   "remote_visits_allowed": true,
   "travel_support": {
    "offered": true,
    "covers": [
     "mileage",
     "lodging"
    ],
    "note": "Travel covered for participants outside the Atlanta metro area"
   },
   "eligibility_summary": "Adults with chronic migraine",
   "contact": "Site coordinator through the site physician"
  },
  {
   "id": "DEMO-IBD-601",
   "title": "Sample study of joint symptoms in inflammatory bowel disease",
   "condition": "Crohn's disease",
   "specialty": "Gastroenterology",
   "phase": "Observational",
   "status": "Recruiting",
   "sponsor": {
    "name": "Sample Academic Consortium (fictional)",
    "type": "Academic"
   },
   "site_specialist_ids": [
    "acc-16"
   ],
   "remote_visits_allowed": true,
   "travel_support": {
    "offered": false,
    "covers": [],
    "note": "Visits are remote"
   },
   "eligibility_summary": "Adults with Crohn's disease and new joint symptoms",
   "contact": "Site coordinator through the site physician"
  }
 ]
};
