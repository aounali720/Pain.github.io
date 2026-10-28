import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chapters,specimens,incidents,sources} from '../content.mjs';
import {cleanSave,emptySave,experience,recordLab,recordChapter,recordIncident,streak,touch,clearance} from '../engine.mjs';
assert.equal(chapters.length,10);
assert.deepEqual(chapters.map(c=>c.code),Array.from({length:10},(_,i)=>`A${String(i+1).padStart(2,'0')}:2025`));
assert.equal(new Set(chapters.map(c=>c.id)).size,10);
assert.equal(new Set(specimens.map(s=>s.id)).size,specimens.length);
assert.equal(incidents.length,6);
for(const c of chapters){assert.equal(c.questions.length,3);assert.ok(c.stages.length===4&&c.controls.length>=4);assert.ok(c.lead&&c.principle&&c.story&&c.gotcha);for(const q of c.questions){assert.equal(q.length,4);assert.equal(q[1].length,4);assert.ok(q[2]>=0&&q[2]<4&&q[3].length>12)}for(const id of c.specimen)assert.ok(specimens.some(s=>s.id===id),`${c.id}: unknown specimen ${id}`)}
for(const i of incidents){assert.equal(i.choices.length,3);assert.ok(i.answer>=0&&i.answer<3);assert.ok(/^T\d{4}$/.test(i.identifier))}
for(const s of specimens){assert.ok(s.meaning&&s.mitigation&&s.payload&&s.name)}
assert.ok(specimens.length>=30);
let save=emptySave();assert.equal(experience(save),0);save=recordLab(save,'sqli-quote','2026-10-27');assert.equal(experience(save),8);
save=recordLab(save,'sqli-quote','2026-10-27');assert.equal(experience(save),8);
save=recordChapter(save,'a01',1,3,'2026-10-27');assert.equal(save.completed.length,0);
save=recordChapter(save,'a01',3,3,'2026-10-27');assert.equal(save.completed.length,1);assert.equal(save.perfect.length,1);
save=recordChapter(save,'a01',2,3,'2026-10-27');assert.equal(save.completed.length,1);
save=recordIncident(save,'ttp1','2026-10-28');assert.equal(save.incidents.length,1);
assert.equal(streak(save,'2026-10-28'),2);assert.equal(save.bestStreak,2);
assert.equal(streak(save,'2026-10-30'),0);
let a=cleanSave({completed:['a01','fake','a01'],perfect:['fake','a01'],labs:['fake','sqli-quote'],incidents:['ttp1','fake'],days:['whatever','2026-10-28'],bestStreak:Infinity,updatedAt:'bad'});
assert.deepEqual(a.completed,['a01']);assert.deepEqual(a.perfect,['a01']);assert.deepEqual(a.days,['2026-10-28']);assert.equal(a.bestStreak,0);
assert.equal(clearance(emptySave()),'NEW RECRUIT');
for(const ref of sources)assert.ok(/^https:\/\//.test(ref.url));
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../style.css',import.meta.url),'utf8');
const js=readFileSync(new URL('../app.mjs',import.meta.url),'utf8');
assert.match(html,/type="module"/);assert.match(html,/viewport/);
assert.match(css,/prefers-reduced-motion/);assert.match(js,/escapeHTML/);
assert.doesNotMatch(js,/\beval\(/);assert.doesNotMatch(js,/new Function\(/);
console.log(`All checks passed: ${chapters.length} OWASP chapters, ${specimens.length} inert specimens, ${incidents.length} investigations, local save migrations.`);
