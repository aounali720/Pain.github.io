import {chapters,specimens,incidents,sources} from './content.mjs';
import {emptySave,safeStorage,recordLab,recordChapter,recordIncident,experience,clearance,streak,progress,dayKey} from './engine.mjs';

const $=sel=>document.querySelector(sel);
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const attr=escapeHTML;
const chapterById=id=>chapters.find(x=>x.id===id);
const specimenById=id=>specimens.find(x=>x.id===id);
let save=safeStorage.read();
let route='home', activeCase=null, activeTtp=null, stage=0, codeView='unsafe', specimenFilter='ALL', specimenSearch='', selectedSpecimen=null;
let quiz={id:null,index:0,answers:[],complete:false};
const codes={
 a01:{bad:'// GET /api/invoices/:id\nconst invoice = await db.invoices.find(id);\nreturn res.json(invoice);',good:'// GET /api/invoices/:id\nconst invoice = await db.invoices.find(id);\nif (invoice.customerId !== req.user.id)\n  return res.sendStatus(403);\nreturn res.json(invoice);'},
 a02:{bad:'DEBUG = true\nALLOW_ORIGIN = "*"\nSHOW_STACK_TRACES = true',good:'DEBUG = false\nALLOW_ORIGIN = "https://app.example"\nSHOW_STACK_TRACES = false'},
 a03:{bad:'# build without review\nnpm install some-helper@latest\n# job gets broad write permissions',good:'# lock and review changes\nnpm ci\n# grant read-only permissions by default\npermissions: { contents: read }'},
 a04:{bad:'// Fast digest is not for passwords\npasswordHash = sha256(password);\nconsole.log(sessionToken);',good:'// Example pseudocode, use a maintained library\npasswordHash = argon2id.hash(password);\nlogger.info("Login completed");'},
 a05:{bad:'// SQL formed from untrusted input\nquery = "SELECT * FROM users WHERE name = \x27"\n      + input + "\x27";\n// HTML interpreted from untrusted input\nelement.innerHTML = input;',good:'// Parameterize values\nquery = "SELECT * FROM users WHERE name = ?";\ndb.execute(query, [input]);\n// For plain text output\nelement.textContent = input;'},
 a06:{bad:'if (coupon.valid) {\n  account.balance += coupon.value;\n}',good:'await db.transaction(async tx => {\n  await tx.claimOnce(userId, coupon.id);\n  await tx.credit(userId, coupon.value);\n});'},
 a07:{bad:'resetToken = Math.random().toString();\n// token never expires or gets revoked',good:'resetToken = secureRandom(32);\nstoreHashWithExpiry(resetToken);\n// invalidate on first successful use'},
 a08:{bad:'const policy = await fetch(sourceUrl);\napplyPolicy(await policy.json());',good:'const artifact = await download(trustedUrl);\nverifySignature(artifact, trustedKey);\nvalidateSchema(artifact.data);\napplyPolicy(artifact.data);'},
 a09:{bad:'logger.info("POST /roles 200");\n// No alert configured',good:'audit.log({actorId,targetId,action,\n  outcome,at,correlationId});\nnotifyOnSuspiciousPrivilegeChange();'},
 a10:{bad:'try { await fraudCheck(order); }\ncatch (e) { return approve(order); }',good:'try { await fraudCheck(order); }\ncatch (e) { logProtected(e);\n  return requireManualReview(order); }'}
};
function updateChrome(){
 $('#top-xp').textContent=`${String(experience(save)).padStart(4,'0')} XP`;
 $('#sidebar-rank').textContent=clearance(save);
 $('#sidebar-level').textContent=`${experience(save)} XP · ${save.completed.length} / 10 cleared`;
 $('#sidebar-bar').style.width=`${progress(save)}%`;
 $('#sidebar-chapters').innerHTML=chapters.map(c=>`<a class="rail-chapter ${activeCase===c.id&&route==='case'?'on':''}" href="#/case/${c.id}"><span>${c.code.split(':')[0]}</span><b>${escapeHTML(c.title)}</b>${save.completed.includes(c.id)?'<i aria-label="cleared">✓</i>':''}</a>`).join('');
 const labels={home:'THE BRIEFING',missions:'OWASP CAMPAIGN',case:chapterById(activeCase)?.code||'CASE',specimens:'PAYLOAD NOTEBOOK',ttp:'TTP INVESTIGATIONS',incident:'CASE REVIEW',sources:'REFERENCE DESK'};
 $('#current-crumb').textContent=labels[route]||'THE BRIEFING';
 document.querySelectorAll('[data-route]').forEach(a=>{const on=a.dataset.route===(route==='case'?'missions':route==='incident'?'ttp':route);a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}
const statsCard=(num,label,detail)=>`<div class="stat-card"><strong>${escapeHTML(num)}</strong><span>${escapeHTML(label)}</span><small>${escapeHTML(detail)}</small></div>`;
const progressMeter=(n,max)=>`<div class="meter"><i style="width:${100*n/max}%"></i></div>`;
function ribbon(kicker,heading,copy,number=''){return `<div class="section-heading"><span>${escapeHTML(kicker)}</span><div class="section-headrow"><h2>${escapeHTML(heading)}</h2>${number?`<b>${escapeHTML(number)}</b>`:''}</div>${copy?`<p>${escapeHTML(copy)}</p>`:''}</div>`}
function chapterCard(c,i){const done=save.completed.includes(c.id);return `<a class="case-card ${done?'cleared':''}" href="#/case/${c.id}" style="--case-accent:${c.accent}"><div class="case-overline"><span>${c.code}</span><span>${done?'● CLEARED':c.difficulty}</span></div><span class="case-serial">${String(i+1).padStart(2,'0')}</span><div class="case-body"><span>${escapeHTML(c.sector)}</span><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.short)}</p></div><div class="case-bottom"><span>${c.time} MIN · 3 QUESTIONS</span><b>${done?'REVISIT CASE':'OPEN CASE'} ↗</b></div></a>`}
function sampleDashboard(){
 const complete=save.completed.length;
 const next=chapters.find(c=>!save.completed.includes(c.id))||chapters[0];
 const items=[['A network request','request.png','Browser → API → Data'],['An authorization decision','auth.png','Identity ≠ Permission'],['A useful event','alert.png','Log → Detect → Respond']];
 return `<div class="page home-page">
  <div class="top-note"><span>◆ TRAINING RECORD / 2026</span><span>SIMULATED ENVIRONMENT — NO ATTACKS EXECUTED</span></div>
  <section class="home-hero">
    <div class="home-copy"><div class="hero-eyebrow"><span class="eyebrow-square"></span> INTERACTIVE SECURITY FIELD GUIDE <span>ISSUE 001 / WEB & OPERATIONS</span></div>
      <h1>Learn how a<br><em>breach</em> happens.<br>Then stop it.</h1>
      <p>Follow a request from browser to database. Investigate the missing control. Read the payload without running it. Practice the fix, then prove you understand it.</p>
      <div class="hero-buttons"><a class="button solid" href="#/case/${next.id}">${complete===0?'OPEN YOUR FIRST CASE':'RESUME FIELDWORK'} <span>↗</span></a><a class="button line-light" href="#/missions">VIEW ALL TEN CASES <span>→</span></a></div>
      <div class="hero-meta"><span>10 OWASP CASE FILES</span><b>✳</b><span>${specimens.length} LAB SPECIMENS</span><b>✳</b><span>6 TTP SCENARIOS</span></div>
    </div>
    <div class="hero-art" aria-label="Animated conceptual web request diagram"><div class="art-stamp">EXHIBIT / A-001</div><div class="blueprint-mark">↘</div>
      <div class="art-route" aria-hidden="true"><div class="art-node browser"><small>01 / CLIENT</small><b>REQUEST</b><span>GET /invoice</span></div><div class="art-connector"><i></i></div><div class="art-node gateway"><small>02 / API</small><b>TRUST CHECK</b><span>validate → authorize</span></div><div class="art-connector"><i></i></div><div class="art-node database"><small>03 / DATA</small><b>RESOURCE</b><span>object ownership</span></div></div>
      <div class="art-foot"><span>THE BOUNDARY IS THE STORY</span><span>CF / 0001</span></div>
    </div>
  </section>
  <div class="stats-strip">${statsCard(`${complete}/10`,'CASES CLEARED','OWASP TOP 10:2025')}${statsCard(`${experience(save)}`,'EXPERIENCE','CURRENT CLEARANCE')}${statsCard(`${save.labs.length}/${specimens.length}`,'SPECIMENS READ','NOTEBOOK')}${statsCard(`${streak(save)}`,'DAY STREAK',`BEST ${save.bestStreak} DAYS`)}</div>
  ${ribbon('001 / THE CAMPAIGN','Ten risks. Ten investigations.','The 2025 OWASP categories, each taught through an incident, annotated flow, working-versus-broken code, and a three-question clearance exam.','A01—A10')}
  <div class="three-cases">${chapters.slice(0,3).map(chapterCard).join('')}</div><a class="index-link" href="#/missions"><span>EXPLORE ALL OWASP CASE FILES</span><b>↗</b></a>
  <div class="split-features"><a class="feature" href="#/specimens"><span class="feature-id">02 / THE NOTEBOOK</span><span class="feature-icon">{ } </span><h3>Read the payload.<br><em>Know the boundary.</em></h3><p>${specimens.length} safe examples with an explanation of the parser, the failure and the fix.</p><strong>OPEN NOTEBOOK ↗</strong></a><a class="feature ttp-feature" href="#/ttp"><span class="feature-id">03 / THE HUNT</span><span class="feature-icon">⌖</span><h3>Think like an<br><em>analyst.</em></h3><p>Six fictional investigations: identify the tactic, understand the technique and choose the next defensible action.</p><strong>START INVESTIGATING ↗</strong></a></div>
  <div class="footnote-block"><span>READ BEFORE PRACTICING</span><p>This site runs local learning simulations. It does not execute examples, scan systems or send network probes. Only test systems you own or are explicitly authorized to assess. For real methods, follow OWASP and MITRE primary resources.</p><a href="#/sources">REFERENCE DESK ↗</a></div>
 </div>`;
}
function renderCampaign(){return `<div class="page"><div class="page-kicker">FIELD RECORD / 01 · APPLICATION SECURITY</div><div class="page-title-line"><h1>The OWASP campaign<span class="dot">.</span></h1><span class="folio">10 CASE FILES<br>2025 EDITION</span></div><p class="page-deck">Pick a case. Trace the fault. Compare unsafe and safer code. Inspect a specimen, then clear the three-question assessment. Cases can be completed in any order.</p>
  <div class="campaign-strip"><div><b>${save.completed.length} OF 10</b><span>FILES CLOSED</span></div>${progressMeter(save.completed.length,10)}<strong>${progress(save)}%</strong></div>
  <div class="all-cases">${chapters.map(chapterCard).join('')}</div><p class="credit-note">Based on <a href="https://top10.owasp.org/2025/" target="_blank" rel="noopener noreferrer">OWASP Top 10:2025 ↗</a>. This learning game is independent and is not endorsed by OWASP.</p></div>`}
function flowDiagram(c){return `<div class="flow-diagram" role="group" aria-label="Animated request and trust-boundary diagram">
  <div class="flow-top"><span>FIG. ${c.code.split(':')[0]} / REQUEST & TRUST FLOW</span><div><button type="button" class="mini-control" data-action="motion" aria-label="Pause or resume animations">${document.documentElement.classList.contains('freeze-motion')?'RESUME':'PAUSE'} MOTION</button><span class="live-indicator">● LIVE SIMULATION</span></div></div>
  <div class="flow-nodes">${c.stages.map((x,i)=>`<button class="flow-node ${stage===i?'focused':''}" type="button" data-action="stage" data-stage="${i}" aria-pressed="${stage===i}"><span class="flow-index">0${i+1}</span><strong>${escapeHTML(x[0].split('/ ')[1]||x[0])}</strong>${i<3?'<i class="flow-wire" aria-hidden="true"><em></em></i>':''}</button>`).join('')}</div>
  <div class="flow-explain"><span>STEP 0${stage+1} / 04</span><p>${escapeHTML(c.stages[stage][1])}</p><div class="flow-pager"><button type="button" data-action="prev-stage" ${stage===0?'disabled':''}>← PREVIOUS</button><button type="button" data-action="next-stage" ${stage===3?'disabled':''}>NEXT STEP →</button></div></div>
 </div>`}
function renderCode(c){const pair=codes[c.id];return `<section class="code-sheet"><div class="code-sheet-top"><span>CODE REVIEW / ${c.code.split(':')[0]}</span><div class="code-tabs"><button type="button" class="${codeView==='unsafe'?'active':''}" data-action="codeview" data-id="unsafe" aria-pressed="${codeView==='unsafe'}">UNSAFE</button><button type="button" class="${codeView==='safe'?'active':''}" data-action="codeview" data-id="safe" aria-pressed="${codeView==='safe'}">SAFER</button></div></div><div class="code-caption"><b>${codeView==='unsafe'?'THE BROKEN ASSUMPTION':'THE BETTER BOUNDARY'}</b><span>${codeView==='unsafe'?'Simplified example · do not deploy':'Conceptual pseudocode · adapt and test'}</span></div><pre><code>${escapeHTML(codeView==='unsafe'?pair.bad:pair.good)}</code></pre><div class="code-bottom">${codeView==='unsafe'?'This code shows what can go wrong when a trust boundary is missed.':'This version illustrates the control, not a complete production implementation.'}</div></section>`}
function caseQuiz(c){
 const q=quiz.index,done=quiz.complete,answered=quiz.answers.length>q;
 if(done){const score=quiz.answers.reduce((n,a,i)=>n+(a===c.questions[i][2]?1:0),0),pass=score>=2,reviewed=c.specimen.some(id=>save.labs.includes(id)),cleared=save.completed.includes(c.id);
 return `<section id="checkpoint" class="exam-finish"><span class="small-label">CLEARANCE REPORT / ${c.code}</span><div class="grade">${score}<small>/ 3</small></div><h3>${pass?(cleared?'FILE CLOSED — WELL DONE':'KNOWLEDGE CLEARED · EVIDENCE NEEDED'):'NOT CLEARED — REVIEW & RETRY'}</h3><p>${pass&&!reviewed?'To close this case, inspect at least one related specimen in the notebook below.':pass?'You reached the 2/3 threshold. Revisit the diagram to improve your understanding.':'Review the mechanism and mitigation, then retake the assessment. No penalty for retrying.'}</p>
 <div class="exam-actions"><button type="button" class="button dark" data-action="retry-quiz">RETAKE ASSESSMENT ↻</button>${pass&&!reviewed?`<button type="button" class="button orange" data-action="inspect-lab" data-id="${c.specimen[0]}">INSPECT EVIDENCE →</button>`:`<a class="button outline" href="#/missions">RETURN TO CAMPAIGN ↗</a>`}</div></section>`}
 const question=c.questions[q],selected=quiz.answers[q];return `<section class="quiz-sheet" id="checkpoint"><div class="quiz-head"><span>FIELD EXAM / QUESTION 0${q+1} OF 03</span><b>PASS MARK 2 / 3</b></div><div class="quiz-meter">${[0,1,2].map(i=>`<i class="${i<quiz.answers.length?'done':i===q?'active':''}"></i>`).join('')}</div><h3>${escapeHTML(question[0])}</h3><div class="quiz-choices">${question[1].map((opt,i)=>`<button type="button" data-action="quiz-answer" data-choice="${i}" class="quiz-choice ${answered?(i===question[2]?'correct':selected===i?'incorrect':'') :''}" ${answered?'disabled':''}><b>${String.fromCharCode(65+i)}</b><span>${escapeHTML(opt)}</span>${answered&&i===question[2]?'<strong>✓</strong>':''}</button>`).join('')}</div>${answered?`<div class="quiz-feedback"><strong>${selected===question[2]?'CORRECT ASSESSMENT':'REVIEW THE EVIDENCE'}</strong><p>${escapeHTML(question[3])}</p><button type="button" class="button orange" data-action="quiz-next">${q===2?'FINALIZE CASE':'NEXT QUESTION'} →</button></div>`:`<p class="exam-help">Select one answer. You'll get the reasoning before continuing.</p>`}</section>`;
}
function renderCase(c){return `<div class="page case-page" style="--case-accent:${c.accent}">
  <div class="case-breadcrumb"><a href="#/missions">← BACK TO CAMPAIGN</a><span>/</span><b>${c.code}</b><span>/</span><span>${escapeHTML(c.sector)}</span></div>
  <div class="case-title-area"><div><span class="case-tag">FILE ${c.code} · ${c.difficulty} · ${c.time} MIN</span><h1>${escapeHTML(c.title)}<span class="dot">.</span></h1><p>${escapeHTML(c.lead)}</p></div><div class="case-stamp"><span>${save.completed.includes(c.id)?'CLEARED':'UNRESOLVED'}</span><b>${c.code.split(':')[0]}</b><small>OWASP / 2025</small></div></div>
  <div class="case-layout"><div class="case-primary">
    <section class="story-sheet"><div class="paper-label">01 / THE INCIDENT</div><h2>What happened?</h2><p>${escapeHTML(c.story)}</p><div class="analogy"><span>PLAIN ENGLISH</span>${escapeHTML(c.analogy)}</div></section>
    <section class="case-module"><div class="module-heading"><span>02 / REQUEST FORENSICS</span><h2>Follow the boundary.</h2><p>Tap the numbered stages to see where a trustworthy input turns into an assumption.</p></div>${flowDiagram(c)}</section>
    <section class="case-module"><div class="module-heading"><span>03 / CODE REVIEW</span><h2>The flaw in code.</h2><p>Switch between a simplified vulnerable pattern and a safer implementation.</p></div>${renderCode(c)}</section>
    <section class="case-module"><div class="module-heading"><span>04 / LAB SPECIMENS</span><h2>Read the evidence.</h2><p>Every specimen is just text. Open it to see what it illustrates and how to fix the underlying failure.</p></div>
    <div class="evidence-list">${c.specimen.map(id=>{const s=specimenById(id);return `<button type="button" data-action="inspect-lab" data-id="${id}" class="evidence-row"><span>${save.labs.includes(id)?'✓':'↗'}</span><b>${escapeHTML(s.name)}</b><small>${save.labs.includes(id)?'REVIEWED':'INSPECT'} →</small></button>`}).join('')}</div></section>
    ${ribbon('05 / FINAL CHECK','Clear the case.','Answer three questions. Pass two, and inspect at least one specimen, to earn your clearance.', '3 QUESTIONS')}${caseQuiz(c)}
  </div><aside class="case-secondary"><section class="insight-card"><span class="small-label">CORE IDEA</span><h3>What actually failed?</h3><p>${escapeHTML(c.principle)}</p></section><section class="control-card"><span class="small-label">DEFENDER'S CHECKLIST</span><h3>Put the boundary back.</h3><ol>${c.controls.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ol></section><section class="signal-card"><span>DETECTION NOTE / ${c.code.split(':')[0]}</span><p>${escapeHTML(c.observe)}</p></section><section class="mistake-card"><span>COMMON MISCONCEPTION</span><p>${escapeHTML(c.gotcha)}</p></section></aside></div>
  <div class="case-next">${(()=>{let n=chapters[(chapters.indexOf(c)+1)%chapters.length];return `<a href="#/case/${n.id}"><span>NEXT FILE / ${n.code}</span><b>${escapeHTML(n.title)} →</b></a>`})()}</div>
 </div>`}
function renderNotebook(){return `<div class="page"><div class="page-kicker">EVIDENCE LOCKER / 02</div><div class="page-title-line"><h1>Payload notebook<span class="dot">.</span></h1><span class="folio">${specimens.length} SPECIMENS<br>100% INERT</span></div><p class="page-deck">A payload is a particular input. It only matters in the context of a parser, a trust boundary and a vulnerable implementation. These are teaching specimens, not an automated exploit toolkit.</p>
  <div class="safety-strip"><b>READ-ONLY SIMULATOR</b><p>All examples are escaped as text. No examples are executed, rendered as HTML, fetched, or submitted to an external target. Authorization is still required for real-world security testing.</p></div>
  <div class="notebook-tools"><label class="search-shell"><span>⌕</span><input id="specimen-search" type="search" placeholder="Search: XSS, SQL, reset token, CORS…" value="${attr(specimenSearch)}" autocomplete="off" aria-label="Search specimens"></label><label>TYPE <select id="specimen-filter" aria-label="Filter specimens by type">${['ALL',...new Set(specimens.map(s=>s.kind))].map(v=>`<option ${specimenFilter===v?'selected':''} value="${v}">${v}</option>`).join('')}</select></label><span class="result-count" id="specimen-count"></span></div>
  <div class="notebook-grid" id="specimen-grid"></div><div class="note-end"><span>NOT ALL RISKS ARE PAYLOAD RISKS</span><p>OWASP categories such as insecure design and supply-chain failure are often about business rules, configurations and provenance—not magic exploit strings. This notebook includes those examples too.</p></div>
 </div>`}
function filterSpecimens(){const target=$('#specimen-grid');if(!target)return;const phrase=specimenSearch.trim().toLowerCase();const matches=specimens.filter(s=>(specimenFilter==='ALL'||s.kind===specimenFilter)&&(!phrase||[s.name,s.kind,s.payload,s.meaning].some(v=>v.toLowerCase().includes(phrase))));$('#specimen-count').textContent=`${matches.length} / ${specimens.length} SHOWN`;
 target.innerHTML=matches.length?matches.map((s,i)=>`<article class="specimen-card"><div class="specimen-top"><span>${s.kind} / ${String(i+1).padStart(2,'0')}</span><b>${save.labs.includes(s.id)?'✓ READ':'UNEXAMINED'}</b></div><h3>${escapeHTML(s.name)}</h3><pre><code>${escapeHTML(s.payload)}</code></pre><p>${escapeHTML(s.meaning)}</p><button type="button" data-action="inspect-lab" data-id="${s.id}">READ ANALYSIS ↗</button></article>`).join(''):'<p class="no-matches">No specimens match that search. Try a broader term.</p>';
}
function renderTtp(){return `<div class="page"><div class="page-kicker">THREAT OPERATIONS / 03 · ADVERSARY BEHAVIOR</div><div class="page-title-line"><h1>Tactics. Techniques.<br>Procedures<span class="dot">.</span></h1><span class="folio">6 INCIDENTS<br>LOCAL CASES</span></div><p class="page-deck">The tactic is <b>why</b>, the technique is <b>how</b>, and a procedure is a concrete example of behavior. Each case below includes one fictional observation and an analyst decision.</p>
  <div class="ttp-map"><div><small>WHY</small><b>TACTIC</b><span>Operational objective</span></div><i>→</i><div><small>HOW</small><b>TECHNIQUE</b><span>Behavior used</span></div><i>→</i><div><small>SPECIFICALLY</small><b>PROCEDURE</b><span>Implementation example</span></div></div>
  ${ribbon('FIELD INVESTIGATIONS','Read the signal. Make the call.','Each case is a deliberately fictional observation. There is no actual intrusion and no scan or exploit is executed.',`${save.incidents.length}/6 CLOSED`)}
  <div class="incident-grid">${incidents.map((x,i)=>`<a href="#/incident/${x.id}" class="incident-card"><div><span>CASE / T${String(i+1).padStart(2,'0')}</span><b>${save.incidents.includes(x.id)?'✓ CLOSED':'OPEN'}</b></div><h3>${escapeHTML(x.title)}</h3><p>${escapeHTML(x.tactic)} / ${escapeHTML(x.technique)}</p><footer><span>${x.identifier}</span><strong>INVESTIGATE ↗</strong></footer></a>`).join('')}</div>
 <p class="credit-note">The vocabulary and technique identifiers refer to the <a href="https://attack.mitre.org/" target="_blank" rel="noopener noreferrer">MITRE ATT&CK knowledge base ↗</a>. These scenarios are fictional examples, not attributed real-world procedures or MITRE-authored content.</p></div>`}
function renderIncident(t){return `<div class="page"><div class="case-breadcrumb"><a href="#/ttp">← INVESTIGATIONS</a><span>/</span><b>${t.identifier}</b></div><div class="page-kicker">THREAT RECORD / ${t.id.toUpperCase()}</div><div class="page-title-line"><h1>${escapeHTML(t.title)}<span class="dot">.</span></h1><span class="folio">ANALYST FILE<br>${t.identifier}</span></div>
 <div class="ttp-detail"><div class="ttp-primary"><div class="ttp-triad"><div><small>TACTIC / WHY</small><strong>${escapeHTML(t.tactic)}</strong></div><div><small>TECHNIQUE / HOW</small><strong>${escapeHTML(t.technique)}</strong></div><div><small>PROCEDURE / SPECIFIC EXAMPLE</small><p>${escapeHTML(t.procedure)}</p></div></div>
 <section class="event-panel"><div>TELEMETRY EXHIBIT / SANITIZED</div><pre>${escapeHTML(t.event)}</pre><p>The event is illustrative. A single log line is not proof of attribution or a confirmed intrusion.</p></section>
 <section class="ttp-question"><span>ANALYST DECISION</span><h2>What should happen next?</h2><div class="ttp-options">${t.choices.map((o,i)=>`<button type="button" data-action="ttp-answer" data-choice="${i}" class="ttp-option"><b>${String.fromCharCode(65+i)}</b><span>${escapeHTML(o)}</span>↗</button>`).join('')}</div><div class="ttp-feedback" id="ttp-feedback" aria-live="polite">${save.incidents.includes(t.id)?`<div class="feedback-good"><strong>CASE CLOSED ✓</strong><p>${escapeHTML(t.why)}</p></div>`:''}</div></section></div><aside class="case-secondary"><section class="insight-card"><span class="small-label">ANALYST NOTES</span><h3>How to interpret this</h3><p>${escapeHTML(t.why)}</p></section><section class="control-card"><span class="small-label">DEFENSIVE LENS</span><h3>What helps stop it?</h3><p>${escapeHTML(t.defense)}</p></section><a class="button outline reference-button" href="https://attack.mitre.org/techniques/${t.identifier}/" target="_blank" rel="noopener noreferrer">READ MITRE TECHNIQUE ↗</a></aside></div>
 <a class="index-link" href="#/ttp">← RETURN TO INVESTIGATIONS</a></div>`}
function renderReferences(){return `<div class="page"><div class="page-kicker">RESEARCH / LIBRARY</div><h1 class="simple-title">Reference desk<span class="dot">.</span></h1><p class="page-deck">This game explains common patterns; it is not a replacement for primary security documentation or hands-on testing in an authorized lab. The examples are simplified and self-contained.</p><div class="reference-list">${sources.map((s,i)=>`<a href="${attr(s.url)}" target="_blank" rel="noopener noreferrer"><span>REFERENCE ${String(i+1).padStart(2,'0')}</span><strong>${escapeHTML(s.label)}</strong><b>↗</b></a>`).join('')}</div><section class="source-statement"><h2>Scope and boundaries</h2><p>OWASP Top 10:2025 names and risk groups are sourced from OWASP. The definition of tactic/technique/procedure and identifiers follow MITRE ATT&CK. Storylines, test observations, questions, diagrams and examples here are independently written learning material. OWASP and MITRE do not endorse this project.</p><p>Payload examples are deliberately stored and displayed as inert strings; no network requests, code execution, exploitation, credential capture or browser script evaluation is performed. Real findings require an authorized environment and proper verification.</p></section></div>`}
function inspector(s){if(!s)return '';const related=chapters.find(c=>c.specimen.includes(s.id));return `<div class="inspector-scrim" data-action="close-inspector-backdrop"><section class="inspector" role="dialog" aria-modal="true" aria-labelledby="inspector-name"><div class="inspector-head"><span>EVIDENCE EXAMINATION / ${escapeHTML(s.kind)}</span><button type="button" data-action="close-inspector" aria-label="Close analysis">✕</button></div><div class="inspector-body"><div class="specimen-stamp">SPECIMEN / ${escapeHTML(s.id.toUpperCase())}</div><h2 id="inspector-name">${escapeHTML(s.name)}</h2><p>Inspect the input and the trust boundary. Nothing in this panel is executed.</p><div class="code-specimen"><div><span>READ-ONLY EXAMPLE</span><button type="button" data-action="copy-specimen" data-id="${s.id}">COPY TEXT</button></div><pre><code>${escapeHTML(s.payload)}</code></pre></div><div class="inspector-explanation"><b>WHAT THIS SHOWS</b><p>${escapeHTML(s.meaning)}</p></div><div class="inspector-explanation mitigation"><b>HOW TO DEFEND</b><p>${escapeHTML(s.mitigation)}</p></div>${related?`<a class="button dark inspector-jump" href="#/case/${related.id}">OPEN RELATED CASE ${related.code} ↗</a>`:''}</div><div class="inspector-foot"><span>INSPECTED ✓ · +8 XP IF FIRST REVIEW</span><button type="button" data-action="close-inspector">CLOSE ANALYSIS ↗</button></div></section></div>`}
function render(){
 const raw=(location.hash||'#/home').replace(/^#\/?/,'');const [first,id]=raw.split('/');
 route=['home','missions','specimens','ttp','sources'].includes(first)?first:(first==='case'&&chapterById(id))?'case':(first==='incident'&&incidents.some(x=>x.id===id))?'incident':'home';
 activeCase=route==='case'?id:null;activeTtp=route==='incident'?id:null;
 updateChrome();
 const body=route==='home'?sampleDashboard():route==='missions'?renderCampaign():route==='case'?renderCase(chapterById(id)):route==='specimens'?renderNotebook():route==='ttp'?renderTtp():route==='incident'?renderIncident(incidents.find(x=>x.id===id)):renderReferences();
 $('#main').innerHTML=body+(selectedSpecimen?inspector(specimenById(selectedSpecimen)):'');
 if(route==='specimens')filterSpecimens();
 document.title=`${route==='case'?chapterById(id).title:route==='incident'?incidents.find(x=>x.id===id).title:'CASEFILE / ZERO'} — Cybersecurity Field Game`;
}
const commit=next=>{save=next;safeStorage.write(save);updateChrome()};
let toastDelay;
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('visible');clearTimeout(toastDelay);toastDelay=setTimeout(()=>t.classList.remove('visible'),3500)}
function startQuiz(id){quiz={id,index:0,answers:[],complete:false};}
function examComplete(c){const score=quiz.answers.reduce((n,a,i)=>n+(a===c.questions[i][2]?1:0),0),hasSpecimen=c.specimen.some(id=>save.labs.includes(id));if(score>=2&&hasSpecimen&&!save.completed.includes(c.id)){
 commit(recordChapter(save,c.id,score));toast(`CASE ${c.code.split(':')[0]} CLEARED / +${score===3?180:140} XP`);
}return score}
function navigateCloseNav(){document.body.classList.remove('nav-open');$('#menu-toggle').setAttribute('aria-expanded','false')}
function restoreCaseQuiz(id){if(quiz.id!==id)startQuiz(id)}
window.addEventListener('hashchange',()=>{stage=0;codeView='unsafe';selectedSpecimen=null;const match=(location.hash||'').match(/^#\/case\/(a\d+)$/);if(match)restoreCaseQuiz(match[1]);render();navigateCloseNav();window.scrollTo({top:0,behavior:'instant'})});
document.addEventListener('click',async e=>{
 const b=e.target.closest('[data-action]');if(!b)return;
 const action=b.dataset.action,id=b.dataset.id;
 if(action==='stage'){stage=Math.max(0,Math.min(3,Number(b.dataset.stage)));render()}
 if(action==='prev-stage'){stage=Math.max(0,stage-1);render()}
 if(action==='next-stage'){stage=Math.min(3,stage+1);render()}
 if(action==='motion'){document.documentElement.classList.toggle('freeze-motion');render()}
 if(action==='codeview'){codeView=id==='safe'?'safe':'unsafe';render()}
 if(action==='inspect-lab'){
  const s=specimenById(id);if(!s)return;
  const was=save.labs.includes(id);commit(recordLab(save,id));selectedSpecimen=id;
  if(!was)toast('EVIDENCE REVIEWED / +8 XP');
  if(route==='case'&&quiz.complete)examComplete(chapterById(activeCase));
  render();setTimeout(()=>$('.inspector [data-action="close-inspector"]')?.focus(),0);
 }
 if(action==='close-inspector'||(action==='close-inspector-backdrop'&&e.target===b)){selectedSpecimen=null;render()}
 if(action==='copy-specimen'){const s=specimenById(id);if(!s)return;try{await navigator.clipboard.writeText(s.payload);toast('EXAMPLE COPIED / USE ONLY IN YOUR OWN LAB')}catch{toast('COPY UNAVAILABLE / SELECT THE TEXT MANUALLY')}}
 if(action==='quiz-answer'&&route==='case'){
  const idx=Number(b.dataset.choice);if(!Number.isInteger(idx)||idx<0||idx>3||quiz.answers.length!==quiz.index)return;
  quiz.answers.push(idx);render();$('#checkpoint')?.scrollIntoView({block:'nearest',behavior:'smooth'});
 }
 if(action==='quiz-next'&&route==='case'){
  if(quiz.answers.length!==quiz.index+1)return;
  if(quiz.index===2){quiz.complete=true;examComplete(chapterById(activeCase))}else quiz.index++;
  render();$('#checkpoint')?.scrollIntoView({block:'start',behavior:'smooth'});
 }
 if(action==='retry-quiz'&&route==='case'){startQuiz(activeCase);render();$('#checkpoint')?.scrollIntoView({block:'start'})}
 if(action==='ttp-answer'&&route==='incident'){
  const t=incidents.find(t=>t.id===activeTtp),choice=Number(b.dataset.choice);if(!t||!Number.isInteger(choice)||choice<0||choice>=3)return;
  const feedback=$('#ttp-feedback');if(choice===t.answer){const first=!save.incidents.includes(t.id);commit(recordIncident(save,t.id));if(first)toast('INVESTIGATION CLOSED / +60 XP');
   feedback.innerHTML=`<div class="feedback-good"><strong>GOOD CALL / CASE CLOSED ✓</strong><p>${escapeHTML(t.why)}</p></div>`;
  }else{feedback.innerHTML='<div class="feedback-bad"><strong>LOOK AGAIN</strong><p>This action either overstates the evidence or skips an important validation. Try another response.</p></div>'}
 }
});
document.addEventListener('input',e=>{if(e.target.id==='specimen-search'){specimenSearch=e.target.value.slice(0,120);filterSpecimens()}});
document.addEventListener('change',e=>{if(e.target.id==='specimen-filter'){specimenFilter=e.target.value;filterSpecimens()}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&selectedSpecimen){selectedSpecimen=null;render()}});
$('#menu-toggle').addEventListener('click',()=>{const isOpen=document.body.classList.toggle('nav-open');$('#menu-toggle').setAttribute('aria-expanded',String(isOpen))});
$('#reset-button').addEventListener('click',()=>{if(confirm('Reset all Casefile Zero progress saved in this browser? This cannot be undone.')){commit(emptySave());startQuiz(null);selectedSpecimen=null;render();toast('LOCAL PROGRESS RESET')}});
if(!location.hash)location.hash='#/home';else{const id=location.hash.match(/^#\/case\/(a\d+)$/)?.[1];if(id)startQuiz(id);render()}
