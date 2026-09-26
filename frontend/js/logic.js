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
    phys: JSON.parse(JSON.stringify(PHYSICIANS_SEED)).concat(loadRealPhysicians()),
    patients: JSON.parse(JSON.stringify(PATIENTS_SEED)),
    requests: [], activity: [], seq: 1040, mapSel:'sato', mapView:'map', showOutside:false,
    specFilter:null, flow:null, expanded:null, editing:null
  };
  S.phys.forEach((p,i)=>{ if(p.real) return; let h=0; for(const ch of p.id) h=(h*31+ch.charCodeAt(0))%100000; p.fax=`(555) 01${h%10}-${String(1000+(h*7)%9000)}`; p.npi=String(1245000000+h*1373%99999999); });
  const R = (o)=>{ S.requests.push(Object.assign({attempts:1, events:[]},o)); };
  R({id:'CC-1031', type:'referral', to:'mensah', patient:'pt3', topic:'Nephrology evaluation for declining kidney function', method:'fax', status:'delivered', created:minsAgo(2900),
     events:[[minsAgo(2905),'AI drafted referral fax (simulated)'],[minsAgo(2902),'Dr. Lee reviewed and approved recipient and contents'],[minsAgo(2900),'Fax sent to (555) 014-2277'],[minsAgo(2899),'Delivered, 2 pages']]});
  R({id:'CC-1033', type:'connect', to:'novak', topic:'Invitation to connect', method:'fax', status:'delivered', created:minsAgo(1500),
     events:[[minsAgo(1502),'AI drafted invitation (simulated)'],[minsAgo(1501),'Dr. Lee approved'],[minsAgo(1500),'Fax sent to (555) 016-8810'],[minsAgo(1499),'Delivered, 1 page']]});
  R({id:'CC-1036', type:'referral', to:'whitaker', patient:'pt4', topic:'Dermatology evaluation for moderate to severe psoriasis', method:'fax', status:'failed', created:minsAgo(190), failReason:'Line busy after 3 attempts',
     events:[[minsAgo(195),'AI drafted referral fax (simulated)'],[minsAgo(193),'Dr. Lee reviewed and approved'],[minsAgo(190),'Fax send attempted to (555) 012-9043'],[minsAgo(170),'Send failed: line busy after 3 attempts']]});
  R({id:'CC-1028', type:'referral', to:'okafor', patient:'pt5', topic:'Neurology evaluation for chronic migraine', method:'fax', status:'joining', created:minsAgo(3000),
     events:[[minsAgo(3000),'Fax sent and delivered'],[minsAgo(1300),'Dr. Okafor accepted through the secure link'],[minsAgo(1299),'NPI verification started to add Dr. Okafor to your network']]});
  R({id:'CC-1038', type:'collab', to:'price', patient:'pt3', topic:'Anticoagulation plan with declining kidney function', method:'fax', status:'joining', created:minsAgo(400),
     events:[[minsAgo(400),'Fax sent and delivered'],[minsAgo(90),'Dr. Price accepted by fax-back form'],[minsAgo(89),'NPI verification started']]});
  R({id:'CC-1035', type:'question', to:'sato', topic:'When to add basal insulin on semaglutide', method:'in-app', status:'responded', created:minsAgo(1700),
     events:[[minsAgo(1700),'Sent as a secure in-app message'],[minsAgo(1400),'Dr. Sato replied']]});
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
  return S.phys.filter(p=>p.spec===pt.needs).map(p=>{
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
  const exp=S.phys.filter(p=>!pt.careTeam.includes(p.id)).map(p=>{const dr=drugReasons(p,pt.keyDrugs);return {p,score:dr.score+relScore(p)+(p.dist!=null?Math.max(0,15-p.dist):0),reasons:[...dr.out.map(t=>({t,k:'drug'})),{t:relReason(p),k:p.rel==='outside'?'off':'warm'},...(p.dist!=null?[{t:`${p.dist} miles away`,k:''}]:[])],group:'exp',dr};}).filter(x=>x.dr.score>=20).sort((a,b)=>b.score-a.score).slice(0,4);
  return {team,exp};
}
function collabForDrug(drug){
  return S.phys.filter(p=>p.drugs[drug]).map(p=>{const lv=p.drugs[drug];return {p,score:(lv==='high'?20:lv==='moderate'?10:3)+relScore(p)+(p.dist!=null?Math.max(0,15-p.dist):0),reasons:[{t:lv==='high'?`Frequently prescribes ${drug}`:lv==='moderate'?`Has prescribed ${drug}`:`Occasionally prescribes ${drug}`,k:'drug'},{t:relReason(p),k:p.rel==='outside'?'off':'warm'},...(p.dist!=null?[{t:`${p.dist} miles away`,k:''}]:[])]};}).sort((a,b)=>b.score-a.score).slice(0,6);
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
  const list=S.phys.map(p=>{
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

/* ---------- Information-sharing fields (minimum necessary by default) ---------- */
function shareFields(type,pt){
  if(!pt&&(type==='collab'||type==='referral')) return [{id:'reason',label:'Discussion topic',on:true,locked:true}];
  if(type==='connect') return [{id:'intro',label:'Short introduction and invitation',on:true,locked:true}];
  if(type==='question') return [
    {id:'question',label:'Your question',on:true,locked:true},
    ...(pt?[{id:'agesex',label:`Age and sex (${pt.age}, ${pt.sex==='F'?'female':'male'})`,on:true},{id:'dx',label:'Relevant diagnoses',on:true},{id:'meds',label:'Relevant medications',on:false}]:[])
  ];
  return [
    {id:'reason',label:type==='referral'?'Reason for referral':'Discussion topic',on:true,locked:true},
    {id:'agesex',label:`Age and sex (${pt.age}, ${pt.sex==='F'?'female':'male'})`,on:true},
    {id:'dx',label:'Relevant diagnoses',on:true},
    {id:'meds',label:'Relevant medications',on:true},
    {id:'labs',label:'Relevant recent labs',on:type==='referral'},
    {id:'ids',label:'Name and date of birth',on:false,locked:true,note:'Released through the secure link only after the physician accepts'},
    ...supportField(pt)
  ];
}

function supportDrug(pt){ return pt?pt.keyDrugs.find(d=>MANUFACTURER_RESOURCES[d]):null; }
function supportField(pt){
  const d=supportDrug(pt); if(!d) return [];
  return [{id:'support',label:`Include manufacturer patient support for ${d}`,on:false,note:`${MANUFACTURER_RESOURCES[d].program[0].toUpperCase()+MANUFACTURER_RESOURCES[d].program.slice(1)}, available through Impiricus. Optional; helps the patient start treatment.`}];
}

/* ---------- AI fax draft (simulated with templates in this prototype) ---------- */
function draftText(f){
  const p=doc(f.to), pt=f.patient?pat(f.patient):null, on=id=>(f.fields.find(x=>x.id===id)||{}).on;
  const greet=`${shortName(p)},`;
  const sign=`\n\nThank you,\n${ME.name}, ${ME.spec}\n${ME.practice}, ${ME.city}\nNPI ${ME.npi}`;
  const lines=[];
  if(pt&&on('agesex')) lines.push(`Patient: ${pt.age}-year-old ${pt.sex==='F'?'female':'male'}`);
  if(pt&&on('dx')) lines.push(`Relevant diagnoses: ${pt.dx.join('; ')}`);
  if(pt&&on('meds')) lines.push(`Current medications: ${pt.meds.join('; ')}`);
  if(pt&&on('labs')) lines.push(`Recent labs: ${pt.labs.join('; ')}`);
  const sd=supportDrug(pt);
  if(pt&&sd&&on('support')) lines.push(`Patient support: the ${sd} manufacturer offers ${MANUFACTURER_RESOURCES[sd].program}, available through Impiricus (link included with the secure referral).`);
  const ctx=lines.length?'\n\n'+lines.join('\n'):'';
  if(f.type==='referral') return `${greet}\n\nI'd like to refer a patient for ${f.topic.toLowerCase()}.${ctx}\n\nRequest: evaluation and treatment recommendations. Patient identifiers will be shared through the secure link once you accept.${sign}`;
  if(f.type==='collab') return `${greet}\n\nWe both care for a patient, or you have experience with this treatment, and I'd value a short discussion.\n\nTopic: ${f.topic}${ctx}\n\nA 10-minute call or a few written notes would help. Patient identifiers are shared only after you accept.${sign}`;
  if(f.type==='question') return `${greet}\n\nA colleague question I thought you'd be well placed to answer:\n\n"${f.question}"${ctx}\n\nA brief reply by the secure link or fax-back form is plenty.${sign}`;
  return `${greet}\n\nI'd like to connect with you on Colleague Connect, a secure way for physicians to share referrals and questions. It takes about a minute to accept, and there's no cost.${sign}`;
}

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
    method:p.rel==='connected'||p.rel==='joining'?'in-app':'fax', status:'draft', created:Date.now(), attempts:0, events:[], faxText:f.text, fields:f.fields.filter(x=>x.on).map(x=>x.label)};
  addEvent(r,'AI drafted the '+(r.method==='fax'?'fax':'message')+' (simulated)');
  if(f.edited) addEvent(r,'Dr. Lee edited the draft');
  addEvent(r,`Dr. Lee confirmed information to share: ${r.fields.join(', ')}`);
  addEvent(r,`Dr. Lee approved recipient ${p.name}${r.method==='fax'?' at '+p.fax:''}`);
  S.requests.unshift(r);
  return r;
}
function sendRequest(r,rerender){
  const p=doc(r.to);
  r.attempts++;
  if(r.method==='in-app'){
    r.status='delivered'; addEvent(r,'Delivered as a secure in-app message'); log(`${TYPE_LABEL[r.type]} sent to ${p.name}`,'wait'); rerender(); return;
  }
  r.status='sending'; addEvent(r,`Fax send attempt ${r.attempts} to ${p.fax} (simulated)`);
  if(p.rel==='outside'){ p.rel='pending'; p.link='Invitation sent by fax just now'; }
  rerender();
  setTimeout(()=>{
    if(p.failOnce&&r.attempts===1){ r.status='failed'; r.failReason='No answer from the fax line'; addEvent(r,'Send failed: no answer from the fax line'); log(`Fax to ${p.name} failed to send`,'bad'); }
    else { r.status='delivered'; r.failReason=null; addEvent(r,`Delivered, ${r.type==='connect'?1:2} pages. Awaiting response`); log(`${TYPE_LABEL[r.type]} fax delivered to ${p.name}`,'wait'); }
    rerender();
  },1600);
}
function respond(r,accept,rerender){
  if(r.method==='impiricus'){ r.status=accept?'responded':'declined'; addEvent(r,accept?'Manufacturer medical team replied with official information (simulated)':'Manufacturer could not answer this request (simulated)'); log(`${r.toLabel} ${accept?'replied to':'could not answer'} your request`,accept?'good':'bad'); rerender(); return; }
  const p=doc(r.to);
  if(!accept){ r.status='declined'; addEvent(r,`${p.name} declined (simulated response)`); log(`${p.name} declined your ${TYPE_LABEL[r.type].toLowerCase()}`,'bad'); rerender(); return; }
  if(r.method==='in-app'){ r.status='responded'; addEvent(r,`${p.name} replied (simulated)`); log(`${p.name} replied to your ${TYPE_LABEL[r.type].toLowerCase()}`,'good'); rerender(); return; }
  r.status='joining'; p.rel='joining'; p.link=`Accepted your ${TYPE_LABEL[r.type].toLowerCase()} through the secure link`; p.newToImpiricus=true;
  addEvent(r,`${p.name} accepted through the secure link (simulated response)`); addEvent(r,'NPI verification started');
  if(r.patient){ const pt=pat(r.patient); if(!pt.careTeam.includes(p.id)) pt.careTeam.push(p.id); addEvent(r,'Patient identifiers released to the accepting physician'); }
  log(`${p.name} accepted and is joining your network`,'live'); rerender();
  setTimeout(()=>{ finishJoin(r); rerender(); },1800);
}
// Recipient's response from the secure-link page. Accepting and joining are separate choices.
function recipientRespond(r,{choice,join,reply},rerender){
  const p=doc(r.to), label=TYPE_LABEL[r.type].toLowerCase();
  const via='through the secure link (simulated response)';
  if(choice==='decline'){
    r.status='declined'; p.rel='outside'; p.link=`Declined your ${label}`;
    addEvent(r,`${p.name} declined ${via}`); log(`${p.name} declined your ${label}`,'bad'); rerender(); return;
  }
  if(choice==='call'){
    r.status='callback'; p.rel='outside'; p.link='Asked for a phone call instead';
    addEvent(r,`${p.name} asked for a phone call ${via}`); log(`${p.name} asked you to call about your ${label}`,'wait'); rerender(); return;
  }
  // Accepted (referral, discussion, or answered the question, or accepted the invitation)
  addEvent(r,`${p.name} ${r.type==='question'?'answered':'accepted'} ${via}`);
  if(reply) addEvent(r,`Reply: "${reply}"`);
  if(r.patient){ const pt=pat(r.patient); if(!pt.careTeam.includes(p.id)) pt.careTeam.push(p.id); addEvent(r,'Patient identifiers released to the accepting physician'); }
  if(join||r.type==='connect'){
    r.status='joining'; p.rel='joining'; p.newToImpiricus=true; p.link=`Accepted your ${label} and chose to join your network`;
    addEvent(r,`${p.name} chose to join your network on Impiricus. NPI verification started`);
    log(`${p.name} accepted and chose to join your network`,'live'); rerender();
    setTimeout(()=>{ finishJoin(r); rerender(); },1800);
  } else {
    r.status='accepted'; p.rel='outside'; p.link=`${r.type==='question'?'Answered':'Accepted'} your ${label}; didn't join your network`;
    addEvent(r,`${p.name} chose not to join the network. They can join later from any future request`);
    log(`${p.name} ${r.type==='question'?'answered':'accepted'} your ${label} without joining the network`,'good'); rerender();
  }
}
function finishJoin(r){
  const p=doc(r.to);
  if(r.status!=='joining') return;
  r.status='added'; p.rel='connected'; p.link=`Joined through your ${TYPE_LABEL[r.type].toLowerCase()}`; p.joinedVia=true;
  addEvent(r,`NPI verified. ${p.name} added to your network and to Impiricus\u2019s verified physician network`); log(`${p.name} was added to your network`,'good');
}
