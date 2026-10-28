import {chapters,incidents,specimens} from './content.mjs';
export const STORAGE_KEY='casefile-zero-save-v1';
export const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const allow=(values,ids,max)=>Array.isArray(values)?[...new Set(values.filter(v=>typeof v==='string'&&ids.has(v)))].slice(0,max):[];
const datePattern=/^\d{4}-\d{2}-\d{2}$/;
const dates=value=>Array.isArray(value)?[...new Set(value.filter(d=>typeof d==='string'&&datePattern.test(d)&&!Number.isNaN(Date.parse(d+'T00:00:00Z'))))].sort().slice(-400):[];
export const emptySave=()=>({version:1,completed:[],perfect:[],labs:[],incidents:[],days:[],bestStreak:0,updatedAt:null});
export function cleanSave(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return emptySave();
 const ids=new Set(chapters.map(x=>x.id));
 const completed=allow(raw.completed,ids,chapters.length);
 const perfect=allow(raw.perfect,ids,chapters.length).filter(id=>completed.includes(id));
 const days=dates(raw.days);
 return {version:1,completed,perfect,labs:allow(raw.labs,new Set(specimens.map(x=>x.id)),specimens.length),incidents:allow(raw.incidents,new Set(incidents.map(x=>x.id)),incidents.length),days,bestStreak:Number.isSafeInteger(raw.bestStreak)?Math.max(0,Math.min(400,raw.bestStreak)):0,updatedAt:typeof raw.updatedAt==='string'&&dates([raw.updatedAt]).length?raw.updatedAt:null};
}
export function streak(save,today=dayKey()){
 const set=new Set(save.days);let cursor=Date.parse(today+'T00:00:00Z')/86400000;
 if(!set.has(today))cursor-=1;
 let count=0;
 while(count<400&&set.has(new Date(cursor*86400000).toISOString().slice(0,10))){count++;cursor--}
 return count;
}
export function touch(save,day=dayKey()){
 const days=save.days.includes(day)?save.days:[...save.days,day].sort().slice(-400);
 const updated={...save,days,updatedAt:day};
 return {...updated,bestStreak:Math.max(save.bestStreak,streak(updated,day))};
}
export function recordLab(save,id,day=dayKey()){
 if(!specimens.some(s=>s.id===id))return save;
 return touch({...save,labs:save.labs.includes(id)?save.labs:[...save.labs,id]},day);
}
export function recordChapter(save,id,score,total=3,day=dayKey()){
 if(!chapters.some(c=>c.id===id)||!Number.isInteger(score)||score<0||score>total||total!==3||score<2)return save;
 return touch({...save,completed:save.completed.includes(id)?save.completed:[...save.completed,id],perfect:score===3&&!save.perfect.includes(id)?[...save.perfect,id]:save.perfect},day);
}
export function recordIncident(save,id,day=dayKey()){
 if(!incidents.some(c=>c.id===id))return save;
 return touch({...save,incidents:save.incidents.includes(id)?save.incidents:[...save.incidents,id]},day);
}
export const experience=save=>save.completed.length*140+save.perfect.length*40+save.labs.length*8+save.incidents.length*60;
export function clearance(save){const xp=experience(save);return xp>=2200?'FIELD DIRECTOR':xp>=1450?'THREAT HUNTER':xp>=700?'SECURITY ANALYST':xp>=240?'JUNIOR OPERATOR':'NEW RECRUIT'}
export const progress=save=>Math.round(100*save.completed.length/chapters.length);
export function dailyOrders(save,today=dayKey()){
 const active=save.updatedAt===today;
 return [
 {title:'Open the notebook',body:'Inspect a new specimen and explain its boundary.',done:active&&save.labs.length>0},
 {title:'Complete a case',body:'Pass an OWASP assessment with at least 2/3.',done:active&&save.completed.length>0},
 {title:'Read an adversary',body:'Solve one TTP investigation exercise.',done:active&&save.incidents.length>0}
 ];
}
export const safeStorage={
 read(){try{return cleanSave(JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'))}catch{return emptySave()}},
 write(save){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(cleanSave(save)))}catch{/* private mode/full storage: app still works */}}
};
