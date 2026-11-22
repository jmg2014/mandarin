/* A topic page: one tab per skill, a tip card, 3 levels per skill, a ⭐ for passing level 3.
   Each topic folder has a skills.js that adds a topic to ZH.TOPICS:
     { id, title, emoji, skills:[ { id, name, emoji, desc, rule, levels:[{name, desc} ×3], make(level) → question } ] }
   rule is a short HTML explanation, shown before playing.
   index.html calls ZH.openTopic(id). */
(function(){
"use strict";
const ZH = window.ZH, $ = ZH.$, P = ZH.prog;
const ROUND = 10, PASS = 8;
let T = null, cur = null;

function tabKey(){ return "mandarin-tw-tab-" + T.id; }
function remember(){ try { localStorage.setItem(tabKey(), cur.id); } catch(e){} }
function recall(){ try { return localStorage.getItem(tabKey()); } catch(e){ return null; } }

ZH.openTopic = function(id){
  T = ZH.TOPICS.find(t => t.id === id);
  document.title = T.title + " · 聽力";
  document.body.insertAdjacentHTML("afterbegin", `
<section id="topic" class="screen active">
  <div class="top"><h1>${T.emoji} ${T.title}</h1>
    <div class="topbtns"><button id="soundBtn" class="ghost" aria-label="Sound effects on or off"></button><a class="ghost" href="../">🏠 Home</a></div></div>
  <div class="tabs" id="tabs"></div>
  <div id="skillPanel" class="panel"></div>
</section>`);
  cur = T.skills.find(s => s.id === location.hash.slice(1)) || T.skills.find(s => s.id === recall()) || T.skills[0];
  ZH.onQuit = renderTopic;
  $("#tabs").addEventListener("click", e => {
    const b = e.target.closest("[data-s]"); if (!b) return;
    cur = T.skills.find(s => s.id === b.dataset.s); remember(); renderTopic();
  });
  $("#skillPanel").addEventListener("click", e => {
    const b = e.target.closest("[data-l]"); if (b && !b.disabled) start(cur, +b.dataset.l);
  });
  $("#soundBtn").addEventListener("click", () => { P.sound = !P.sound; renderTopic(); });
  renderTopic();
  ZH.registerOffline("../sw.js");
};

function renderTopic(){
  ZH.stopSession();
  $("#soundBtn").textContent = P.sound ? "🔔" : "🔕";
  $("#tabs").innerHTML = T.skills.map(s => {
    const r = P.peek(s.id);
    return `<button class="tab ${s === cur ? "on" : ""}" data-s="${s.id}">${s.emoji} ${s.name}${r && r.star ? " ⭐" : ""}</button>`;
  }).join("");
  const st = P.skill(cur.id);
  const acc = st.seen ? Math.round(st.correct / st.seen * 100) : 0;
  $("#skillPanel").innerHTML = `<h2>${cur.emoji} ${cur.name} ${st.star ? "⭐" : ""}</h2>
    <p class="muted">${cur.desc}</p>
    ${ZH.canSpeak() ? "" : `<p class="note">⚠️ This device has no Mandarin voice, so you won't hear anything. Install “Chinese (Taiwan)” in the device's text-to-speech settings.</p>`}
    ${cur.rule ? `<details class="rule" ${st.seen ? "" : "open"}><summary>📘 Tip</summary><div>${cur.rule}</div></details>` : ""}
    <div class="llist">${cur.levels.map((L, i) => {
      const n = i + 1, locked = n > st.level, done = n < st.level || (n === 3 && st.star);
      return `<button class="lbtn" data-l="${n}" ${locked ? "disabled" : ""}><b>${locked ? "🔒" : done ? "✅" : n + "."} ${L.name}</b><small>${L.desc}</small></button>`;
    }).join("")}</div>
    <p class="muted">${st.star ? "⭐ Mastered! Play level 3 now and then so you don't forget it."
                               : `Get ${PASS} out of ${ROUND} to unlock the next level. Pass level 3 to earn a ⭐.`}
       ${st.seen ? `<br>${st.seen} answers so far · ${acc}% right` : ""}</p>`;
  ZH.show("topic");
}

function makeRound(skill, lv){
  const qs = [], seen = new Set();
  for (let g = 0; qs.length < ROUND && g < 300; g++){
    const q = skill.make(lv), k = ZH.keyOf(q);
    if (seen.has(k) && g < 200) continue;          // avoid repeats when possible
    seen.add(k); qs.push(q);
  }
  return qs;
}
ZH.makeRound = makeRound;

function start(skill, lv){
  let questions;
  try { questions = makeRound(skill, lv); }
  catch(e){    // usually old and new files mixed up after an update: say so instead of doing nothing
    $("#skillPanel").insertAdjacentHTML("afterbegin",
      `<p class="feedback bad" style="margin-top:0">This page needs updating. Close the app completely and open it again with Wi-Fi.</p>`);
    return;
  }
  ZH.startSession({ title:`${skill.name} · Level ${lv}`, questions,
    requeue:true, maxQ:ROUND + 4,
    onAnswer:(q, ok, ms) => P.record(skill.id, ok, ms),
    onFinish:res => finish(skill, lv, res) });
}

function finish(skill, lv, res){
  const score = res.filter(r => !r.q.retry && r.ok).length;   // second tries don't count towards the score
  const pass = score >= PASS;
  const st = P.skill(skill.id);
  let title, msg, celebrate = false;
  if (pass){
    if (lv < 3){
      const fresh = st.level < lv + 1;
      if (fresh) st.level = lv + 1;
      title = "Level passed! 🎉"; msg = fresh ? `You can now play level ${lv + 1}.` : "Well done!";
    } else {
      const first = !st.star; st.star = true; celebrate = true;
      title = `${skill.name} mastered! ⭐`; msg = first ? "You've earned a star!" : "You keep your star. Great!";
    }
  } else {
    title = "Almost there!";
    msg = `You need ${PASS} or more to pass. Look at the ones below and try again.`;
  }
  P.save();
  const btns = [];
  if (pass && lv < 3) btns.push(["Next level ▶", () => start(skill, lv + 1), "primary"]);
  btns.push([pass ? "Play again" : "Try again", () => start(skill, lv), (pass && lv < 3) ? "" : "primary"]);
  btns.push([`Back to ${T.title}`, renderTopic, ""]);
  btns.push(["Home", () => { location.href = "../"; }, ""]);
  ZH.showResults({ title, score:`${score} / ${ROUND}`, msg, missed:res.filter(r => !r.ok), buttons:btns, celebrate });
}
})();
