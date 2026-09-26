// main.js
// Rendering, interactions, and startup. Must load last.
'use strict';

function toast(msg){ const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.getElementById('toasts').appendChild(t); setTimeout(()=>t.remove(),4200); }

function render(){
  document.getElementById('topbar').innerHTML=renderTop();
  document.getElementById('app').innerHTML=
    `<div class="page-title"><div><h1>Colleague Connect</h1><p>Refer patients, work through shared care, and ask colleagues who've seen it before. Every message is reviewed by you before it's sent.</p></div></div>`
    +viewSummary()+viewNetwork()+viewActions()+viewFlow();
  const root=document.getElementById('sheet-root');
  const body=root.querySelector('.sheet-body'), top=body?body.scrollTop:0;
  root.innerHTML=viewSheet();
  const nb=root.querySelector('.sheet-body'); if(nb&&S.flow&&S.flow._keepScroll) nb.scrollTop=top;
  document.body.style.overflow=S.flow?'hidden':'';
}

/* ---------- Privacy check: runs whenever the draft or the checked fields change ---------- */
let privacyTimer=null, privacySeq=0;
function runPrivacyCheck(delay){
  const f=S.flow; if(!f||!f.to) return;
  clearTimeout(privacyTimer);
  const seq=++privacySeq;
  f.privacy={status:'checking',flags:[],mode:null,override:false}; f.approved=false;
  updatePrivacyUI();
  privacyTimer=setTimeout(async()=>{
    const text=f.text, res=await privacyCheck(privacyRequest(f));
    if(seq!==privacySeq||S.flow!==f||f.text!==text) return;   // a newer check or edit replaced this one
    f.privacy={status:'done',flags:res.flags,mode:res.mode,override:false};
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
  f.drafting=true; f.approved=false; f.privacy={status:'checking',flags:[],mode:null,override:false};
  const res=await aiDraft(draftRequest(f));
  if(seq!==draftSeq||S.flow!==f) return;              // a newer draft request replaced this one
  if(res){ f.text=res.text; f.draftSource='ai'; f.draftModel=res.model; }
  else { f.text=draftText(f); f.draftSource='template'; f.draftModel=null; }
  f.drafting=false; f.edited=false; f._keepScroll=true;
  render(); runPrivacyCheck(0);
}

const COLLAB_TOPICS = {pt2:'Next step after semaglutide with A1c still above goal', pt3:'Anticoagulation plan with declining kidney function', pt6:'Evaluating new joint pain during infliximab treatment'};
function stepIndex(name){ return STEP_NAMES[S.flow.type](S.flow.fixedTo).indexOf(name); }
function prepareReview(){
  const f=S.flow, pt=f.patient?pat(f.patient):null;
  f.fields=shareFields(f.type,pt); f.text=''; f.edited=false; f.approved=false; f.showPreview=false;
  f.step=stepIndex('Review and approve');
  generateDraft();
}
function startFlow(type,to){
  S.flow={type,step:0,fixedTo:to||null,to:to||null,mode:'patient',patient:null,drug:null,question:'',topic:type==='connect'?'Invitation to connect':'',fields:[],text:'',edited:false,approved:false};
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
    case 'reset': resetState(); render(); toast('Demo reset.'); break;
    case 'select': S.mapSel=id; render(); break;
    case 'mapview': S.mapView=t.dataset.v; render(); break;
    case 'specfilter': S.specFilter=S.specFilter===t.dataset.s?null:t.dataset.s; render(); break;
    case 'start': startFlow(t.dataset.type,t.dataset.to); break;
    case 'close-sheet': S.flow=null; render(); break;
    case 'back': f.step=Math.max(0,f.step-1); f.approved=false; render(); break;
    case 'cmode': f.mode=t.dataset.v; render(); break;
    case 'pick-drug': f.drug=t.dataset.d; f.patient=null; f.topic=`Practical experience with ${t.dataset.d}`; f.step++; render(); break;
    case 'pick-patient': {
      const pt=pat(id); f.patient=id;
      const spec=f.fixedTo?doc(f.fixedTo).spec:pt.needs;
      f.topic=f.type==='referral'?`${spec} evaluation for ${pt.summary.toLowerCase()}`:(COLLAB_TOPICS[id]||`Coordinating care for ${pt.summary.toLowerCase()}`);
      if(f.fixedTo){ f.to=f.fixedTo; prepareReview(); } else f.step++;
      render(); break; }
    case 'pick-doc': f.to=id; prepareReview(); render(); break;
    case 'example': f.question=t.dataset.q; render(); break;
    case 'ask-next': {
      const q=document.getElementById('q-text').value.trim(); f.patient=document.getElementById('q-patient').value||null;
      if(!q){ toast('Write your question first.'); return; }
      f.question=q;
      if(f.fixedTo){ f.to=f.fixedTo; prepareReview(); } else f.step++;
      render(); break; }
    case 'regen': generateDraft(); f._keepScroll=true; render(); break;
    case 'privacy-ok': if(f&&f.privacy){ f.privacy.override=true; updatePrivacyUI(); } break;
    case 'preview': f.showPreview=!f.showPreview; f._keepScroll=true; render(); break;
    case 'send': {
      if(!f.approved) return;
      const r=createRequest(f); f.reqId=r.id; f.step=stepIndex('Track');
      S.mapSel=r.to; sendRequest(r,render); break; }
    case 'msl': {
      const r=createMslRequest(t.dataset.d,t.dataset.q||'',null);
      toast(`Sent to the ${t.dataset.d} medical team through Impiricus (simulated). Track it under What happens next.`);
      render(); break; }
    case 'recipient': document.getElementById('modal-root').innerHTML=recipientView(findReq(id)); { const b=document.querySelector('.modal input'); if(b) b.focus(); } break;
    case 'close-modal': document.getElementById('modal-root').innerHTML=''; break;
    case 'overlay': if(e.target===t) document.getElementById('modal-root').innerHTML=''; break;
    case 'rv-send': {
      const choice=(document.querySelector('input[name="rv-choice"]:checked')||{}).value||'accept';
      const joinEl=document.getElementById('rv-join'), replyEl=document.getElementById('rv-reply');
      document.getElementById('modal-root').innerHTML='';
      recipientRespond(findReq(id),{choice,join:joinEl?joinEl.checked:false,reply:replyEl?replyEl.value.trim():''},render);
      break; }
    case 'retry': { const r=findReq(id); addEvent(r,'Dr. Lee chose to retry the send'); sendRequest(r,render); break; }
    case 'editfax': S.editing=id; S.expanded=id; render(); break;
    case 'respond': respond(findReq(id),t.dataset.a==='1',render); break;
    case 'finish': finishJoin(findReq(id)); render(); break;
    case 'audit': S.expanded=S.expanded===id?null:id; render(); break;
    case 'show-req': if(!id) return; S.expanded=id; render(); { const row=document.getElementById('row-'+id); if(row) row.scrollIntoView({behavior:'smooth',block:'center'}); } break;
  }
});

document.addEventListener('change',e=>{
  const el=e.target, f=S.flow;
  if(el.dataset.bind==='outside'){ S.showOutside=el.checked; render(); return; }
  if(!f) return;
  if(el.dataset.bind==='approve'){ f.approved=el.checked&&privacyClear(f); f._keepScroll=true; render(); return; }
  if(el.dataset.field){
    const fld=f.fields.find(x=>x.id===el.dataset.field); fld.on=el.checked; f.approved=false; f._keepScroll=true;
    if(!f.edited) generateDraft(); else { toast('You edited the draft, so it wasn\u2019t changed. Use Regenerate to rebuild it.'); runPrivacyCheck(0); }
    render();
  }
});
document.addEventListener('input',e=>{
  const el=e.target, f=S.flow; if(!f) return;
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
  if(e.key==='Escape'&&document.querySelector('#modal-root .overlay')){ document.getElementById('modal-root').innerHTML=''; return; }
  if(e.key==='Escape'&&S.flow){ S.flow=null; render(); }
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('g[role="button"][data-action]')){ e.preventDefault(); e.target.dispatchEvent(new MouseEvent('click',{bubbles:true})); }
});

resetState();
render();
checkHealth();
