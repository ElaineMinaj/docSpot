// main.js
// Rendering, interactions, and startup. Must load last.
'use strict';

function toast(msg){ const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.getElementById('toasts').appendChild(t); setTimeout(()=>t.remove(),4200); }
// A larger notification that stays longer, for events Dr. Lee shouldn't miss (like patient consent).
function notify(title,msg,tone){
  const t=document.createElement('div'); t.className='toast big '+(tone||'good'); t.setAttribute('role','status');
  t.innerHTML=`<span class="ticon" aria-hidden="true">${tone==='bad'?'!':'✓'}</span><div><b>${esc(title)}</b><div>${esc(msg)}</div></div><button class="tclose" aria-label="Dismiss">×</button>`;
  t.querySelector('.tclose').onclick=()=>t.remove();
  document.getElementById('toasts').appendChild(t); setTimeout(()=>t.remove(),12000);
}

function render(){
  document.getElementById('topbar').innerHTML=renderTop();
  document.getElementById('app').innerHTML=
    `<div class="page-title"><div><h1>Colleague Connect</h1><p>Refer patients, work through shared care, and ask colleagues who've seen it before. Every message is reviewed by you before it's sent.</p></div></div>`
    +viewSummary()+viewNetwork()+viewActions()+viewRequests();
  const root=document.getElementById('sheet-root');
  const body=root.querySelector('.sheet-body'), top=body?body.scrollTop:0;
  root.innerHTML=viewSheet();
  const nb=root.querySelector('.sheet-body'); if(nb&&S.flow&&S.flow._keepScroll) nb.scrollTop=top;
  const mr=document.getElementById('modal-root'), rvTop=mr.querySelector('.rv-screen')?mr.querySelector('.rv-screen').scrollTop:0;
  mr.innerHTML=S.rv?recipientFlow():S.consent?consentModal():'';
  if(S.rv){ const sc=mr.querySelector('.rv-screen'); if(S.rv._focus){ S.rv._focus=false; const h=document.getElementById('rv-title'); if(h) h.focus(); } else if(sc) sc.scrollTop=rvTop; }
  document.body.style.overflow=S.flow||S.rv||S.consent?'hidden':'';
}

/* ---------- Privacy check: runs whenever the draft or the checked fields change ---------- */
let privacyTimer=null, privacySeq=0;
function runPrivacyCheck(delay){
  const f=S.flow; if(!f||!f.to) return;
  clearTimeout(privacyTimer);
  const seq=++privacySeq;
  // Clinical questions skip the privacy check (a team decision). The skip is noted in the audit trail.
  if(f.type==='question'){ f.privacy={status:'done',flags:[],mode:'skipped',checkedText:f.text}; f.approved=false; updatePrivacyUI(); return; }
  f.privacy={status:'checking',flags:[],mode:null}; f.approved=false;
  updatePrivacyUI();
  privacyTimer=setTimeout(async()=>{
    const text=f.text, res=await privacyCheck(privacyRequest(f));
    if(seq!==privacySeq||S.flow!==f||f.text!==text) return;   // a newer check or edit replaced this one
    f.privacy={status:'done',flags:res.flags,mode:res.mode,checkedText:text};
    updatePrivacyUI();
  },delay||0);
}
// Update only the privacy panel and the approval controls, so the textarea keeps focus while typing.
function updatePrivacyUI(){
  const f=S.flow, box=document.getElementById('privacy-box'); if(!f) return;
  if(box) box.outerHTML=privacyBox(f);
  const c=document.querySelector('[data-bind="approve"]'); if(c){ c.disabled=!privacyClear(f); c.checked=!!f.approved; }
  const s=document.querySelector('[data-action="send"]'); if(s) s.disabled=!f.approved;
}

/* ---------- AI draft: Claude through the backend, template if it's off or slower than ~6s ---------- */
let draftSeq=0;
async function generateDraft(){
  const f=S.flow; if(!f||!f.to) return;
  const seq=++draftSeq;
  clearTimeout(privacyTimer); privacySeq++;          // cancel any check of the old draft
  f.drafting=true; f.approved=false; f.privacy={status:'checking',flags:[],mode:null};
  const res=f.type==='referral'||(f.type==='connect'&&!f.patient)?await aiDraft(draftRequest(f)):null;
  if(seq!==draftSeq||S.flow!==f) return;              // a newer draft request replaced this one
  if(res){ f.text=res.text; f.draftSource='ai'; f.draftModel=res.model; }
  else { f.text=draftText(f); f.draftSource='template'; f.draftModel=null; }
  f.drafting=false; f.edited=false; f._keepScroll=true;
  render(); runPrivacyCheck(0);
}

function stepIndex(name){ return STEP_NAMES[S.flow.type](S.flow.fixedTo,S.flow).indexOf(name); }
function prepareReview(){
  const f=S.flow, pt=f.patient?pat(f.patient):null;
  f.fields=shareFields(f.type,pt,doc(f.to)?.spec); f.text=''; f.edited=false; f.approved=false; f.showPreview=false;
  f.step=stepIndex('Review and approve');
  generateDraft();
}
function startFlow(type,to,mode){
  S.flow={type,step:0,fixedTo:to||null,to:to||null,access:mode==='access',accessFilter:{},accessMode:null,accessTrial:null,mode:'patient',patient:null,drug:null,question:'',topic:type==='connect'?'Invitation to connect':'',fields:[],text:'',edited:false,approved:false};
  if(type==='connect') prepareReview();
  render();
  setTimeout(()=>{const b=document.querySelector('.sheet .opt, .sheet textarea, .sheet .btn');if(b)b.focus();},0);
}
function findReq(id){ return S.requests.find(r=>r.id===id); }

document.addEventListener('click',e=>{
  const t=e.target.closest('[data-action]'); if(!t) return;
  const a=t.dataset.action, id=t.dataset.id, f=S.flow;
  if(f) f._keepScroll=false;
  switch(a){
    case 'reset': resetState(); S.rv=null; S.consent=null; render(); toast('Demo reset.'); break;
    case 'select': S.mapSel=id; render(); break;
    case 'mapview': S.mapView=t.dataset.v; render(); break;
    case 'specfilter': S.specFilter=S.specFilter===t.dataset.s?null:t.dataset.s; render(); break;
    case 'start': startFlow(t.dataset.type,t.dataset.to,t.dataset.mode); break;
    case 'close-sheet': S.flow=null; render(); break;
    case 'back': f.step=Math.max(0,f.step-1); f.approved=false; render(); break;
    case 'cmode': f.mode=t.dataset.v; render(); break;
    case 'pick-drug': f.drug=t.dataset.d; f.patient=null; f.topic=`Practical experience with ${t.dataset.d}`; f.step++; render(); break;
    case 'pick-patient': {
      const pt=pat(id); f.patient=id;
      const spec=f.fixedTo?doc(f.fixedTo).spec:pt.needs;
      f.topic=f.type==='referral'?`${spec} evaluation`:f.type==='collab'?'Care coordination for a patient':'';
      if(f.fixedTo){ f.to=f.fixedTo; prepareReview(); } else f.step++;
      render(); break; }
    case 'pick-doc': f.to=id; prepareReview(); render(); break;
    case 'access-filter': f.accessFilter[t.dataset.k]=!f.accessFilter[t.dataset.k]; f._keepScroll=true; render(); break;
    case 'pick-access': {
      const pt=pat(f.patient), trial=t.dataset.trial?accessTrial(t.dataset.trial):null;
      f.to=id; f.accessMode=t.dataset.mode; f.accessTrial=trial?trial.id:null; f.topic=accessTopic(pt,f.accessMode,trial);
      prepareReview(); render(); break; }
    case 'example': f.question=t.dataset.q; render(); break;
    case 'ask-next': {
      const q=document.getElementById('q-text').value.trim(); f.patient=document.getElementById('q-patient').value||null;
      if(!q){ toast('Write your question first.'); return; }
      f.question=q;
      if(f.fixedTo){ f.to=f.fixedTo; prepareReview(); } else f.step++;
      render(); break; }
    case 'regen': generateDraft(); f._keepScroll=true; render(); break;
    case 'preview': f.showPreview=!f.showPreview; f._keepScroll=true; render(); break;
    case 'send': {
      if(!f.approved||!privacyClear(f)){ toast('Sending is blocked until this exact draft passes the privacy check with no flags.'); runPrivacyCheck(0); return; }
      const r=createRequest(f); f.reqId=r.id; f.step=stepIndex('Track');
      S.mapSel=r.to; sendRequest(r,render); break; }
    case 'msl': {
      const r=createMslRequest(t.dataset.d,t.dataset.q||'',null);
      toast(`Sent to the ${t.dataset.d} medical team through Impiricus (simulated). Track it under What happens next.`);
      render(); break; }
    // Recipient's side walkthrough (state in S.rv)
    case 'recipient': S.rv={id, step:0, routed:false, verified:false, choice:'accept', reply:'Happy to help. Call my office any time this week to discuss.',
      joinYes:false, skipped:false, prefs:{fax:true,inapp:false,email:false}, services:{samples:false,msl:false,support:false}, _focus:true}; render(); break;
    case 'close-modal': S.rv=null; render(); break;
    case 'rv-route': S.rv.routed=true; render(); break;
    case 'rv-next': S.rv.step++; S.rv._focus=true; render(); break;
    case 'rv-back': S.rv.step--; S.rv._focus=true; render(); break;
    case 'rv-verify': if(!S.rv.verified) return; recipientVerified(findReq(S.rv.id)); S.rv.step=2; S.rv._focus=true; render(); break;
    case 'rv-respond': {
      const v=S.rv, r=findReq(v.id);
      v.step=3; v._focus=true;
      recipientRespond(r,{choice:v.choice,reply:r.type==='question'?v.reply.trim():''},render);
      break; }
    case 'rv-joinyes': S.rv.joinYes=true; render(); break;
    case 'rv-joinno': { const v=S.rv; recipientSkipJoin(findReq(v.id)); v.skipped=true; v.step=4; v._focus=true; render(); break; }
    case 'rv-join': { const v=S.rv; v.step=4; v._focus=true; recipientJoin(findReq(v.id),{prefs:v.prefs,services:v.services},render); break; }
    // Consent: Dr. Lee reviews the auto-filled form, then it is emailed to the patient
    case 'consent-open': S.consent={id, loading:true, approved:false}; render(); loadConsentPreview(); break;
    case 'consent-close': S.consent=null; render(); break;
    case 'consent-send': {
      const v=S.consent, r=findReq(v.id); if(!v.approved||v.sending) return;
      v.sending=true; render();
      consentSend(consentPayload(r,true)).then(res=>{
        consentSent(r,res); S.consent=null; render();
        toast(res.emailed?`Consent form emailed to the patient (${res.to}).`:'Consent form ready. Email isn\u2019t set up, so use "Open patient\u2019s form".');
      }).catch(()=>{ v.sending=false; v.offline=true; render(); toast('Couldn\u2019t reach the backend to send the form.'); });
      break; }
    case 'consent-simulate': { const r=findReq(S.consent.id); consentSent(r,{simulated:true}); S.consent=null; render(); break; }
    case 'consent-simsign': { const r=findReq(id); consentResult(r,'signed',{name:pat(r.patient).name,at:clock(Date.now())}); render(); notify('Patient consented',consentMessage(r,'signed'),'good'); break; }
    case 'rv-consult': sendConsultNote(findReq(S.rv.id)); render(); toast('Consult note sent to Dr. Lee (simulated).'); break;
    case 'retry': { const r=findReq(id); addEvent(r,'Dr. Lee chose to retry the send'); sendRequest(r,render); break; }
    case 'editfax': S.editing=id; S.expanded=id; render(); break;
    case 'finish': finishJoin(findReq(id)); render(); break;
    case 'audit': S.expanded=S.expanded===id?null:id; render(); break;
    case 'show-req': if(!id) return; S.expanded=id; render(); { const row=document.getElementById('row-'+id); if(row) row.scrollIntoView({behavior:'smooth',block:'center'}); } break;
  }
});

document.addEventListener('change',e=>{
  const el=e.target, f=S.flow;
  if(el.dataset.bind==='outside'){ S.showOutside=el.checked; render(); return; }
  if(el.dataset.bind==='consent-approve'&&S.consent){ S.consent.approved=el.checked; render(); return; }
  if(el.dataset.consentField&&S.consent){
    const r=findReq(S.consent.id), k=el.dataset.consentField;
    r.consent.fields=el.checked?[...new Set([...r.consent.fields,k])]:r.consent.fields.filter(x=>x!==k);
    S.consent.approved=false; loadConsentPreview(); return;
  }
  if(el.dataset.rv&&S.rv){
    const v=S.rv, k=el.dataset.rv;
    if(k==='verified') v.verified=el.checked;
    else if(k==='choice') v.choice=el.value;
    else if(k==='prefs'||k==='services') v[k][el.value]=el.checked;
    render(); return;
  }
  if(!f) return;
  if(el.dataset.bind==='approve'){ f.approved=el.checked&&privacyClear(f); f._keepScroll=true; render(); return; }
  if(el.dataset.field){
    const fld=f.fields.find(x=>x.id===el.dataset.field); fld.on=el.checked; f.approved=false; f._keepScroll=true;
    if(!f.edited) generateDraft(); else { toast('You edited the draft, so it wasn\u2019t changed. Use Regenerate to rebuild it.'); runPrivacyCheck(0); }
    render();
  }
});
document.addEventListener('input',e=>{
  const el=e.target, f=S.flow;
  if(el.dataset.rv==='reply'&&S.rv){ S.rv.reply=el.value; return; }
  if(!f) return;
  if(el.dataset.bind==='text'){ f.text=el.value; f.edited=true; runPrivacyCheck(700); }
  if(el.dataset.bind==='topic'){ f.topic=el.value; runPrivacyCheck(700); }
  if(el.id==='q-text') f.question=el.value;
});
document.addEventListener('submit',e=>{
  const fm=e.target; if(fm.dataset.submit!=='fax') return;
  e.preventDefault();
  const r=findReq(fm.dataset.id), p=doc(r.to), val=fm.querySelector('input[name=fax]').value.trim();
  if(!/^\(?\d{3}\)?[\s-]?\d{3}-?\d{4}$/.test(val)){ toast('Enter a 10-digit fax number, like (555) 012-3456.'); return; }
  addEvent(r,`Dr. Lee updated the fax number from ${p.fax} to ${val} and approved a resend`); p.fax=val; S.editing=null;
  sendRequest(r,render);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&S.rv){ S.rv=null; render(); return; }
  if(e.key==='Escape'&&S.consent){ S.consent=null; render(); return; }
  if(e.key==='Escape'&&S.flow){ S.flow=null; render(); }
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('g[role="button"][data-action]')){ e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click',{bubbles:true})); }
});

// Fill in the form from the template on the backend. Rerun when the released items change.
async function loadConsentPreview(){
  const v=S.consent; if(!v) return;
  v.loading=true; render();
  try{ const res=await consentPreview(consentPayload(findReq(v.id),false)); if(S.consent!==v) return; Object.assign(v,{html:res.html, to:res.to, emailReady:res.email_ready, offline:false}); }
  catch(e){ if(S.consent!==v) return; v.offline=true; }
  v.loading=false; render();
}
// Check every few seconds whether a patient has signed. Patient information is released only then.
setInterval(async()=>{
  for(const r of S.requests.filter(x=>x.consent&&x.consent.status==='sent'&&x.consent.token)){
    try{
      const st=await consentStatus(r.consent.token);
      if(st.status==='signed'||st.status==='declined'){ consentResult(r,st.status,st.signed); render(); notify(st.status==='signed'?'Patient consented':'Patient declined consent',consentMessage(r,st.status),st.status==='signed'?'good':'bad'); }
    }catch(e){ /* backend off or restarted: keep waiting */ }
  }
},3000);

resetState();
render();
checkHealth();
