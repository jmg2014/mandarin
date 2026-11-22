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
      ["奶茶", "nǎichá", "milk tea", "🥤"],
      ["酒", "jiǔ", "alcohol", "🍶", ["我不喝酒。", "Wǒ bù hē jiǔ.", "I don't drink alcohol."]],
      ["飲料", "yǐnliào", "drinks", "🍹", ["你要什麼飲料？", "Nǐ yào shénme yǐnliào?", "What would you like to drink?"]]
    ]},
  food:{ name:"Food", emoji:"🍜",
    frames:[["我想吃{w}。", "Wǒ xiǎng chī {p}.", "I'd like to eat {e}."], ["我喜歡吃{w}。", "Wǒ xǐhuān chī {p}.", "I like eating {e}."], ["你要吃{w}嗎？", "Nǐ yào chī {p} ma?", "Do you want to eat {e}?"]],
    items:[
      ["白飯", "báifàn", "rice", "🍚"], ["麵", "miàn", "noodles", "🍜"], ["麵包", "miànbāo", "bread", "🍞"], ["蛋", "dàn", "eggs", "🥚"],
      ["魚", "yú", "fish", "🐟"], ["牛肉", "niúròu", "beef", "🥩"], ["蛋糕", "dàngāo", "cake", "🍰"], ["蘋果", "píngguǒ", "apples", "🍎"],
      ["香蕉", "xiāngjiāo", "bananas", "🍌"], ["西瓜", "xīguā", "watermelon", "🍉"], ["餃子", "jiǎozi", "dumplings", "🥟"], ["漢堡", "hànbǎo", "burgers", "🍔"],
      ["冰淇淋", "bīngqílín", "ice cream", "🍦"], ["湯", "tāng", "soup", "🥣", ["我想喝湯。", "Wǒ xiǎng hē tāng.", "I'd like some soup."]], ["巧克力", "qiǎokèlì", "chocolate", "🍫"], ["便當", "biàndāng", "bento (a boxed lunch)", "🍱"],
      ["水果", "shuǐguǒ", "fruit", "🍇"], ["青菜", "qīngcài", "vegetables", "🥬"],
      ["菜", "cài", "dish (of food)", "🥘", ["這個菜很好吃。", "Zhège cài hěn hǎochī.", "This dish is delicious."]],
      ["小吃", "xiǎochī", "street food", "🍢", ["我很喜歡台灣小吃。", "Wǒ hěn xǐhuān Táiwān xiǎochī.", "I love Taiwanese street food."]],
      ["食物", "shíwù", "food", "🍲", ["這裡的食物很便宜。", "Zhèlǐ de shíwù hěn piányí.", "The food here is cheap."]]
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
    ]},
  body:{ name:"Body & health", emoji:"🩺",
    frames:[["我{w}很痛。", "Wǒ {p} hěn tòng.", "My {e} hurts."]],
    items:[
      ["頭", "tóu", "head", "🤕"], ["手", "shǒu", "hand", "✋"], ["腳", "jiǎo", "foot", "🦶"], ["肚子", "dùzi", "tummy", "🤢"],
      ["眼睛", "yǎnjīng", "eyes", "👀", ["我眼睛很痛。", "Wǒ yǎnjīng hěn tòng.", "My eyes hurt."]],
      ["耳朵", "ěrduo", "ears", "👂", ["我耳朵很痛。", "Wǒ ěrduo hěn tòng.", "My ears hurt."]],
      ["鼻子", "bízi", "nose", "👃", ["他的鼻子很大。", "Tā de bízi hěn dà.", "He has a big nose."]],
      ["嘴巴", "zuǐba", "mouth", "👄", ["請張開嘴巴。", "Qǐng zhāngkāi zuǐba.", "Please open your mouth."]],
      ["感冒", "gǎnmào", "a cold", "🤧", ["我感冒了。", "Wǒ gǎnmào le.", "I've got a cold."]],
      ["生病", "shēngbìng", "ill", "🤒", ["他生病了。", "Tā shēngbìng le.", "He's ill."]],
      ["藥", "yào", "medicine", "💊", ["你要吃藥。", "Nǐ yào chī yào.", "You need to take medicine."]],
      ["看病", "kànbìng", "see a doctor", "🩺", ["我要去看病。", "Wǒ yào qù kànbìng.", "I'm going to see a doctor."]],
      ["病", "bìng", "illness", "🛌", ["你的病好了嗎？", "Nǐ de bìng hǎo le ma?", "Are you better now?"]]
    ]},
  opposites:{ name:"Opposites", emoji:"↔️",
    frames:[["他很{w}。", "Tā hěn {p}.", "He's {e}."]],
    items:[
      ["高", "gāo", "tall", "🦒"], ["矮", "ǎi", "short (not tall)", "🐧"], ["胖", "pàng", "fat", "🐼"], ["瘦", "shòu", "thin", "🦩"],
      ["老", "lǎo", "old (people)", "👴", ["我爺爺很老了。", "Wǒ yéye hěn lǎo le.", "My grandpa is old now."]],
      ["新", "xīn", "new", "✨", ["這支手機很新。", "Zhè zhī shǒujī hěn xīn.", "This phone is new."]],
      ["舊", "jiù", "old (things)", "🏚️", ["這件衣服很舊。", "Zhè jiàn yīfú hěn jiù.", "This piece of clothing is old."]],
      ["長", "cháng", "long", "🐍", ["這條路很長。", "Zhè tiáo lù hěn cháng.", "This road is long."]],
      ["短", "duǎn", "short (not long)", "✂️", ["她的頭髮很短。", "Tā de tóufǎ hěn duǎn.", "Her hair is short."]],
      ["難", "nán", "difficult", "🤯", ["中文很難。", "Zhōngwén hěn nán.", "Chinese is difficult."]],
      ["容易", "róngyì", "easy", "👌", ["這個很容易。", "Zhège hěn róngyì.", "This is easy."]],
      ["快", "kuài", "fast", "🐇", ["捷運很快。", "Jiéyùn hěn kuài.", "The MRT is fast."]],
      ["慢", "màn", "slow", "🐢", ["公車很慢。", "Gōngchē hěn màn.", "The bus is slow."]],
      ["多", "duō", "a lot of", "👥", ["夜市人很多。", "Yèshì rén hěn duō.", "There are a lot of people at the night market."]],
      ["少", "shǎo", "few", "👤", ["今天人很少。", "Jīntiān rén hěn shǎo.", "There are few people today."]],
      ["美", "měi", "beautiful", "🏞️", ["台灣很美。", "Táiwān hěn měi.", "Taiwan is beautiful."]],
      ["低", "dī", "low", "⬇️", ["這張桌子很低。", "Zhè zhāng zhuōzi hěn dī.", "This table is low."]],
      ["方便", "fāngbiàn", "convenient", "👍", ["捷運很方便。", "Jiéyùn hěn fāngbiàn.", "The MRT is convenient."]],
      ["不錯", "búcuò", "pretty good", "🙂", ["這家店不錯。", "Zhè jiā diàn búcuò.", "This shop is pretty good."]],
      ["一樣", "yíyàng", "the same", "🟰", ["我們的手機一樣。", "Wǒmen de shǒujī yíyàng.", "Our phones are the same."]]
    ]},
  school:{ name:"School & study", emoji:"📚",
    frames:[["{w}", "{P}", "{e}"]],
    items:[
      ["筆", "bǐ", "pen", "🖊️", ["我有兩枝筆。", "Wǒ yǒu liǎng zhī bǐ.", "I have two pens."]],
      ["紙", "zhǐ", "paper", "📄", ["請給我一張紙。", "Qǐng gěi wǒ yì zhāng zhǐ.", "Please give me a sheet of paper."]],
      ["教室", "jiàoshì", "classroom", "🏫", ["我們在教室上課。", "Wǒmen zài jiàoshì shàngkè.", "We have class in the classroom."]],
      ["功課", "gōngkè", "homework", "📝", ["我今天功課很多。", "Wǒ jīntiān gōngkè hěn duō.", "I have a lot of homework today."]],
      ["課", "kè", "class (lesson)", "📚", ["我今天有中文課。", "Wǒ jīntiān yǒu Zhōngwén kè.", "I have a Chinese class today."]],
      ["下課", "xiàkè", "class ends", "🔔", ["我們幾點下課？", "Wǒmen jǐ diǎn xiàkè?", "What time does class end?"]],
      ["寫", "xiě", "write", "✍️", ["請寫你的名字。", "Qǐng xiě nǐ de míngzi.", "Please write your name."]],
      ["讀", "dú", "read / study", "📖", ["請讀這個句子。", "Qǐng dú zhège jùzi.", "Please read this sentence."]],
      ["念", "niàn", "read aloud", "🗣️", ["這個字怎麼念？", "Zhège zì zěnme niàn?", "How do you read this character?"]],
      ["教", "jiāo", "teach", "🧑‍🏫", ["王老師教中文。", "Wáng lǎoshī jiāo Zhōngwén.", "Teacher Wang teaches Chinese."]],
      ["問", "wèn", "ask", "❓", ["我可以問你一個問題嗎？", "Wǒ kěyǐ wèn nǐ yí ge wèntí ma?", "May I ask you a question?"]],
      ["說話", "shuōhuà", "talk", "💬", ["請不要說話。", "Qǐng bú yào shuōhuà.", "Please don't talk."]],
      ["英文", "Yīngwén", "English", "🔤", ["你會說英文嗎？", "Nǐ huì shuō Yīngwén ma?", "Can you speak English?"]],
      ["句子", "jùzi", "sentence", "🧾", ["這個句子很難。", "Zhège jùzi hěn nán.", "This sentence is difficult."]],
      ["意思", "yìsi", "meaning", "💡", ["這是什麼意思？", "Zhè shì shénme yìsi?", "What does this mean?"]],
      ["錯", "cuò", "wrong", "❌", ["對不起，我錯了。", "Duìbùqǐ, wǒ cuò le.", "Sorry, I was wrong."]],
      ["畫", "huà", "draw", "🎨", ["他喜歡畫畫。", "Tā xǐhuān huà huà.", "He likes drawing."]],
      ["告訴", "gàosù", "tell", "📢", ["請告訴我。", "Qǐng gàosù wǒ.", "Please tell me."]],
      ["介紹", "jièshào", "introduce", "🤝", ["我來介紹一下。", "Wǒ lái jièshào yíxià.", "Let me do the introductions."]]
    ]},
  home:{ name:"At home", emoji:"🏠",
    frames:[["{w}", "{P}", "{e}"]],
    items:[
      ["門", "mén", "door", "🚪", ["請開門。", "Qǐng kāi mén.", "Please open the door."]],
      ["門口", "ménkǒu", "doorway", "🛎️", ["我在門口等你。", "Wǒ zài ménkǒu děng nǐ.", "I'll wait for you at the door."]],
      ["桌子", "zhuōzi", "table", "🍽️", ["書在桌子上。", "Shū zài zhuōzi shàng.", "The book is on the table."]],
      ["椅子", "yǐzi", "chair", "🪑", ["請坐這張椅子。", "Qǐng zuò zhè zhāng yǐzi.", "Please sit on this chair."]],
      ["床", "chuáng", "bed", "🛏️", ["貓在床下。", "Māo zài chuáng xià.", "The cat is under the bed."]],
      ["樓", "lóu", "floor (storey)", "🏢", ["我住在三樓。", "Wǒ zhù zài sān lóu.", "I live on the third floor."]],
      ["鞋子", "xiézi", "shoes", "👟", ["在家裡不穿鞋子。", "Zài jiā lǐ bù chuān xiézi.", "We don't wear shoes at home."]],
      ["筷子", "kuàizi", "chopsticks", "🥢", ["你會用筷子嗎？", "Nǐ huì yòng kuàizi ma?", "Can you use chopsticks?"]],
      ["杯子", "bēizi", "cup", "🥛", ["這是我的杯子。", "Zhè shì wǒ de bēizi.", "This is my cup."]],
      ["房間", "fángjiān", "room", "🛋️", ["我的房間很小。", "Wǒ de fángjiān hěn xiǎo.", "My room is small."]]
    ]},
  time:{ name:"Time words", emoji:"⏳",
    frames:[["{w}", "{P}", "{e}"]],
    items:[
      ["去年", "qùnián", "last year", "⏪", ["我去年去了日本。", "Wǒ qùnián qù le Rìběn.", "I went to Japan last year."]],
      ["明年", "míngnián", "next year", "⏩", ["明年我想去台灣。", "Míngnián wǒ xiǎng qù Táiwān.", "Next year I want to go to Taiwan."]],
      ["前天", "qiántiān", "the day before yesterday", "⬅️", ["前天下雨。", "Qiántiān xiàyǔ.", "It rained the day before yesterday."]],
      ["前年", "qiánnián", "the year before last", "⏮️", ["我前年來台灣。", "Wǒ qiánnián lái Táiwān.", "I came to Taiwan the year before last."]],
      ["後年", "hòunián", "the year after next", "⏭️", ["我們後年結婚。", "Wǒmen hòunián jiéhūn.", "We're getting married the year after next."]],
      ["以前", "yǐqián", "before (in the past)", "🕰️", ["我以前住在台中。", "Wǒ yǐqián zhù zài Táizhōng.", "I used to live in Taichung."]],
      ["以後", "yǐhòu", "after", "🔜", ["吃飯以後，我們去看電影。", "Chīfàn yǐhòu, wǒmen qù kàn diànyǐng.", "After eating, we'll go and see a film."]],
      ["鐘頭", "zhōngtóu", "hour", "⏳", ["坐火車要兩個鐘頭。", "Zuò huǒchē yào liǎng ge zhōngtóu.", "It takes two hours by train."]],
      ["晚", "wǎn", "late", "🐌", ["對不起，我來晚了。", "Duìbùqǐ, wǒ lái wǎn le.", "Sorry, I'm late."]],
      ["早", "zǎo", "early", "🌅", ["你今天起得很早。", "Nǐ jīntiān qǐ de hěn zǎo.", "You got up early today."]],
      ["久", "jiǔ", "a long time", "👋", ["好久不見！", "Hǎo jiǔ bú jiàn!", "Long time no see!"]],
      ["馬上", "mǎshàng", "right away", "⚡", ["我馬上來！", "Wǒ mǎshàng lái!", "I'm coming right away!"]],
      ["常常", "chángcháng", "often", "🔁", ["我常常去夜市。", "Wǒ chángcháng qù yèshì.", "I often go to the night market."]],
      ["先", "xiān", "first", "1️⃣", ["你先走吧。", "Nǐ xiān zǒu ba.", "You go first."]],
      ["然後", "ránhòu", "then (after that)", "2️⃣", ["我們先吃飯，然後去看電影。", "Wǒmen xiān chīfàn, ránhòu qù kàn diànyǐng.", "First we'll eat, then we'll see a film."]]
    ]},
  weather:{ name:"Weather & free time", emoji:"🌤️",
    frames:[["{w}", "{P}", "{e}"]],
    items:[
      ["天氣", "tiānqì", "weather", "☀️", ["今天天氣很好。", "Jīntiān tiānqì hěn hǎo.", "The weather is nice today."]],
      ["風", "fēng", "wind", "💨", ["今天風很大。", "Jīntiān fēng hěn dà.", "It's very windy today."]],
      ["空氣", "kōngqì", "air", "🌬️", ["這裡的空氣很好。", "Zhèlǐ de kōngqì hěn hǎo.", "The air here is good."]],
      ["玩", "wán", "have fun", "🎡", ["我們去台南玩吧！", "Wǒmen qù Táinán wán ba!", "Let's go to Tainan for fun!"]],
      ["球", "qiú", "ball", "🏀", ["我週末常常打球。", "Wǒ zhōumò chángcháng dǎ qiú.", "I often play ball games at the weekend."]],
      ["唱", "chàng", "sing", "🎤", ["她唱得很好。", "Tā chàng de hěn hǎo.", "She sings very well."]],
      ["歌", "gē", "song", "🎵", ["他每天聽中文歌。", "Tā měitiān tīng Zhōngwén gē.", "He listens to Chinese songs every day."]],
      ["跳", "tiào", "jump", "🦘", ["貓跳到桌子上了。", "Māo tiào dào zhuōzi shàng le.", "The cat jumped onto the table."]],
      ["公園", "gōngyuán", "park", "🌳", ["天氣好的時候，我們去公園。", "Tiānqì hǎo de shíhòu, wǒmen qù gōngyuán.", "When the weather's nice, we go to the park."]]
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
