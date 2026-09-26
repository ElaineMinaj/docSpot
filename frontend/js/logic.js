// logic.js
// State, recommendations, AI fax drafting (simulated), and the request lifecycle.
'use strict';

let S; // app state
const esc = s => String(s==null?'':s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const doc = id => S.phys.find(p=>p.id===id);
const pat = id => S.patients.find(p=>p.id===id);
const shortName = p => p.cred==='NP'||p.cred==='PA' ? p.name.replace(/,.*$/,'') : 'Dr. '+p.name.split(' ').slice(-1)[0];
const initialsOf = p => p.name.replace(/^Dr\. /,'').split(' ').map(w=>w[0]).slice(0,2).join('');
const sharedPatients = id => S.patients.filter(pt=>pt.careTeam.includes(id));
const ago = d => { const m=Math.round((Date.now()-d)/60000); if(m<1) return 'just now'; if(m<60) return m+' min ago'; const h=Math.round(m/60); if(h<24) return h+' h ago'; const dd=Math.round(h/24); return dd===1?'yesterday':dd+' days ago'; };
const clock = d => new Date(d).toLocaleString([], {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'});
const minsAgo = n => Date.now()-n*60000;

// Request statuses mapped onto the six flow stages (0-5).
const STATUS = {
  draft:     {label:'Awaiting your approval', stage:2, tone:'wait'},
  sending:   {label:'Sending fax',            stage:3, tone:'live'},
  failed:    {label:'Send failed',            stage:3, tone:'bad'},
  delivered: {label:'Delivered, awaiting response', stage:4, tone:'wait'},
  responded: {label:'Responded',              stage:4, tone:'good', done:true},
  declined:  {label:'Declined',               stage:4, tone:'bad', done:true},
  accepted:  {label:'Accepted, not joining network', stage:4, tone:'good', done:true},
  callback:  {label:'Asked for a phone call',  stage:4, tone:'wait', done:true},
  joining:   {label:'Accepted, joining network', stage:5, tone:'live'},
  added:     {label:'Added to your network',  stage:5, tone:'good', done:true}
};
const FLOW_STEPS = ['Select a patient or topic','Review recommended physician','Confirm information to share','Send secure fax or referral','Track delivery and response','Added to your network'];
const TYPE_LABEL = {referral:'Referral', collab:'Care discussion', question:'Clinical question', connect:'Connection invitation', msl:'Manufacturer medical inquiry'};

function resetState(){
  S = {
    phys: JSON.parse(JSON.stringify(PHYSICIANS_SEED)).concat(loadRealPhysicians(), loadAccessPhysicians()),
    patients: JSON.parse(JSON.stringify(PATIENTS_SEED)),
    requests: [], activity: [], seq: 1040, mapSel:'sato', mapView:'map', showOutside:false,
    specFilter:null, flow:null, expanded:null, editing:null
  };
  S.phys.forEach((p,i)=>{ if(p.real) return; let h=0; for(const ch of p.id) h=(h*31+ch.charCodeAt(0))%100000; if(!p.accessOnly) p.fax=`(555) 01${h%10}-${String(1000+(h*7)%9000)}`; p.npi=String(1245000000+h*1373%99999999); });
  const R = (o)=>{ S.requests.push(Object.assign({attempts:1, events:[]},o)); };
  R({id:'CC-1031', type:'referral', to:'mensah', patient:'pt3', topic:'Nephrology evaluation', method:'fax', status:'delivered', created:minsAgo(2900),
     events:[[minsAgo(2905),'AI drafted referral fax (simulated)'],[minsAgo(2902),'Dr. Lee reviewed and approved recipient and contents'],[minsAgo(2900),'Fax sent to (555) 014-2277'],[minsAgo(2899),'Delivered, 2 pages']]});
  R({id:'CC-1033', type:'connect', to:'novak', topic:'Invitation to connect', method:'fax', status:'delivered', created:minsAgo(1500),
     events:[[minsAgo(1502),'AI drafted invitation (simulated)'],[minsAgo(1501),'Dr. Lee approved'],[minsAgo(1500),'Fax sent to (555) 016-8810'],[minsAgo(1499),'Delivered, 1 page']]});
  R({id:'CC-1036', type:'referral', to:'whitaker', patient:'pt4', topic:'Dermatology evaluation', method:'fax', status:'failed', created:minsAgo(190), failReason:'Line busy after 3 attempts',
     events:[[minsAgo(195),'AI drafted referral fax (simulated)'],[minsAgo(193),'Dr. Lee reviewed and approved'],[minsAgo(190),'Fax send attempted to (555) 012-9043'],[minsAgo(170),'Send failed: line busy after 3 attempts']]});
  R({id:'CC-1028', type:'referral', to:'okafor', patient:'pt5', topic:'Neurology evaluation', method:'fax', status:'joining', created:minsAgo(3000),
     events:[[minsAgo(3000),'Fax sent and delivered'],[minsAgo(1300),'Dr. Okafor accepted through the secure link'],[minsAgo(1299),'NPI verification started to add Dr. Okafor to your network']]});
  R({id:'CC-1038', type:'collab', to:'price', patient:'pt3', topic:'Care coordination', method:'fax', status:'joining', created:minsAgo(400),
     events:[[minsAgo(400),'Fax sent and delivered'],[minsAgo(90),'Dr. Price accepted by fax-back form'],[minsAgo(89),'NPI verification started']]});
  R({id:'CC-1035', type:'question', to:'sato', topic:'A general question about diabetes management', method:'fax', wasConnected:true, status:'responded', created:minsAgo(1700),
     events:[[minsAgo(1700),'Fax sent and delivered'],[minsAgo(1400),'Dr. Sato answered through the secure response page']]});
  S.activity = [
    [minsAgo(89),'Dr. Theo Price accepted your discussion request and is joining your network','live'],
    [minsAgo(170),'Referral fax to Dr. Grace Whitaker failed to send','bad'],
    [minsAgo(1300),'Dr. Nadia Okafor accepted your referral for S.P.','good'],
    [minsAgo(1400),'Dr. Kenji Sato answered your question about basal insulin','good'],
    [minsAgo(1499),'Connection invitation delivered to Dr. Julia Novak','wait']
  ];
}

function log(text,tone){ S.activity.unshift([Date.now(),text,tone||'']); }
function addEvent(r,text){ r.events.push([Date.now(),text]); }

/* ---------- Recommendations (labeled as simulated AI in the UI) ---------- */
function relReason(p){
  return {connected:'In your network', joining:'Joining your network now', pending:'Invitation already pending', outside:'Not in your network yet: the request goes by fax with an invitation to join'}[p.rel];
}
function relScore(p){ return {connected:30, joining:22, pending:6, outside:0}[p.rel]; }
function drugReasons(p,drugs){
  const out=[]; let score=0;
  drugs.forEach(d=>{ const lv=p.drugs[d]; if(lv==='high'){score+=20;out.push(`Frequently prescribes ${d}`);} else if(lv==='moderate'){score+=10;out.push(`Has prescribed ${d}`);} });
  return {score,out};
}
function recommendForPatient(pt){
  return S.phys.filter(p=>p.spec===pt.needs&&!p.accessOnly).map(p=>{
    const reasons=[{t:relReason(p),k:p.rel==='outside'?'off':'warm'}];
    let score=relScore(p);
    if(p.link){reasons.push({t:p.link,k:'warm'});score+=6;}
    const dr=drugReasons(p,pt.keyDrugs); score+=dr.score; dr.out.forEach(t=>reasons.push({t,k:'drug'}));
    if(p.accepting===true){score+=10;reasons.push({t:'Accepting new referrals',k:''});} else if(p.accepting===false){score-=25;reasons.push({t:'Not accepting new referrals right now',k:'off'});}
    if(p.respond&&p.respond!=='Unknown') reasons.push({t:`Usually responds in ${p.respond.toLowerCase()}`,k:''});
    if(p.dist!=null){score+=Math.max(0,20-p.dist); reasons.push({t:`${p.dist} miles from your practice`,k:''});}
    if(p.real){score+=4; reasons.push({t:`Real practice from the NPI Registry: ${p.address}`,k:''});}
    return {p,score,reasons};
  }).sort((a,b)=>b.score-a.score).slice(0,6);
}
function collabForPatient(pt){
  const team=pt.careTeam.map(doc).map(p=>({p,score:100+relScore(p),reasons:[{t:'Already caring for this patient',k:'warm'},{t:relReason(p),k:p.rel==='outside'?'off':'warm'}],group:'team'}));
  const exp=S.phys.filter(p=>!pt.careTeam.includes(p.id)&&!p.accessOnly).map(p=>{const dr=drugReasons(p,pt.keyDrugs);return {p,score:dr.score+relScore(p)+(p.dist!=null?Math.max(0,15-p.dist):0),reasons:[...dr.out.map(t=>({t,k:'drug'})),{t:relReason(p),k:p.rel==='outside'?'off':'warm'},...(p.dist!=null?[{t:`${p.dist} miles away`,k:''}]:[])],group:'exp',dr};}).filter(x=>x.dr.score>=20).sort((a,b)=>b.score-a.score).slice(0,4);
  return {team,exp};
}
function collabForDrug(drug){
  return S.phys.filter(p=>p.drugs[drug]&&!p.accessOnly).map(p=>{const lv=p.drugs[drug];return {p,score:(lv==='high'?20:lv==='moderate'?10:3)+relScore(p)+(p.dist!=null?Math.max(0,15-p.dist):0),reasons:[{t:lv==='high'?`Frequently prescribes ${drug}`:lv==='moderate'?`Has prescribed ${drug}`:`Occasionally prescribes ${drug}`,k:'drug'},{t:relReason(p),k:p.rel==='outside'?'off':'warm'},...(p.dist!=null?[{t:`${p.dist} miles away`,k:''}]:[])]};}).sort((a,b)=>b.score-a.score).slice(0,6);
}
function understandQuestion(q){
  const low=' '+q.toLowerCase()+' ';
  const specs=[...new Set(TOPIC_WORDS.filter(t=>t.k.some(k=>low.includes(k))).map(t=>t.spec))];
  const drugs=DRUG_LIST.filter(d=>low.includes(d));
  return {specs,drugs};
}
function recommendForQuestion(q){
  const u=understandQuestion(q);
  if(!u.specs.length&&!u.drugs.length) return {u,list:[]};
  const list=S.phys.filter(p=>!p.accessOnly).map(p=>{
    let score=0; const reasons=[];
    if(u.specs.includes(p.spec)){score+=35;reasons.push({t:`Specializes in ${p.spec.toLowerCase()}, which this question is about`,k:''});}
    const dr=drugReasons(p,u.drugs); score+=dr.score; dr.out.forEach(t=>reasons.push({t,k:'drug'}));
    if(!score) return null;
    score+=relScore(p); reasons.push({t:relReason(p),k:p.rel==='outside'?'off':'warm'});
    if(p.real) reasons.push({t:'Real practice from the NPI Registry',k:''});
    if(p.respond&&p.respond!=='Unknown') reasons.push({t:`Usually responds in ${p.respond.toLowerCase()}`,k:''});
    return {p,score,reasons};
  }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,5);
  return {u,list};
}

/* ---------- Telehealth and clinical-trial access (fictional sample data) ---------- */
// Ranked by what helps a patient far from care: telehealth for new patients, accepting, distance, wait.
// Trials and travel support are filters the physician chooses. Sponsor funding never adds to the score.
function accessOptions(pt,flt){
  const loc=accessLocation(pt.id)||{lat:33.749,lng:-84.388,home_city:'Atlanta'};
  return S.phys.filter(p=>p.accessOnly&&p.spec===pt.needs).map(p=>{
    const miles=Math.round(milesBetween(loc,p));
    const trials=(p.trialIds||[]).map(accessTrial).filter(t=>t&&t.status==='Recruiting');
    const tele=!!(p.telehealth&&p.telehealth.offered), teleNew=tele&&p.telehealth.new_patients_by_telehealth;
    if(flt.telehealth&&!teleNew) return null;
    if(flt.trials&&!trials.length) return null;
    if(flt.travel&&!trials.some(t=>t.travel_support.offered)) return null;
    let score=0; const reasons=[];
    if(teleNew){ score+=30; reasons.push({t:`Telehealth for new patients (${p.telehealth.modalities.join(', ')}), licensed in ${p.telehealth.licensed_states.join(', ')}`,k:'warm'}); }
    else if(tele) reasons.push({t:'Telehealth for existing patients only',k:''});
    else reasons.push({t:'In-person visits only',k:'off'});
    if(p.accepting){ score+=15; reasons.push({t:'Accepting new patients',k:''}); } else { score-=30; reasons.push({t:'Not accepting new patients right now',k:'off'}); }
    score+=Math.max(0,20-miles/10); reasons.push({t:`${miles} miles from the patient's home in ${loc.home_city}`,k:''});
    if(p.waitDays){ score+=Math.max(0,10-p.waitDays/10); reasons.push({t:`Typical wait: about ${p.waitDays} days`,k:''}); }
    return {p,score,reasons,trials,teleNew,miles};
  }).filter(Boolean).sort((a,b)=>b.score-a.score);
}
function accessTopic(pt,mode,trial){
  return mode==='trial'?`${pt.needs} evaluation, including clinical trial eligibility (${trial.id})`
    :mode==='telehealth'?`${pt.needs} telehealth evaluation`:`${pt.needs} evaluation`;
}

/* ---------- Information-sharing fields (minimum necessary by default) ---------- */
function generalConcern(pt,specialty=pt.needs){
  const concerns={
    pt1:['inflammatory_arthritis','inflammatory arthritis'],
    pt2:['type_2_diabetes','type 2 diabetes'],
    pt3:specialty==='Cardiology'?['atrial_fibrillation','atrial fibrillation']:['kidney_disease','kidney disease'],
    pt4:['plaque_psoriasis','plaque psoriasis'],
    pt5:['chronic_migraine','chronic migraine'],
    pt6:specialty==='Rheumatology'?['inflammatory_arthritis','inflammatory arthritis']:['crohns_disease',"Crohn's disease"]
  };
  return concerns[pt.id]||['specialty_concern','a concern requiring specialty care'];
}
function shareFields(type,pt,specialty){
  if(!pt&&(type==='collab'||type==='referral')) return [{id:'reason',label:'Discussion topic',on:true,locked:true}];
  if(type==='connect') return [{id:'intro',label:'Short introduction and invitation',on:true,locked:true}];
  const fields=[];
  if(type==='question') fields.push({id:'question',label:'Your question',on:true,locked:true});
  if(pt) fields.push({id:'dx',label:`General concern: ${generalConcern(pt,specialty)[1]}`,on:true,locked:true});
  else if(type!=='question') fields.push({id:'reason',label:'Discussion topic',on:true,locked:true});
  return fields;
}

function supportDrug(pt){ return pt?pt.keyDrugs.find(d=>MANUFACTURER_RESOURCES[d]):null; }
function supportField(pt){
  const d=supportDrug(pt); if(!d) return [];
  return [{id:'support',label:`Include manufacturer patient support for ${d}`,on:false,note:`${MANUFACTURER_RESOURCES[d].program[0].toUpperCase()+MANUFACTURER_RESOURCES[d].program.slice(1)}, available through Impiricus. Optional; helps the patient start treatment.`}];
}

/* ---------- AI fax draft (simulated with templates in this prototype) ---------- */
function draftText(f){
  const p=doc(f.to), pt=f.patient?pat(f.patient):null;
  const greet=`${shortName(p)},`;
  const sign=`\n\nThank you,\n${ME.name}, ${ME.spec}\n${ME.practice}, ${ME.city}\nNPI ${ME.npi}`;
  const concern=pt?generalConcern(pt,p.spec)[1]:'';
  if(f.type==='referral') return `${greet}\n\nI'd like to refer a patient for ${f.topic.toLowerCase()}${concern?` concerning ${concern}`:''}.\n\nIt would be great if you could please assess this concern and share recommendations for appropriate next steps. Patient identifiers will be shared through the secure response page after acceptance.${sign}`;
  if(f.type==='collab') return `${greet}\n\nI'd value a brief discussion to coordinate care${concern?` regarding a patient with ${concern}`:''}.\n\nTopic: ${f.topic}. A brief reply by scanning the QR code on this fax, or by the fax-back form, is plenty. Patient identifiers will be shared through the secure response page after acceptance.${sign}`;
  if(f.type==='question') return `${greet}\n\nA colleague question I thought you'd be well placed to answer:\n\n"${f.question}"${concern?`\n\nGeneral concern: ${concern}.`:''}\n\nA brief reply by scanning the QR code on this fax, or by the fax-back form, is plenty. Patient identifiers will be shared through the secure response page after acceptance.${sign}`;
  return `${greet}\n\nI'd like to connect with you on Colleague Connect, a secure way for physicians to share referrals and questions. It takes about a minute to accept, and there's no cost.${sign}`;
}

/* ---------- Privacy check (see api.js) ---------- */
// Only mock patient data from data.js is ever sent.
function privacyRequest(f){
  const p=doc(f.to), pt=f.patient?pat(f.patient):null;
  return {text:f.text, approved:f.fields.filter(x=>x.on).map(x=>x.id), topic:pt?generalConcern(pt,p.spec)[1]:(f.type==='connect'?'':f.topic),
    patient:pt?{name:pt.name,initials:pt.initials,dob:pt.dob,mrn:pt.mrn,age:pt.age,sex:pt.sex,dx:pt.dx,meds:pt.meds,labs:pt.labs,general_concern:generalConcern(pt,p.spec)[0]}:null,
    allowed:[ME.fax,RETURN_FAX,p.fax,p.phone].filter(Boolean)};
}
// Approval is valid only for the exact text that passed a clean privacy check.
const privacyClear = f => !!f.privacy&&f.privacy.status==='done'&&f.privacy.checkedText===f.text&&!f.privacy.flags.length;
const FLAG_KIND = {identifier:'patient identifier', contact:'contact detail', unapproved:'unapproved clinical detail', ai:'other detail'};
function privacyAudit(r,pv){
  if(!pv||pv.status!=='done') return;
  // The audit trail records what kind of item was flagged, not the flagged text itself.
  const kinds=[...new Set(pv.flags.map(x=>FLAG_KIND[x.kind]||'other detail'))];
  addEvent(r,`${PRIVACY_LABEL[pv.mode]}: ${pv.flags.length?`flagged ${pv.flags.length} ${pv.flags.length===1?'item':'items'} (${kinds.join(', ')})`:'no issues found'}`);
}

// The AI draft endpoint receives only structured purpose/specialty/broad-concern metadata.
function draftRequest(f){
  const p=doc(f.to), pt=f.patient?pat(f.patient):null;
  const person=x=>({name:x.name, specialty:x.spec, practice:x.practice, city:x.city||'', npi:x.npi||''});
  const purpose=f.type==='connect'?'connection_invitation':f.accessMode==='trial'?'clinical_trial_eligibility':f.accessMode==='telehealth'?'telehealth_evaluation':'specialty_evaluation';
  return {type:f.type,purpose,concern:pt?generalConcern(pt,p.spec)[0]:null,channel:'fax',recipient:person(p),
    recipient_on_impiricus:p.rel==='connected'||p.rel==='joining',sender:person(ME)};
}
const DRAFT_LABEL = {ai:'AI draft. Review before sending.', template:'Privacy-safe template. Review before sending.'};

/* ---------- Request lifecycle ---------- */
// Existing Impiricus service: route a question to the manufacturer's medical team (MSL / medical information).
function createMslRequest(drug,question,patientId){
  const r={id:'CC-'+(++S.seq), type:'msl', to:null, toLabel:`${drug[0].toUpperCase()+drug.slice(1)} medical team`, toSub:'Manufacturer, through Impiricus', drug, patient:null,
    topic:question||`Medical information request about ${drug}`, method:'impiricus', status:'delivered', created:Date.now(), attempts:1, events:[]};
  addEvent(r,`Dr. Lee sent a medical information request about ${drug} through Impiricus`);
  addEvent(r,'Routed to the manufacturer\u2019s medical team (existing Impiricus service, simulated). No patient identifiers included');
  S.requests.unshift(r); log(`Medical information request about ${drug} sent to the manufacturer through Impiricus`,'wait');
  return r;
}
function createRequest(f){
  const p=doc(f.to);
  const r={id:'CC-'+(++S.seq), type:f.type, to:f.to, patient:f.patient||null, topic:f.type==='question'?f.question:f.topic,
    method:'fax', wasConnected:p.rel==='connected'||p.rel==='joining', status:'draft', created:Date.now(), attempts:0, events:[], faxText:f.text, fields:f.fields.filter(x=>x.on).map(x=>x.label), code:'A7K-'+S.seq};
  const what=r.method==='fax'?'fax':'message';
  addEvent(r,f.draftSource==='ai'?`AI drafted the ${what} (${f.draftModel||'AI model'}) from the checked information only`:`AI drafted the ${what} (simulated: template, AI backend off or slow)`);
  if(f.edited) addEvent(r,'Dr. Lee edited the draft');
  privacyAudit(r,f.privacy);
  addEvent(r,`Dr. Lee confirmed information to share: ${r.fields.join(', ')}`);
  addEvent(r,`Dr. Lee approved recipient ${p.name}${r.method==='fax'?' at '+p.fax:''}`);
  S.requests.unshift(r);
  return r;
}
function sendRequest(r,rerender){
  const p=doc(r.to);
  r.attempts++;
  r.status='sending'; addEvent(r,`Fax send attempt ${r.attempts} to ${p.fax} (simulated)`);
  if(p.rel==='outside'){ p.rel='pending'; p.link='Invitation sent by fax just now'; }
  rerender();
  setTimeout(()=>{
    if(p.failOnce&&r.attempts===1){ r.status='failed'; r.failReason='No answer from the fax line'; addEvent(r,'Send failed: no answer from the fax line'); log(`Fax to ${p.name} failed to send`,'bad'); }
    else { r.status='delivered'; r.failReason=null; addEvent(r,`Delivered, ${r.type==='connect'?1:2} pages. Awaiting response`); log(`${TYPE_LABEL[r.type]} fax delivered to ${p.name}`,'wait'); }
    rerender();
  },1600);
}
/* ---------- Recipient's side (simulated): fax inbox → secure link → respond → optional join ---------- */
// The fax as the recipient received it. Older sample requests have no saved text, so rebuild it.
function recipientFields(r){ return r.fields||shareFields(r.type,r.patient?pat(r.patient):null,r.to?doc(r.to)?.spec:undefined).filter(x=>x.on).map(x=>x.label); }
function recipientFaxText(r){
  if(r.faxText) return r.faxText;
  return draftText({to:r.to, patient:r.patient, type:r.type, topic:r.topic, question:r.topic, fields:shareFields(r.type,r.patient?pat(r.patient):null,doc(r.to)?.spec)});
}
function recipientVerified(r){
  const p=doc(r.to);
  addEvent(r,`${p.name} scanned the QR code on the fax and opened the secure response page (simulated)`);
  addEvent(r,`${p.name} confirmed their identity against their NPI record${p.npi?' (NPI '+p.npi+')':''}`);
}
// Accepting and joining are separate choices, made on separate screens.
function recipientRespond(r,{choice,reply},rerender){
  const p=doc(r.to), label=TYPE_LABEL[r.type].toLowerCase();
  const via='through the secure response page (simulated response)', member=p.rel==='connected'||p.rel==='joining';
  if(choice==='decline'){
    r.status='declined'; if(!member){ p.rel='outside'; p.link=`Declined your ${label}`; }
    addEvent(r,`${p.name} declined ${via}`); log(`${p.name} declined your ${label}`,'bad'); rerender(); return;
  }
  if(choice==='call'){
    r.status='callback'; if(!member){ p.rel='outside'; p.link='Asked for a phone call instead'; }
    addEvent(r,`${p.name} asked for a phone call ${via}`); log(`${p.name} asked you to call about your ${label}`,'wait'); rerender(); return;
  }
  // Accepted (referral, discussion, answered the question, or accepted the invitation)
  r.status='accepted'; if(!member){ p.rel='outside'; p.link=`${r.type==='question'?'Answered':'Accepted'} your ${label}`; }
  addEvent(r,`${p.name} ${r.type==='question'?'answered':'accepted'} ${via}`);
  if(reply) addEvent(r,`Reply: "${reply}"`);
  if(r.patient){ const pt=pat(r.patient); if(!pt.careTeam.includes(p.id)) pt.careTeam.push(p.id); addEvent(r,'Patient name and date of birth released to the accepting physician'); }
  log(`${p.name} ${r.type==='question'?'answered':'accepted'} your ${label}`,'good'); rerender();
}
const CONTACT_LABEL = {fax:'fax', inapp:'in-app messages', email:'email'};
const SERVICE_LABEL = {samples:'samples and bridge supply', msl:'manufacturer medical team', support:'patient support programs'};
function recipientJoin(r,{prefs,services},rerender){
  const p=doc(r.to), label=TYPE_LABEL[r.type].toLowerCase();
  const on=o=>Object.keys(o).filter(k=>o[k]);
  r.status='joining'; p.rel='joining'; p.newToImpiricus=true; p.link=`Accepted your ${label} and chose to join your network`;
  addEvent(r,`${p.name} chose to join Impiricus (separate from accepting). NPI verification started`);
  addEvent(r,`Contact preferences: ${on(prefs).map(k=>CONTACT_LABEL[k]).join(', ')||'none'}. No text messages`);
  addEvent(r,`Optional Impiricus services: ${on(services).map(k=>SERVICE_LABEL[k]).join(', ')||'none selected'}`);
  log(`${p.name} accepted and chose to join your network`,'live'); rerender();
  setTimeout(()=>{ finishJoin(r); rerender(); },1800);
}
function recipientSkipJoin(r){
  const p=doc(r.to);
  p.link+='; didn’t join your network';
  addEvent(r,`${p.name} chose not to join the network. They can join later from any future request`);
}
function sendConsultNote(r){
  const p=doc(r.to);
  addEvent(r,`${p.name} sent a consult note back to Dr. Lee (simulated)`);
  log(`${p.name} sent a consult note${r.patient?' for '+pat(r.patient).initials:''}`,'good');
}
function finishJoin(r){
  const p=doc(r.to);
  if(r.status!=='joining') return;
  r.status='added'; p.rel='connected'; p.link=`Joined through your ${TYPE_LABEL[r.type].toLowerCase()}`; p.joinedVia=true;
  addEvent(r,`NPI verified. ${p.name} added to your network and to Impiricus\u2019s verified physician network`); log(`${p.name} was added to your network`,'good');
}
