/* Mandarin helpers: numbers, prices, times and dates in characters + pinyin, tones, and the 一 tone change.
   Numbers follow Taiwan usage: 兩 before 百 / 千 / 萬 and before a measure word (兩百, 兩千, 兩塊, 兩個),
   but 二 when counting (二十, 十二, 二月, 二號); 零 for a missing place (一百零五). */
(function(){
"use strict";
const ZH = window.ZH = window.ZH || {};

const MARKS = { 1:"āēīōūǖ", 2:"áéíóúǘ", 3:"ǎěǐǒǔǚ", 4:"àèìòùǜ" };
/* the tone of one pinyin syllable: 1–4, or 0 for the neutral tone */
ZH.toneOf = function(syl){
  for (const t of [1, 2, 3, 4]) if ([...syl].some(c => MARKS[t].includes(c))) return t;
  return 0;
};
/* change the tone of one syllable: setTone("ma", 3) → "mǎ" (the mark goes on a/e, on o in "ou", otherwise on the last vowel) */
const PLAIN = "aeiouü";
ZH.plain = s => s.normalize("NFD").replace(/[\u0300\u0301\u0304\u030c]/g, "").normalize("NFC").replace(/v/g, "ü");   // tone marks only: ü keeps its dots
ZH.setTone = function(syl, t){
  const p = ZH.plain(syl);
  if (!t) return p;
  let i = p.search(/[ae]/);
  if (i < 0) i = p.indexOf("ou");
  if (i < 0){ for (let k = p.length - 1; k >= 0; k--) if (PLAIN.includes(p[k])){ i = k; break; } }
  if (i < 0) return p;
  return p.slice(0, i) + MARKS[t][PLAIN.indexOf(p[i])] + p.slice(i + 1);
};
ZH.cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
/* is this (toneless, lower-case) a pinyin syllable? */
const SYL = /^(zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?(iang|iong|uang|ang|eng|ing|ong|ian|iao|uai|uan|üan|ai|ei|ao|ou|an|en|in|un|ün|ia|ie|iu|ua|uo|ui|üe|ue|er|a|o|e|i|u|ü)$/;
ZH.isSyllable = s => SYL.test(ZH.plain(s).toLowerCase());
/* split a two-syllable pinyin word: both parts must be syllables with one tone mark each (xuéxiào → xué + xiào) */
ZH.splitTwo = function(py){
  const ok = [];
  for (let k = 1; k < py.length; k++){
    const a = py.slice(0, k), b = py.slice(k);
    if (ZH.isSyllable(a) && ZH.isSyllable(b)) ok.push([a, b]);
  }
  return ok.find(([a, b]) => ZH.toneOf(a) && ZH.toneOf(b) && !/^[aeoāáǎàēéěèōóǒò]/i.test(b)) || ok.find(([a, b]) => ZH.toneOf(a) && ZH.toneOf(b)) || ok[0] || [py, ""];
};

/* ---------- numbers ---------- */
const DZ = ["零","一","二","三","四","五","六","七","八","九"];
const DP = ["líng","yī","èr","sān","sì","wǔ","liù","qī","bā","jiǔ"];
const UNIT = { "十":"shí", "百":"bǎi", "千":"qiān", "萬":"wàn" };
function section(n, leading){
  const digits = [Math.floor(n / 1000) % 10, Math.floor(n / 100) % 10, Math.floor(n / 10) % 10, n % 10];
  const units = ["千", "百", "十", ""], out = [];
  let started = false, zero = false;
  digits.forEach((d, i) => {
    if (d === 0){ if (started) zero = true; return; }
    if (zero){ out.push(["零", "líng"]); zero = false; }
    if (i === 2 && d === 1 && !started && leading){ out.push(["十", "shí"]); started = true; return; }
    out.push(d === 2 && i < 2 ? ["兩", "liǎng"] : [DZ[d], DP[d]]);
    if (units[i]) out.push([units[i], UNIT[units[i]]]);
    started = true;
  });
  return out;
}
function tokens(n){
  if (n === 0) return [["零", "líng"]];
  if (n >= 10000){
    const w = Math.floor(n / 10000), rest = n % 10000;
    const t = (w === 2 ? [["兩", "liǎng"]] : section(w, true)).concat([["萬", "wàn"]]);
    if (rest) return t.concat(rest < 1000 ? [["零", "líng"]] : [], section(rest, false));
    return t;
  }
  return section(n, true);
}
/* join syllables into pinyin words: a space after 百 / 千 / 萬 / 零, an apostrophe before a, e, o inside a word */
function joinPy(toks){
  let s = "", word = false;
  toks.forEach(([z, p], i) => {
    const next = toks[i + 1];
    if (z === "一" && next && ["百", "千", "萬"].includes(next[0])) p = next[0] === "萬" ? "yí" : "yì";   // 一 changes tone before these
    if (word && /^[aeoāáǎàēéěèōóǒò]/.test(p)) s += "'";
    s += p; word = true;
    if (["百", "千", "萬", "零"].includes(z) && next){ s += " "; word = false; }
  });
  return s;
}
/* a number as you count it: 12 → 十二 shí'èr, 350 → 三百五十 sānbǎi wǔshí */
ZH.num = function(n){ const t = tokens(n); return { zh:t.map(x => x[0]).join(""), py:joinPy(t) }; };
/* a number before a measure word: 2 → 兩 liǎng, 1 → 一 yì/yí (yí before a 4th-tone or neutral syllable), else as counted */
ZH.qty = function(n, mwPy){
  if (n === 2) return { zh:"兩", py:"liǎng" };
  if (n === 1){ const t = ZH.toneOf(mwPy || "ge"); return { zh:"一", py:t === 4 || t === 0 ? "yí" : "yì" }; }
  return ZH.num(n);
};
/* digits one by one (phone numbers): 0912 → 零九一二 */
ZH.digits = function(str){
  const ds = String(str).split("").filter(c => /[0-9]/.test(c)).map(Number);
  return { zh:ds.map(d => DZ[d]).join(""), py:ds.map(d => DP[d]).join(" ") };
};

/* ---------- money ---------- */
/* 55 → 五十五塊 wǔshíwǔ kuài ; unit "元" for 元 yuán */
ZH.price = function(n, unit){
  const u = unit === "元" ? ["元", "yuán"] : ["塊", "kuài"], q = ZH.qty(n, u[1]);
  return { zh:q.zh + u[0], py:q.py + " " + u[1] };
};

/* ---------- time ---------- */
const PERIODS = { morning:["早上", "zǎoshàng", "in the morning"], forenoon:["上午", "shàngwǔ", "in the late morning"], noon:["中午", "zhōngwǔ", "at noon"], afternoon:["下午", "xiàwǔ", "in the afternoon"], evening:["晚上", "wǎnshàng", "in the evening"] };
ZH.PERIODS = PERIODS;
/* h 1–12, m 0–59. half: say 半 for :30. → { zh, py, en:"3:30" } */
ZH.time = function(h, m, half, period){
  const hh = h === 2 ? { zh:"兩", py:"liǎng" } : ZH.num(h);
  let zh = hh.zh + "點", py = hh.py + " diǎn";
  if (m === 30 && half){ zh += "半"; py += " bàn"; }
  else if (m > 0 && m < 10){ zh += "零" + DZ[m] + "分"; py += " líng " + DP[m] + " fēn"; }
  else if (m >= 10){ const x = ZH.num(m); zh += x.zh + "分"; py += " " + x.py + " fēn"; }
  if (period){ const P = PERIODS[period]; zh = P[0] + zh; py = P[1] + " " + py; }
  return { zh, py, en:`${h}:${String(m).padStart(2, "0")}` };
};

/* ---------- days and dates ---------- */
const WEEK = [["一", "yī", "Monday"], ["二", "èr", "Tuesday"], ["三", "sān", "Wednesday"], ["四", "sì", "Thursday"],
  ["五", "wǔ", "Friday"], ["六", "liù", "Saturday"], ["天", "tiān", "Sunday"]];
/* i 0–6 (Monday–Sunday). libai: say 禮拜 instead of 星期 (both are common in Taiwan) */
ZH.weekday = function(i, libai){
  const [z, p, en] = WEEK[i];
  return libai ? { zh:"禮拜" + z, py:"lǐbài" + p, en } : { zh:"星期" + z, py:"xīngqí" + p, en };
};
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
/* month 1–12, day 1–31 → 五月十號 wǔ yuè shí hào, "May 10" */
ZH.date = function(month, day){
  const m = ZH.num(month), d = ZH.num(day);
  return { zh:m.zh + "月" + d.zh + "號", py:m.py + " yuè " + d.py + " hào", en:MONTHS[month - 1] + " " + day };
};
ZH.MONTHS = MONTHS;
})();
