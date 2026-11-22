/* The word bank: everyday words by theme, from the TOCFL Novice 1, Novice 2 and Beginner (A1) lists,
   plus a few words you'll hear everywhere in Taiwan (珍珠奶茶, 捷運, 便利商店, 機車, 夜市…).
   tests/check.py checks every word and its pinyin against the TOCFL list and CC-CEDICT.

   Each theme: { name, emoji, frames, items }
     items:  [characters, pinyin, English, emoji, frame?]
     frames: short sentences the word is heard in: [characters, pinyin, English] with {w} = the word's characters,
             {p} = its pinyin, {e} = its English. An item's own frame (5th field) is used instead when it has one. */
(function(){
"use strict";
const ZH = window.ZH = window.ZH || {};

ZH.WORDS = {
  drinks:{ name:"Drinks", emoji:"🧋",
    frames:[["我要{w}。", "Wǒ yào {p}.", "I'd like {e}."], ["我想喝{w}。", "Wǒ xiǎng hē {p}.", "I'd like to drink {e}."], ["你要喝{w}嗎？", "Nǐ yào hē {p} ma?", "Would you like {e}?"]],
    items:[
      ["水", "shuǐ", "water", "💧"], ["茶", "chá", "tea", "🍵"], ["咖啡", "kāfēi", "coffee", "☕"], ["牛奶", "niúnǎi", "milk", "🥛"],
      ["果汁", "guǒzhī", "juice", "🧃"], ["啤酒", "píjiǔ", "beer", "🍺"], ["珍珠奶茶", "zhēnzhū nǎichá", "bubble tea", "🧋"], ["紅茶", "hóngchá", "black tea", "🫖"],
      ["奶茶", "nǎichá", "milk tea", "🥤"]
    ]},
  food:{ name:"Food", emoji:"🍜",
    frames:[["我想吃{w}。", "Wǒ xiǎng chī {p}.", "I'd like to eat {e}."], ["我喜歡吃{w}。", "Wǒ xǐhuān chī {p}.", "I like eating {e}."], ["你要吃{w}嗎？", "Nǐ yào chī {p} ma?", "Do you want to eat {e}?"]],
    items:[
      ["白飯", "báifàn", "rice", "🍚"], ["麵", "miàn", "noodles", "🍜"], ["麵包", "miànbāo", "bread", "🍞"], ["蛋", "dàn", "eggs", "🥚"],
      ["魚", "yú", "fish", "🐟"], ["牛肉", "niúròu", "beef", "🥩"], ["蛋糕", "dàngāo", "cake", "🍰"], ["蘋果", "píngguǒ", "apples", "🍎"],
      ["香蕉", "xiāngjiāo", "bananas", "🍌"], ["西瓜", "xīguā", "watermelon", "🍉"], ["餃子", "jiǎozi", "dumplings", "🥟"], ["漢堡", "hànbǎo", "burgers", "🍔"],
      ["冰淇淋", "bīngqílín", "ice cream", "🍦"], ["湯", "tāng", "soup", "🥣", ["我想喝湯。", "Wǒ xiǎng hē tāng.", "I'd like some soup."]], ["巧克力", "qiǎokèlì", "chocolate", "🍫"], ["便當", "biàndāng", "bento (a boxed lunch)", "🍱"],
      ["水果", "shuǐguǒ", "fruit", "🍇"], ["青菜", "qīngcài", "vegetables", "🥬"]
    ]},
  people:{ name:"People & family", emoji:"👪",
    frames:[["這是我{w}。", "Zhè shì wǒ {p}.", "This is my {e}."], ["我{w}很忙。", "Wǒ {p} hěn máng.", "My {e} is busy."]],
    items:[
      ["爸爸", "bàba", "dad", "👨"], ["媽媽", "māma", "mum", "👩"], ["哥哥", "gēge", "older brother", "👦"], ["弟弟", "dìdi", "younger brother", "🧒"],
      ["姊姊", "jiějie", "older sister", "👧"], ["妹妹", "mèimei", "younger sister", "👧"], ["爺爺", "yéye", "grandpa", "👴"], ["奶奶", "nǎinai", "grandma", "👵"],
      ["朋友", "péngyǒu", "friend", "🤝"], ["先生", "xiānshēng", "husband", "🤵"], ["太太", "tàitai", "wife", "👰"],
      ["老師", "lǎoshī", "teacher", "🧑‍🏫", ["他是老師。", "Tā shì lǎoshī.", "He's a teacher."]],
      ["學生", "xuéshēng", "student", "🧑‍🎓", ["她是學生。", "Tā shì xuéshēng.", "She's a student."]],
      ["醫生", "yīshēng", "doctor", "🧑‍⚕️", ["他是醫生嗎？", "Tā shì yīshēng ma?", "Is he a doctor?"]],
      ["小孩", "xiǎohái", "child", "🧒", ["你有小孩嗎？", "Nǐ yǒu xiǎohái ma?", "Do you have children?"]],
      ["司機", "sījī", "driver", "🚖", ["他是司機。", "Tā shì sījī.", "He's a driver."]]
    ]},
  places:{ name:"Places", emoji:"🏙️",
    frames:[["我要去{w}。", "Wǒ yào qù {p}.", "I'm going to the {e}."], ["{w}在哪裡？", "{P} zài nǎlǐ?", "Where's the {e}?"]],
    items:[
      ["家", "jiā", "home", "🏠", ["我要回家。", "Wǒ yào huí jiā.", "I'm going home."]], ["學校", "xuéxiào", "school", "🏫"], ["醫院", "yīyuàn", "hospital", "🏥"],
      ["銀行", "yínháng", "bank", "🏦"], ["餐廳", "cāntīng", "restaurant", "🍽️"], ["公園", "gōngyuán", "park", "🌳"], ["超市", "chāoshì", "supermarket", "🛒"],
      ["便利商店", "biànlì shāngdiàn", "convenience store", "🏪"], ["機場", "jīchǎng", "airport", "🛫"], ["車站", "chēzhàn", "station", "🚉"],
      ["洗手間", "xǐshǒujiān", "toilet", "🚻"], ["飯店", "fàndiàn", "hotel", "🏨"], ["圖書館", "túshūguǎn", "library", "📚"], ["夜市", "yèshì", "night market", "🏮"],
      ["郵局", "yóujú", "post office", "📮"], ["公司", "gōngsī", "office", "🏢"]
    ]},
  transport:{ name:"Getting around", emoji:"🚇",
    frames:[["我坐{w}去。", "Wǒ zuò {p} qù.", "I'm going by {e}."], ["我們坐{w}吧。", "Wǒmen zuò {p} ba.", "Let's take the {e}."]],
    items:[
      ["捷運", "jiéyùn", "MRT (metro)", "🚇"], ["公車", "gōngchē", "bus", "🚌"], ["計程車", "jìchéngchē", "taxi", "🚕"], ["火車", "huǒchē", "train", "🚆"],
      ["高鐵", "gāotiě", "high-speed rail", "🚄"], ["飛機", "fēijī", "plane", "✈️"],
      ["機車", "jīchē", "scooter", "🛵", ["我騎機車去。", "Wǒ qí jīchē qù.", "I'm going by scooter."]],
      ["腳踏車", "jiǎotàchē", "bicycle", "🚲", ["我騎腳踏車去。", "Wǒ qí jiǎotàchē qù.", "I'm going by bike."]],
      ["走路", "zǒulù", "on foot", "🚶", ["我走路去。", "Wǒ zǒulù qù.", "I'm going on foot."]]
    ]},
  actions:{ name:"Actions", emoji:"🏃",
    frames:[["我現在要{w}。", "Wǒ xiànzài yào {p}.", "I'm going to {e} now."], ["我不想{w}。", "Wǒ bù xiǎng {p}.", "I don't want to {e}."]],
    items:[
      ["吃飯", "chīfàn", "eat", "🍽️"], ["喝水", "hē shuǐ", "drink water", "💧"], ["睡覺", "shuìjiào", "sleep", "😴"], ["工作", "gōngzuò", "work", "💼"],
      ["看書", "kàn shū", "read", "📖"], ["看電視", "kàn diànshì", "watch TV", "📺"], ["看電影", "kàn diànyǐng", "watch a film", "🎬"], ["聽音樂", "tīng yīnyuè", "listen to music", "🎧"],
      ["買東西", "mǎi dōngxi", "go shopping", "🛍️"], ["說中文", "shuō Zhōngwén", "speak Chinese", "🗣️"], ["唱歌", "chànggē", "sing", "🎤"], ["跳舞", "tiàowǔ", "dance", "💃"],
      ["游泳", "yóuyǒng", "swim", "🏊"], ["運動", "yùndòng", "exercise", "🏃"], ["打電話", "dǎ diànhuà", "make a phone call", "📞"], ["洗澡", "xǐzǎo", "have a shower", "🚿"],
      ["起床", "qǐchuáng", "get up", "⏰"], ["上班", "shàngbān", "go to work", "🏢"], ["開車", "kāichē", "drive", "🚗"]
    ]},
  describe:{ name:"How is it?", emoji:"🌡️",
    frames:[["我很{w}。", "Wǒ hěn {p}.", "I'm {e}."]],
    items:[
      ["累", "lèi", "tired", "😩"], ["餓", "è", "hungry", "🤤"], ["渴", "kě", "thirsty", "🥤"], ["忙", "máng", "busy", "⏳"], ["高興", "gāoxìng", "happy", "😊"],
      ["熱", "rè", "hot", "🥵", ["今天很熱。", "Jīntiān hěn rè.", "It's hot today."]], ["冷", "lěng", "cold", "🥶", ["今天很冷。", "Jīntiān hěn lěng.", "It's cold today."]],
      ["好吃", "hǎochī", "tasty", "😋", ["這個很好吃。", "Zhège hěn hǎochī.", "This is tasty."]], ["貴", "guì", "expensive", "💸", ["這個很貴。", "Zhège hěn guì.", "This is expensive."]],
      ["便宜", "piányí", "cheap", "🏷️", ["這個很便宜。", "Zhège hěn piányí.", "This is cheap."]], ["大", "dà", "big", "🐘", ["這個很大。", "Zhège hěn dà.", "This one is big."]],
      ["小", "xiǎo", "small", "🐜", ["這個很小。", "Zhège hěn xiǎo.", "This one is small."]], ["漂亮", "piàoliàng", "pretty", "🌸", ["她很漂亮。", "Tā hěn piàoliàng.", "She's pretty."]],
      ["下雨", "xiàyǔ", "raining", "🌧️", ["今天下雨。", "Jīntiān xiàyǔ.", "It's raining today."]], ["不舒服", "bù shūfu", "unwell", "🤒", ["我不舒服。", "Wǒ bù shūfu.", "I don't feel well."]]
    ]}
};
/* every item as an object, and the sentences it is heard in */
ZH.wordList = theme => ZH.WORDS[theme].items.map(it => ({ zh:it[0], py:it[1], en:it[2], emoji:it[3], frame:it[4] || null, theme }));
ZH.framesOf = function(w){
  if (w.frame) return [{ zh:w.frame[0], py:w.frame[1], en:w.frame[2] }];
  return ZH.WORDS[w.theme].frames.map(f => ({
    zh:f[0].replace("{w}", w.zh),
    py:f[1].replace("{P}", ZH.cap(w.py)).replace("{p}", w.py),
    en:f[2].replace("{e}", w.en)
  }));
};
})();
