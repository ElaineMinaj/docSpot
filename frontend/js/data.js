// data.js
// Mock data for the prototype. Everything here is fictional sample data.
// In a real build: physicians come from Impiricus's verified-physician records (NPI-based),
// patients come from the physician's panel already available in the platform,
// and drug experience comes from prescribing data such as Medicare Part D.
'use strict';

const SPECIALTY_COLORS = {
  'Family Medicine':'#C9D1DC', 'Internal Medicine':'#93A7C1', 'Rheumatology':'#F28DB2',
  'Endocrinology':'#F5B94E', 'Cardiology':'#F07D66', 'Nephrology':'#A895FF',
  'Dermatology':'#5FD3C6', 'Neurology':'#86A8FF', 'Gastroenterology':'#B7D96A', 'Pulmonology':'#6FC3FF'
};

const ME = {id:'me', name:'Dr. Anna Lee', short:'Dr. Lee', cred:'MD', spec:'Family Medicine',
  practice:'Northside Family Care', city:'Atlanta, GA', fax:'(555) 010-4410', npi:'1487203391', hospital:'Metro North Hospital'};

const RETURN_FAX = '(555) 010-2041';

// rel: connected | joining (accepted through a referral, being added) | pending (invitation sent) | outside (not connected)
const PHYSICIANS_SEED = [
  // In your network
  {id:'sato',    name:'Dr. Kenji Sato',      cred:'MD', spec:'Endocrinology',    practice:'Midtown Endocrine Group',          city:'Atlanta', dist:8.2,  rel:'connected', link:'You have referred 6 patients to Dr. Sato', hospital:'Midtown Medical Center', drugs:{semaglutide:'high','insulin glargine':'high',metformin:'high'}, accepting:true, respond:'1 day'},
  {id:'brennan', name:'Dr. Claire Brennan',  cred:'MD', spec:'Cardiology',       practice:'Summit Cardiology',                city:'Atlanta', dist:0.1,  rel:'connected', link:'Same building as your practice', hospital:'Metro North Hospital', drugs:{apixaban:'high'}, accepting:true, respond:'Same day'},
  {id:'holt',    name:'Dr. Marcus Holt',     cred:'MD', spec:'Gastroenterology', practice:'Perimeter Gastroenterology',       city:'Atlanta', dist:0.2,  rel:'connected', link:'Same building as your practice', hospital:'Metro North Hospital', drugs:{infliximab:'high',adalimumab:'moderate'}, accepting:true, respond:'2 days'},
  {id:'raman',   name:'Dr. Priya Raman',     cred:'MD', spec:'Rheumatology',     practice:'Buckhead Rheumatology Associates', city:'Atlanta', dist:5.1,  rel:'connected', link:'Both on staff at Metro North Hospital', hospital:'Metro North Hospital', drugs:{adalimumab:'high',methotrexate:'high'}, accepting:false, respond:'2 days'},
  {id:'ortiz',   name:'Dr. Daniel Ortiz',    cred:'MD', spec:'Family Medicine',  practice:'Northside Family Care',            city:'Atlanta', dist:0,    rel:'connected', link:'Same practice', hospital:'Metro North Hospital', drugs:{semaglutide:'moderate',apixaban:'moderate'}, accepting:true, respond:'Same day'},
  {id:'ellis',   name:'Maya Ellis',          cred:'NP', spec:'Family Medicine',  practice:'Northside Family Care',            city:'Atlanta', dist:0,    rel:'connected', link:'Same practice', hospital:'', drugs:{semaglutide:'low'}, accepting:true, respond:'Same day'},
  {id:'kline',   name:'Dr. Samuel Kline',    cred:'DO', spec:'Internal Medicine',practice:'Midtown Internal Medicine',        city:'Atlanta', dist:7.9,  rel:'connected', link:'Colleague at Metro North Hospital', hospital:'Metro North Hospital', drugs:{semaglutide:'moderate',apixaban:'moderate'}, accepting:true, respond:'1 day'},
  {id:'iverson', name:'Dr. Hannah Iverson',  cred:'MD', spec:'Pulmonology',      practice:'Midtown Pulmonary and Sleep',      city:'Atlanta', dist:8.4,  rel:'connected', link:'You have referred 2 patients', hospital:'Midtown Medical Center', drugs:{dupilumab:'moderate'}, accepting:true, respond:'3 days'},
  {id:'castillo',name:'Dr. Elena Castillo',  cred:'MD', spec:'Dermatology',      practice:'Southside Dermatology',            city:'Atlanta', dist:14.6, rel:'connected', link:'Answered 3 of your questions', hospital:'Southside Regional Hospital', drugs:{adalimumab:'high',dupilumab:'high',methotrexate:'moderate'}, accepting:true, respond:'2 days'},
  {id:'tran',    name:'Dr. Wesley Tran',     cred:'MD', spec:'Neurology',        practice:'Eastside Neurology',               city:'Decatur', dist:11.3, rel:'connected', link:'You have referred 3 patients', hospital:'Eastside Medical Center', drugs:{erenumab:'high'}, accepting:false, respond:'4 days'},
  // Joining through referrals
  {id:'okafor',  name:'Dr. Nadia Okafor',    cred:'MD', spec:'Neurology',        practice:'Decatur Neurology Associates',     city:'Decatur', dist:12.0, rel:'joining',   link:'Accepted your referral by fax yesterday', hospital:'Eastside Medical Center', drugs:{erenumab:'high'}, accepting:true, respond:'1 day'},
  {id:'price',   name:'Dr. Theo Price',      cred:'MD', spec:'Cardiology',       practice:'Southside Heart',                  city:'Atlanta', dist:13.2, rel:'joining',   link:'Accepted a discussion request by fax today', hospital:'Southside Regional Hospital', drugs:{apixaban:'high'}, accepting:true, respond:'1 day'},
  // Pending invitations
  {id:'mensah',  name:'Dr. Kofi Mensah',     cred:'MD', spec:'Nephrology',       practice:'Eastside Kidney Care',             city:'Decatur', dist:10.8, rel:'pending',   link:'Referral fax delivered 2 days ago', hospital:'Eastside Medical Center', drugs:{}, accepting:true, respond:'Unknown'},
  {id:'novak',   name:'Dr. Julia Novak',     cred:'MD', spec:'Rheumatology',     practice:'Westside Rheumatology',            city:'Marietta',dist:16.4, rel:'pending',   link:'Connection invitation delivered yesterday', hospital:'Lakeside Community Hospital', drugs:{methotrexate:'high',adalimumab:'moderate'}, accepting:true, respond:'Unknown'},
  {id:'whitaker',name:'Dr. Grace Whitaker',  cred:'MD', spec:'Dermatology',      practice:'Jonesboro Dermatology and Allergy',city:'Jonesboro',dist:18.9,rel:'pending',   link:'Referral fax failed to send', hospital:'Southside Regional Hospital', drugs:{adalimumab:'moderate',dupilumab:'high'}, accepting:true, respond:'Unknown'},
  // Outside your network (appear in recommendations; optional on the map)
  {id:'ibarra',  name:'Dr. Rosa Ibarra',     cred:'MD', spec:'Rheumatology',     practice:'Decatur Arthritis Center',         city:'Decatur', dist:11.0, rel:'outside',   link:'Colleague of Dr. Raman', hospital:'Eastside Medical Center', drugs:{adalimumab:'high',methotrexate:'high'}, accepting:true, respond:'2 days'},
  {id:'rhodes',  name:'Dr. Caleb Rhodes',    cred:'MD', spec:'Endocrinology',    practice:'Marietta Diabetes and Endocrine',  city:'Marietta',dist:15.7, rel:'outside',   link:'', hospital:'Lakeside Community Hospital', drugs:{semaglutide:'high','insulin glargine':'high'}, accepting:true, respond:'3 days'},
  {id:'vance',   name:'Dr. Leah Vance',      cred:'MD', spec:'Nephrology',       practice:'Midtown Nephrology',               city:'Atlanta', dist:8.0,  rel:'outside',   link:'Both on staff at Midtown Medical Center with Dr. Sato', hospital:'Midtown Medical Center', drugs:{}, accepting:true, respond:'2 days', failOnce:true},
  {id:'siddiqui',name:'Dr. Imran Siddiqui',  cred:'MD', spec:'Dermatology',      practice:'Buckhead Dermatology',             city:'Atlanta', dist:5.6,  rel:'outside',   link:'Colleague of Dr. Castillo', hospital:'Metro North Hospital', drugs:{adalimumab:'high',methotrexate:'moderate'}, accepting:true, respond:'1 day'},
  {id:'lambert', name:'Dr. Victor Lambert',  cred:'MD', spec:'Neurology',        practice:'Marietta Neurology',               city:'Marietta',dist:17.2, rel:'outside',   link:'', hospital:'Lakeside Community Hospital', drugs:{erenumab:'moderate'}, accepting:true, respond:'5 days'},
  {id:'osei',    name:'Dr. Amara Osei',      cred:'MD', spec:'Gastroenterology', practice:'Decatur Digestive Health',         city:'Decatur', dist:12.4, rel:'outside',   link:'', hospital:'Eastside Medical Center', drugs:{infliximab:'high',adalimumab:'high'}, accepting:true, respond:'2 days'},
  {id:'sloan',   name:'Dr. Ruth Sloan',      cred:'MD', spec:'Pulmonology',      practice:'Northside Lung Center',            city:'Atlanta', dist:2.3,  rel:'outside',   link:'Both on staff at Metro North Hospital', hospital:'Metro North Hospital', drugs:{dupilumab:'high'}, accepting:true, respond:'2 days'},
  {id:'moreau',  name:'Dr. Felix Moreau',    cred:'DO', spec:'Cardiology',       practice:'Perimeter Heart and Rhythm',       city:'Atlanta', dist:3.1,  rel:'outside',   link:'', hospital:'Metro North Hospital', drugs:{apixaban:'high'}, accepting:true, respond:'1 day'}
];

// Dr. Lee's patients, as already available in the platform. Initials only in lists.
const PATIENTS_SEED = [
  {id:'pt1', initials:'M.R.', name:'Maria Reyes', dob:'04/12/1968', age:58, sex:'F', mrn:'…4471',
   summary:'Suspected rheumatoid arthritis', needs:'Rheumatology', flag:'Needs specialist care',
   dx:['Inflammatory polyarthritis, suspected rheumatoid arthritis'], meds:['Prednisone 10 mg daily (started 3 weeks ago)','Naproxen 500 mg twice daily'],
   labs:['Rheumatoid factor positive','Anti-CCP positive','CRP 18 mg/L'], keyDrugs:['adalimumab','methotrexate'], careTeam:[]},
  {id:'pt2', initials:'J.T.', name:'James Turner', dob:'09/02/1962', age:64, sex:'M', mrn:'…2210',
   summary:'Type 2 diabetes above goal', needs:'Endocrinology', flag:'Above goal on two agents',
   dx:['Type 2 diabetes mellitus'], meds:['Metformin 1000 mg twice daily','Semaglutide 1 mg weekly'],
   labs:['A1c 9.4%','eGFR 58'], keyDrugs:['semaglutide','insulin glargine'], careTeam:['sato']},
  {id:'pt3', initials:'A.K.', name:'Alice Kim', dob:'01/30/1955', age:71, sex:'F', mrn:'…8832',
   summary:'Atrial fibrillation with new stage 3b kidney disease', needs:'Nephrology', flag:'Needs specialist care',
   dx:['Atrial fibrillation','Chronic kidney disease, stage 3b'], meds:['Apixaban 5 mg twice daily','Metoprolol 25 mg twice daily'],
   labs:['eGFR 38, down from 52 in 6 months','Creatinine 1.5 mg/dL'], keyDrugs:['apixaban'], careTeam:['brennan','price']},
  {id:'pt4', initials:'D.L.', name:'David Lowell', dob:'06/18/1981', age:45, sex:'M', mrn:'…5019',
   summary:'Moderate to severe plaque psoriasis', needs:'Dermatology', flag:'Needs specialist care',
   dx:['Plaque psoriasis, about 12% body surface area'], meds:['Clobetasol 0.05% cream (inadequate response)'],
   labs:['TB screening negative','Hepatitis panel negative'], keyDrugs:['adalimumab'], careTeam:[]},
  {id:'pt5', initials:'S.P.', name:'Sofia Price', dob:'11/05/1992', age:34, sex:'F', mrn:'…3307',
   summary:'Chronic migraine', needs:'Neurology', flag:'Referral accepted',
   dx:['Chronic migraine without aura, about 16 headache days a month'], meds:['Sumatriptan 50 mg as needed','Topiramate 50 mg daily (side effects)'],
   labs:['MRI brain normal'], keyDrugs:['erenumab'], careTeam:['okafor']},
  {id:'pt6', initials:'R.W.', name:'Robert Wade', dob:'03/22/1974', age:52, sex:'M', mrn:'…6645',
   summary:'Crohn\u2019s disease with new joint pain', needs:'Rheumatology', flag:'Care team discussion',
   dx:['Crohn\u2019s disease','New inflammatory joint pain'], meds:['Infliximab every 8 weeks'],
   labs:['CRP 22 mg/L','Fecal calprotectin elevated'], keyDrugs:['infliximab','adalimumab'], careTeam:['holt']}
];

const DRUG_LIST = ['adalimumab','semaglutide','apixaban','infliximab','methotrexate','dupilumab','insulin glargine','erenumab'];

// Words the question assistant recognizes (simple rules standing in for AI in this prototype).
const TOPIC_WORDS = [
  {k:['rheumat','arthritis','lupus','anti-ccp'], spec:'Rheumatology'},
  {k:['diabet','a1c','insulin','glp-1','thyroid'], spec:'Endocrinology'},
  {k:['afib','atrial','anticoag','heart','arrhythm'], spec:'Cardiology'},
  {k:['kidney','renal','egfr','ckd','creatinine'], spec:'Nephrology'},
  {k:['psoria','eczema','rash','skin','dermat'], spec:'Dermatology'},
  {k:['migraine','headache','seizure','neuro'], spec:'Neurology'},
  {k:['crohn','colitis','ibd','liver','gi '], spec:'Gastroenterology'},
  {k:['asthma','copd','lung','inhaler'], spec:'Pulmonology'}
];

const EXAMPLE_QUESTIONS = [
  'How do you adjust apixaban dosing as kidney function declines?',
  'When do you add basal insulin for a patient already on semaglutide?',
  'Which patients with psoriasis are good candidates for adalimumab?',
  'Is new joint pain on infliximab worth a rheumatology workup?'
];

// Manufacturer resources Impiricus already routes physicians to (sample, generic descriptions).
// Pharma companies fund these; they appear only when the physician chooses them.
const MANUFACTURER_RESOURCES = {
  'adalimumab':      {program:'copay and prior authorization support'},
  'semaglutide':     {program:'savings card and coverage support'},
  'apixaban':        {program:'free trial and coverage support'},
  'infliximab':      {program:'infusion coverage and financial assistance'},
  'dupilumab':       {program:'copay and nurse educator support'},
  'insulin glargine':{program:'monthly cost cap program'},
  'erenumab':        {program:'copay support and bridge supply'},
  'methotrexate':    null
};
