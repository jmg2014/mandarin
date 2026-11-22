/* Sentences (句子): the basic sentence patterns, generated from slots.
   Each pattern: { slots:{ name:[values] }, build(v) → { parts:[[characters, pinyin]…], end:"。" or "？", en } or null (not allowed) }.
   Wrong answers are the same sentence with one slot changed (level 3) or one or two (level 1),
   so you have to catch the detail: 兩杯 or 三杯, 要 or 不要, 明天 or 後天. */
(function(){
"use strict";
const ZH = window.ZH, { pick, shuffle } = ZH;
const NUM_EN = { 1:"a", 2:"two", 3:"three" };
const cap = ZH.cap;

/* ---------- 1. 是: who you are ---------- */
const SHI = {
  slots:{
    s:[{ zh:"我", py:"wǒ", c:"I'm" }, { zh:"你", py:"nǐ", c:"you're", q:"Are you" }, { zh:"他", py:"tā", c:"he's", q:"Is he" },
       { zh:"我們", py:"wǒmen", c:"we're", pl:true }, { zh:"他們", py:"tāmen", c:"they're", q:"Are they", pl:true }],
    o:[{ zh:"台灣人", py:"Táiwān rén", en:"Taiwanese" }, { zh:"西班牙人", py:"Xībānyá rén", en:"Spanish" }, { zh:"美國人", py:"Měiguó rén", en:"American" },
       { zh:"日本人", py:"Rìběn rén", en:"Japanese" }, { zh:"英國人", py:"Yīngguó rén", en:"British" }, { zh:"法國人", py:"Fǎguó rén", en:"French" },
       { zh:"韓國人", py:"Hánguó rén", en:"Korean" }, { zh:"德國人", py:"Déguó rén", en:"German" },
       { zh:"老師", py:"lǎoshī", en:"a teacher", pl:"teachers" }, { zh:"學生", py:"xuéshēng", en:"a student", pl:"students" },
       { zh:"醫生", py:"yīshēng", en:"a doctor", pl:"doctors" }, { zh:"護士", py:"hùshì", en:"a nurse", pl:"nurses" }],
    m:["yes", "no", "q"]
  },
  build(v){
    const o = v.s.pl && v.o.pl ? v.o.pl : v.o.en;
    if (v.m === "q"){
      if (!v.s.q) return null;
      return { parts:[[v.s.zh, v.s.py], ["是", "shì"], [v.o.zh, v.o.py], ["嗎", "ma"]], end:"？", en:`${v.s.q} ${o}?` };
    }
    return { parts:[[v.s.zh, v.s.py], v.m === "no" ? ["不是", "bú shì"] : ["是", "shì"], [v.o.zh, v.o.py]], end:"。",
      en:`${cap(v.s.c)} ${v.m === "no" ? "not " : ""}${o}.` };
  }
};

/* ---------- 2. 要: ordering ---------- */
const YAO = {
  slots:{
    s:[{ zh:"我", py:"wǒ", yes:"I'd like", no:"I don't want" }, { zh:"他", py:"tā", yes:"He wants", no:"He doesn't want" },
       { zh:"我們", py:"wǒmen", yes:"We'd like", no:"We don't want" }],
    i:[{ zh:"咖啡", py:"kāfēi", mw:["杯", "bēi"], one:"coffee", many:"coffees", mass:"coffee" },
       { zh:"紅茶", py:"hóngchá", mw:["杯", "bēi"], one:"black tea", many:"black teas", mass:"black tea" },
       { zh:"珍珠奶茶", py:"zhēnzhū nǎichá", mw:["杯", "bēi"], one:"bubble tea", many:"bubble teas", mass:"bubble tea" },
       { zh:"果汁", py:"guǒzhī", mw:["杯", "bēi"], one:"juice", many:"juices", mass:"juice" },
       { zh:"水", py:"shuǐ", mw:["杯", "bēi"], one:"glass of water", many:"glasses of water", mass:"water" },
       { zh:"漢堡", py:"hànbǎo", mw:["個", "ge"], one:"burger", many:"burgers", mass:"a burger" },
       { zh:"包子", py:"bāozi", mw:["個", "ge"], one:"steamed bun", many:"steamed buns", mass:"steamed buns" },
       { zh:"飯", py:"fàn", mw:["碗", "wǎn"], one:"bowl of rice", many:"bowls of rice", mass:"rice" },
       { zh:"麵", py:"miàn", mw:["碗", "wǎn"], one:"bowl of noodles", many:"bowls of noodles", mass:"noodles" },
       { zh:"湯", py:"tāng", mw:["碗", "wǎn"], one:"bowl of soup", many:"bowls of soup", mass:"soup" }],
    n:[1, 2, 3],
    m:["yes", "yes", "no", "q"]
  },
  build(v){
    if (v.m === "q") return v.n !== 1 || v.s.zh !== "我" ? null :
      { parts:[["你", "nǐ"], ["要", "yào"], [v.i.zh, v.i.py], ["嗎", "ma"]], end:"？", en:`Would you like ${v.i.mass}?` };
    if (v.m === "no") return v.n !== 1 ? null : { parts:[[v.s.zh, v.s.py], ["不要", "bú yào"], [v.i.zh, v.i.py]], end:"。", en:`${v.s.no} ${v.i.mass}.` };
    const q = ZH.qty(v.n, v.i.mw[1]);
    return { parts:[[v.s.zh, v.s.py], ["要", "yào"], [q.zh + v.i.mw[0], q.py + " " + v.i.mw[1]], [v.i.zh, v.i.py]], end:"。",
      en:`${v.s.yes} ${NUM_EN[v.n]} ${v.n === 1 ? v.i.one : v.i.many}.` };
  }
};

/* ---------- 3. 喜歡: likes ---------- */
const LIKE = {
  slots:{
    s:[{ zh:"我", py:"wǒ", en:"I", v:"like", neg:"don't like" }, { zh:"他", py:"tā", en:"He", v:"likes", neg:"doesn't like" },
       { zh:"我媽媽", py:"wǒ māma", en:"My mum", v:"likes", neg:"doesn't like" }, { zh:"我朋友", py:"wǒ péngyǒu", en:"My friend", v:"likes", neg:"doesn't like" },
       { zh:"我們", py:"wǒmen", en:"We", v:"like", neg:"don't like" }],
    o:[["游泳", "yóuyǒng", "swimming"], ["唱歌", "chànggē", "singing"], ["跳舞", "tiàowǔ", "dancing"], ["看書", "kàn shū", "reading"],
       ["看電影", "kàn diànyǐng", "watching films"], ["聽音樂", "tīng yīnyuè", "listening to music"], ["運動", "yùndòng", "doing sport"],
       ["買東西", "mǎi dōngxi", "shopping"], ["喝咖啡", "hē kāfēi", "drinking coffee"], ["吃辣", "chī là", "spicy food"], ["台灣", "Táiwān", "Taiwan"],
       ["夏天", "xiàtiān", "summer"], ["冬天", "dōngtiān", "winter"], ["貓", "māo", "cats"], ["狗", "gǒu", "dogs"]],
    m:["yes", "very", "no", "q"]
  },
  build(v){
    const [oz, op, oe] = v.o;
    if (v.m === "q") return v.s.zh !== "我" ? null : { parts:[["你", "nǐ"], ["喜歡", "xǐhuān"], [oz, op], ["嗎", "ma"]], end:"？", en:`Do you like ${oe}?` };
    const verb = { yes:["喜歡", "xǐhuān"], very:["很喜歡", "hěn xǐhuān"], no:["不喜歡", "bù xǐhuān"] }[v.m];
    const en = v.m === "no" ? `${v.s.en} ${v.s.neg} ${oe}.` : `${v.s.en} ${v.m === "very" ? "really " : ""}${v.s.v} ${oe}.`;
    return { parts:[[v.s.zh, v.s.py], verb, [oz, op]], end:"。", en };
  }
};

/* ---------- 4. 有 / 沒有: having ---------- */
const YOU = {
  slots:{
    s:[{ zh:"我", py:"wǒ", yes:"I have", no:"I don't have" }, { zh:"他", py:"tā", yes:"He has", no:"He doesn't have" },
       { zh:"我們", py:"wǒmen", yes:"We have", no:"We don't have" }, { zh:"我朋友", py:"wǒ péngyǒu", yes:"My friend has", no:"My friend doesn't have" }],
    o:[{ zh:"哥哥", py:"gēge", mw:["個", "ge"], one:"an older brother", many:"older brothers", none:"any older brothers" },
       { zh:"妹妹", py:"mèimei", mw:["個", "ge"], one:"a younger sister", many:"younger sisters", none:"any younger sisters" },
       { zh:"小孩", py:"xiǎohái", mw:["個", "ge"], one:"a child", many:"children", none:"any children" },
       { zh:"貓", py:"māo", mw:["隻", "zhī"], one:"a cat", many:"cats", none:"a cat" },
       { zh:"狗", py:"gǒu", mw:["隻", "zhī"], one:"a dog", many:"dogs", none:"a dog" },
       { zh:"車", py:"chē", mw:["台", "tái"], one:"a car", many:"cars", none:"a car" },
       { zh:"電腦", py:"diànnǎo", mw:["台", "tái"], one:"a computer", many:"computers", none:"a computer" },
       { zh:"手機", py:"shǒujī", mw:["支", "zhī"], one:"a mobile phone", many:"mobile phones", none:"a mobile phone" }],
    n:[1, 2, 3],
    m:["yes", "yes", "no", "q"]
  },
  build(v){
    if (v.m === "q") return v.n !== 1 || v.s.zh !== "我" ? null :
      { parts:[["你", "nǐ"], ["有", "yǒu"], [v.o.zh, v.o.py], ["嗎", "ma"]], end:"？", en:`Do you have ${v.o.none}?` };
    if (v.m === "no") return v.n !== 1 ? null : { parts:[[v.s.zh, v.s.py], ["沒有", "méiyǒu"], [v.o.zh, v.o.py]], end:"。", en:`${v.s.no} ${v.o.none}.` };
    const q = ZH.qty(v.n, v.o.mw[1]);
    return { parts:[[v.s.zh, v.s.py], ["有", "yǒu"], [q.zh + v.o.mw[0], q.py + " " + v.o.mw[1]], [v.o.zh, v.o.py]], end:"。",
      en:`${v.s.yes} ${v.n === 1 ? v.o.one : NUM_EN[v.n] + " " + v.o.many}.` };
  }
};

/* ---------- 5. 在: where someone or something is ---------- */
const ZAI_WHO = {
  slots:{
    s:[{ zh:"我", py:"wǒ", c:"I'm" }, { zh:"他", py:"tā", c:"He's", q:"Is he" }, { zh:"媽媽", py:"māma", c:"Mum is", q:"Is Mum" },
       { zh:"老師", py:"lǎoshī", c:"The teacher is", q:"Is the teacher" }, { zh:"你", py:"nǐ", c:"You're", q:"Are you" }],
    p:[["家", "jiā", "at home"], ["學校", "xuéxiào", "at school"], ["公司", "gōngsī", "at the office"], ["銀行", "yínháng", "at the bank"],
       ["醫院", "yīyuàn", "at the hospital"], ["夜市", "yèshì", "at the night market"], ["超市", "chāoshì", "at the supermarket"],
       ["捷運站", "jiéyùn zhàn", "at the MRT station"], ["台北", "Táiběi", "in Taipei"], ["日本", "Rìběn", "in Japan"]],
    m:["yes", "yes", "no", "q"]
  },
  build(v){
    const [pz, pp, pe] = v.p;
    if (v.m === "q") return !v.s.q ? null : { parts:[[v.s.zh, v.s.py], ["在", "zài"], [pz, pp], ["嗎", "ma"]], end:"？", en:`${v.s.q} ${pe}?` };
    return { parts:[[v.s.zh, v.s.py], v.m === "no" ? ["不在", "bú zài"] : ["在", "zài"], [pz, pp]], end:"。", en:`${cap(v.s.c)} ${v.m === "no" ? "not " : ""}${pe}.` };
  }
};
const ZAI_WHERE = {
  slots:{
    p:[["車站", "chēzhàn", "The station"], ["洗手間", "xǐshǒujiān", "The toilet"], ["銀行", "yínháng", "The bank"], ["捷運站", "jiéyùn zhàn", "The MRT station"],
       ["便利商店", "biànlì shāngdiàn", "The convenience store"], ["餐廳", "cāntīng", "The restaurant"]],
    d:[["前面", "qiánmiàn", "up ahead"], ["後面", "hòumiàn", "at the back"], ["左邊", "zuǒbiān", "on the left"], ["右邊", "yòubiān", "on the right"],
       ["對面", "duìmiàn", "across the road"], ["旁邊", "pángbiān", "next door"], ["樓上", "lóushàng", "upstairs"], ["樓下", "lóuxià", "downstairs"]]
  },
  build(v){
    if (["樓上", "樓下"].includes(v.d[0]) && ["車站", "捷運站", "銀行", "便利商店"].includes(v.p[0])) return null;
    if (v.d[0] === "對面" && v.p[0] === "洗手間") return null;
    return { parts:[[v.p[0], v.p[1]], ["在", "zài"], [v.d[0], v.d[1]]], end:"。", en:`${v.p[2]} is ${v.d[2]}.` };
  }
};

/* ---------- 6. time + going somewhere ---------- */
const QU = {
  slots:{
    s:[{ zh:"我", py:"wǒ", c:"I'm" }, { zh:"他", py:"tā", c:"He's" }, { zh:"我們", py:"wǒmen", c:"We're" }, { zh:"我爸爸", py:"wǒ bàba", c:"My dad's" }],
    t:[["今天", "jīntiān", "today"], ["明天", "míngtiān", "tomorrow"], ["後天", "hòutiān", "the day after tomorrow"], ["星期六", "xīngqíliù", "on Saturday"],
       ["晚上", "wǎnshàng", "this evening"], ["下午", "xiàwǔ", "this afternoon"], ["下個月", "xià ge yuè", "next month"]],
    p:[{ zh:"台北", py:"Táiběi", en:"Taipei", city:true, hsr:true }, { zh:"台中", py:"Táizhōng", en:"Taichung", city:true, hsr:true },
       { zh:"高雄", py:"Gāoxióng", en:"Kaohsiung", city:true, hsr:true }, { zh:"台南", py:"Táinán", en:"Tainan", city:true, hsr:true },
       { zh:"花蓮", py:"Huālián", en:"Hualien", city:true }, { zh:"日本", py:"Rìběn", en:"Japan", abroad:true },
       { zh:"夜市", py:"yèshì", en:"the night market" }, { zh:"公園", py:"gōngyuán", en:"the park" }, { zh:"超市", py:"chāoshì", en:"the supermarket" }],
    h:[null, null, ["坐高鐵", "zuò gāotiě", "by high-speed rail"], ["坐火車", "zuò huǒchē", "by train"], ["坐公車", "zuò gōngchē", "by bus"], ["坐客運", "zuò kèyùn", "by coach"],
       ["坐飛機", "zuò fēijī", "by plane"], ["騎機車", "qí jīchē", "by scooter"], ["開車", "kāichē", "by car"]]
  },
  build(v){
    const h = v.h, p = v.p;
    if (h){   // only ways of travelling that make sense for the place
      if (h[0] === "坐高鐵" && !p.hsr) return null;
      if (h[0] === "坐飛機" && !(p.abroad || p.zh === "花蓮")) return null;
      if (h[0] === "坐火車" && !p.city) return null;
      if (p.abroad && h[0] !== "坐飛機") return null;
      if (["坐公車", "騎機車"].includes(h[0]) && p.city) return null;      // between cities you take a coach (客運), not a city bus
      if (h[0] === "坐客運" && !p.city) return null;
    }
    if (v.t[0] === "下個月" && !p.city && !p.abroad) return null;       // nobody plans the supermarket a month ahead
    if (p.abroad && ["晚上", "下午", "今天"].includes(v.t[0])) return null;
    const parts = [[v.s.zh, v.s.py], [v.t[0], v.t[1]]].concat(h ? [[h[0], h[1]]] : [], [["去", "qù"], [p.zh, p.py]]);
    return { parts, end:"。", en:`${v.s.c} going to ${p.en}${h ? " " + h[2] : ""} ${v.t[2]}.` };
  }
};

/* ---------- making questions from a pattern ---------- */
function randomV(P){ const v = {}; for (const k in P.slots) v[k] = pick(P.slots[k]); return v; }
function sentence(P, v){
  const s = P.build(v); if (!s) return null;
  const zh = s.parts.map(p => p[0]).join("") + s.end;
  const py = cap(s.parts.map(p => p[1]).join(" ")) + (s.end === "？" ? "?" : ".");
  return Object.assign(s, { zh, py });
}
function makeFrom(patterns, level, opts){
  const P = pick(patterns);
  let v, s;
  for (let g = 0; g < 200 && !s; g++){ v = randomV(P); s = sentence(P, v); }
  const reveal = ZH.line(s.zh, s.py, s.en);
  if (level === 2){
    // one decoy card: a word from the same sentence with one slot changed (三杯 for 兩杯, 不要 for 要…)
    const items = s.parts.map(p => p[0] + "|" + p[1]), decoys = new Set();
    const keys2 = Object.keys(P.slots).filter(k => P.slots[k].length > 1);
    for (let g = 0; g < 100 && !decoys.size; g++){
      const k = pick(keys2), v2 = Object.assign({}, v, { [k]:pick(P.slots[k].filter(x => x !== v[k])) }), s2 = sentence(P, v2);
      if (s2) s2.parts.map(p => p[0] + "|" + p[1]).filter(c => !items.includes(c) && !items.some(i => i.split("|")[1] === c.split("|")[1])).forEach(c => decoys.add(c));
    }
    return { say:s.zh, rate:.8, input:"order", text:"Put the words in the order you hear them", items, extra:[...decoys].slice(0, 1),
      reveal, solution:`${s.zh} ${s.py}`, key:"o" + s.zh, wait:true };
  }
  // wrong answers: the same sentence with one slot changed (level 1: sometimes two)
  const wrong = new Set(), keys = Object.keys(P.slots).filter(k => P.slots[k].length > 1);
  for (let g = 0; g < 400 && wrong.size < 3; g++){
    const v2 = Object.assign({}, v), n = level === 1 && Math.random() < .5 ? 2 : 1;
    for (const k of ZH.sample(keys, Math.min(n, keys.length))) v2[k] = pick(P.slots[k].filter(x => x !== v[k]));
    const s2 = sentence(P, v2);
    if (s2 && s2.en !== s.en && s2.zh !== s.zh) wrong.add(s2.en);
  }
  return { say:s.zh, rate:level === 1 ? .7 : .95, text:"What does it mean?", choices:shuffle([s.en, ...[...wrong].slice(0, 3)]), answer:s.en, long:true,
    reveal, solution:`${s.zh} ${s.py}`, key:"m" + level + s.zh, wait:level === 3 };
}
ZH._patterns = { SHI, YAO, LIKE, YOU, ZAI_WHO, ZAI_WHERE, QU, sentence, randomV };

const LEVELS = [
  { name:"Meaning", desc:"Hear a sentence, choose its meaning (slowly)" },
  { name:"Word order", desc:"Put the words in the order you hear them" },
  { name:"Details", desc:"Normal speed; the options differ in one small detail" }
];
const skill = (id, name, emoji, desc, rule, patterns) => ({ id, name, emoji, desc, rule, levels:LEVELS, patterns, make:level => makeFrom(patterns, level) });

ZH.TOPICS.push({ id:"sentences", title:"Sentences", emoji:"🧩", skills:[
  skill("se-shi", "是 Who you are", "🪪", "我是西班牙人, 他不是老師, 你是學生嗎?",
    `<ul><li><b>是</b> shì = am / is / are: 我是學生 = I'm a student</li><li><b>不是</b> bú shì = am not / isn't</li>
     <li><b>嗎</b> ma at the end makes a yes/no question: 你是老師嗎？ = Are you a teacher?</li>
     <li>Nationality = country + <b>人</b> rén (person): 西班牙人 Spanish, 台灣人 Taiwanese</li>
     <li>他 (he) and 她 (she) both sound <b>tā</b>, so the app says “he”.</li></ul>`, [SHI]),
  skill("se-yao", "要 Ordering", "🛎️", "我要兩杯咖啡, 我不要湯, 你要水嗎?",
    `<ul><li><b>要</b> yào = want / would like: 我要咖啡</li><li><b>不要</b> bú yào = don't want</li>
     <li>Number + measure word + thing: <b>兩杯</b>咖啡 two cups of coffee, <b>一碗</b>麵 a bowl of noodles, <b>三個</b>包子 three buns</li></ul>`, [YAO]),
  skill("se-like", "喜歡 Likes", "❤️", "我喜歡游泳, 他很喜歡貓, 我媽媽不喜歡吃辣.",
    `<ul><li><b>喜歡</b> xǐhuān = like · <b>很喜歡</b> = really like · <b>不喜歡</b> = don't like</li>
     <li>The thing you like comes after: 我喜歡<b>台灣</b>, 我喜歡<b>唱歌</b> (singing)</li></ul>`, [LIKE]),
  skill("se-you", "有 Having", "🎒", "我有兩個哥哥, 他沒有車, 你有貓嗎?",
    `<ul><li><b>有</b> yǒu = have · <b>沒有</b> méiyǒu = don't have (never 不有)</li>
     <li>Measure words: 個 people, 隻 zhī animals, 台 tái cars and machines (🇹🇼 Taiwan says 一台車), 支 zhī phones</li></ul>`, [YOU]),
  skill("se-zai", "在 Where", "📍", "他在家, 媽媽不在銀行, 車站在左邊.",
    `<ul><li><b>在</b> zài = to be at / in: 我在家 = I'm at home · <b>不在</b> = not there</li>
     <li>Directions: 前面 ahead · 後面 behind · 左邊 left · 右邊 right · 對面 across the road · 旁邊 next door · 樓上 upstairs · 樓下 downstairs</li></ul>`, [ZAI_WHO, ZAI_WHERE]),
  skill("se-plans", "Plans: when & where", "🗓️", "我明天去台北, 他星期六坐高鐵去台中.",
    `<p>The order is always <b>who + when + how + 去 + where</b>:</p>
     <p>我 · 明天 · 坐高鐵 · 去 · 台中 = I'm going to Taichung by high-speed rail tomorrow.</p>
     <p>The time comes <i>before</i> the verb, not at the end like in English or Spanish.</p>`, [QU])
]});
})();
