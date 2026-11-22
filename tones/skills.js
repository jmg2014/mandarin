/* Tones (聲調): the four tones on one syllable, tone pairs in real words, and sounds that are easy to mix up.
   Only characters with one common reading are used, so the device's voice can't pick the wrong one. */
(function(){
"use strict";
const ZH = window.ZH, { pick, shuffle, sample, rnd, esc } = ZH;

const TONE_NAME = { 1:"1 ˉ high", 2:"2 ˊ rising", 3:"3 ˇ low", 4:"4 ˋ falling" };
const TONE_RULE = `<ul>
  <li><b>1st ˉ</b> high and flat, like singing one note: <b>mā</b> 媽 mum</li>
  <li><b>2nd ˊ</b> rising, like asking “what?”: <b>má</b> 麻 numb</li>
  <li><b>3rd ˇ</b> low. Alone it dips and rises; in a sentence it often just stays low: <b>mǎ</b> 馬 horse</li>
  <li><b>4th ˋ</b> falling fast, like a firm “No!”: <b>mà</b> 罵 to scold</li></ul>
  <p>Same sound, different tone = a different word. Listen to the <i>shape</i> of the voice, not the sound.</p>`;

/* syllable families: the same sound in each tone. [character, pinyin, meaning] per tone (null = no common word) */
const FAMILIES = [
  [["媽","mā","mum"], ["麻","má","numb"], ["馬","mǎ","horse"], ["罵","mà","to scold"]],
  [["八","bā","eight"], ["拔","bá","to pull out"], ["靶","bǎ","target"], ["爸","bà","dad"]],
  [["衣","yī","clothes"], ["姨","yí","aunt"], ["椅","yǐ","chair"], ["億","yì","100 million"]],
  [["屋","wū","house"], ["無","wú","none"], ["五","wǔ","five"], ["霧","wù","fog"]],
  [["湯","tāng","soup"], ["糖","táng","sugar"], ["躺","tǎng","to lie down"], ["燙","tàng","very hot"]],
  [["詩","shī","poem"], ["十","shí","ten"], ["史","shǐ","history"], ["是","shì","to be"]],
  [["七","qī","seven"], ["騎","qí","to ride"], ["起","qǐ","to rise"], ["氣","qì","air"]],
  [["豬","zhū","pig"], ["竹","zhú","bamboo"], ["主","zhǔ","main"], ["住","zhù","to live"]],
  [["天","tiān","sky"], ["甜","tián","sweet"], ["舔","tiǎn","to lick"], null],
  [["煙","yān","smoke"], ["鹽","yán","salt"], ["眼","yǎn","eye"], ["驗","yàn","to test"]],
  [null, ["魚","yú","fish"], ["雨","yǔ","rain"], ["玉","yù","jade"]],
  [["花","huā","flower"], ["滑","huá","slippery"], null, ["話","huà","words"]],
  [["飛","fēi","to fly"], ["肥","féi","fat"], null, ["費","fèi","fee"]],
  [["方","fāng","square"], ["房","fáng","house"], ["紡","fǎng","to spin"], ["放","fàng","to put"]]
];
const SYLS = FAMILIES.flatMap(f => f.map((x, i) => x && { zh:x[0], py:x[1], en:x[2], tone:i + 1, fam:f })).filter(Boolean);
const synReveal = s => ZH.line(s.zh, s.py, s.en);

const four = {
  id:"to-four", name:"The 4 tones", emoji:"🎵",
  desc:"Hear one syllable and say which tone it has.",
  rule:TONE_RULE,
  levels:[
    { name:"Two tones", desc:"Choose between 2 tones, slowly" },
    { name:"Four tones", desc:"Choose from all 4 tones" },
    { name:"Two syllables", desc:"Hear 2 syllables: which tones?" }
  ],
  make(level){
    if (level === 3){
      const a = pick(SYLS), b = pick(SYLS.filter(s => s.fam !== a.fam));
      const right = `${a.tone} + ${b.tone}`;
      const wrong = shuffle([1, 2, 3, 4].flatMap(x => [1, 2, 3, 4].map(y => `${x} + ${y}`)).filter(x => x !== right))
        .sort((x, y) => near(y, right) - near(x, right)).slice(0, 6);
      return { say:[{ t:a.zh }, { t:b.zh }], rate:.75, text:"Which tones did you hear?", choices:shuffle([right, ...sample(wrong, 3)]), answer:right,
        reveal:synReveal(a) + synReveal(b), solution:`${a.zh}${b.zh} ${a.py} ${b.py}`, key:"t3" + a.zh + b.zh };
    }
    const s = pick(SYLS);
    let tones = [1, 2, 3, 4];
    if (level === 1) tones = shuffle([s.tone, pick(tones.filter(t => t !== s.tone))]).sort();
    return { say:s.zh, rate:level === 1 ? .6 : .8, text:"Which tone?", choices:tones.map(t => TONE_NAME[t]), answer:TONE_NAME[s.tone],
      reveal:synReveal(s), solution:`${s.zh} ${s.py} (tone ${s.tone})`, key:"t" + level + s.zh };
  }
};
/* how many tones two answers like "2 + 4" share (to make wrong options that are close) */
function near(a, b){ const x = a.split(" + "), y = b.split(" + "); return (x[0] === y[0]) + (x[1] === y[1]); }

/* ---------- tone pairs in real words ---------- */
/* [word, pinyin, meaning]. Tones as written; 3 + 3 is said 2 + 3. */
const WORDS = [
  ["咖啡","kāfēi","coffee"], ["飛機","fēijī","plane"], ["今天","jīntiān","today"], ["公司","gōngsī","company"], ["醫生","yīshēng","doctor"],
  ["中國","Zhōngguó","China"], ["歡迎","huānyíng","welcome"], ["星期","xīngqí","week"], ["今年","jīnnián","this year"], ["公園","gōngyuán","park"],
  ["身體","shēntǐ","body"], ["開始","kāishǐ","to start"], ["喝水","hē shuǐ","to drink water"], ["鉛筆","qiānbǐ","pencil"],
  ["生日","shēngrì","birthday"], ["音樂","yīnyuè","music"], ["商店","shāngdiàn","shop"], ["工作","gōngzuò","work"], ["車站","chēzhàn","station"],
  ["明天","míngtiān","tomorrow"], ["台灣","Táiwān","Taiwan"], ["房間","fángjiān","room"], ["昨天","zuótiān","yesterday"], ["時間","shíjiān","time"],
  ["銀行","yínháng","bank"], ["同學","tóngxué","classmate"], ["學習","xuéxí","to study"], ["回來","huílái","to come back"],
  ["牛奶","niúnǎi","milk"], ["蘋果","píngguǒ","apple"], ["游泳","yóuyǒng","to swim"], ["沒有","méiyǒu","not have"],
  ["學校","xuéxiào","school"], ["牛肉","niúròu","beef"], ["白色","báisè","white"], ["頭痛","tóutòng","headache"],
  ["每天","měitiān","every day"], ["老師","lǎoshī","teacher"], ["手機","shǒujī","mobile phone"], ["喜歡","xǐhuān","to like"],
  ["美國","Měiguó","USA"], ["小時","xiǎoshí","hour"], ["起床","qǐchuáng","to get up"], ["女兒","nǚ'ér","daughter"],
  ["你好","nǐ hǎo","hello"], ["水果","shuǐguǒ","fruit"], ["可以","kěyǐ","can"], ["洗澡","xǐzǎo","to shower"],
  ["考試","kǎoshì","exam"], ["好看","hǎokàn","good-looking"], ["晚上","wǎnshàng","evening"], ["請問","qǐngwèn","excuse me, may I ask"],
  ["麵包","miànbāo","bread"], ["汽車","qìchē","car"], ["上班","shàngbān","to go to work"], ["唱歌","chànggē","to sing"],
  ["大學","dàxué","university"], ["問題","wèntí","question"], ["練習","liànxí","to practise"], ["外國","wàiguó","foreign country"],
  ["電腦","diànnǎo","computer"], ["下雨","xiàyǔ","to rain"], ["跳舞","tiàowǔ","to dance"], ["字典","zìdiǎn","dictionary"],
  ["再見","zàijiàn","goodbye"], ["電視","diànshì","TV"], ["上課","shàngkè","to have class"], ["睡覺","shuìjiào","to sleep"]
].map(w => {
  const join = w[1].includes(" ") ? " " : w[1].includes("'") ? "'" : "";
  const parts = join ? w[1].split(join) : splitTwo(w[1]);
  return { zh:w[0], py:w[1], en:w[2], parts, join, tones:parts.map(ZH.toneOf) };
});
function splitTwo(py){ return ZH.splitTwo(py); }
ZH._toneWords = WORDS;
const pairName = t => `${t[0]} + ${t[1]}`;
/* a 3 + 3 word sounds like 2 + 3, so "2 + 3" is never offered as a wrong answer for it */
const soundsLike = w => w.tones[0] === 3 && w.tones[1] === 3 ? "2 + 3" : null;
const ALL_PAIRS = [1, 2, 3, 4].flatMap(x => [1, 2, 3, 4].map(y => [x, y]));

const pairs = {
  id:"to-pairs", name:"Tone pairs", emoji:"🎶",
  desc:"Most words have two syllables. Hear a word and find its two tones.",
  rule:`<p>Each syllable keeps its tone inside a word: <b>kāfēi</b> 咖啡 is 1 + 1, <b>Táiwān</b> 台灣 is 2 + 1.</p>
    <p><b>Two 3rd tones together:</b> the first one becomes a 2nd tone. <b>nǐ hǎo</b> 你好 is written 3 + 3 but sounds like <i>ní hǎo</i>.
    In this app 3 + 3 words count as “3 + 3”.</p>`,
  levels:[
    { name:"Two choices", desc:"Which of 2 tone pairs?" },
    { name:"Four choices", desc:"Which of 4 tone pairs?" },
    { name:"Pinyin", desc:"Choose the right pinyin spelling" }
  ],
  make(level){
    const w = pick(WORDS);
    const reveal = ZH.line(w.zh, w.py, w.en);
    if (level === 3){
      // the same letters with other tones (the closest ones first: one tone changed)
      const variants = new Set([w.py]);
      const spell = t => ZH.setTone(w.parts[0], t[0]) + w.join + ZH.setTone(w.parts[1], t[1]);
      const others = shuffle(ALL_PAIRS.filter(t => pairName(t) !== pairName(w.tones) && pairName(t) !== soundsLike(w))).sort((x, y) => near(pairName(y), pairName(w.tones)) - near(pairName(x), pairName(w.tones)));
      for (const t of others.slice(0, 6).concat(others.slice(6))){ if (variants.size >= 4) break; if (Math.random() < .7) variants.add(spell(t)); }
      for (const t of others){ if (variants.size >= 4) break; variants.add(spell(t)); }
      return { say:w.zh, rate:.85, text:"Which spelling did you hear?", choices:shuffle([...variants]), answer:w.py,
        reveal, solution:`${w.zh} ${w.py}`, key:"p3" + w.zh };
    }
    const right = pairName(w.tones), n = level === 1 ? 2 : 4;
    const others = shuffle(ALL_PAIRS.map(pairName).filter(x => x !== right && x !== soundsLike(w))).sort((x, y) => near(y, right) - near(x, right));
    const choices = shuffle([right, ...(level === 1 ? sample(others.slice(6), 1) : sample(others.slice(0, 7), n - 1))]);
    return { say:w.zh, rate:level === 1 ? .65 : .8, text:"Which tones?", choices, answer:right,
      reveal, solution:`${w.zh} ${w.py} (${right})`, key:"p" + level + w.zh };
  }
};

/* ---------- sounds that are easy to mix up ---------- */
/* groups of syllables that differ only in one sound. [character, pinyin, meaning] */
const GROUPS = [
  { name:"j / q / x", items:[["雞","jī","chicken"], ["七","qī","seven"], ["西","xī","west"]] },
  { name:"zh / ch / sh", items:[["知","zhī","to know"], ["吃","chī","to eat"], ["詩","shī","poem"]] },
  { name:"z / c / s", items:[["字","zì","character"], ["次","cì","time (once)"], ["四","sì","four"]] },
  { name:"zh / j / z", items:[["豬","zhū","pig"], ["居","jū","to reside"], ["租","zū","to rent"]] },
  { name:"sh / x / s", items:[["書","shū","book"], ["需","xū","to need"], ["蘇","sū","(a surname)"]] },
  { name:"ch / q / c", items:[["出","chū","to go out"], ["區","qū","district"], ["粗","cū","thick"]] },
  { name:"u / ü", items:[["路","lù","road"], ["綠","lǜ","green"]] },
  { name:"u / ü", items:[["努","nǔ","effort"], ["女","nǚ","woman"]] },
  { name:"wu / yu", items:[["無","wú","none"], ["魚","yú","fish"]] },
  { name:"an / ang", items:[["山","shān","mountain"], ["商","shāng","business"]] },
  { name:"an / ang", items:[["飯","fàn","meal"], ["放","fàng","to put"]] },
  { name:"r / l", items:[["入","rù","to enter"], ["路","lù","road"]] },
  { name:"b / p", items:[["包","bāo","bag"], ["拋","pāo","to throw"]] },
  { name:"d / t", items:[["大","dà","big"], ["踏","tà","to step"]] },
  { name:"g / k", items:[["哥","gē","older brother"], ["科","kē","subject"]] }
];
const ALL_SOUNDS = GROUPS.flatMap(g => g.items.map(i => ({ zh:i[0], py:i[1], en:i[2], g })));
const sounds = {
  id:"to-sounds", name:"Similar sounds", emoji:"👂",
  desc:"Sounds that are new for Spanish and English ears: j q x, zh ch sh, z c s, ü…",
  rule:`<ul><li><b>j q x</b>: tongue flat behind the bottom teeth, lips smiling. <b>q</b> = “ch” with a puff of air, <b>x</b> = a soft “sh”.</li>
    <li><b>zh ch sh</b>: tongue curled back. <b>z c s</b>: tongue at the teeth; <b>c</b> sounds like “ts” in “cats”.</li>
    <li><b>ü</b>: say “ee” and round your lips. After j q x y it is written u: <b>qù</b> 去.</li>
    <li>🇹🇼 In Taiwan many people say zh ch sh softly, close to z c s. You'll hear both.</li></ul>`,
  levels:[
    { name:"Two choices", desc:"Choose between 2 sounds, slowly" },
    { name:"Whole group", desc:"Choose from the whole group" },
    { name:"Mixed", desc:"Sounds from different groups, normal speed" }
  ],
  make(level){
    const g = pick(GROUPS), s = pick(g.items);
    const me = { zh:s[0], py:s[1], en:s[2] };
    let choices;
    if (level === 1) choices = shuffle([s[1], pick(g.items.filter(x => x !== s))[1]]);
    else if (level === 2) choices = shuffle(g.items.map(x => x[1]).concat(g.items.length < 3 ? [(pick(ALL_SOUNDS.filter(x => x.g !== g && ZH.toneOf(x.py) === ZH.toneOf(s[1]))) || pick(ALL_SOUNDS.filter(x => x.g !== g))).py] : []));
    else choices = ZH.choicesFrom(s[1], g.items.map(x => x[1]).concat(sample(ALL_SOUNDS, 6).map(x => x.py)), 4);
    choices = [...new Set(choices)];
    return { say:s[0], rate:level === 1 ? .6 : level === 2 ? .75 : .9, text:"Which one did you hear?", choices, answer:s[1],
      reveal:ZH.line(me.zh, me.py, me.en), solution:`${s[0]} ${s[1]}`, key:"s" + level + s[0] };
  }
};

ZH.TOPICS.push({ id:"tones", title:"Tones & sounds", emoji:"🎵", skills:[four, pairs, sounds] });
})();
