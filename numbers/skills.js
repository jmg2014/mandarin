/* Numbers (數字): digits, 11–99, hundreds and thousands, prices, times, days and dates, how many.
   All generated: shared/zh.js turns a number into characters and pinyin, so these never run out. */
(function(){
"use strict";
const ZH = window.ZH, { pick, shuffle, sample, rnd } = ZH;

const RATE = { 1:.7, 2:.8, 3:.95 };
/* n distinct numbers close to x (the ones that sound alike first: 14 / 40, 15 / 50 …) */
function nearNumbers(x, lo, hi){
  const s = String(x), out = new Set();
  if (s.length === 2 && s[1] !== "0" && s[0] !== s[1]) out.add(+(s[1] + s[0]));
  if (x % 10 === 0 && x >= 20 && x < 100) out.add(x / 10 + 10);           // 40 ↔ 14
  if (x > 10 && x < 20) out.add((x - 10) * 10);                            // 14 ↔ 40
  [x + 10, x - 10, x + 1, x - 1, x + 2, x * 10, Math.floor(x / 10), x + 100, x - 100].forEach(v => out.add(v));
  return [...out].filter(v => v !== x && v >= lo && v <= hi && Number.isInteger(v));
}
function numChoices(x, lo, hi){
  const near = shuffle(nearNumbers(x, lo, hi));
  while (near.length < 3){ const v = rnd(lo, hi); if (v !== x && !near.includes(v)) near.push(v); }
  return shuffle([x, ...near.slice(0, 3)]).map(String);
}
const say = (zh, py, en, rate) => ({ say:zh, rate, reveal:ZH.line(zh, py, en) });

/* ---------- 0–10 and digits ---------- */
const small = {
  id:"nu-small", name:"0–10", emoji:"0️⃣",
  desc:"零 to 十, then digits one by one, like a phone number.",
  rule:`<p>零 líng 0 · 一 yī 1 · 二 èr 2 · 三 sān 3 · 四 sì 4 · 五 wǔ 5 · 六 liù 6 · 七 qī 7 · 八 bā 8 · 九 jiǔ 9 · 十 shí 10</p>
    <p>Careful: <b>四 sì</b> (4) and <b>十 shí</b> (10) sound alike: 4 is short and falling, 10 rises. <b>一 yī</b> 1 and <b>七 qī</b> 7 rhyme.</p>
    <p>🇹🇼 In Taiwan phone numbers start with 09 and 1 is said <b>yī</b>.</p>`,
  levels:[
    { name:"Choose", desc:"Hear a number 0–10, choose it" },
    { name:"Type", desc:"Type the number on the keypad" },
    { name:"Phone numbers", desc:"Type a Taiwan mobile number" }
  ],
  make(level){
    if (level === 3){
      const d = "09" + String(rnd(10, 99)) + String(rnd(100, 999)) + String(rnd(100, 999));
      const z = ZH.digits(d), shown = `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
      const q = say(`我的電話是${z.zh}。`, `Wǒ de diànhuà shì ${z.py}.`, `My phone number is ${shown}.`, .8);
      return Object.assign(q, { input:"num", text:"Type the phone number (10 digits)", answer:d, solution:shown, key:"ph" + d, wait:true });
    }
    const n = rnd(0, 10), x = ZH.num(n);
    const q = say(x.zh, x.py, String(n), RATE[level]);
    if (level === 1) return Object.assign(q, { text:"Which number?", choices:ZH.choicesFrom(String(n), ["4","10","1","7","0","2","3","5","6","8","9"].concat(n === 4 ? ["10"] : n === 10 ? ["4"] : []), 4), answer:String(n), big:true, key:"s1" + n });
    return Object.assign(q, { input:"num", text:"Type the number", answer:String(n), key:"s2" + n });
  }
};

/* ---------- 11–99 ---------- */
const tens = {
  id:"nu-99", name:"11–99", emoji:"🔟",
  desc:"Tens and units: 十二 is 12, 二十 is 20.",
  rule:`<p>Just like counting with words: <b>十二</b> shí'èr = ten-two = 12, <b>二十</b> èrshí = two-ten = 20,
    <b>二十五</b> èrshíwǔ = two-ten-five = 25.</p><p>Listen for where <b>十</b> comes: at the start (十四 = 14) or in the middle (四十 = 40).</p>`,
  levels:[
    { name:"Choose", desc:"Choose from 4 numbers" },
    { name:"Type", desc:"Type the number" },
    { name:"Faster", desc:"Type it, at normal speed" }
  ],
  make(level){
    const n = Math.random() < .3 ? pick([14, 40, 15, 50, 16, 60, 17, 70, 18, 80, 19, 90, 11, 12, 13, 20, 30]) : rnd(11, 99), x = ZH.num(n);
    const q = say(x.zh, x.py, String(n), RATE[level]);
    if (level === 1) return Object.assign(q, { text:"Which number?", choices:numChoices(n, 10, 99), answer:String(n), big:true, key:"t1" + n });
    return Object.assign(q, { input:"num", text:"Type the number", answer:String(n), key:"t" + level + n });
  }
};

/* ---------- 100–9999 ---------- */
const big = {
  id:"nu-big", name:"Hundreds & thousands", emoji:"💯",
  desc:"百 bǎi hundred, 千 qiān thousand, and 零 for a gap.",
  rule:`<ul><li><b>百</b> bǎi = hundred: 三百 = 300, 三百五十 = 350</li><li><b>千</b> qiān = thousand: 一千兩百 = 1200</li>
    <li>Before 百 and 千, 2 is <b>兩</b> liǎng: 兩百 = 200, 兩千 = 2000</li>
    <li><b>零</b> líng fills a gap: 一百零五 = 105, 兩千零三十 = 2030</li></ul>`,
  levels:[
    { name:"Hundreds", desc:"Choose a number like 300 or 350" },
    { name:"100–999", desc:"Type a number from 100 to 999" },
    { name:"1000–9999", desc:"Type a number in the thousands" }
  ],
  make(level){
    let n;
    if (level === 1) n = rnd(1, 9) * 100 + (Math.random() < .5 ? rnd(1, 9) * 10 : 0);
    else if (level === 2) n = Math.random() < .3 ? rnd(1, 9) * 100 + rnd(1, 9) : rnd(100, 999);
    else n = Math.random() < .3 ? rnd(1, 9) * 1000 + rnd(1, 99) : Math.random() < .5 ? rnd(10, 99) * 100 : rnd(1000, 9999);
    const x = ZH.num(n), q = say(x.zh, x.py, String(n), RATE[level]);
    if (level === 1){
      const near = [n + 100, n - 100, n + 10, n - 10, Math.floor(n / 100) * 100 + (n % 100 ? 0 : 50), n + 200].filter(v => v >= 100 && v <= 999 && v !== n);
      return Object.assign(q, { text:"Which number?", choices:shuffle([String(n), ...sample([...new Set(near)], 3).map(String)]), answer:String(n), big:true, key:"b1" + n });
    }
    return Object.assign(q, { input:"num", text:"Type the number", answer:String(n), key:"b" + level + n });
  }
};

/* ---------- prices ---------- */
const ITEMS = [["這個","zhège","this one"], ["咖啡","kāfēi","the coffee"], ["奶茶","nǎichá","the milk tea"], ["便當","biàndāng","the bento"],
  ["這件衣服","zhè jiàn yīfú","this piece of clothing"], ["這本書","zhè běn shū","this book"], ["蘋果","píngguǒ","the apples"], ["票","piào","the ticket"]];
const price = {
  id:"nu-price", name:"Prices", emoji:"💰",
  desc:"多少錢？ How much? Hear prices in Taiwan dollars.",
  rule:`<ul><li><b>多少錢？</b> duōshǎo qián? = How much is it?</li><li><b>塊</b> kuài = dollar (NT$) when speaking. On signs and receipts you'll see <b>元</b> yuán.</li>
    <li><b>一共</b> yígòng = in total</li><li>2 dollars is <b>兩塊</b> liǎng kuài, 200 is <b>兩百塊</b>.</li></ul>`,
  levels:[
    { name:"Choose", desc:"Choose the price (up to NT$100)" },
    { name:"Type", desc:"Type the price (up to NT$500)" },
    { name:"At the till", desc:"A short exchange, up to NT$2000" }
  ],
  make(level){
    if (level === 3){
      const n = Math.random() < .5 ? rnd(5, 99) * 10 : rnd(100, 2000), p = ZH.price(n, Math.random() < .2 ? "元" : "塊");
      const total = Math.random() < .5;
      const lines = total
        ? [{ t:"請問，多少錢？", py:"Qǐngwèn, duōshǎo qián?", en:"Excuse me, how much is it?", who:"A" }, { t:`一共${p.zh}。`, py:`Yígòng ${p.py}.`, en:`${n} dollars in total.`, who:"B" }]
        : (it => [{ t:`${it[0]}多少錢？`, py:`${ZH.cap(it[1])} duōshǎo qián?`, en:`How much is ${it[2]}?`, who:"A" }, { t:`${p.zh}。`, py:`${ZH.cap(p.py)}.`, en:`${n} dollars.`, who:"B" }])(pick(ITEMS));
      return { say:lines, bubbles:true, rate:.95, input:"num", text:"How much? Type the price.", answer:String(n), solution:`${p.zh} NT$${n}`, key:"p3" + n, wait:true };
    }
    const n = level === 1 ? (Math.random() < .5 ? rnd(1, 10) * 10 : rnd(1, 100)) : (Math.random() < .5 ? rnd(2, 50) * 10 : rnd(10, 500));
    const p = ZH.price(n), it = pick(ITEMS);
    const q = say(`${it[0]}${p.zh}。`, `${ZH.cap(it[1])} ${p.py}.`, `${ZH.cap(it[2])} is ${n} dollars.`, RATE[level]);
    if (level === 1) return Object.assign(q, { text:"How much?", choices:numChoices(n, 1, 100).map(v => "NT$" + v), answer:"NT$" + n, big:true, key:"p1" + n });
    return Object.assign(q, { input:"num", text:"How much? Type the price.", answer:String(n), key:"p2" + n });
  }
};

/* ---------- time ---------- */
function timeLabel(h, m, period){ const t = `${h}:${String(m).padStart(2, "0")}`; return period ? t + (period === "morning" || period === "forenoon" ? " am" : " pm") : t; }
const time = {
  id:"nu-time", name:"What time is it?", emoji:"🕒",
  desc:"幾點？ Hours, half past, minutes, morning and evening.",
  rule:`<ul><li><b>點</b> diǎn = o'clock: 三點 = 3:00. 2:00 is <b>兩點</b> liǎng diǎn.</li><li><b>半</b> bàn = half past: 三點半 = 3:30</li>
    <li><b>分</b> fēn = minutes: 三點十五分 = 3:15, 三點零五分 = 3:05</li>
    <li><b>早上</b> zǎoshàng early morning · <b>上午</b> shàngwǔ late morning · <b>中午</b> zhōngwǔ noon · <b>下午</b> xiàwǔ afternoon · <b>晚上</b> wǎnshàng evening. They come <i>before</i> the time.</li></ul>`,
  levels:[
    { name:"O'clock", desc:"Whole hours" },
    { name:"Half & quarter", desc:":00, :15, :30, :45" },
    { name:"Any time", desc:"Minutes, morning, afternoon, evening" }
  ],
  make(level){
    const h = rnd(1, 12);
    let m = 0, period = null;
    if (level === 2) m = pick([0, 15, 30, 30, 45]);
    if (level === 3){ m = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 2, 8]); period = h === 12 ? "noon" : h <= 5 ? "afternoon" : pick([h <= 8 ? "morning" : "forenoon", "evening"]); }
    const t = ZH.time(h, m, true, period);
    const zh = `現在${t.zh}。`, py = `Xiànzài ${t.py}.`, right = timeLabel(h, m, period);
    // wrong times that sound alike: the hour and minutes swapped, 4 / 10, one hour off, another period
    const cands = new Set();
    const add = (hh, mm, pp) => { if (hh >= 1 && hh <= 12 && mm >= 0 && mm < 60) cands.add(timeLabel(hh, mm, pp)); };
    add(h === 4 ? 10 : h === 10 ? 4 : h + 1, m, period); add(h - 1, m, period); add(h + 2, m, period);
    if (level > 1){ add(h, m === 30 ? 0 : 30, period); add(h, (m + 15) % 60, period); }
    if (level === 3){ add(Math.floor(m / 5) || 1, h * 5 % 60, period); if (h >= 6 && h <= 11) add(h, m, period === "evening" ? (h <= 8 ? "morning" : "forenoon") : "evening"); add(h, m === 50 ? 15 : m + 10, period); }
    cands.delete(right);
    const q = say(zh, py, `It's ${right} now.`, RATE[level]);
    return Object.assign(q, { text:"What time is it?", choices:shuffle([right, ...sample([...cands], 3)]), answer:right, key:"tm" + level + right });
  }
};

/* ---------- days and dates ---------- */
const days = {
  id:"nu-days", name:"Days & dates", emoji:"📅",
  desc:"星期一 Monday … 星期天 Sunday, then months and dates.",
  rule:`<ul><li>Days are numbered: <b>星期一</b> xīngqíyī (week-1) = Monday … <b>星期六</b> = Saturday, <b>星期天</b> = Sunday.</li>
    <li>🇹🇼 In Taiwan you'll also hear <b>禮拜</b> lǐbài: 禮拜一 = Monday.</li>
    <li>Months are numbered too: <b>五月</b> wǔ yuè = May. A date: <b>五月十號</b> wǔ yuè shí hào = May 10 (month first).</li>
    <li><b>今天</b> today · <b>明天</b> tomorrow · <b>昨天</b> yesterday</li></ul>`,
  levels:[
    { name:"Days", desc:"Which day of the week?" },
    { name:"星期 or 禮拜", desc:"Today, tomorrow, yesterday, both ways of saying it" },
    { name:"Dates", desc:"Month and day" }
  ],
  make(level){
    if (level === 3){
      const LEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const mo = rnd(1, 12), d = rnd(1, LEN[mo - 1]), x = ZH.date(mo, d);
      const cands = new Set();
      if (d <= 12 && d !== mo) cands.add(ZH.date(d, mo).en);     // month and day swapped: 五月十號 / 十月五號
      [[mo, d + 1], [mo, d - 1], [mo + 1, d], [mo - 1, d], [mo, d + 10], [mo, d - 10], [mo === 4 ? 10 : 4, d]].forEach(([a, b]) => { if (a >= 1 && a <= 12 && b >= 1 && b <= LEN[a - 1]) cands.add(ZH.date(a, b).en); });
      cands.delete(x.en);
      while (cands.size < 3){ const a = rnd(1, 12), b = rnd(1, 28); if (ZH.date(a, b).en !== x.en) cands.add(ZH.date(a, b).en); }
      const q = say(`今天${x.zh}。`, `Jīntiān ${x.py}.`, `Today is ${x.en}.`, .9);
      return Object.assign(q, { text:"What's the date?", choices:shuffle([x.en, ...sample([...cands], 3)]), answer:x.en, key:"d3" + x.en });
    }
    const i = rnd(0, 6), w = ZH.weekday(i, level === 2 && Math.random() < .5);
    const when = level === 2 ? pick([["今天", "Jīntiān", "Today"], ["明天", "Míngtiān", "Tomorrow"], ["昨天", "Zuótiān", "Yesterday"]]) : ["今天", "Jīntiān", "Today"];
    const verb = when[0] === "昨天" ? "是" : "", vpy = verb ? " shì" : "";
    const q = say(`${when[0]}${verb}${w.zh}。`, `${when[1]}${vpy} ${w.py}.`, `${when[2]} ${when[0] === "昨天" ? "was" : "is"} ${w.en}.`, RATE[level]);
    const near = [i - 1, i + 1, i + 2, i - 2, i === 3 ? 6 : 3].map(k => (k + 7) % 7).filter(k => k !== i);
    const choices = shuffle([w.en, ...sample([...new Set(near)], 3).map(k => ZH.weekday(k).en)]);
    if (level === 1) return Object.assign(q, { text:"Which day?", choices, answer:w.en, key:"d1" + i });
    const ans = `${when[2]}: ${w.en}`;
    const other = pick([["Today", "今天"], ["Tomorrow", "明天"], ["Yesterday", "昨天"]].filter(x => x[0] !== when[2]))[0];
    const ch = shuffle([ans, `${when[2]}: ${ZH.weekday(near[0]).en}`, `${other}: ${w.en}`, `${other}: ${ZH.weekday(near[1]).en}`]);
    return Object.assign(q, { text:"What did you hear?", choices:[...new Set(ch)], answer:ans, long:true, key:"d2" + when[0] + i });
  }
};

/* ---------- how many: measure words and age ---------- */
const THINGS = [
  ["杯", "bēi", "咖啡", "kāfēi", "coffee", "coffees"], ["杯", "bēi", "茶", "chá", "tea", "teas"], ["個", "ge", "人", "rén", "person", "people"],
  ["個", "ge", "包子", "bāozi", "steamed bun", "steamed buns"], ["張", "zhāng", "票", "piào", "ticket", "tickets"], ["本", "běn", "書", "shū", "book", "books"],
  ["碗", "wǎn", "飯", "fàn", "bowl of rice", "bowls of rice"], ["隻", "zhī", "貓", "māo", "cat", "cats"], ["瓶", "píng", "水", "shuǐ", "bottle of water", "bottles of water"]
];
const howMany = {
  id:"nu-qty", name:"How many?", emoji:"🧮",
  desc:"Numbers with measure words (三杯咖啡) and ages (三十歲).",
  rule:`<p>Between a number and a thing there is always a <b>measure word</b>:</p>
    <ul><li><b>個</b> ge for people and most things: 三個人 = 3 people</li><li><b>杯</b> bēi cup: 兩杯咖啡 = 2 coffees</li>
    <li><b>張</b> zhāng flat things (tickets), <b>本</b> běn books, <b>碗</b> wǎn bowls, <b>隻</b> zhī animals, <b>瓶</b> píng bottles</li></ul>
    <p>2 is <b>兩</b> liǎng here: 兩個人. Age: <b>我三十歲</b> = I'm 30 (歲 suì = years old).</p>`,
  levels:[
    { name:"Choose", desc:"How many? 1–5" },
    { name:"Type", desc:"How many? 1–10" },
    { name:"Age", desc:"How old? Type the age" }
  ],
  make(level){
    if (level === 3){
      // each person with a believable age
      const who = pick([["我", "Wǒ", "I'm", 18, 70], ["我媽媽", "Wǒ māma", "My mum is", 35, 75], ["他", "Tā", "He's", 16, 80],
        ["我爺爺", "Wǒ yéye", "My grandpa is", 62, 95], ["老師", "Lǎoshī", "The teacher is", 25, 65]]);
      const n = rnd(who[3], who[4]), x = ZH.num(n);
      const q = say(`${who[0]}今年${x.zh}歲。`, `${who[1]} jīnnián ${x.py} suì.`, `${who[2]} ${n} this year.`, .9);
      return Object.assign(q, { input:"num", text:"How old? Type the age.", answer:String(n), key:"a" + who[0] + n });
    }
    const n = level === 1 ? rnd(1, 5) : rnd(1, 10), t = pick(THINGS), k = ZH.qty(n, t[1]);
    // people and cats: only "we have" (請給我三個人 "give me 3 people" makes no sense)
    const verb = t[2] === "人" || t[2] === "貓" ? ["我們有", "Wǒmen yǒu", "We have"] : pick([["我要", "Wǒ yào", "I'd like"], ["我們有", "Wǒmen yǒu", "We have"], ["請給我", "Qǐng gěi wǒ", "Please give me"]]);
    const mw = t[1] === "ge" ? " ge" : " " + t[1];
    const q = say(`${verb[0]}${k.zh}${t[0]}${t[2]}。`, `${verb[1]} ${k.py}${mw} ${t[3]}.`, `${verb[2]} ${n} ${n === 1 ? t[4] : t[5]}.`, RATE[level]);
    if (level === 1) return Object.assign(q, { text:"How many?", choices:ZH.choicesFrom(String(n), ["1","2","3","4","5"], 4).sort(), answer:String(n), big:true, key:"q1" + n + t[2] });
    return Object.assign(q, { input:"num", text:"How many? Type the number.", answer:String(n), key:"q2" + n + t[2] });
  }
};

ZH.TOPICS.push({ id:"numbers", title:"Numbers", emoji:"🔢", skills:[small, tens, big, price, time, days, howMany] });
})();
