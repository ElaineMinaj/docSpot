// views.js
// Overview page (summary, network map, three actions, connection flow) and the action sheet.
'use strict';

const AI_TAG = '<span class="ai">AI recommendation, simulated</span>';
const SIM = '<span class="sim">Simulated</span>';
const relLabel = r => ({connected:'Connected', joining:'Joining through referral', pending:'Invitation pending', outside:'Not connected'}[r]);
const specChip = s => `<span class="spec-chip"><span class="spec-dot" style="background:${SPECIALTY_COLORS[s]}"></span>${esc(s)}</span>`;
const statusPill = st => `<span class="status ${STATUS[st].tone}">${esc(STATUS[st].label)}</span>`;
const avatar = p => `<div class="avatar ${p.rel==='connected'||p.rel==='joining'?'g':'c'}" style="background:${SPECIALTY_COLORS[p.spec]}22;color:${SPECIALTY_COLORS[p.spec]}">${initialsOf(p)}</div>`;

function renderTop(){
  return `<div class="brand"><svg width="30" height="22" viewBox="0 0 30 22" aria-hidden="true"><circle cx="10" cy="11" r="8" fill="var(--accent)"/><circle cx="20" cy="11" r="8" fill="var(--connected)" opacity=".85"/></svg>Impiricus <span style="color:var(--muted);font-weight:600">Colleague Connect</span></div>
  <span class="meta">${esc(ME.name)}, ${esc(ME.spec)}</span><span class="verified">Verified physician</span>
  <button class="btn ghost small" data-action="reset">Reset demo</button>`;
}

/* ---------- 1. Network summary ---------- */
function viewSummary(){
  const c=S.phys.filter(p=>p.rel==='connected').length, pend=S.phys.filter(p=>p.rel==='pending').length;
  const failed=S.requests.filter(r=>r.status==='failed').length;
  const joining=S.phys.filter(p=>p.rel==='joining').length, joined=S.phys.filter(p=>p.joinedVia).length;
  const shared=S.patients.filter(pt=>pt.careTeam.some(id=>['connected','joining'].includes(doc(id).rel))).length;
  const toneColor={good:'var(--connected)',bad:'var(--danger)',wait:'var(--warm)',live:'var(--accent)','':'var(--muted)'};
  return `<section class="section" aria-labelledby="h-sum"><div class="section-head"><h2 id="h-sum">Network summary</h2><p>Updated live as faxes are delivered and physicians respond.</p></div>
  <div class="summary"><div class="statgrid">
    <div class="stat"><b style="color:var(--connected)">${c}</b><span>Connected physicians</span><span class="hint">${joined?`${joined} new to Impiricus through your invitations`:'Across 8 specialties'}</span></div>
    <div class="stat"><b style="color:var(--warm)">${pend}</b><span>Pending invitations</span><span class="hint ${failed?'bad':''}">${failed?`${failed} fax ${failed===1?'needs':'need'} attention`:'All delivered'}</span></div>
    <div class="stat"><b style="color:var(--accent)">${joining}</b><span>Joining through referrals</span><span class="hint">Accepted by fax, joining Impiricus</span></div>
    <div class="stat"><b>${shared}</b><span>Patients shared with your network</span><span class="hint">Details stay inside each workflow</span></div>
  </div><div class="activity"><h3>Recent activity</h3><ol>${S.activity.slice(0,6).map(a=>`<li><span class="adot" style="background:${toneColor[a[2]]}"></span><span>${esc(a[1])}</span><span class="when">${ago(a[0])}</span></li>`).join('')}</ol></div></div></section>`;
}

/* ---------- 2. Network map ---------- */
function graphLayout(){
  const order=Object.keys(SPECIALTY_COLORS);
  const nodes=S.phys.filter(p=>p.rel!=='outside'||S.showOutside).sort((a,b)=>order.indexOf(a.spec)-order.indexOf(b.spec)||a.name.localeCompare(b.name));
  const pos={}, n=nodes.length;
  nodes.forEach((p,i)=>{ const ang=-Math.PI/2+(i+.5)/n*2*Math.PI; const r={connected:150,joining:198,pending:236,outside:268}[p.rel]; pos[p.id]={x:500+Math.cos(ang)*r*1.45,y:300+Math.sin(ang)*r}; });
  return {nodes,pos};
}
function graphSVG(){
  const {nodes,pos}=graphLayout();
  let s=`<svg viewBox="0 0 1000 600" role="img" aria-label="Network map: you in the center, connected physicians around you, colored by specialty. Use the list view for a text version."><defs><filter id="glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="vig" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="var(--accent)" stop-opacity=".10"/><stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/></radialGradient></defs><rect width="1000" height="600" fill="url(#vig)"/>`;
  [150,198,236,268].forEach((r,i)=>{ if(i===3&&!S.showOutside) return; s+=`<ellipse cx="500" cy="300" rx="${r*1.45}" ry="${r}" fill="none" stroke="var(--map-line)" stroke-width="1.2"/>`; });
  nodes.forEach(p=>{ const q=pos[p.id], dim=S.specFilter&&S.specFilter!==p.spec;
    const dash=p.rel==='pending'?'stroke-dasharray="6 6"':p.rel==='joining'?'stroke-dasharray="2 5"':p.rel==='outside'?'stroke-dasharray="1 7"':'';
    s+=`<line x1="500" y1="300" x2="${q.x}" y2="${q.y}" stroke="${SPECIALTY_COLORS[p.spec]}" stroke-opacity="${dim?.08:p.rel==='connected'?.45:.35}" stroke-width="${S.mapSel===p.id?2.6:1.5}" ${dash}/>`; });
  nodes.forEach(p=>{
    const q=pos[p.id], col=SPECIALTY_COLORS[p.spec], sel=S.mapSel===p.id, dim=S.specFilter&&S.specFilter!==p.spec, sh=sharedPatients(p.id).length;
    const filled=p.rel==='connected'||p.rel==='joining', r=p.rel==='outside'?10:13;
    s+=`<g class="gnode" data-action="select" data-id="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}, ${esc(p.spec)}, ${relLabel(p.rel)}" opacity="${dim?.22:1}">`;
    if(sel) s+=`<circle cx="${q.x}" cy="${q.y}" r="${r+8}" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>`;
    s+=`<circle class="core" cx="${q.x}" cy="${q.y}" r="${r}" fill="${filled?col:'var(--map-bg)'}" stroke="${col}" stroke-width="${filled?2:2.4}" ${p.rel==='pending'?'stroke-dasharray="4 3"':''} ${filled?'filter="url(#glow)"':''}/>`;
    if(p.rel==='joining') s+=`<circle cx="${q.x}" cy="${q.y}" r="${r+4}" fill="none" stroke="${col}" stroke-width="1.5" stroke-dasharray="2 3"/>`;
    if(sh) s+=`<circle cx="${q.x+r-1}" cy="${q.y-r+1}" r="8" fill="var(--raised)" stroke="${col}" stroke-width="1.5"/><text x="${q.x+r-1}" y="${q.y-r+5}" text-anchor="middle" font-size="10.5" font-weight="800" fill="var(--ink)" font-family="Public Sans, sans-serif" pointer-events="none">${sh}</text>`;
    s+=`<text x="${q.x}" y="${q.y+r+17}" text-anchor="middle" font-size="12" font-weight="${sel?800:600}" fill="${sel?'var(--ink)':'var(--muted)'}" font-family="Public Sans, sans-serif" paint-order="stroke" stroke="var(--map-bg)" stroke-width="4" pointer-events="none">${esc(shortName(p))}</text></g>`;
  });
  s+=`<circle cx="500" cy="300" r="26" fill="var(--accent)" filter="url(#glow)"/><text x="500" y="305" text-anchor="middle" font-size="14" font-weight="800" fill="#0A1224" font-family="Public Sans, sans-serif">You</text>`;
  return s+'</svg>';
}
function viewNetwork(){
  const specsShown=[...new Set(S.phys.filter(p=>p.rel!=='outside'||S.showOutside).map(p=>p.spec))];
  let h=`<section class="section" aria-labelledby="h-net"><div class="section-head"><h2 id="h-net">Network map</h2><div class="nettools"><div class="seg small" role="group" aria-label="Map or list"><button data-action="mapview" data-v="map" aria-pressed="${S.mapView==='map'}">Map</button><button data-action="mapview" data-v="list" aria-pressed="${S.mapView==='list'}">List</button></div><label class="meta" style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-bind="outside" ${S.showOutside?'checked':''}> Show recommended physicians outside your network</label></div></div><div class="netwrap"><div>`;
  if(S.mapView==='map'){
    h+=`<div class="netmap">${graphSVG()}</div><div class="netlegend">${specsShown.map(s=>`<span><button class="pill" style="padding:2px 10px;font-size:12.5px" data-action="specfilter" data-s="${esc(s)}" aria-pressed="${S.specFilter===s}"><span class="spec-dot" style="background:${SPECIALTY_COLORS[s]};margin-right:6px"></span>${esc(s)}</button></span>`).join('')}<span><i class="lg-line"></i>Connected</span><span><i class="lg-line dot"></i>Joining</span><span><i class="lg-line dash"></i>Pending</span><span>Small number: shared patients (count only)</span></div>`;
  } else {
    const rows=S.phys.filter(p=>p.rel!=='outside'||S.showOutside);
    h+=`<div class="tablewrap"><table class="list"><caption class="meta" style="text-align:left;padding:10px 12px">Physicians in your network${S.showOutside?' and recommended physicians outside it':''}</caption><thead><tr><th scope="col">Physician</th><th scope="col">Specialty</th><th scope="col">Relationship</th><th scope="col">Shared patients</th><th scope="col">Drug experience</th><th scope="col"><span class="sr-only">Action</span></th></tr></thead><tbody>${rows.map(p=>`<tr><td><b>${esc(p.name)}</b><div class="meta">${esc(p.practice)}</div></td><td>${specChip(p.spec)}</td><td>${relLabel(p.rel)}</td><td>${sharedPatients(p.id).length||'None'}</td><td class="meta">${Object.keys(p.drugs).filter(d=>p.drugs[d]!=='low').join(', ')||'None listed'}</td><td><button class="btn ghost small" data-action="select" data-id="${p.id}">View</button></td></tr>`).join('')}</tbody></table></div>`;
  }
  h+=`</div>${viewPanel()}</div></section>`;
  return h;
}
function viewPanel(){
  const p=doc(S.mapSel); if(!p) return '<aside class="panel-card"><p class="meta">Select a physician on the map.</p></aside>';
  const sh=sharedPatients(p.id).length, drugs=Object.keys(p.drugs).filter(d=>p.drugs[d]!=='low');
  const req=S.requests.find(r=>r.to===p.id&&!STATUS[r.status].done);
  let h=`<aside class="panel-card" aria-live="polite"><div style="display:flex;gap:12px;align-items:center">${avatar(p)}<div><h3>${esc(p.name)}</h3><div class="meta">${esc(p.practice)}, ${esc(p.city)}</div></div></div><div class="chips" style="margin-top:12px">${specChip(p.spec)}<span class="status ${p.rel==='connected'?'good':p.rel==='outside'?'':'wait'}">${relLabel(p.rel)}</span></div>`;
  h+=`<h4>Relationship to you</h4><p style="margin:0;font-size:14px">${esc(p.link||'No prior contact')}</p><p class="meta" style="margin:4px 0 0">${p.dist} miles away${p.hospital?`, ${esc(p.hospital)}`:''}</p>`;
  h+=`<h4>Shared patients</h4><p style="margin:0;font-size:14px">${sh?`${sh} shared ${sh===1?'patient':'patients'}`:'None'}</p>`;
  h+=`<h4>Relevant drug experience</h4>${drugs.length?`<div class="chips">${drugs.map(d=>`<span class="chip drug">${esc(d)}, ${p.drugs[d]}</span>`).join('')}</div>`:'<p class="meta" style="margin:0">None listed</p>'}`;
  h+='<div class="btnrow">';
  if(p.rel==='connected'||p.rel==='joining'){
    h+=`<button class="btn small" data-action="start" data-type="collab" data-to="${p.id}">Collaborate on care</button><button class="btn ghost small" data-action="start" data-type="question" data-to="${p.id}">Ask a question</button><button class="btn ghost small" data-action="start" data-type="referral" data-to="${p.id}">Refer a patient</button>`;
  } else if(p.rel==='pending'){
    h+=`<button class="btn small" data-action="show-req" data-id="${req?req.id:''}">${req&&req.status==='failed'?'Fix failed fax':'View invitation status'}</button>`;
  } else {
    h+=`<button class="btn small" data-action="start" data-type="connect" data-to="${p.id}">Send connection request</button><button class="btn ghost small" data-action="start" data-type="referral" data-to="${p.id}">Refer a patient</button>`;
  }
  h+=`</div><p class="privacy">Patient details never appear on the map. They're shown only inside a referral or care discussion, after you choose to share them.</p></aside>`;
  return h;
}

/* ---------- 3. Three primary actions ---------- */
function viewActions(){
  const icon=(d)=>`<div class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg></div>`;
  return `<section class="section" aria-labelledby="h-act"><div class="section-head"><h2 id="h-act">What do you need?</h2><p>Each action ends with a fax or message you review before it's sent.</p></div><div class="actions3">
  <button class="action" data-action="start" data-type="referral">${icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>')}<h3>Find a specialist</h3><p>Start from a patient who needs specialist care. Get matched physicians with the reasons, then send a referral.</p><span class="go">Choose a patient</span></button>
  <button class="action" data-action="start" data-type="collab">${icon('<circle cx="8" cy="9" r="3"/><circle cx="16" cy="9" r="3"/><path d="M2 20c0-3 3-5 6-5s6 2 6 5M12 20c0-3 3-5 6-5 1.5 0 3 .5 4 1.3"/>')}<h3>Collaborate on care</h3><p>Find physicians already caring for the same patient or experienced with the same drug, and request a focused discussion.</p><span class="go">Choose a patient or drug</span></button>
  <button class="action" data-action="start" data-type="question">${icon('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M12 8.5a1.8 1.8 0 0 1 1.8 1.8c0 1.2-1.8 1.6-1.8 2.9M12 16h.01"/>')}<h3>Ask a clinical question</h3><p>Type your question. An AI assistant suggests who is best placed to answer it and helps you route it.</p><span class="go">Write a question</span></button>
  </div></section>`;
}

/* ---------- 4. Connection and referral flow ---------- */
function progressDots(r){
  const st=STATUS[r.status], stage=st.stage;
  return `<div class="dots" aria-label="Stage ${stage+1} of 6: ${esc(st.label)}">${FLOW_STEPS.map((_,i)=>{let c='';if(i<stage||(st.done&&i===stage&&r.status!=='declined'))c='done';else if(i===stage)c=st.tone==='bad'?'fail':'on';if(r.method!=='fax'&&i===5)c='';return `<i class="${c}" title="${esc(FLOW_STEPS[i])}"></i>`;}).join('')}</div>`;
}
function reqActions(r){
  if(r.status==='failed') return `<button class="btn small" data-action="retry" data-id="${r.id}">Retry send</button><button class="btn ghost small" data-action="editfax" data-id="${r.id}">Update fax number</button>`;
  if(r.status==='delivered'&&r.method==='fax') return `<button class="btn ghost small" data-action="recipient" data-id="${r.id}">Open recipient's view</button> <span class="sim">Simulated</span>`;
  if(r.status==='delivered') return `<button class="btn ghost small" data-action="respond" data-id="${r.id}" data-a="1">Simulate: replies</button><button class="btn ghost small" data-action="respond" data-id="${r.id}" data-a="0">Simulate: declines</button>`;
  if(r.status==='joining') return `<button class="btn ghost small" data-action="finish" data-id="${r.id}">Complete verification</button>`;
  if(r.status==='sending') return '<span class="meta">Sending…</span>';
  return '';
}
function viewFlow(){
  const active=S.requests.filter(r=>!STATUS[r.status].done);
  const counts=FLOW_STEPS.map((_,i)=>active.filter(r=>STATUS[r.status].stage===i).length);
  const bad=FLOW_STEPS.map((_,i)=>active.some(r=>STATUS[r.status].stage===i&&STATUS[r.status].tone==='bad'));
  let h=`<section class="section" aria-labelledby="h-flow"><div class="section-head"><h2 id="h-flow">What happens next</h2><p>Every request moves through the same six steps. ${SIM} Fax delivery in this prototype is simulated; no fax provider is connected.</p></div>`;
  h+=`<ol class="flow" style="list-style:none;padding:0;margin:0 0 14px">${FLOW_STEPS.map((t,i)=>`<li class="fstep ${counts[i]?'has':''} ${bad[i]?'bad':''}"><span class="n">${i+1}</span><b>${t}</b><div class="cnt">${bad[i]?'Needs attention':counts[i]?`${counts[i]} in progress`:i===5?`${S.phys.filter(p=>p.joinedVia).length} added today`:'None right now'}</div></li>`).join('')}</ol>`;
  h+=`<div class="tablewrap"><table class="list"><caption class="meta" style="text-align:left;padding:10px 12px">Your requests. Select Audit trail to see every step, who approved it, and when.</caption><thead><tr><th scope="col">Request</th><th scope="col">Physician</th><th scope="col">Patient or topic</th><th scope="col">Status</th><th scope="col">Progress</th><th scope="col">Next step</th></tr></thead><tbody>`;
  S.requests.forEach(r=>{
    const p=r.to?doc(r.to):{name:r.toLabel,spec:r.toSub,fax:''}, pt=r.patient?pat(r.patient):null;
    h+=`<tr id="row-${r.id}"><td><b>${TYPE_LABEL[r.type]}</b><div class="meta">${r.id}, ${r.method==='fax'?'fax':r.method==='impiricus'?'through Impiricus':'in-app'}</div></td><td>${esc(p.name)}<div class="meta">${esc(p.spec)}</div></td><td>${pt?`<b>${pt.initials}</b> `:''}<span class="meta">${esc(r.topic.length>60?r.topic.slice(0,57)+'…':r.topic)}</span></td><td>${statusPill(r.status)}${r.status==='failed'?`<div class="meta" style="color:var(--danger);margin-top:4px">${esc(r.failReason)}</div>`:''}</td><td>${progressDots(r)}</td><td><div class="acts">${reqActions(r)}<button class="btn link" data-action="audit" data-id="${r.id}" aria-expanded="${S.expanded===r.id}">Audit trail</button></div></td></tr>`;
    if(S.expanded===r.id) h+=`<tr class="expand"><td colspan="6"><b style="font-size:13.5px">Audit trail for ${r.id}</b><ol class="audit">${r.events.map(e=>`<li><time>${clock(e[0])}</time>${esc(e[1])}</li>`).join('')}</ol>${S.editing===r.id?`<form class="inline-input" data-submit="fax" data-id="${r.id}"><input type="text" name="fax" value="${esc(p.fax)}" aria-label="Fax number for ${esc(p.name)}" style="max-width:220px"><button class="btn small" type="submit">Save and resend</button></form><p class="note">Resending uses the contents you already approved.</p>`:''}</td></tr>`;
  });
  return h+'</tbody></table></div></section>';
}

/* ---------- Recipient's secure-link page (simulated) ---------- */
function recipientView(r){
  const p=doc(r.to), pt=r.patient?pat(r.patient):null, t=r.type;
  const shared=(r.fields||[]).filter(x=>!/Name and date of birth/.test(x));
  const primary = t==='connect'
    ? [['accept','Accept the invitation and join']]
    : [['accept',t==='referral'?'Accept the referral':t==='collab'?'Accept the discussion':'Answer the question'],['call','Ask for a phone call instead'],['decline','Decline']];
  return `<div class="overlay" data-action="overlay"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="rv-title" style="max-width:640px">
  <p class="meta" style="margin:0 0 6px">What ${esc(p.name)} sees after opening the secure link from the fax <span class="sim">Simulated</span></p>
  <div class="box" style="margin:0 0 12px"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>Impiricus Colleague Connect</b><span class="tag">Secure response, code verified</span></div>
  <h2 id="rv-title" style="margin:10px 0 4px;font-size:20px">${esc(ME.name)} sent you a ${esc(TYPE_LABEL[t].toLowerCase())}</h2><p class="meta" style="margin:0">${esc(ME.spec)}, ${esc(ME.practice)}, ${esc(ME.city)}</p>
  <p style="margin:12px 0 4px"><b>${t==='question'?'Question':t==='connect'?'Message':'Topic'}:</b> ${esc(r.topic)}</p>
  ${pt?`<p class="meta" style="margin:4px 0 0">Shared so far: ${esc(shared.join(', ')||'topic only')}. Patient name and date of birth are released only if you accept.</p>`:''}</div>
  <fieldset style="border:0;padding:0;margin:0"><legend style="font-weight:700;margin-bottom:6px">Your response</legend>
  ${primary.map((o,i)=>`<label class="check"><input type="radio" name="rv-choice" value="${o[0]}" ${i===0?'checked':''}><span>${o[1]}</span></label>`).join('')}</fieldset>
  ${t==='question'?'<label class="f" style="margin-top:10px">Your reply<textarea id="rv-reply">In my practice, I would start by checking the most recent labs and adjusting based on current guidance. Happy to discuss by phone.</textarea></label>':''}
  ${t==='connect'?'':`<div class="approve" style="margin-top:14px"><input type="checkbox" id="rv-join"><span><b>Also join ${esc(ME.short)}'s network on Impiricus</b> (optional)<br><span class="meta">Free and limited to verified physicians. Lets colleagues send you referrals and questions securely instead of by fax. Your answer above is sent either way. This does not sign you up for text messages.</span></span></div>`}
  <div class="modal-foot"><button class="btn ghost" data-action="close-modal">Cancel</button><button class="btn" data-action="rv-send" data-id="${r.id}">Send response</button></div></div></div>`;
}

/* ---------- Action sheet ---------- */
const STEP_NAMES = {
  referral: to => to?['Patient','Review and approve','Track']:['Patient','Specialist','Review and approve','Track'],
  collab:   to => to?['Patient','Review and approve','Track']:['Patient or drug','Physician','Review and approve','Track'],
  question: to => to?['Question','Review and approve','Track']:['Question','Who to ask','Review and approve','Track'],
  connect:  () => ['Review and approve','Track']
};
const SHEET_TITLE = {referral:'Find a specialist', collab:'Collaborate on care', question:'Ask a clinical question', connect:'Send a connection request'};

function viewSheet(){
  const f=S.flow; if(!f) return '';
  const names=STEP_NAMES[f.type](f.fixedTo), cur=names[f.step];
  let body='';
  if(cur==='Patient'||cur==='Patient or drug') body=stepPatient(f);
  else if(cur==='Specialist'||cur==='Physician'||cur==='Who to ask') body=stepRecommend(f);
  else if(cur==='Question') body=stepQuestion(f);
  else if(cur==='Review and approve') body=stepReview(f);
  else body=stepTrack(f);
  const onReview=cur==='Review and approve';
  return `<div class="sheet-bg" data-action="close-sheet"></div><aside class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="sheet-head"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><h2 id="sheet-title">${SHEET_TITLE[f.type]}</h2><button class="btn ghost small" data-action="close-sheet">Close</button></div><div class="stepper">${names.map((n,i)=>`<span class="${i===f.step?'cur':i<f.step?'done':''}"><i>${i<f.step?'✓':i+1}</i>${n}</span>`).join('')}</div></div>
  <div class="sheet-body">${body}</div>
  <div class="sheet-foot"><div>${f.step>0&&cur!=='Track'?'<button class="btn ghost" data-action="back">Back</button>':''}</div><div style="display:flex;gap:8px">${onReview?`<button class="btn" data-action="send" ${f.approved?'':'disabled'}>${doc(f.to).rel==='connected'||doc(f.to).rel==='joining'?'Send secure message':'Send secure fax'}</button>`:''}${cur==='Track'?'<button class="btn" data-action="close-sheet">Done</button>':''}</div></div></aside>`;
}
function stepPatient(f){
  let h='';
  if(f.type==='collab'&&!f.fixedTo) h+=`<div class="seg small" role="group" aria-label="Start from" style="margin-bottom:14px"><button data-action="cmode" data-v="patient" aria-pressed="${f.mode!=='drug'}">A patient</button><button data-action="cmode" data-v="drug" aria-pressed="${f.mode==='drug'}">A drug</button></div>`;
  if(f.type==='collab'&&f.mode==='drug'&&!f.fixedTo){
    return h+`<p class="meta" style="margin:0 0 10px">Find physicians with experience prescribing a specific drug.</p><div class="examples">${DRUG_LIST.map(d=>`<button data-action="pick-drug" data-d="${esc(d)}">${esc(d)}</button>`).join('')}</div>`;
  }
  let list=S.patients;
  if(f.type==='collab'&&f.fixedTo) list=list.filter(pt=>pt.careTeam.includes(f.fixedTo)).concat(list.filter(pt=>!pt.careTeam.includes(f.fixedTo)));
  h+=`<p class="meta" style="margin:0 0 12px">Your patients, already available in Impiricus. Only initials and the reason for care are shown here.</p>`;
  list.forEach(pt=>{
    const team=pt.careTeam.map(doc);
    const tag=f.type==='referral'?`<span class="tag ${pt.flag==='Needs specialist care'?'need':''}">${esc(pt.flag)}</span>`:`<span class="tag">${team.length?`${team.length} other ${team.length===1?'physician':'physicians'} involved`:'No shared care team'}</span>`;
    h+=`<button class="opt" data-action="pick-patient" data-id="${pt.id}"><div class="avatar c">${pt.initials.replace(/\./g,'')}</div><div class="grow"><b>${pt.initials}, ${pt.age}${pt.sex}</b> <span class="meta">MRN ${pt.mrn}</span><div class="meta">${esc(pt.summary)}</div><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">${tag}${f.type==='referral'?specChip(pt.needs):''}</div></div></button>`;
  });
  return h;
}
function stepQuestion(f){
  return `<label class="f">Your question<textarea id="q-text" placeholder="For example: How do you adjust apixaban dosing as kidney function declines?">${esc(f.question||'')}</textarea></label><div class="examples" aria-label="Example questions">${EXAMPLE_QUESTIONS.map(q=>`<button data-action="example" data-q="${esc(q)}">${esc(q)}</button>`).join('')}</div>
  <label class="f" style="margin-top:6px">Attach a patient for context (optional)<select id="q-patient"><option value="">No patient</option>${S.patients.map(pt=>`<option value="${pt.id}" ${f.patient===pt.id?'selected':''}>${pt.initials}, ${pt.age}${pt.sex}: ${esc(pt.summary)}</option>`).join('')}</select></label>
  <p class="note">You'll choose exactly which patient details to share on the review step.</p><div style="margin-top:14px"><button class="btn" data-action="ask-next">${f.fixedTo?'Continue':'Find who can answer'}</button></div>`;
}
function stepRecommend(f){
  let h='';
  const pt=f.patient?pat(f.patient):null;
  const opt=(x)=>`<button class="opt" data-action="pick-doc" data-id="${x.p.id}">${avatar(x.p)}<div class="grow"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(x.p.name)}</b>${specChip(x.p.spec)}</div><div class="meta">${esc(x.p.practice)}</div><ul class="reasons">${x.reasons.map(r=>`<li class="${r.k}">${esc(r.t)}</li>`).join('')}</ul></div></button>`;
  if(f.type==='referral'){
    const list=recommendForPatient(pt);
    h+=`<div class="box" style="margin-bottom:14px"><b>${pt.initials}, ${pt.age}${pt.sex}</b><div class="meta">${esc(pt.summary)}. Recommended specialty: ${esc(pt.needs)}</div></div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b>Recommended ${esc(pt.needs.toLowerCase())} physicians</b>${AI_TAG}</div><p class="disclaimer">Ranked by relationship to you, relevant treatment experience, whether they're accepting referrals, and distance. Payments from drug companies are never used. Review each reason before choosing.</p>`;
    h+=list.map(opt).join('');
  } else if(f.type==='collab'){
    if(f.mode==='drug'){
      h+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b>Physicians experienced with ${esc(f.drug)}</b>${AI_TAG}</div><p class="disclaimer">Based on prescribing experience and your relationship. Payments from drug companies are never used.</p>`+collabForDrug(f.drug).map(opt).join('')+mslCard(f.drug,`Practical questions about ${f.drug}`);
    } else {
      const {team,exp}=collabForPatient(pt);
      h+=`<div class="box" style="margin-bottom:14px"><b>${pt.initials}, ${pt.age}${pt.sex}</b><div class="meta">${esc(pt.summary)}</div></div>`;
      h+=`<b>Already involved with this patient</b><div style="margin:8px 0 14px">${team.length?team.map(opt).join(''):'<p class="meta">No other physicians on this patient\u2019s care team yet.</p>'}</div>`;
      h+=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b>Experienced with ${esc(pt.keyDrugs.join(' or '))}</b>${AI_TAG}</div>${exp.map(opt).join('')||'<p class="meta">No strong matches.</p>'}`+mslCard(pt.keyDrugs[0],'');
    }
  } else {
    const {u,list}=recommendForQuestion(f.question);
    h+=`<div class="box"><span class="meta">Your question</span><p style="margin:4px 0 0">${esc(f.question)}</p></div><div style="display:flex;justify-content:space-between;align-items:center;margin:4px 0 8px"><b>Who can answer this</b>${AI_TAG}</div><p class="disclaimer">The assistant suggests physicians to ask. It doesn't answer clinical questions or give medical advice.</p>`;
    if(!list.length) h+=`<p class="meta">The assistant couldn't tell what this question is about. Mention a condition, drug, or specialty, then try again.</p><button class="btn ghost" data-action="back">Edit question</button>`;
    else h+=`<p class="meta" style="margin:0 0 10px">Detected: ${[...u.specs,...u.drugs].map(esc).join(', ')}.</p>`+list.map(opt).join('')+mslCard(u.drugs[0],f.question);
  }
  return h;
}
function mslCard(drug,question){
  if(!drug) return '';
  return `<div class="box" style="margin-top:16px;border-color:rgba(134,168,255,.35)"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap"><b>Also want the manufacturer's official answer?</b><span class="tag">Existing Impiricus service</span></div><p class="meta" style="margin:6px 0 10px">Send this to the ${esc(drug)} manufacturer's medical team through Impiricus for official, on-label information. Only your question is shared, never patient identifiers.</p><button class="btn ghost small" data-action="msl" data-d="${esc(drug)}" data-q="${esc(question||'')}">Send to the ${esc(drug)} medical team</button> ${SIM}</div>`;
}
function faxPreview(f,p,code){
  const date=new Date().toLocaleDateString([], {month:'short',day:'numeric',year:'numeric'});
  const inApp=p.rel==='connected'||p.rel==='joining';
  if(inApp) return `<div class="box"><b>Delivered as a secure in-app message</b><p class="meta" style="margin:4px 0 0">${esc(p.name)} is in your network, so no fax is needed.</p></div><div class="fax" style="font-family:inherit"><pre>${esc(f.text)}</pre></div>`;
  return `<div class="fax"><div class="stamp">Simulated</div><div class="fax-head"><span>SECURE FAX: ${TYPE_LABEL[f.type].toUpperCase()}</span><span>Page 1 of ${f.type==='connect'?1:2}</span></div><table><tr><td>To:</td><td>${esc(p.name)}, ${esc(p.practice)}<br>Fax ${esc(p.fax)}</td></tr><tr><td>From:</td><td>${esc(ME.name)}, ${esc(ME.practice)}</td></tr><tr><td>Date:</td><td>${date}</td></tr></table><pre>${esc(f.text)}</pre><div class="respond"><b>To respond (no account needed):</b><br>1. Secure link: impiricus.example/cc/${code}, one-time code ${code}<br>2. Or tick and fax this page back to ${RETURN_FAX}:<br>${f.type==='connect'?`[ ] Yes, join ${esc(ME.short)}'s network on Impiricus<br>[ ] Not now`:`[ ] ${f.type==='referral'?'Accept the referral':f.type==='collab'?'Accept the discussion':'I\u2019ll answer (reply below or by link)'}<br>[ ] Please call me instead: ______________<br>[ ] Decline<br><br>Optional, separate from your answer:<br>[ ] Also join ${esc(ME.short)}'s network on Impiricus (free, verified physicians only)`}</div><p class="fine" style="margin-top:10px">Sent securely through Impiricus Colleague Connect. Joining is free for physicians. Confidential. Intended only for the named recipient. If received in error, notify the sender and destroy this document.</p></div>`;
}
function stepReview(f){
  const p=doc(f.to), pt=f.patient?pat(f.patient):null, inApp=p.rel==='connected'||p.rel==='joining';
  let h=`<div class="review"><div><div class="box"><h3>Recipient</h3><div class="kvrow"><span>Physician</span><span>${esc(p.name)}</span></div><div class="kvrow"><span>Specialty</span><span>${esc(p.spec)}</span></div><div class="kvrow"><span>Practice</span><span>${esc(p.practice)}</span></div><div class="kvrow"><span>NPI</span><span>${p.npi}</span></div><div class="kvrow"><span>Delivery</span><span>${inApp?'Secure in-app message':'Secure fax to '+esc(p.fax)}</span></div><div class="kvrow"><span>Relationship</span><span>${relLabel(p.rel)}</span></div>${f.fixedTo||f.type==='connect'?'':'<button class="btn link" data-action="back" style="margin-top:8px">Choose a different physician</button>'}</div>`;
  if(f.type==='referral'||f.type==='collab') h+=`<div class="box"><h3>${f.type==='referral'?'Reason for referral':'Discussion topic'}</h3><input type="text" data-bind="topic" value="${esc(f.topic)}" aria-label="${f.type==='referral'?'Reason for referral':'Discussion topic'}"></div>`;
  h+=`<div class="box"><h3>Information to share</h3>${pt?`<p class="meta" style="margin:0 0 6px">Patient ${pt.initials}, ${pt.age}${pt.sex}. Only what's checked is included.</p>`:''}${f.fields.map(x=>`<label class="check ${x.locked?'locked':''}"><input type="checkbox" data-field="${x.id}" ${x.on?'checked':''} ${x.locked?'disabled':''}><span>${esc(x.label)}${x.note?`<small>${esc(x.note)}</small>`:''}</span></label>`).join('')}</div></div>`;
  h+=`<div><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><b>${inApp?'Message':'Fax'} draft</b><span class="ai">AI draft, simulated. Review before sending.</span></div><textarea data-bind="text" style="min-height:230px" aria-label="Draft text">${esc(f.text)}</textarea><div style="display:flex;gap:10px;margin:8px 0 14px;flex-wrap:wrap"><button class="btn ghost small" data-action="regen">Regenerate from checked information</button><button class="btn ghost small" data-action="preview" aria-expanded="${!!f.showPreview}">${f.showPreview?'Hide':'Show'} ${inApp?'message':'fax'} preview</button></div>${f.showPreview?faxPreview(f,p,'A7K-'+(S.seq+1)):''}
  <label class="approve" style="margin-top:14px"><input type="checkbox" data-bind="approve" ${f.approved?'checked':''}><span>I reviewed the recipient and the information being shared, and I approve sending it${inApp?'':' by fax'}.</span></label></div></div>`;
  return h;
}
function stepTrack(f){
  const r=S.requests.find(x=>x.id===f.reqId); if(!r) return '';
  const p=r.to?doc(r.to):{name:r.toLabel,fax:''}, st=STATUS[r.status];
  let h=`<div class="box"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center"><div><b>${TYPE_LABEL[r.type]} to ${esc(p.name)}</b><div class="meta">${r.id}, ${r.method==='fax'?'secure fax to '+esc(p.fax):'secure in-app message'}</div></div>${statusPill(r.status)}</div>${r.status==='failed'?`<p style="color:var(--danger);margin:10px 0 0">${esc(r.failReason)}. You can retry, or update the fax number if it may be wrong.</p>`:''}</div>`;
  h+=`<ol class="flow" style="list-style:none;padding:0;grid-template-columns:repeat(3,minmax(0,1fr))">${FLOW_STEPS.map((t,i)=>{const done=i<st.stage||(st.done&&i===st.stage&&r.status!=='declined');const now=i===st.stage&&!done;return `<li class="fstep ${done||now?'has':''} ${now&&st.tone==='bad'?'bad':''}"><span class="n">${done?'✓':i+1}</span><b>${t}</b><div class="cnt">${r.method==='in-app'&&i===5?'Already in your network':done?'Done':now?esc(st.label):'Not yet'}</div></li>`;}).join('')}</ol>`;
  h+=`<div class="acts" style="margin:6px 0 14px">${reqActions(r)}</div>`;
  if(S.editing===r.id) h+=`<form class="inline-input" data-submit="fax" data-id="${r.id}"><input type="text" name="fax" value="${esc(p.fax)}" aria-label="Fax number" style="max-width:220px"><button class="btn small" type="submit">Save and resend</button></form>`;
  h+=`<div class="box"><h3>Audit trail</h3><ol class="audit">${r.events.map(e=>`<li><time>${clock(e[0])}</time>${esc(e[1])}</li>`).join('')}</ol></div><p class="note">Responses are simulated in this prototype. In a real deployment, the recipient's secure-link or fax-back response would update this automatically.</p>`;
  return h;
}
