/* Question engine shared by every page: play screen, answer inputs, speech, results.
   Load after progress.js. Based on lengua's engine (~/git/lengua/shared/engine.js), which is based on the maths app's.

   A question is an object:
     say       what the device says (Taiwan Mandarin voice) when the question starts: a text, or a list of lines
               [{ t:"你好！", who:"A" }, { t:"你好！", who:"B" }] for a conversation (A and B sound different).
               🔊 plays it again, 🐢 plays it slowly.
     rate      speaking rate (default 0.85). Multiplied by the speed setting.
     bubbles   true: show one speech bubble per line (text hidden until answered), lit while it is spoken
     text      what is asked (HTML allowed)
     picture   optional HTML shown above the question
     input     how to answer:
       "choice"  2–4 big buttons. answer = the right choice text; choices = list of texts. big: true for emoji buttons
       "num"     a number keypad. answer = the digits as a string ("350")
       "order"   tap cards in the order you heard them. items = the cards in the RIGHT order ("我|wǒ": characters|pinyin);
                 extra = decoy cards that were NOT in the sentence (so the cards can't be ordered just by reading them)
     reveal    HTML shown after answering: the transcript (characters, pinyin, meaning). Use ZH.line().
     explain   HTML shown when the answer is wrong (default: "The answer is …")
     wait      true: always wait for "Next" after answering (time to read the transcript and listen again)
     solution  short text for the "to practise" list on the results screen (default: the right answer)
     key       optional: a short id, to avoid the same question twice in a round
     tag       optional: shown after the title in the top bar (the daily mix shows the skill)
*/
(function(){
"use strict";
const ZH = window.ZH = window.ZH || {};
const $ = ZH.$ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
ZH.esc = esc;

/* ---------- helpers ---------- */
ZH.shuffle = arr => { for (let i = arr.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
ZH.pick = arr => arr[Math.floor(Math.random() * arr.length)];
ZH.rnd = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
ZH.sample = (arr, n) => ZH.shuffle(arr.slice()).slice(0, n);
ZH.weightedPick = function(items, weights, n){
  const it = items.slice(), w = weights.slice(), out = [];
  while (out.length < n && it.length){
    const tot = w.reduce((s,x) => s + x, 0);
    let r = Math.random() * tot, i = 0;
    while (i < w.length - 1 && r >= w[i]){ r -= w[i]; i++; }
    out.push(it[i]); it.splice(i,1); w.splice(i,1);
  }
  return out;
};
/* n distinct choices: the answer plus wrong ones from a list (by a key function), shuffled */
ZH.choicesFrom = function(answer, pool, n, keyFn){
  keyFn = keyFn || (x => x);
  const others = ZH.shuffle(pool.filter(x => keyFn(x) !== keyFn(answer)));
  const out = [answer], seen = new Set([keyFn(answer)]);
  for (const o of others){ if (out.length >= n) break; if (!seen.has(keyFn(o))){ seen.add(keyFn(o)); out.push(o); } }
  return ZH.shuffle(out);
};
ZH.show = function(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
  window.scrollTo(0,0);
};
/* one line of Chinese for a transcript: characters, pinyin and meaning (follows the pinyin/characters settings) */
ZH.line = function(zh, py, en, who){
  const st = ZH.prog.settings;
  const face = who ? `<span class="who">${who === "B" ? "👨" : "👩"}</span>` : "";
  return `<div class="tline">${face}<div>${st.hanzi !== false ? `<span class="hz">${esc(zh)}</span>` : ""}` +
    `${st.pinyin !== false || st.hanzi === false ? `<span class="py">${esc(py)}</span>` : ""}` +
    `${en ? `<span class="en">${esc(en)}</span>` : ""}</div></div>`;
};

/* ---------- sound effects & confetti ---------- */
let actx = null;
function tone(freqs){
  if (!ZH.prog.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime;
    freqs.forEach((f,i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = t0 + i * .1;
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(.0001, t);
      g.gain.exponentialRampToValueAtTime(.18, t + .015);
      g.gain.exponentialRampToValueAtTime(.0001, t + .2);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .22);
    });
  } catch(e){}
}
const goodSound = () => tone([660, 880]);
const badSound  = () => tone([300, 220]);
const winSound  = () => tone([523, 659, 784, 1047]);
function confetti(){
  const box = document.createElement("div"); box.className = "confetti";
  const em = ["⭐","🎉","✨","🧧","🎊"];
  for (let i = 0; i < 40; i++){
    const s = document.createElement("span");
    s.textContent = em[i % em.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.animationDelay = Math.random() * .8 + "s";
    s.style.fontSize = (18 + Math.random() * 22) + "px";
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 3600);
}
ZH.sound = { good:goodSound, bad:badSound, win:winSound };
ZH.confetti = confetti;

/* ---------- speaking with the device's Taiwan Mandarin voice ----------
   Voices load a moment after the page, so they are looked up again when the browser says they changed.
   Taiwan (zh-TW) is preferred; any other Mandarin voice is a fallback (with a warning on the main page). */
let voices = { tw:[], other:[] };
const langOf = v => String(v.lang || "").replace("_", "-").toLowerCase();
const isTW = v => langOf(v) === "zh-tw" || langOf(v).startsWith("cmn-hant-tw") || /taiwan|臺灣|台灣/i.test(v.name);
const isCantonese = v => /^(zh-hk|yue)/.test(langOf(v)) || /cantonese|粵|香港/i.test(v.name);
function findVoices(){
  try {
    const vs = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const zh = vs.filter(v => /^(zh|cmn)/.test(langOf(v)) && !isCantonese(v));
    // voices on the device first (they work offline)
    const order = (a, b) => (b.localService ? 1 : 0) - (a.localService ? 1 : 0);
    voices = { tw:zh.filter(isTW).sort(order), other:zh.filter(v => !isTW(v)).sort(order) };
  } catch(e){ voices = { tw:[], other:[] }; }
}
if (window.speechSynthesis){ findVoices(); try { speechSynthesis.addEventListener("voiceschanged", findVoices); } catch(e){} }
ZH.voiceInfo = () => { if (!voices.tw.length && !voices.other.length) findVoices(); return voices; };
ZH.canSpeak = () => { const v = ZH.voiceInfo(); return !!(v.tw.length || v.other.length); };
const PITCH = { A:1.12, B:.78 };
let speakId = 0;
ZH.stopSpeaking = function(){ speakId++; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch(e){} };
/* lines: a text or [{t, who}]. o.rate, o.onLine(i) (−1 when finished). Lines are spoken one after another with a short pause. */
ZH.speak = function(lines, o){
  o = o || {};
  if (typeof lines === "string") lines = [{ t:lines }];
  ZH.stopSpeaking();
  const id = speakId, v = ZH.voiceInfo(), main = v.tw[0] || v.other[0] || null;
  const second = v.tw[1] || null;                    // a second Taiwan voice, if the device has one, for speaker B
  const rate = Math.max(.4, Math.min(1.6, (o.rate || .85) * (ZH.prog.settings.speed || 1)));
  const onLine = o.onLine || (() => {});
  if (!window.speechSynthesis){ onLine(-1); return false; }
  let i = 0;
  const next = () => {
    if (id !== speakId) return;
    if (i >= lines.length){ onLine(-1); return; }
    const L = lines[i], n = i++;
    let done = false;
    const finish = () => { if (done) return; done = true; clearTimeout(guard); if (id === speakId) setTimeout(next, 380); };
    // if the browser never says the line ended, carry on anyway (a rough upper bound for the line's length)
    const guard = setTimeout(finish, 2500 + L.t.length * 650 / rate);
    try {
      const u = new SpeechSynthesisUtterance(L.t);
      const voice = L.who === "B" && second ? second : main;
      if (voice){ u.voice = voice; u.lang = voice.lang; } else u.lang = "zh-TW";
      u.rate = rate;
      u.pitch = L.who === "B" && second ? 1 : (PITCH[L.who] || 1);
      u.onstart = () => { if (id === speakId) onLine(n); };
      u.onend = finish; u.onerror = finish;
      speechSynthesis.speak(u);
    } catch(e){ finish(); }
  };
  next();
  return true;
};

/* ---------- play & results screens (added to every page) ---------- */
document.body.insertAdjacentHTML("beforeend", `
<section id="play" class="screen">
  <div class="playtop">
    <button id="quitBtn" class="ghost">✕ Quit</button>
    <span id="playTitle"></span>
    <span id="progress"></span>
  </div>
  <div class="playbody">
    <div id="qtext" class="q"></div>
    <div id="audio" class="audio"></div>
    <div id="qpic" class="qpic"></div>
    <div id="answer" class="answer"></div>
    <div id="board" class="board"></div>
    <div id="feedback" class="feedback" aria-live="polite"></div>
    <div id="reveal" class="reveal"></div>
    <div id="cont"></div>
    <div class="choices" id="choices"></div>
    <div class="numpad" id="numpad">
      ${["1","2","3","4","5","6","7","8","9","del","0","ok"].map(k =>
        `<button data-n="${k}" class="n-${k}"${k === "del" ? ' aria-label="Delete"' : k === "ok" ? ' aria-label="Check"' : ""}>${k === "del" ? "⌫" : k === "ok" ? "Check ✓" : k}</button>`).join("")}
    </div>
  </div>
</section>
<section id="results" class="screen">
  <div class="res">
    <h1 id="resTitle"></h1>
    <div id="resScore" class="bigscore"></div>
    <p id="resMsg" style="font-size:1.2rem"></p>
    <div id="resList"></div>
    <div id="resButtons" class="btnrow"></div>
  </div>
</section>`);

ZH.showResults = function(o){
  $("#resTitle").textContent = o.title;
  $("#resScore").textContent = o.score;
  $("#resMsg").textContent = o.msg;
  const seen = new Set();
  const missed = o.missed.filter(r => { const k = keyOf(r.q); if (seen.has(k)) return false; seen.add(k); return true; });
  $("#resList").innerHTML = missed.length
    ? `<h3>To practise</h3><div class="chips">${missed.map(r =>
        `<span class="chip"><b>${esc(solutionOf(r.q))}</b><small>${r.givenText === null ? "no answer" : "you said: " + esc(r.givenText)}</small></span>`).join("")}</div>`
    : "";
  const box = $("#resButtons"); box.innerHTML = "";
  o.buttons.forEach(([label, fn, cls]) => {
    const b = document.createElement("button");
    b.textContent = label; b.className = "btn " + (cls || ""); b.onclick = fn;
    box.appendChild(b);
  });
  ZH.show("results");
  if (o.celebrate){ confetti(); winSound(); }
};

/* ---------- question engine ----------
   startSession(cfg) options:
     title, questions[], requeue + maxQ (wrong ones come back a few questions later),
     okDelay, onAnswer(q, ok, ms, given), onFinish(results) */
let S = null, sid = 0;
const inputOf = q => q.input || "choice";
const keyOf = q => q.key || (q.text || "") + "|" + JSON.stringify(q.say || "") + "|" + (q.items || []).join(" ");
const answersOf = q => Array.isArray(q.answer) ? q.answer : [q.answer];
const hz = item => String(item).split("|")[0];
function solutionOf(q){
  if (q.solution) return q.solution;
  if (inputOf(q) === "order") return q.items.map(hz).join("");
  return answersOf(q)[0];
}
ZH.solutionOf = solutionOf;
ZH.keyOf = keyOf;
function later(fn, ms){ const id = S && S.id; setTimeout(() => { if (S && S.id === id) fn(); }, ms); }
function stopSession(){ S = null; ZH.stopSpeaking(); }
function finishSession(){ const s = S; stopSession(); s.onFinish(s.results); }
function updateProgress(){ $("#progress").textContent = `${S.i + 1} / ${S.questions.length}`; }

function startSession(cfg){
  stopSession();
  S = Object.assign({ i:0, right:0, results:[], id:++sid, busy:true }, cfg);
  ZH.show("play");
  $("#playTitle").textContent = cfg.title;
  nextQuestion();
}

/* ---- audio: replay buttons and speech bubbles ---- */
const linesOf = q => !q.say ? [] : typeof q.say === "string" ? [{ t:q.say }] : q.say;
function play(q, slow){
  const bubbles = document.querySelectorAll("#audio .bubble");
  ZH.speak(linesOf(q), { rate:(q.rate || .85) * (slow ? .7 : 1), onLine:i => {
    bubbles.forEach((b, n) => b.classList.toggle("on", n === i));
  }});
}
function renderAudio(q){
  if (!q.say){ $("#audio").innerHTML = ""; return; }
  const lines = linesOf(q);
  $("#audio").innerHTML = `<div class="sayrow"><button class="sayBtn" data-say="1" aria-label="Listen again">🔊</button>` +
    `<button class="sayBtn slow" data-say="slow" aria-label="Listen slowly">🐢</button></div>` +
    (q.bubbles ? `<div class="bubbles">${lines.map(L => `<div class="bubble ${L.who === "B" ? "b" : "a"}"><span class="who">${L.who === "B" ? "👨" : "👩"}</span><span class="dots">• • •</span></div>`).join("")}</div>` : "") +
    (ZH.canSpeak() ? "" : `<p class="note">This device has no Mandarin voice. See “Voice” on the main page.</p>`);
}

/* ---- the answer area for each input ---- */
function renderNum(){
  $("#answer").innerHTML = `${esc(S.typed)}<span class="caret"></span>`;
}
function card(item, cls, attr){
  const [h, p] = String(item).split("|"), st = ZH.prog.settings;
  return `<button class="card ${cls || ""}" ${attr || ""}><span class="hz">${esc(h)}</span>${p && st.pinyin !== false ? `<span class="py">${esc(p)}</span>` : ""}</button>`;
}
function renderOrder(){
  $("#board").innerHTML =
    `<div class="built">${S.built.length ? S.built.map((p, n) => card(S.pool[p], "on", `data-b="${n}"`)).join("")
      : `<span class="muted hint">Tap the cards in the order you hear them${S.need < S.pool.length ? " (one card is extra)" : ""}</span>`}</div>
     <div class="pool">${S.pool.map((t, p) => S.built.includes(p) ? card(t, "ghostcard", "disabled") : card(t, "", `data-p="${p}"`)).join("")}</div>`;
  $("#choices").innerHTML = S.built.length === S.need ? `<button class="choice check" data-check>Check ✓</button>` : "";
}

function nextQuestion(){
  if (S.i >= S.questions.length){ finishSession(); return; }
  const q = S.questions[S.i], m = inputOf(q);
  $("#playTitle").textContent = q.tag ? `${S.title} · ${q.tag}` : S.title;
  updateProgress();
  renderAudio(q);
  $("#qtext").innerHTML = q.text || "";
  $("#qpic").innerHTML = q.picture || "";
  Object.assign(S, { typed:"", choice:undefined, built:[], pool:[] });
  const ans = $("#answer"), board = $("#board"), ch = $("#choices");
  ans.className = "answer"; ans.innerHTML = ""; board.innerHTML = ""; ch.innerHTML = "";
  ans.style.display = m === "num" ? "" : "none";
  board.style.display = m === "order" ? "" : "none";
  $("#numpad").style.display = m === "num" ? "" : "none";
  ch.className = "choices" + (q.big ? " big" : "") + (q.choices && q.choices.length > 3 && !q.long ? " grid2" : "");
  if (m === "choice")
    ch.innerHTML = q.choices.map((c,i) => `<button class="choice${q.long ? " long" : ""}" data-c="${i}">${esc(c)}</button>`).join("");
  if (m === "num") renderNum();
  if (m === "order"){
    // shuffle the cards, but never show them already in the right order
    const right = q.items.join("\u0001"), all = q.items.concat(q.extra || []);
    let pool = ZH.shuffle(all.slice());
    for (let t = 0; t < 20 && pool.slice(0, q.items.length).join("\u0001") === right && new Set(q.items).size > 1; t++) pool = ZH.shuffle(all.slice());
    S.pool = pool; S.need = q.items.length;
    renderOrder();
  }
  $("#feedback").innerHTML = ""; $("#feedback").className = "feedback";
  $("#reveal").innerHTML = "";
  $("#cont").innerHTML = "";
  S.busy = false;
  S.start = performance.now();
  if (q.say) later(() => play(q), 350);
}

function readGiven(q){
  const m = inputOf(q);
  if (m === "choice") return S.choice === undefined ? null : S.choice;
  if (m === "num") return S.typed === "" ? null : S.typed;
  if (m === "order") return S.built.length ? S.built.map(p => S.pool[p]) : null;
  return null;
}
function givenText(q, g){
  if (g === null) return null;
  if (inputOf(q) === "order") return g.map(hz).join("");
  return String(g);
}
function judge(q, g){
  if (g === null) return false;
  if (q.check) return !!q.check(g);
  if (inputOf(q) === "order") return g.join("\u0001") === q.items.join("\u0001");
  return answersOf(q).includes(g);
}

function submit(){
  if (!S || S.busy) return;
  S.busy = true;
  const q = S.questions[S.i], m = inputOf(q);
  const ms = performance.now() - S.start;
  const given = readGiven(q), ok = judge(q, given);
  if (S.onAnswer) S.onAnswer(q, ok, ms, given);
  // the TOCFL words in what was heard, for the TOCFL map
  try { if (ZH.TOCFL) ZH.prog.hear(ZH.tocflWords(linesOf(q).map(L => L.t).join("，") + (q.items ? "，" + q.items.map(hz).join("") : "")), ok); } catch(e){}
  if (ok) S.right++;
  S.results.push({ q, given, givenText:givenText(q, given), ok, ms });

  if (m === "choice"){
    document.querySelectorAll("#choices .choice").forEach(b => {
      const c = q.choices[+b.dataset.c];
      if (answersOf(q).includes(c) && (c === given || !ok)) b.classList.add("right");
      else if (c === given) b.classList.add("wrongpick");
      b.disabled = true;
    });
  }
  if (m === "num"){
    $("#answer").classList.add(ok ? "right" : "wrong");
    if (!ok) $("#answer").insertAdjacentHTML("beforeend", ` <span class="fix">→ ${esc(solutionOf(q))}</span>`);
  }
  if (m === "order"){
    document.querySelector("#board .built").classList.add(ok ? "right" : "wrong");
    document.querySelectorAll("#board button").forEach(b => { b.disabled = true; });
    $("#choices").innerHTML = "";
  }
  // the transcript: now the bubbles show their text
  document.querySelectorAll("#audio .bubble").forEach((b, n) => {
    const L = linesOf(q)[n]; if (L && L.py) b.querySelector(".dots").outerHTML = ZH.line(L.t, L.py, L.en);
  });

  const fb = $("#feedback");
  if (ok){
    fb.textContent = ZH.pick(["✓ Great!", "✓ Correct!", "✓ 很好！ Very good!", "✓ 對！ Right!", "✓ Perfect!"]);
    fb.className = "feedback good"; goodSound();
  } else {
    fb.innerHTML = `✗ ${q.explain || `The answer is <b>${esc(solutionOf(q))}</b>.`}`;
    fb.className = "feedback bad"; badSound();
  }
  if (q.reveal) $("#reveal").innerHTML = q.reveal;
  // a wrong answer comes back a few questions later
  if (!ok && S.requeue && S.questions.length < S.maxQ && !q.retry)
    S.questions.splice(Math.min(S.questions.length, S.i + 4), 0, Object.assign({}, q, { retry:true }));
  updateProgress();
  if (!ok || q.wait){   // time to read the transcript and listen again, then tap "Next"
    S.waiting = true;
    $("#cont").innerHTML = `<button class="btn primary" id="contBtn">Next ▶</button>`;
    return;
  }
  S.i++;
  later(nextQuestion, (S.okDelay || 1000) + (q.reveal ? 1400 : 0));
}
function proceed(){ S.waiting = false; ZH.stopSpeaking(); $("#cont").innerHTML = ""; S.i++; nextQuestion(); }

function typeNum(k){
  if (!S) return;
  if (S.waiting){ if (k === "ok") proceed(); return; }
  if (S.busy || inputOf(S.questions[S.i]) !== "num") return;
  if (k === "ok"){ if (S.typed !== "") submit(); return; }
  if (k === "del") S.typed = S.typed.slice(0, -1);
  else if (S.typed.length < 12) S.typed += k;
  renderNum();
}
function choose(i){
  if (!S || S.busy) return;
  const q = S.questions[S.i];
  if (inputOf(q) !== "choice" || i < 0 || i >= q.choices.length) return;
  S.choice = q.choices[i];
  submit();
}
ZH.startSession = startSession;
ZH.stopSession = stopSession;

/* ---------- wiring ---------- */
$("#numpad").addEventListener("pointerdown", e => {
  const b = e.target.closest("button[data-n]"); if (!b) return;
  e.preventDefault();
  b.classList.add("down"); setTimeout(() => b.classList.remove("down"), 120);
  typeNum(b.dataset.n);
});
$("#choices").addEventListener("click", e => {
  const b = e.target.closest("[data-c]"); if (b){ choose(+b.dataset.c); return; }
  if (e.target.closest("[data-check]") && S && !S.busy && readGiven(S.questions[S.i]) !== null) submit();
});
$("#board").addEventListener("click", e => {
  if (!S || S.busy || inputOf(S.questions[S.i]) !== "order") return;
  const p = e.target.closest("[data-p]"), b = e.target.closest("[data-b]");
  if (p && S.built.length < S.need){ S.built.push(+p.dataset.p); renderOrder(); }
  if (b){ S.built.splice(+b.dataset.b, 1); renderOrder(); }
});
$("#audio").addEventListener("click", e => {
  const b = e.target.closest("[data-say]"); if (b && S) play(S.questions[S.i], b.dataset.say === "slow");
});
$("#cont").addEventListener("click", e => { if (e.target.closest("#contBtn") && S && S.waiting) proceed(); });
document.addEventListener("keydown", e => {
  if (!$("#play").classList.contains("active") || !S || e.ctrlKey || e.metaKey || e.altKey) return;
  const q = S.questions[S.i];
  if (e.key === "r" || e.key === "R"){ if (q) play(q, e.key === "R"); return; }   // r: listen again, R: slowly
  if (S.waiting){ if (e.key === "Enter"){ e.preventDefault(); proceed(); } return; }
  if (S.busy) return;
  const m = inputOf(q);
  if (m === "choice" && /^[1-9]$/.test(e.key)){ choose(+e.key - 1); return; }
  if (m === "num"){
    if (/^[0-9]$/.test(e.key)) typeNum(e.key);
    else if (e.key === "Backspace"){ e.preventDefault(); typeNum("del"); }
    else if (e.key === "Enter"){ e.preventDefault(); typeNum("ok"); }
    return;
  }
  if (e.key === "Enter" && m === "order" && S.built.length === S.need){ e.preventDefault(); submit(); }
});
$("#quitBtn").addEventListener("click", () => { stopSession(); if (ZH.onQuit) ZH.onQuit(); });

/* ---------- offline support (works on https sites such as GitHub Pages) ---------- */
ZH.registerOffline = function(path){
  if ("serviceWorker" in navigator && window.isSecureContext){
    window.addEventListener("load", () => { navigator.serviceWorker.register(path).catch(() => {}); });
  }
};
})();
