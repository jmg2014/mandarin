/* Saved progress for the whole app (kept in this browser, on this device).
   Stored under "mandarin-tw-v1", a different key from the maths app ("y4-v1") and lengua ("lengua4-v1"),
   because the apps can live on the same address (github.io) and so share the same browser storage. */
(function(){
"use strict";
const ZH = window.ZH = window.ZH || {};
ZH.TOPICS = ZH.TOPICS || [];          // each topic's skills.js adds itself here
const KEY = "mandarin-tw-v1";

function read(k){ try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(e){ return null; } }
function write(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
function blank(){ return { skills:{}, sound:true, days:{}, daily:{ last:null, streak:0, best:0 }, settings:{ pinyin:true, hanzi:true, speed:1 } }; }
function load(obj){
  const d = Object.assign(blank(), obj || {});
  if (!d.skills || typeof d.skills !== "object") d.skills = {};
  if (!d.days) d.days = {};
  if (!d.daily) d.daily = blank().daily;
  d.settings = Object.assign(blank().settings, d.settings || {});
  return d;
}
let data = load(read(KEY));
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;   // local date
const today = () => dayKey(new Date());

const P = ZH.prog = {
  save(){ write(KEY, data); },
  get sound(){ return data.sound !== false; },
  set sound(v){ data.sound = !!v; P.save(); },
  /* pinyin: show pinyin in transcripts; hanzi: show characters; speed: multiplies every speaking rate (0.8–1.2) */
  get settings(){ return data.settings; },
  setSetting(k, v){ data.settings[k] = v; P.save(); },

  /* one record per skill: level unlocked (1–3), star when level 3 is passed, and answer history */
  skill(id){
    return data.skills[id] || (data.skills[id] = { level:1, star:false, seen:0, correct:0, streak:0, last:null, lastDate:null });
  },
  peek(id){ return data.skills[id] || null; },
  record(id, ok, ms){
    const s = P.skill(id);
    s.seen++; s.last = ok ? 1 : 0; s.lastDate = today();
    if (ok){ s.correct++; s.streak++; } else s.streak = 0;
    P.logDay(ok, ms);                                  // saves too
  },
  /* answers per day: { "2026-11-22": { n, ok, ms } } */
  logDay(ok, ms){
    const d = data.days[today()] || (data.days[today()] = { n:0, ok:0, ms:0 });
    d.n++; if (ok) d.ok++; d.ms += Math.min(ms || 0, 90000);     // cap: a question left open doesn't count as an hour
    const keys = Object.keys(data.days).sort();
    while (keys.length > 200) delete data.days[keys.shift()];
    P.save();
  },
  get days(){ return data.days; },

  /* Levels can also move on in the daily mix: 4 right in a row at a skill's current level unlocks the next level,
     and 6 right in a row at level 3 earns the ⭐. Returns a message when something is unlocked, otherwise null. */
  mixProgress(id, lv, ok, name){
    const s = P.skill(id);
    if (s.mixLv !== s.level){ s.mixLv = s.level; s.mixRun = 0; }
    if (lv !== s.level || s.star && s.level === 3) return null;
    s.mixRun = ok ? (s.mixRun || 0) + 1 : 0;
    let msg = null;
    if (s.level < 3 && s.mixRun >= 4){ s.level++; s.mixLv = s.level; s.mixRun = 0; msg = `🔓 ${name}: level ${s.level} unlocked!`; }
    else if (s.level === 3 && !s.star && s.mixRun >= 6){ s.star = true; s.mixRun = 0; msg = `⭐ ${name} mastered!`; }
    P.save();
    return msg;
  },
  /* the daily streak: days in a row with a finished daily session */
  get daily(){ return data.daily; },
  dailyDone(){
    const d = data.daily, t = today(), y = dayKey(new Date(Date.now() - 864e5));
    if (d.last === t) return false;
    d.streak = d.last === y ? d.streak + 1 : 1;
    d.best = Math.max(d.best || 0, d.streak); d.last = t;
    P.save();
    return true;
  },
  today,
  dayKey,
  topicStars(topic){ return topic.skills.filter(s => { const r = P.peek(s.id); return r && r.star; }).length; },

  /* one backup file for everything */
  backup(){ return { app:"mandarin-tw", version:1, savedAt:new Date().toISOString(), data }; },
  restore(obj){
    if (!obj || obj.app !== "mandarin-tw" || !obj.data || typeof obj.data.skills !== "object") throw new Error("not a backup");
    data = load(obj.data); P.save();
  },
  resetAll(){ data = blank(); P.save(); }
};
})();
