/* Phrases (常用語): everyday expressions, and the questions people will ask you.
   Written by hand. In "best reply" questions, wrong replies always come from a different kind of phrase,
   so only one reply fits (tests/skills.html checks it). */
(function(){
"use strict";
const ZH = window.ZH, { pick, shuffle } = ZH;

/* [characters, pinyin, English, kind, reply?] — kind keeps replies that could also fit apart */
const PHRASES = [
  ["你好！", "Nǐ hǎo!", "Hello!", "greet", ["你好！", "Nǐ hǎo!", "Hello!"]],
  ["早安！", "Zǎo'ān!", "Good morning!", "greet", ["早安！", "Zǎo'ān!", "Good morning!"]],
  ["謝謝！", "Xièxie!", "Thank you!", "thanks", ["不客氣。", "Bú kèqì.", "You're welcome."]],
  ["不客氣。", "Bú kèqì.", "You're welcome.", "welcome"],
  ["對不起！", "Duìbùqǐ!", "Sorry!", "sorry", ["沒關係。", "Méi guānxi.", "That's OK."]],
  ["沒關係。", "Méi guānxi.", "That's OK. / Never mind.", "ok"],
  ["不好意思。", "Bù hǎoyìsi.", "Sorry to bother you.", "sorry"],
  ["請問。", "Qǐngwèn.", "Excuse me, may I ask…", "ask"],
  ["再見！", "Zàijiàn!", "Goodbye!", "bye", ["再見！", "Zàijiàn!", "Goodbye!"]],
  ["掰掰！", "Bāibāi!", "Bye-bye!", "bye", ["掰掰！", "Bāibāi!", "Bye-bye!"]],
  ["晚安！", "Wǎn'ān!", "Good night!", "bye", ["晚安！", "Wǎn'ān!", "Good night!"]],
  ["好。", "Hǎo.", "OK.", "ok"],
  ["對。", "Duì.", "Yes, that's right.", "ok"],
  ["不是。", "Bú shì.", "No, it isn't.", "no"],
  ["我不知道。", "Wǒ bù zhīdào.", "I don't know.", "no"],
  ["我聽不懂。", "Wǒ tīng bù dǒng.", "I don't understand.", "no"],
  ["請再說一次。", "Qǐng zài shuō yí cì.", "Please say it again.", "ask"],
  ["請說慢一點。", "Qǐng shuō màn yìdiǎn.", "Please speak more slowly.", "ask"],
  ["很高興認識你。", "Hěn gāoxìng rènshì nǐ.", "Nice to meet you.", "meet", ["我也很高興認識你。", "Wǒ yě hěn gāoxìng rènshì nǐ.", "Nice to meet you too."]],
  ["沒問題！", "Méi wèntí!", "No problem!", "ok"],
  ["等一下。", "Děng yíxià.", "Wait a moment.", "ask"],
  ["歡迎光臨！", "Huānyíng guānglín!", "Welcome! (in shops)", "shop"],
  ["加油！", "Jiāyóu!", "Go for it! / You can do it!", "thanks", ["謝謝！", "Xièxie!", "Thanks!"]],
  ["好吃！", "Hǎochī!", "Delicious!", "ok"],
  ["你吃飽了嗎？", "Nǐ chībǎo le ma?", "Have you eaten? (a friendly greeting)", "eat", ["吃飽了，謝謝。", "Chībǎo le, xièxie.", "Yes, I've eaten, thanks."]],
  ["生日快樂！", "Shēngrì kuàilè!", "Happy birthday!", "thanks", ["謝謝！", "Xièxie!", "Thank you!"]],
  ["新年快樂！", "Xīnnián kuàilè!", "Happy New Year!", "newyear", ["新年快樂！", "Xīnnián kuàilè!", "Happy New Year!"]],
  ["小心！", "Xiǎoxīn!", "Be careful!", "ok"],
  ["真的嗎？", "Zhēnde ma?", "Really?", "ask"]
].map(p => ({ zh:p[0], py:p[1], en:p[2], kind:p[3], reply:p[4] ? { zh:p[4][0], py:p[4][1], en:p[4][2] } : null }));
const replyLabel = r => `${r.py}  (${r.en})`;

const phrases = {
  id:"ph-everyday", name:"Everyday phrases", emoji:"🙏",
  desc:"Hello, thank you, sorry, I don't understand…",
  rule:`<ul><li><b>謝謝</b> xièxie thank you → <b>不客氣</b> bú kèqì you're welcome</li>
    <li><b>對不起</b> duìbùqǐ sorry → <b>沒關係</b> méi guānxi that's OK</li>
    <li><b>不好意思</b> bù hǎoyìsi is the everyday “excuse me / sorry” in Taiwan</li>
    <li>Two you'll need a lot: <b>我聽不懂</b> I don't understand, <b>請說慢一點</b> please speak more slowly</li>
    <li>🇹🇼 <b>掰掰</b> bāibāi (bye-bye) is very common in Taiwan.</li></ul>`,
  levels:[
    { name:"Meaning", desc:"Hear a phrase, choose what it means (slowly)" },
    { name:"Faster", desc:"The same at normal speed" },
    { name:"Best reply", desc:"Hear a phrase, choose what you'd answer" }
  ],
  phrases:PHRASES,
  make(level){
    if (level === 3){
      const p = pick(PHRASES.filter(x => x.reply));
      // wrong replies: replies to other kinds of phrase (not "that's OK" for "thank you", which could sound fine in English)
      const clash = { thanks:["sorry"], sorry:["thanks"], greet:["eat"], eat:["greet"], newyear:["thanks"] }[p.kind] || [];
      const others = PHRASES.filter(x => x.reply && x.kind !== p.kind && !clash.includes(x.kind)).map(x => x.reply);
      const choices = ZH.choicesFrom(p.reply, others, 4, r => r.zh).map(replyLabel);
      return { say:p.zh, rate:.9, text:"What would you answer?", choices, answer:replyLabel(p.reply), long:true,
        reveal:ZH.line(p.zh, p.py, p.en) + ZH.line(p.reply.zh, p.reply.py, p.reply.en, "B"), solution:`${p.zh} → ${p.reply.zh} ${p.reply.py}`, key:"r" + p.zh };
    }
    const p = pick(PHRASES);
    return { say:p.zh, rate:level === 1 ? .7 : .95, text:"What does it mean?", choices:ZH.choicesFrom(p, PHRASES, 4, x => x.en).map(x => x.en), answer:p.en, long:true,
      reveal:ZH.line(p.zh, p.py, p.en), solution:`${p.zh} ${p.py} – ${p.en}`, key:"m" + level + p.zh };
  }
};

/* ---------- questions people ask you ---------- */
/* [characters, pinyin, English, what it asks about, a good answer] */
const QUESTIONS = [
  ["你叫什麼名字？", "Nǐ jiào shénme míngzi?", "What's your name?", "What", ["我叫安娜。", "Wǒ jiào Ānnà.", "My name is Anna."]],
  ["那是什麼？", "Nà shì shénme?", "What's that?", "What", ["那是我的手機。", "Nà shì wǒ de shǒujī.", "That's my phone."]],
  ["你要喝什麼？", "Nǐ yào hē shénme?", "What would you like to drink?", "What", ["我要一杯紅茶。", "Wǒ yào yì bēi hóngchá.", "A black tea, please."]],
  ["你喜歡吃什麼？", "Nǐ xǐhuān chī shénme?", "What do you like to eat?", "What", ["我喜歡吃餃子。", "Wǒ xǐhuān chī jiǎozi.", "I like dumplings."]],
  ["他是誰？", "Tā shì shéi?", "Who is he?", "Who", ["他是我哥哥。", "Tā shì wǒ gēge.", "He's my older brother."]],
  ["誰是你的老師？", "Shéi shì nǐ de lǎoshī?", "Who is your teacher?", "Who", ["王老師。", "Wáng lǎoshī.", "Teacher Wang."]],
  ["你住在哪裡？", "Nǐ zhù zài nǎlǐ?", "Where do you live?", "Where", ["我住在台北。", "Wǒ zhù zài Táiběi.", "I live in Taipei."]],
  ["洗手間在哪裡？", "Xǐshǒujiān zài nǎlǐ?", "Where's the toilet?", "Where", ["在那邊。", "Zài nàbiān.", "Over there."]],
  ["你在哪裡工作？", "Nǐ zài nǎlǐ gōngzuò?", "Where do you work?", "Where", ["我在銀行工作。", "Wǒ zài yínháng gōngzuò.", "I work at a bank."]],
  ["你是哪國人？", "Nǐ shì nǎ guó rén?", "Where are you from?", "Where", ["我是西班牙人。", "Wǒ shì Xībānyá rén.", "I'm Spanish."]],
  ["現在幾點？", "Xiànzài jǐ diǎn?", "What time is it?", "When", ["三點半。", "Sān diǎn bàn.", "Half past three."]],
  ["你什麼時候去台中？", "Nǐ shénme shíhòu qù Táizhōng?", "When are you going to Taichung?", "When", ["明天。", "Míngtiān.", "Tomorrow."]],
  ["今天星期幾？", "Jīntiān xīngqí jǐ?", "What day is it today?", "When", ["星期五。", "Xīngqíwǔ.", "Friday."]],
  ["你的生日是幾月幾號？", "Nǐ de shēngrì shì jǐ yuè jǐ hào?", "When is your birthday?", "When", ["五月十號。", "Wǔ yuè shí hào.", "May 10."]],
  ["你有幾個小孩？", "Nǐ yǒu jǐ ge xiǎohái?", "How many children do you have?", "How many", ["兩個。", "Liǎng ge.", "Two."]],
  ["你家有幾個人？", "Nǐ jiā yǒu jǐ ge rén?", "How many people are in your family?", "How many", ["四個人。", "Sì ge rén.", "Four."]],
  ["你今年幾歲？", "Nǐ jīnnián jǐ suì?", "How old are you?", "How many", ["我三十歲。", "Wǒ sānshí suì.", "I'm thirty."]],
  ["這個多少錢？", "Zhège duōshǎo qián?", "How much is this?", "How much", ["五十塊。", "Wǔshí kuài.", "Fifty dollars."]],
  ["一杯咖啡多少錢？", "Yì bēi kāfēi duōshǎo qián?", "How much is a coffee?", "How much", ["六十塊。", "Liùshí kuài.", "Sixty dollars."]],
  ["你為什麼學中文？", "Nǐ wèishénme xué Zhōngwén?", "Why are you learning Chinese?", "Why", ["因為我喜歡台灣。", "Yīnwèi wǒ xǐhuān Táiwān.", "Because I like Taiwan."]],
  ["你為什麼不吃肉？", "Nǐ wèishénme bù chī ròu?", "Why don't you eat meat?", "Why", ["因為我不喜歡。", "Yīnwèi wǒ bù xǐhuān.", "Because I don't like it."]],
  ["你怎麼去學校？", "Nǐ zěnme qù xuéxiào?", "How do you get to school?", "How", ["坐公車。", "Zuò gōngchē.", "By bus."]],
  ["你怎麼去機場？", "Nǐ zěnme qù jīchǎng?", "How are you getting to the airport?", "How", ["坐捷運。", "Zuò jiéyùn.", "By MRT."]],
  ["你是老師嗎？", "Nǐ shì lǎoshī ma?", "Are you a teacher?", "Yes / no", ["不是，我是學生。", "Bú shì, wǒ shì xuéshēng.", "No, I'm a student."]],
  ["你會說中文嗎？", "Nǐ huì shuō Zhōngwén ma?", "Can you speak Chinese?", "Yes / no", ["會一點點。", "Huì yìdiǎndiǎn.", "A little bit."]],
  ["你明天有空嗎？", "Nǐ míngtiān yǒu kòng ma?", "Are you free tomorrow?", "Yes / no", ["有，下午有空。", "Yǒu, xiàwǔ yǒu kòng.", "Yes, in the afternoon."]],
  ["你喜歡台灣嗎？", "Nǐ xǐhuān Táiwān ma?", "Do you like Taiwan?", "Yes / no", ["很喜歡！", "Hěn xǐhuān!", "I love it!"]],
  ["你要袋子嗎？", "Nǐ yào dàizi ma?", "Do you need a bag?", "Yes / no", ["不用，謝謝。", "Búyòng, xièxie.", "No, thanks."]]
].map(q => ({ zh:q[0], py:q[1], en:q[2], kind:q[3], ans:{ zh:q[4][0], py:q[4][1], en:q[4][2] } }));
const KINDS = ["What", "Who", "Where", "When", "How many", "How much", "Why", "How", "Yes / no"];
const KIND_LABEL = { "What":"What? 什麼", "Who":"Who? 誰", "Where":"Where? 哪裡", "When":"When? 幾點 / 星期幾 / 什麼時候", "How many":"How many / how old? 幾個 / 幾歲",
  "How much":"How much? 多少錢", "Why":"Why? 為什麼", "How":"How? 怎麼", "Yes / no":"Yes or no? …嗎" };

const questions = {
  id:"ph-questions", name:"Questions", emoji:"❓",
  desc:"什麼, 誰, 哪裡, 幾, 多少… Understand what people ask you.",
  rule:`<ul><li><b>什麼</b> shénme what · <b>誰</b> shéi who · <b>哪裡</b> nǎlǐ where · <b>什麼時候</b> when</li>
    <li><b>幾</b> jǐ how many (small numbers, time, date) · <b>多少</b> duōshǎo how many / how much · <b>多少錢</b> how much money</li>
    <li><b>為什麼</b> wèishénme why · <b>怎麼</b> zěnme how</li>
    <li><b>…嗎？</b> ma at the end turns a sentence into a yes/no question: 你是老師<b>嗎</b>？</li>
    <li>The question word stays where the answer goes: 你叫<b>什麼</b>？ → 我叫<b>安娜</b>。</li></ul>`,
  levels:[
    { name:"What is asked?", desc:"Hear a question: is it what, who, where…?" },
    { name:"Meaning", desc:"Hear a question, choose its meaning" },
    { name:"Best answer", desc:"Hear a question, choose a good answer" }
  ],
  questions:QUESTIONS,
  make(level){
    const q = pick(QUESTIONS);
    const reveal = ZH.line(q.zh, q.py, q.en);
    if (level === 1){
      const kinds = ZH.choicesFrom(q.kind, KINDS, 4);
      return { say:q.zh, rate:.75, text:"What is the question about?", choices:kinds.map(k => KIND_LABEL[k]), answer:KIND_LABEL[q.kind], long:true,
        reveal, solution:`${q.zh} ${q.py} – ${q.en}`, key:"k" + q.zh };
    }
    if (level === 2){
      return { say:q.zh, rate:.9, text:"What does it mean?", choices:ZH.choicesFrom(q, QUESTIONS, 4, x => x.en).map(x => x.en), answer:q.en, long:true,
        reveal, solution:`${q.zh} ${q.py} – ${q.en}`, key:"q2" + q.zh };
    }
    const others = QUESTIONS.filter(x => x.kind !== q.kind).map(x => x.ans);
    return { say:q.zh, rate:.95, text:"Choose a good answer", choices:ZH.choicesFrom(q.ans, others, 4, a => a.zh).map(replyLabel), answer:replyLabel(q.ans), long:true,
      reveal:reveal + ZH.line(q.ans.zh, q.ans.py, q.ans.en, "B"), solution:`${q.zh} → ${q.ans.zh}`, key:"q3" + q.zh };
  }
};

ZH.TOPICS.push({ id:"phrases", title:"Phrases & questions", emoji:"💬", skills:[phrases, questions] });
})();
