// api.js
// Talks to the Colleague Connect backend (backend/, FastAPI + Claude). Every call has a short
// timeout and a non-AI fallback, so the demo keeps working when the backend is off.
// The API key lives only on the backend; nothing here needs it.
'use strict';

const API_BASE = 'http://127.0.0.1:8000';
const AI = {status:'unknown', model:null};   // status: 'ai' (key set) | 'patterns' (backend on, no key) | 'off'

async function apiPost(path, body, ms){
  const ctl=new AbortController(), timer=setTimeout(()=>ctl.abort(),ms);
  try{
    const res=await fetch(API_BASE+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctl.signal});
    if(!res.ok) throw new Error('HTTP '+res.status);
    return await res.json();
  } finally { clearTimeout(timer); }
}
async function checkHealth(){
  try{ const res=await fetch(API_BASE+'/health',{signal:AbortSignal.timeout(2000)}); const j=await res.json(); AI.status=j.ai?'ai':'patterns'; AI.model=j.model; }
  catch(e){ AI.status='off'; AI.model=null; }
  return AI.status;
}

/* ---------- AI draft ---------- */
// Returns {text, model} from Claude, or null so the caller uses the template instead.
async function aiDraft(req){
  if(AI.status==='off') return null;
  try{ const j=await apiPost('/ai/draft',req,6000); return j.text?j:null; }
  catch(e){ return null; }
}

/* ---------- Privacy check ---------- */
// mode: 'ai' (pattern rules + Claude) | 'patterns' (backend, no key) | 'offline' (rules in this file)
const PRIVACY_LABEL = {
  ai:'AI privacy check',
  patterns:'AI privacy check, simulated: pattern rules only (no API key)',
  offline:'AI privacy check, simulated: pattern rules in the browser (backend off)'
};
async function privacyCheck(req){
  if(AI.status!=='off'){
    try{ const j=await apiPost('/ai/privacy-check',req,10000); return {flags:j.flags||[], mode:j.mode}; }
    catch(e){ /* fall through to the local rules */ }
  }
  return {flags:localPatternCheck(req), mode:'offline'};
}

// Browser copy of backend/privacy.py. Keep the two in step.
function localPatternCheck({text,patient,approved,topic,allowed}){
  approved=new Set(approved||[]);
  const norm=s=>String(s||'').replace(/\s+/g,' ').trim().toLowerCase();
  const rx=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const lowTopic=norm(topic), allowedDigits=(allowed||[]).map(a=>String(a).replace(/\D/g,'').slice(-10));
  const flags=[], seen=new Set();
  const add=(snippet,reason,kind)=>{ const k=norm(snippet)+'|'+kind; if(snippet&&!seen.has(k)){ seen.add(k); flags.push({text:snippet,reason,kind}); } };
  const findPhrase=p=>{ if(!p||p.trim().length<2) return null; const m=text.match(new RegExp('(?<!\\w)'+rx(p.trim())+'(?!\\w)','i')); return m?m[0]:null; };
  const each=(re,fn)=>{ for(const m of text.matchAll(re)) fn(m[0]); };

  // 1. Patient identifiers
  if(patient){
    const name=patient.name||'';
    [name,...name.split(/\s+/)].forEach(part=>{
      if(part.length<3) return;
      for(const m of text.matchAll(new RegExp('(?<!\\w)'+rx(part)+'(?!\\w)','gi'))){
        if(!/\bDr\.?\s*$/.test(text.slice(0,m.index))){ add(m[0],'Patient name. Identifiers are released through the secure link only after the physician accepts.','identifier'); break; }
      }
    });
    if(patient.dob&&findPhrase(patient.dob)) add(findPhrase(patient.dob),'Patient date of birth. Released only after the physician accepts.','identifier');
    const mrn=String(patient.mrn||'').replace(/\D/g,'');
    if(mrn.length>=3){ const m=text.match(new RegExp('(?<!\\d)'+mrn+'(?!\\d)')); if(m) add(m[0],'Looks like the patient’s medical record number.','identifier'); }
  }
  each(/\b(?:MRN|medical record(?: number)?)\b[\s:#.]*[\w…-]*/gi, s=>add(s.trim(),'Medical record number. Don’t include record numbers in the fax.','identifier'));
  each(/\b\d{1,2}[/-]\d{1,2}[/-](?:\d{4}|\d{2})\b/g, s=>add(s,'A full date could be a date of birth. Use age instead.','identifier'));
  each(/\b\d{3}-\d{2}-\d{4}\b/g, s=>add(s,'Looks like a Social Security number.','identifier'));

  // 2. Contact details that aren't the sender's or recipient's own
  each(/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g, s=>{ if(!allowedDigits.includes(s.replace(/\D/g,'').slice(-10))) add(s,'Phone or fax number that isn’t yours or the recipient’s. It could identify the patient.','contact'); });
  each(/\b[\w.+-]+@[\w-]+\.[\w.]+\b/g, s=>{ if(!(allowed||[]).map(norm).includes(norm(s))) add(s,'Email address. It could identify the patient.','contact'); });
  each(/\b\d{1,6}[ \t]+(?:[A-Za-z0-9.]+[ \t]+){0,4}(?:St|Street|Ave|Avenue|Rd|Road|Blvd|Boulevard|Drive|Ln|Lane|Way|Ct|Court|Pkwy|Parkway|Hwy|Highway|Pl|Place)\b\.?/g, s=>add(s.trim(),'Street address. It could identify the patient.','contact'));

  // 3. Clinical details from fields the physician left unchecked
  if(patient){
    if(!approved.has('agesex')&&patient.age){ const m=text.match(new RegExp('\\b'+patient.age+'[- ]?(?:year|yo\\b|y/o)','i')); if(m) add(m[0],'Age wasn’t checked for sharing.','unapproved'); }
    [['dx',patient.dx,'Diagnosis wasn’t checked for sharing.'],['meds',patient.meds,'Medications weren’t checked for sharing.'],['labs',patient.labs,'Labs weren’t checked for sharing.']].forEach(([field,items,reason])=>{
      if(approved.has(field)) return;
      (items||[]).forEach(item=>{
        const cands=[item]; if(field!=='dx') cands.push(item.split(/\s(?=\d)|,/)[0].trim());
        for(const c of cands){ if(lowTopic.includes(norm(c))) continue; const hit=findPhrase(c); if(hit){ add(hit,reason,'unapproved'); break; } }
      });
    });
  }
  // Drop a flag when a longer flag already covers it ("Reyes" inside "Maria Reyes")
  return flags.filter(f=>!flags.some(g=>g!==f&&g.text.length>f.text.length&&g.text.toLowerCase().includes(f.text.toLowerCase())));
}
