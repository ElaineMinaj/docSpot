// views.js
// Overview page (summary, network map, three actions, connection flow) and the action sheet.
'use strict';

const AI_TAG = '<span class="ai">AI recommendation, simulated</span>';
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

/* ---------- 2. Specialty-clustered connection map ---------- */
function graphSVG(){
  const order=Object.keys(SPECIALTY_COLORS), visible=S.phys.filter(p=>(p.rel!=='outside'||S.showOutside)&&!(p.real&&p.rel==='outside'));
  const grouped=order.map(spec=>({spec,people:visible.filter(p=>p.spec===spec).sort((a,b)=>a.name.localeCompare(b.name))})).filter(g=>g.people.length);
  const cx=640,cy=450,boxW=280,boxH=210,positions={};
  const anchors=[[240,130],[640,125],[1040,130],[1050,345],[1050,555],[1040,770],[640,775],[240,770],[230,555],[230,345]];
  grouped.forEach((g,i)=>{[g.x,g.y]=anchors[i%anchors.length];const cols=Math.min(2,g.people.length);g.people.forEach((p,j)=>{const row=Math.floor(j/2),rowCount=Math.min(2,g.people.length-row*2),col=j%2,x=g.x+(rowCount===1?0:col===0?-64:64);positions[p.id]={x,y:g.y-15+row*60};});});
  let s=`<svg viewBox="0 0 1280 900" role="img" aria-label="Connection map with you in the center and physicians in separated specialty groups around you"><rect width="1280" height="900" fill="var(--map-bg)"/>`;
  grouped.forEach(g=>{const dx=g.x-cx,dy=g.y-cy,l=Math.hypot(dx,dy)||1,nx=dx/l,ny=dy/l,edge=Math.min(nx?boxW/2/Math.abs(nx):Infinity,ny?boxH/2/Math.abs(ny):Infinity),entry={x:g.x-nx*edge,y:g.y-ny*edge};g.entry=entry;const dim=S.specFilter&&S.specFilter!==g.spec,opacity=dim?.08:.6;
    s+=`<line x1="${cx}" y1="${cy}" x2="${entry.x}" y2="${entry.y}" stroke="${SPECIALTY_COLORS[g.spec]}" stroke-opacity="${opacity}" stroke-width="2.5"/>`;
  });
  grouped.forEach(g=>{const col=SPECIALTY_COLORS[g.spec],dim=S.specFilter&&S.specFilter!==g.spec,opacity=dim?.24:1;
    s+=`<rect class="specialty-card" x="${g.x-boxW/2}" y="${g.y-boxH/2}" width="${boxW}" height="${boxH}" rx="18" fill="var(--surface)" stroke="${col}" stroke-width="2.5" opacity="${opacity}"/>`;
    s+=`<rect x="${g.x-boxW/2}" y="${g.y-boxH/2}" width="${boxW}" height="48" rx="17" fill="${col}" fill-opacity=".2"/><path d="M ${g.x-boxW/2} ${g.y-boxH/2+48} H ${g.x+boxW/2}" stroke="${col}" stroke-opacity=".6"/>`;
    s+=`<circle cx="${g.x-boxW/2+21}" cy="${g.y-boxH/2+24}" r="7" fill="${col}"/><text x="${g.x-boxW/2+39}" y="${g.y-boxH/2+30}" fill="var(--ink)" font-size="18" font-weight="750" font-family="Public Sans, sans-serif">${esc(g.spec)}</text><text x="${g.x+boxW/2-16}" y="${g.y-boxH/2+29}" text-anchor="end" fill="var(--muted)" font-size="14" font-family="Public Sans, sans-serif">${g.people.length}</text>`;
    g.people.forEach((p,j)=>{const q=positions[p.id],col=SPECIALTY_COLORS[p.spec],selected=S.mapSel===p.id,filled=p.rel==='connected'||p.rel==='joining';
      s+=`<line x1="${g.x}" y1="${g.y-28}" x2="${q.x}" y2="${q.y}" stroke="${col}" stroke-opacity=".5" stroke-width="2.5"/>`;
      s+=`<g class="gnode ${selected?'selected':''}" data-action="select" data-id="${p.id}" tabindex="0" role="button" aria-label="${esc(p.name)}, ${esc(p.spec)}, ${relLabel(p.rel)}">`;
      if(selected)s+=`<circle cx="${q.x}" cy="${q.y}" r="29" fill="none" stroke="var(--ink)" stroke-width="3"/>`;
      s+=`<circle class="core ${p.rel}" cx="${q.x}" cy="${q.y}" r="21" fill="${filled?col:'var(--map-bg)'}" stroke="${col}" stroke-width="3.5" ${p.rel==='pending'||p.rel==='outside'?'stroke-dasharray="6 4"':''}/>`;
      if(p.rel==='joining')s+=`<circle cx="${q.x}" cy="${q.y}" r="26" fill="none" stroke="${col}" stroke-width="2.5" stroke-dasharray="3 3"/>`;
      if(sharedPatients(p.id).length)s+=`<circle cx="${q.x+17}" cy="${q.y-17}" r="10" fill="var(--raised)" stroke="${col}" stroke-width="1.5"/><text x="${q.x+17}" y="${q.y-13}" text-anchor="middle" font-size="11" font-weight="800" fill="var(--ink)" font-family="Public Sans, sans-serif">${sharedPatients(p.id).length}</text>`;
      s+=`<text x="${q.x}" y="${q.y+37}" text-anchor="middle" font-size="15" font-weight="${selected?800:650}" fill="var(--ink)" font-family="Public Sans, sans-serif">${esc(shortName(p))}</text><title>${esc(p.name)} · ${esc(relLabel(p.rel))}</title></g>`;
    });
  });
  s+=`<circle cx="${cx}" cy="${cy}" r="52" fill="var(--accent)" opacity=".12"/><circle cx="${cx}" cy="${cy}" r="36" fill="var(--accent)" stroke="var(--map-bg)" stroke-width="5"/><text x="${cx}" y="${cy+6}" text-anchor="middle" font-size="16" font-weight="800" fill="var(--accent-ink)" font-family="Public Sans, sans-serif">You</text></svg>`;
  return s;
}
function viewNetwork(){
  const realCount=S.phys.filter(p=>p.real).length;
  let h=`<section class="section" aria-labelledby="h-net"><div class="section-head"><h2 id="h-net">Network map</h2><div class="nettools"><div class="seg small" role="group" aria-label="Map or list"><button data-action="mapview" data-v="map" aria-pressed="${S.mapView==='map'}">Map</button><button data-action="mapview" data-v="list" aria-pressed="${S.mapView==='list'}">List</button></div><label class="meta" style="display:flex;gap:6px;align-items:center"><input type="checkbox" data-bind="outside" ${S.showOutside?'checked':''}> Show recommended physicians outside your network</label></div></div>${realCount?`<p class="note" style="margin:-4px 0 12px">${realCount} real Atlanta-area clinicians from the NPI Registry are available for recommendations. They appear in the list view and in each action's results.</p>`:''}<div class="netwrap"><div>`;
  if(S.mapView==='map'){
    h+=`<div class="netmap specialty-map">${graphSVG()}</div><div class="netlegend" aria-label="Connection status key"><span><i class="lg-node connected"></i>Connected</span><span><i class="lg-node joining"></i>Joining</span><span><i class="lg-node pending"></i>Pending</span></div>`;
  } else {
    const rows=S.phys.filter(p=>p.rel!=='outside'||(S.showOutside&&!p.accessOnly));
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
  h+=`<h4>Relationship to you</h4><p style="margin:0;font-size:14px">${esc(p.link||'No prior contact')}</p><p class="meta" style="margin:4px 0 0">${p.real?`${esc(p.address)}${p.phone?`, phone ${esc(p.phone)}`:''}`:`${p.dist} miles away${p.hospital?`, ${esc(p.hospital)}`:''}`}</p>${p.real?`<p class="meta" style="margin:4px 0 0">Source: NPI Registry (${esc(p.taxonomy)})</p>`:''}`;
  h+=`<h4>Shared patients</h4><p style="margin:0;font-size:14px">${sh?`${sh} shared ${sh===1?'patient':'patients'}`:'None'}</p>`;
  h+=`<h4>Relevant drug experience</h4>${drugs.length?`<div class="chips">${drugs.map(d=>`<span class="chip drug">${esc(d)}, ${p.drugs[d]}</span>`).join('')}</div>`:'<p class="meta" style="margin:0">None listed</p>'}`;
  h+='<div class="btnrow">';
  if(p.rel==='connected'||p.rel==='joining'){
    h+=`<button class="btn small" data-action="start" data-type="referral" data-to="${p.id}">Refer a patient</button>`;
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
  <button class="action" data-action="start" data-type="referral" data-mode="access">${icon('<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3"/>')}<h3>Telehealth &amp; clinical trials</h3><p>For patients far from specialty care. Find specialists who offer telehealth, or run clinical trials that support travel.</p><span class="go">Choose a patient</span></button>
  <button class="action" data-action="start" data-type="question">${icon('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/><path d="M12 8.5a1.8 1.8 0 0 1 1.8 1.8c0 1.2-1.8 1.6-1.8 2.9M12 16h.01"/>')}<h3>Ask a clinical question</h3><p>Type your question. An AI assistant suggests who is best placed to answer it and helps you route it.</p><span class="go">Write a question</span></button>
  </div></section>`;
}

/* ---------- 4. Connection and referral flow ---------- */
function reqActions(r){
  if(r.status==='failed') return `<button class="btn small" data-action="retry" data-id="${r.id}">Retry send</button><button class="btn ghost small" data-action="editfax" data-id="${r.id}">Update fax number</button>`;
  if(r.status==='delivered'&&r.method==='fax') return `<button class="btn ghost small" data-action="recipient" data-id="${r.id}">Open recipient's view</button>`;
  if(r.status==='joining') return `<button class="btn ghost small" data-action="finish" data-id="${r.id}">Complete verification</button>`;
  if(r.status==='sending') return '<span class="meta">Sending…</span>';
  return '';
}
// Grouped by what Dr. Lee needs to do. The six steps and the audit trail live in each row's Details.
const REQ_GROUPS = [
  ['attention','Needs your attention',['failed','callback']],
  ['waiting','Waiting on others',['draft','sending','delivered','joining']],
  ['done','Completed',['responded','accepted','declined','added']]
];
function reqNote(r,p){
  const via=r.method==='fax'?'fax':r.method==='impiricus'?'through Impiricus':'in-app message';
  if(r.status==='failed') return `<span style="color:var(--danger)">${esc(r.failReason)}</span>`;
  if(r.status==='callback') return `Call ${esc(p.phone||'their office')} to discuss`;
  if(r.status==='joining') return 'Verifying their NPI to add them to your network';
  if(r.status==='delivered') return `Sent by ${via} ${ago(r.created)}. Waiting for ${esc(r.to?shortName(p):'a reply')}`;
  return `Sent by ${via} ${ago(r.created)}`;
}
function reqSteps(r){
  const st=STATUS[r.status];
  return `<ol class="req-steps" aria-label="Progress">${FLOW_STEPS.map((t,i)=>{
    const done=i<st.stage||(st.done&&i===st.stage&&r.status!=='declined'), now=i===st.stage&&!done, skip=r.wasConnected&&i===5;
    return `<li class="${skip?'':done?'done':now?(st.tone==='bad'?'fail':'now'):''}"><i>${done&&!skip?'✓':i+1}</i>${esc(t)}${skip?' (already connected)':''}</li>`;}).join('')}</ol>`;
}
function viewRequests(){
  let h=`<section class="section" aria-labelledby="h-flow"><div class="section-head"><h2 id="h-flow">Your requests</h2><p>Reviewed by you, sent by secure fax or message, and tracked until the physician responds. Fax delivery is simulated in this prototype.</p></div>`;
  REQ_GROUPS.forEach(([key,title,statuses])=>{
    const list=S.requests.filter(r=>statuses.includes(r.status)); if(!list.length) return;
    h+=`<div class="req-group ${key}"><h3>${title} <span class="meta">${list.length}</span></h3>`;
    list.forEach(r=>{
      const p=r.to?doc(r.to):{name:r.toLabel,spec:r.toSub,fax:''}, pt=r.patient?pat(r.patient):null, open=S.expanded===r.id;
      h+=`<div class="req ${open?'open':''}" id="row-${r.id}">
        ${r.to?avatar(p):'<div class="avatar">MT</div>'}
        <div class="req-main"><b>${esc(p.name)}</b> <span class="meta">${esc(p.spec)}</span><div class="req-what">${TYPE_LABEL[r.type]}${pt?` for <b>${pt.initials}</b>`:''}: ${esc(r.topic.length>70?r.topic.slice(0,67)+'…':r.topic)}</div></div>
        <div class="req-status">${statusPill(r.status)}<div class="meta">${reqNote(r,p)}</div></div>
        <div class="acts req-acts">${reqActions(r)}<button class="btn link" data-action="audit" data-id="${r.id}" aria-expanded="${open}">${open?'Hide details':'Details'}</button></div>
      </div>`;
      if(open) h+=`<div class="req-detail">${reqSteps(r)}${S.editing===r.id?`<form class="inline-input" data-submit="fax" data-id="${r.id}"><input type="text" name="fax" value="${esc(p.fax)}" aria-label="Fax number for ${esc(p.name)}" style="max-width:220px"><button class="btn small" type="submit">Save and resend</button></form><p class="note" style="margin-top:4px">Resending uses the contents you already approved.</p>`:''}<b style="font-size:13.5px;display:block;margin-top:12px">Audit trail <span class="meta">${r.id}</span></b><ol class="audit">${r.events.map(e=>`<li><time>${clock(e[0])}</time>${esc(e[1])}</li>`).join('')}</ol></div>`;
    });
    h+='</div>';
  });
  return h+'</section>';
}

/* ---------- Recipient's side (simulated): what the receiving physician experiences ---------- */
const RV_STEPS = ['Fax arrives','Scan QR code','Respond','Join (optional)','Your account'];
function recipientFlow(){
  const v=S.rv, r=S.requests.find(x=>x.id===v.id); if(!r) return '';
  const p=doc(r.to), body=[rvInbox,rvLink,rvRespond,rvJoin,rvAccount][v.step](r,p,v);
  return `<div class="rv-screen" role="dialog" aria-modal="true" aria-labelledby="rv-title"><div class="rv-inner">
  <div class="rv-top"><div><p class="meta" style="margin:0">The recipient's side: what ${esc(p.name)} experiences (simulated)</p>
  <div class="stepper">${RV_STEPS.map((n,i)=>`<span class="${i===v.step?'cur':i<v.step?'done':''}"><i>${i<v.step?'✓':i+1}</i>${n}</span>`).join('')}</div></div>
  <button class="btn ghost small" data-action="close-modal">Back to Dr. Lee's view</button></div>${body}</div></div>`;
}
function rvInbox(r,p,v){
  const code=r.code||'A7K-'+r.id.replace(/\D/g,'');
  const junk=[['8:02 AM','Reference laboratory','Lab results, 3 patients','Filed to patient charts',''],
    ['8:40 AM','Health plan','Prior authorization decision','Sent to billing',''],
    ['9:15 AM','Drug marketing service','Promotional: dinner program invitation','Discarded: marketing','junk'],
    ['9:31 AM','Medical supply vendor','Special offer on exam supplies','Discarded: marketing','junk']];
  // Real NPI records often list an address (even a PO box) as the practice name, so name the inbox after the physician.
  return `<h2 id="rv-title" tabindex="-1">Fax inbox at ${esc(p.real?shortName(p)+'’s practice':p.practice)}</h2>
  <p class="meta" style="margin:0 0 14px">${p.real?esc(p.address)+'. ':''}Faxes arrive here as PDFs. Front-desk staff sort them before anything reaches ${esc(shortName(p))}.</p>
  <div class="rv-cols"><div class="tablewrap"><table class="list"><caption class="sr-only">Today's faxes</caption><thead><tr><th scope="col">Received</th><th scope="col">From</th><th scope="col">Subject</th><th scope="col">Staff action</th></tr></thead><tbody>
  ${junk.map(j=>`<tr class="${j[4]}"><td class="meta">${j[0]}</td><td>${j[1]}</td><td>${j[2]}</td><td class="meta">${j[3]}</td></tr>`).join('')}
  <tr class="rv-hit"><td class="meta">Just now</td><td><b>${esc(ME.name)}</b><div class="meta">${esc(ME.spec)}, ${esc(ME.practice)}</div></td><td><b>${esc(TYPE_LABEL[r.type])}</b>${r.type==='referral'?': new patient':''}<div class="meta">${esc(r.topic.length>70?r.topic.slice(0,67)+'…':r.topic)}</div></td><td>${v.routed?`<span class="status good">Routed to ${esc(shortName(p))}</span>`:`<button class="btn small" data-action="rv-route">Route to ${esc(shortName(p))}</button>`}</td></tr>
  </tbody></table></div>
  <div>${faxPreview({type:r.type,text:recipientFaxText(r)},p,code)}</div></div>
  <p class="note">Marketing faxes get discarded. A colleague's request about a real patient gets routed to the physician.</p>
  <div class="rv-foot"><span></span><button class="btn" data-action="rv-next" ${v.routed?'':'disabled'}>${esc(shortName(p))} scans the QR code</button></div>`;
}
function rvLink(r,p,v){
  const code=r.code||'A7K-'+r.id.replace(/\D/g,'');
  return `<div class="rv-browser"><span class="dotrow"><i></i><i></i><i></i></span><span class="url">https://impiricus.example/cc/${esc(code)}</span></div>
  <div class="box"><h2 id="rv-title" tabindex="-1" style="margin:0 0 4px;font-size:20px">Secure response</h2><p class="meta" style="margin:0 0 12px">Opened by scanning the QR code on the fax. No account or app needed. Confirm who you are.</p>
  <label class="f" style="max-width:260px">One-time code<input type="text" value="${esc(code)}" readonly aria-describedby="code-note"></label><p id="code-note" class="meta" style="margin:6px 0 14px">Filled in automatically from the QR code.</p>
  <h3>Confirm this is you</h3>
  <div class="kvrow"><span>Name</span><span>${esc(p.name)}</span></div><div class="kvrow"><span>Specialty</span><span>${esc(p.taxonomy||p.spec)}</span></div><div class="kvrow"><span>NPI</span><span>${esc(p.npi||'On file')}</span></div><div class="kvrow"><span>Practice</span><span>${esc(p.real?p.address:p.practice)}</span></div>${p.real?'<div class="kvrow"><span>Source</span><span><span class="tag">NPI Registry</span> real record</span></div>':''}
  <label class="approve" style="margin-top:12px"><input type="checkbox" data-rv="verified" ${v.verified?'checked':''}><span>This is me. I'm the physician named on this fax.</span></label></div>
  <div class="rv-foot"><button class="btn ghost" data-action="rv-back">Back</button><button class="btn" data-action="rv-verify" ${v.verified?'':'disabled'}>Continue</button></div>`;
}
function rvRespond(r,p,v){
  const t=r.type, pt=r.patient?pat(r.patient):null;
  const shared=recipientFields(r).filter(x=>!/Name and date of birth/.test(x));
  const opts=t==='connect'?[['accept','Accept the invitation'],['decline','Not now']]
    :[['accept',t==='referral'?'Accept the referral':t==='collab'?'Accept the discussion':'Answer the question'],['call','Ask for a phone call instead'],['decline','Decline']];
  return `<div class="box"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>Impiricus Colleague Connect</b><span class="tag">Code verified</span></div>
  <h2 id="rv-title" tabindex="-1" style="margin:10px 0 4px;font-size:20px">${esc(ME.name)} sent you a ${esc(TYPE_LABEL[t].toLowerCase())}</h2><p class="meta" style="margin:0">${esc(ME.spec)}, ${esc(ME.practice)}, ${esc(ME.city)}</p>
  <p style="margin:12px 0 4px"><b>${t==='question'?'Question':t==='connect'?'Message':'Topic'}:</b> ${esc(r.topic)}</p>
  ${pt?`<p class="meta" style="margin:4px 0 0">Shared so far: ${esc(shared.join(', ')||'topic only')}.</p><p class="privacy">Patient name and date of birth are released only if you accept.</p>`:''}</div>
  <fieldset style="border:0;padding:0;margin:0"><legend style="font-weight:700;margin-bottom:6px">Your response</legend>
  ${opts.map(o=>`<label class="check"><input type="radio" name="rv-choice" data-rv="choice" value="${o[0]}" ${v.choice===o[0]?'checked':''}><span>${o[1]}</span></label>`).join('')}</fieldset>
  ${t==='question'?`<label class="f" style="margin-top:10px">Your reply to ${esc(ME.short)}<textarea data-rv="reply">${esc(v.reply)}</textarea></label>`:''}
  <p class="note">Joining Impiricus is a separate choice on the next screen. Your response is sent either way.</p>
  <div class="rv-foot"><button class="btn ghost" data-action="rv-back">Back</button><button class="btn" data-action="rv-respond">Send response</button></div>`;
}
function rvJoin(r,p,v){
  if(v.choice!=='accept') return `<div class="box"><h2 id="rv-title" tabindex="-1" style="margin:0 0 6px;font-size:20px">Response sent</h2><p style="margin:0">${esc(ME.short)} will see that you ${v.choice==='call'?'asked for a phone call':'declined'}. Nothing else is shared, and you haven't been signed up for anything.</p></div><div class="rv-foot"><span></span><button class="btn" data-action="close-modal">Back to Dr. Lee's view</button></div>`;
  const pt=r.patient?pat(r.patient):null, member=r.wasConnected;
  let h=`<div class="box ok-box"><h2 id="rv-title" tabindex="-1" style="margin:0 0 6px;font-size:20px">${r.type==='question'?'Answer sent':'Accepted'}. ${esc(ME.short)} has been notified.</h2>
  ${pt?`<div class="reveal"><span class="tag">Released after you accepted</span><div class="kvrow"><span>Patient</span><span><b>${esc(pt.name)}</b></span></div><div class="kvrow"><span>Date of birth</span><span>${esc(pt.dob)}</span></div><div class="kvrow"><span>Already shared</span><span>${esc(recipientFields(r).filter(x=>!/Name and date of birth/.test(x)).join(', '))}</span></div></div>`:''}</div>`;
  if(member) return h+`<div class="box"><p style="margin:0">You're already on Impiricus and connected with ${esc(ME.short)}, so there's nothing else to do.</p></div><div class="rv-foot"><span></span><button class="btn" data-action="close-modal">Back to Dr. Lee's view</button></div>`;
  h+=`<div class="box"><h3 style="font-size:16px">One more, separate choice: join Impiricus?</h3><p class="meta" style="margin:0 0 10px">Free and limited to verified physicians. Colleagues like ${esc(ME.short)} can reach you securely, and you keep receiving faxes if you prefer. Your response above is already sent either way.</p>`;
  if(!v.joinYes) return h+`<div class="btnrow" style="margin-top:0"><button class="btn" data-action="rv-joinyes">Join Impiricus (free)</button><button class="btn ghost" data-action="rv-joinno">Not now</button></div></div>`;
  const box=(grp,k,label,sub)=>`<label class="check"><input type="checkbox" data-rv="${grp}" value="${k}" ${v[grp][k]?'checked':''}><span>${label}${sub?`<small>${sub}</small>`:''}</span></label>`;
  return h+`<h3>How colleagues can reach you</h3>${box('prefs','fax','Fax','What you use today. Stays on unless you turn it off.')}${box('prefs','inapp','Secure in-app messages','')}${box('prefs','email','Email','')}
  <p class="privacy">Colleague Connect never uses text messages (SMS).</p>
  <h3 style="margin-top:14px">Optional Impiricus services</h3><p class="meta" style="margin:0 0 4px">Nothing is turned on unless you choose it. Change these anytime.</p>
  ${box('services','samples','Samples and bridge supply for your patients','Through Impiricus partners')}${box('services','msl','Manufacturer medical team for drug questions','Official, on-label answers')}${box('services','support','Patient support programs','Copay help and prior authorization support')}
  <div class="btnrow"><button class="btn" data-action="rv-join">Verify my NPI and join</button><button class="btn ghost" data-action="rv-joinno">Not now</button></div></div>`;
}
function rvAccount(r,p,v){
  if(v.skipped) return `<div class="box"><h2 id="rv-title" tabindex="-1" style="margin:0 0 6px;font-size:20px">All set</h2><p style="margin:0">Your response went to ${esc(ME.short)}. You didn't join Impiricus, and nothing else changes: future requests will still reach you by fax, and you can join from any of them.</p></div><div class="rv-foot"><span></span><button class="btn" data-action="close-modal">Back to Dr. Lee's view</button></div>`;
  if(r.status==='joining') return `<div class="box"><h2 id="rv-title" tabindex="-1" style="margin:0 0 6px;font-size:20px">Verifying your NPI…</h2><p class="meta" style="margin:0">Checking ${esc(p.npi||'your NPI')} against the NPI Registry.</p></div>`;
  const pt=r.patient?pat(r.patient):null, on=o=>Object.keys(o).filter(k=>o[k]);
  const consult=r.events.some(e=>/consult note/.test(e[1]));
  return `<div class="rv-home-head"><div style="display:flex;gap:12px;align-items:center">${avatar(p)}<div><h2 id="rv-title" tabindex="-1" style="margin:0;font-size:22px">Welcome to Impiricus, ${esc(p.name)}</h2><div class="meta">${esc(p.spec)}, ${esc(p.real?p.address:p.practice)}</div></div></div><span class="verified">NPI verified</span></div>
  <div class="rv-cols"><div>
  <div class="box"><h3>Your network</h3><div class="person" style="padding:8px 0;border:0"><div class="avatar g">AL</div><div class="body"><b>${esc(ME.name)}</b><div class="meta">${esc(ME.spec)}, ${esc(ME.practice)}. Connected through this ${esc(TYPE_LABEL[r.type].toLowerCase())}</div></div></div></div>
  <div class="box"><h3>Your requests</h3><div class="kvrow"><span>${esc(TYPE_LABEL[r.type])} from ${esc(ME.short)}</span><span class="status good">${r.type==='question'?'Answered':'Accepted'}</span></div>${pt?`<p style="margin:8px 0 4px"><b>${esc(pt.name)}</b>, ${pt.age}${pt.sex}. ${esc(r.topic)}</p>`:`<p style="margin:8px 0 4px">${esc(r.topic)}</p>`}
  ${r.type==='referral'?(consult?'<p class="meta" style="margin:8px 0 0">Consult note sent back to Dr. Lee. The loop is closed.</p>':`<button class="btn small" data-action="rv-consult" style="margin-top:8px">Send consult note back</button>`):''}</div>
  </div><div>
  <div class="box"><h3>How colleagues reach you</h3><p style="margin:0">${on(v.prefs).map(k=>CONTACT_LABEL[k][0].toUpperCase()+CONTACT_LABEL[k].slice(1)).join(', ')||'No channels selected'}</p><p class="meta" style="margin:4px 0 0">Never by text message.</p></div>
  <div class="box"><h3>Impiricus services</h3><p style="margin:0">${on(v.services).map(k=>SERVICE_LABEL[k][0].toUpperCase()+SERVICE_LABEL[k].slice(1)).join(', ')||'None turned on. You can add them anytime.'}</p></div>
  </div></div>
  <div class="rv-foot"><span></span><button class="btn" data-action="close-modal">Back to Dr. Lee's view</button></div>`;
}

/* ---------- Action sheet ---------- */
const STEP_NAMES = {
  referral: (to,f) => f&&f.access?['Patient','Options','Review and approve','Track']:to?['Patient','Review and approve','Track']:['Patient','Specialist','Review and approve','Track'],
  collab:   to => to?['Patient','Review and approve','Track']:['Patient or drug','Physician','Review and approve','Track'],
  question: to => to?['Question','Review and approve','Track']:['Question','Who to ask','Review and approve','Track'],
  connect:  () => ['Review and approve','Track']
};
const SHEET_TITLE = {referral:'Find a specialist', collab:'Collaborate on care', question:'Ask a clinical question', connect:'Send a connection request'};

function viewSheet(){
  const f=S.flow; if(!f) return '';
  const names=STEP_NAMES[f.type](f.fixedTo,f), cur=names[f.step];
  let body='';
  if(cur==='Patient'||cur==='Patient or drug') body=stepPatient(f);
  else if(cur==='Specialist'||cur==='Physician'||cur==='Who to ask') body=stepRecommend(f);
  else if(cur==='Options') body=stepAccess(f);
  else if(cur==='Question') body=stepQuestion(f);
  else if(cur==='Review and approve') body=stepReview(f);
  else body=stepTrack(f);
  const onReview=cur==='Review and approve';
  return `<div class="sheet-bg" data-action="close-sheet"></div><aside class="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="sheet-head"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><h2 id="sheet-title">${f.access?'Telehealth &amp; clinical trials':SHEET_TITLE[f.type]}</h2><button class="btn ghost small" data-action="close-sheet">Close</button></div><div class="stepper">${names.map((n,i)=>`<span class="${i===f.step?'cur':i<f.step?'done':''}"><i>${i<f.step?'✓':i+1}</i>${n}</span>`).join('')}</div></div>
  <div class="sheet-body">${body}</div>
  <div class="sheet-foot"><div>${f.step>0&&cur!=='Track'?'<button class="btn ghost" data-action="back">Back</button>':''}</div><div style="display:flex;gap:8px">${onReview?`<button class="btn" data-action="send" ${f.approved?'':'disabled'}>Send secure fax</button>`:''}${cur==='Track'?'<button class="btn" data-action="close-sheet">Done</button>':''}</div></div></aside>`;
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
    const loc=f.access?accessLocation(pt.id):null;
    const tag=loc?`<span class="tag ${loc.rural?'need':''}">${esc(loc.home_city)}, ${esc(loc.state)}${loc.rural?', rural':''}</span><span class="tag">${loc.miles_to_nearest_in_person_specialist} mi to nearest accepting ${esc(pt.needs.toLowerCase())}</span>`:f.type==='referral'?`<span class="tag ${pt.flag==='Needs specialist care'?'need':''}">${esc(pt.flag)}</span>`:`<span class="tag">${team.length?`${team.length} other ${team.length===1?'physician':'physicians'} involved`:'No shared care team'}</span>`;
    h+=`<button class="opt" data-action="pick-patient" data-id="${pt.id}"><div class="avatar c">${pt.initials.replace(/\./g,'')}</div><div class="grow"><b>${pt.initials}, ${pt.age}${pt.sex}</b> <span class="meta">MRN ${pt.mrn}</span><div class="meta">${esc(pt.summary)}</div><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">${tag}${f.type==='referral'&&!loc?specChip(pt.needs):''}</div></div></button>`;
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
  const opt=(x)=>`<button class="opt" data-action="pick-doc" data-id="${x.p.id}">${avatar(x.p)}<div class="grow"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(x.p.name)}</b>${specChip(x.p.spec)}</div><div class="meta">${esc(x.p.real?x.p.address:x.p.practice)}${x.p.real?' <span class="tag">NPI Registry</span>':''}</div><ul class="reasons">${x.reasons.map(r=>`<li class="${r.k}">${esc(r.t)}</li>`).join('')}</ul></div></button>`;
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
function stepAccess(f){
  const pt=pat(f.patient), loc=accessLocation(pt.id), flt=f.accessFilter, list=accessOptions(pt,flt);
  const pill=(k,label)=>`<button class="pill" data-action="access-filter" data-k="${k}" aria-pressed="${!!flt[k]}">${label}</button>`;
  let h=`<div class="box" style="margin-bottom:14px"><b>${pt.initials}, ${pt.age}${pt.sex}</b><div class="meta">${esc(loc?loc.general_condition:pt.summary)}. Needs ${esc(pt.needs.toLowerCase())}.</div>${loc?`<div class="meta" style="margin-top:4px">Lives in ${esc(loc.home_city)}, ${esc(loc.state)}${loc.rural?' (rural)':''}. Nearest in-person ${esc(pt.needs.toLowerCase())} accepting new patients: about ${loc.miles_to_nearest_in_person_specialist} miles.</div>`:''}</div>`;
  h+=`<div class="pillbar" role="group" aria-label="Filter options">${pill('telehealth','Telehealth for new patients')}${pill('trials','Clinical trials')}${pill('travel','Travel support')}</div>`;
  h+=`<p class="disclaimer">Sample data for the demo. Ranked by telehealth availability, whether they're accepting patients, distance, and wait time. Trial sponsorship and travel support are filters only and never affect ranking.</p>`;
  if(!list.length) return h+'<p class="meta">No specialists in the sample data match these filters. Try turning one off.</p>';
  list.forEach(x=>{
    const p=x.p;
    h+=`<div class="box access-card"><div style="display:flex;gap:12px;align-items:flex-start">${avatar(p)}<div class="grow" style="flex:1;min-width:0"><div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><b>${esc(p.name)}</b>${specChip(p.spec)}${x.teleNew?'<span class="chip on">Telehealth</span>':''}</div><div class="meta">${esc(p.practice)}, ${esc(p.city)}</div><ul class="reasons">${x.reasons.map(r=>`<li class="${r.k}">${esc(r.t)}</li>`).join('')}</ul></div></div>`;
    x.trials.forEach(t=>{ h+=`<div class="trial"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${esc(t.title)}</b><span class="tag">${esc(t.id)}</span></div><div class="meta">${esc(t.phase)}, ${esc(t.status.toLowerCase())}. ${esc(t.sponsor.type)} sponsor. ${t.remote_visits_allowed?'Some visits can be remote.':'In-person visits.'}</div><div class="meta">Who it's for: ${esc(t.eligibility_summary)}.</div>${t.travel_support.offered?`<div class="travel">Travel support: ${esc(t.travel_support.covers.join(', '))}. ${esc(t.travel_support.note)}.</div>`:`<div class="meta">${esc(t.travel_support.note)}.</div>`}<button class="btn ghost small" data-action="pick-access" data-id="${p.id}" data-mode="trial" data-trial="${esc(t.id)}" style="margin-top:8px">Refer for trial eligibility</button></div>`; });
    h+=`<div class="btnrow" style="margin-top:10px">${x.teleNew?`<button class="btn small" data-action="pick-access" data-id="${p.id}" data-mode="telehealth">Request telehealth visit</button>`:''}${!x.teleNew&&!x.trials.length?`<button class="btn ghost small" data-action="pick-access" data-id="${p.id}" data-mode="inperson">Request in-person referral</button>`:''}</div></div>`;
  });
  return h;
}
function mslCard(drug,question){
  if(!drug) return '';
  return `<div class="box" style="margin-top:16px;border-color:rgba(134,168,255,.35)"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;flex-wrap:wrap"><b>Also want the manufacturer's official answer?</b><span class="tag">Existing Impiricus service</span></div><p class="meta" style="margin:6px 0 10px">Send this to the ${esc(drug)} manufacturer's medical team through Impiricus for official, on-label information. Only your question is shared, never patient identifiers.</p><button class="btn ghost small" data-action="msl" data-d="${esc(drug)}" data-q="${esc(question||'')}">Send to the ${esc(drug)} medical team</button></div>`;
}
// QR code for the fax. It encodes the recipient's secure response page (a placeholder address in this prototype).
function qrSvg(text){
  if(typeof qrcode==='undefined') return '';
  const q=qrcode(0,'M'); q.addData(text); q.make();
  return `<span class="qr" role="img" aria-label="QR code to open the secure response page">${q.createSvgTag({cellSize:3,margin:2})}</span>`;
}
function faxPreview(f,p,code){
  const date=new Date().toLocaleDateString([], {month:'short',day:'numeric',year:'numeric'});
  return `<div class="fax"><div class="stamp">Simulated</div><div class="fax-head"><span>SECURE FAX: ${TYPE_LABEL[f.type].toUpperCase()}</span><span>Page 1 of ${f.type==='connect'?1:2}</span></div><table><tr><td>To:</td><td>${esc(p.name)}, ${esc(p.practice)}<br>Fax ${esc(p.fax)}</td></tr><tr><td>From:</td><td>${esc(ME.name)}, ${esc(ME.practice)}</td></tr><tr><td>Date:</td><td>${date}</td></tr></table><pre>${esc(f.text)}</pre><div class="respond"><b>To respond (no account needed):</b><div class="qr-row">${qrSvg('https://impiricus.example/cc/'+code)}<div>1. Scan this QR code with your phone to open your secure response page. It works from your screen too.<br>Code: ${code}</div></div>2. Or tick and fax this page back to ${RETURN_FAX}:<br>${f.type==='connect'?`[ ] Accept the invitation<br>[ ] Not now`:`[ ] ${f.type==='referral'?'Accept the referral':f.type==='collab'?'Accept the discussion':'I\u2019ll answer (scan the QR code to reply)'}<br>[ ] Please call me instead: ______________<br>[ ] Decline`}</div><p class="fine" style="margin-top:10px">Sent securely through Impiricus Colleague Connect. Confidential. Intended only for the named recipient. If received in error, notify the sender and destroy this document.</p></div>`;
}
function stepReview(f){
  const p=doc(f.to), pt=f.patient?pat(f.patient):null;
  let h=`<div class="review"><div><div class="box"><h3>Recipient</h3><div class="kvrow"><span>Physician</span><span>${esc(p.name)}</span></div><div class="kvrow"><span>Specialty</span><span>${esc(p.spec)}</span></div><div class="kvrow"><span>Practice</span><span>${esc(p.practice)}</span></div><div class="kvrow"><span>NPI</span><span>${p.npi||'In NPI Registry (number not in export)'}</span></div>${p.real?'<div class="kvrow"><span>Data source</span><span>NPI Registry, real practice</span></div>':''}<div class="kvrow"><span>Delivery</span><span>Secure fax to ${esc(p.fax)}</span></div><div class="kvrow"><span>Relationship</span><span>${relLabel(p.rel)}</span></div>${f.accessMode?`<div class="kvrow"><span>Requesting</span><span>${f.accessMode==='trial'?'Clinical trial eligibility ('+esc(f.accessTrial)+')':f.accessMode==='telehealth'?'Telehealth visit':'In-person referral'}</span></div><div class="kvrow"><span>Data source</span><span>Sample data (fictional)</span></div>`:''}${f.fixedTo||f.type==='connect'?'':'<button class="btn link" data-action="back" style="margin-top:8px">Choose a different physician</button>'}</div>`;
  if(f.type==='referral'||f.type==='collab') h+=`<div class="box"><h3>${f.type==='referral'?'Reason for referral':'Discussion topic'}</h3><input type="text" data-bind="topic" value="${esc(f.topic)}" aria-label="${f.type==='referral'?'Reason for referral':'Discussion topic'}"></div>`;
  h+=`<div class="box"><h3>Information to share</h3>${pt?`<p class="meta" style="margin:0 0 6px">Patient ${pt.initials}, ${pt.age}${pt.sex}. Only what's checked is included.</p>`:''}${f.fields.map(x=>`<label class="check ${x.locked?'locked':''}"><input type="checkbox" data-field="${x.id}" ${x.on?'checked':''} ${x.locked?'disabled':''}><span>${esc(x.label)}${x.note?`<small>${esc(x.note)}</small>`:''}</span></label>`).join('')}</div></div>`;
  h+=`<div><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><b>Fax draft</b><span class="ai">${f.drafting?'AI draft: writing…':esc(DRAFT_LABEL[f.draftSource]||DRAFT_LABEL.template)}</span></div><textarea data-bind="text" style="min-height:230px" aria-label="Draft text" aria-busy="${!!f.drafting}" ${f.drafting?'disabled placeholder="The AI is drafting from the information you checked…"':''}>${f.drafting?'':esc(f.text)}</textarea><div style="display:flex;gap:10px;margin:8px 0 14px;flex-wrap:wrap"><button class="btn ghost small" data-action="regen" ${f.drafting?'disabled':''}>Regenerate from checked information</button><button class="btn ghost small" data-action="preview" aria-expanded="${!!f.showPreview}" ${f.drafting?'disabled':''}>${f.showPreview?'Hide':'Show'} fax preview</button></div>${f.showPreview&&!f.drafting?faxPreview(f,p,'A7K-'+(S.seq+1)):''}${privacyBox(f)}
  <label class="approve" style="margin-top:14px"><input type="checkbox" data-bind="approve" ${f.approved?'checked':''} ${privacyClear(f)?'':'disabled'}><span>I reviewed the recipient and the information being shared, and I approve sending it by fax.</span></label></div></div>`;
  return h;
}
function privacyBox(f){
  const pv=f.privacy||{status:'checking'};
  const head=mode=>`<div class="pcheck-head"><b>Privacy check</b><span class="ai">${esc(PRIVACY_LABEL[mode]||'AI privacy check')}</span></div>`;
  if(pv.status==='checking') return `<div id="privacy-box" class="pcheck" aria-live="polite">${head({ai:'ai',patterns:'patterns',off:'offline'}[AI.status])}<p class="meta" style="margin:0">Checking the draft for patient identifiers and details you didn't check for sharing…</p></div>`;
  if(!pv.flags.length) return `<div id="privacy-box" class="pcheck ok" aria-live="polite">${head(pv.mode)}<p style="margin:0">No patient identifiers or unapproved details found.</p></div>`;
  return `<div id="privacy-box" class="pcheck ${pv.override?'':'warn'}" aria-live="polite">${head(pv.mode)}<p style="margin:0 0 6px">${pv.flags.length} ${pv.flags.length===1?'item':'items'} in the draft may not belong in it:</p><ul class="pflags">${pv.flags.map(x=>`<li><mark>${esc(x.text)}</mark><span>${esc(x.reason)}</span></li>`).join('')}</ul>${pv.override?'<p class="meta" style="margin:8px 0 0">You chose to keep these. This is recorded in the audit trail.</p>':'<p class="meta" style="margin:8px 0">Edit the draft to remove them (the check reruns as you type), or keep them if they’re intended.</p><button class="btn ghost small" data-action="privacy-ok">This is fine, keep it</button>'}</div>`;
}
function stepTrack(f){
  const r=S.requests.find(x=>x.id===f.reqId); if(!r) return '';
  const p=r.to?doc(r.to):{name:r.toLabel,fax:''}, st=STATUS[r.status];
  let h=`<div class="box"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:center"><div><b>${TYPE_LABEL[r.type]} to ${esc(p.name)}</b><div class="meta">${r.id}, ${r.method==='fax'?'secure fax to '+esc(p.fax):'secure in-app message'}</div></div>${statusPill(r.status)}</div>${r.status==='failed'?`<p style="color:var(--danger);margin:10px 0 0">${esc(r.failReason)}. You can retry, or update the fax number if it may be wrong.</p>`:''}</div>`;
  h+=`<ol class="flow" style="list-style:none;padding:0;grid-template-columns:repeat(3,minmax(0,1fr))">${FLOW_STEPS.map((t,i)=>{const done=i<st.stage||(st.done&&i===st.stage&&r.status!=='declined');const now=i===st.stage&&!done;return `<li class="fstep ${done||now?'has':''} ${now&&st.tone==='bad'?'bad':''}"><span class="n">${done?'✓':i+1}</span><b>${t}</b><div class="cnt">${r.wasConnected&&i===5?'Already in your network':done?'Done':now?esc(st.label):'Not yet'}</div></li>`;}).join('')}</ol>`;
  h+=`<div class="acts" style="margin:6px 0 14px">${reqActions(r)}</div>`;
  if(S.editing===r.id) h+=`<form class="inline-input" data-submit="fax" data-id="${r.id}"><input type="text" name="fax" value="${esc(p.fax)}" aria-label="Fax number" style="max-width:220px"><button class="btn small" type="submit">Save and resend</button></form>`;
  h+=`<div class="box"><h3>Audit trail</h3><ol class="audit">${r.events.map(e=>`<li><time>${clock(e[0])}</time>${esc(e[1])}</li>`).join('')}</ol></div><p class="note">Responses are simulated in this prototype. In a real deployment, the recipient's secure-link or fax-back response would update this automatically.</p>`;
  return h;
}
