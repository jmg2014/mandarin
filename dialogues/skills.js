/* Conversations (對話): short everyday dialogues in Taiwan, two speakers, one question each time you listen.
   Written by hand from the words in the other topics plus a few you'll hear in Taiwan (半糖, 少冰, 載具, 刷卡…).
   Each dialogue: { title, lines:[[who, characters, pinyin, English]], qs:[{ lv, q, c:[right, wrong…] } or { lv, q, num:"65" }] }
   lv is the level the question belongs to: 1 the gist, 2 a detail, 3 a number or a finer detail at normal speed. */
(function(){
"use strict";
const ZH = window.ZH, { pick, shuffle } = ZH;

const SKILLS = [
  { id:"di-meet", name:"Meeting people", emoji:"🤝", desc:"Names, where you're from, what you do, family.",
    rule:`<ul><li><b>你叫什麼名字？</b> What's your name? → <b>我叫…</b></li><li><b>你是哪國人？</b> Where are you from? → <b>我是西班牙人</b></li>
      <li><b>…你呢？</b> …and you?</li><li>🇹🇼 When someone praises you, Taiwanese people often answer <b>沒有啦</b> méiyǒu la (“not really”).</li></ul>`,
    dialogues:[
      { title:"First meeting", lines:[
        ["A", "你好！我叫小美。你叫什麼名字？", "Nǐ hǎo! Wǒ jiào Xiǎoměi. Nǐ jiào shénme míngzi?", "Hi! I'm Xiaomei. What's your name?"],
        ["B", "你好，我叫大衛。", "Nǐ hǎo, wǒ jiào Dàwèi.", "Hi, I'm David."],
        ["A", "你是哪國人？", "Nǐ shì nǎ guó rén?", "Where are you from?"],
        ["B", "我是美國人。你呢？", "Wǒ shì Měiguó rén. Nǐ ne?", "I'm American. And you?"],
        ["A", "我是台灣人。很高興認識你！", "Wǒ shì Táiwān rén. Hěn gāoxìng rènshì nǐ!", "I'm Taiwanese. Nice to meet you!"]],
        qs:[{ lv:1, q:"Where is the man from?", c:["The USA", "Taiwan", "Japan", "Spain"] },
            { lv:2, q:"What's the woman's name?", c:["Xiaomei", "Xiaoming", "Anna", "David"] },
            { lv:2, q:"Where is the woman from?", c:["Taiwan", "The USA", "Japan", "Spain"] },
            { lv:3, q:"What does the woman say at the end?", c:["Nice to meet you", "See you tomorrow", "Thank you", "Sorry"] }] },
      { title:"A student", lines:[
        ["A", "請問，你是老師嗎？", "Qǐngwèn, nǐ shì lǎoshī ma?", "Excuse me, are you a teacher?"],
        ["B", "不是，我是學生。", "Bú shì, wǒ shì xuéshēng.", "No, I'm a student."],
        ["A", "你學什麼？", "Nǐ xué shénme?", "What do you study?"],
        ["B", "我學中文。我是西班牙人。", "Wǒ xué Zhōngwén. Wǒ shì Xībānyá rén.", "I study Chinese. I'm Spanish."],
        ["A", "你的中文很好！", "Nǐ de Zhōngwén hěn hǎo!", "Your Chinese is very good!"],
        ["B", "沒有啦，謝謝。", "Méiyǒu la, xièxie.", "Not really, thanks."]],
        qs:[{ lv:1, q:"Is the man a teacher?", c:["No, he's a student", "Yes, he's a teacher", "No, he's a doctor", "Yes, and a student too"] },
            { lv:1, q:"What does he study?", c:["Chinese", "English", "Japanese", "Music"] },
            { lv:2, q:"Where is he from?", c:["Spain", "The USA", "Taiwan", "Britain"] },
            { lv:3, q:"What does the woman say about his Chinese?", c:["It's very good", "It's not very good", "It's difficult", "She can't understand it"] }] },
      { title:"Family", lines:[
        ["A", "你家有幾個人？", "Nǐ jiā yǒu jǐ ge rén?", "How many people are there in your family?"],
        ["B", "我家有五個人：爸爸、媽媽、兩個姊姊和我。", "Wǒ jiā yǒu wǔ ge rén: bàba, māma, liǎng ge jiějie hé wǒ.", "There are five of us: dad, mum, two older sisters and me."],
        ["A", "你有小孩嗎？", "Nǐ yǒu xiǎohái ma?", "Do you have children?"],
        ["B", "有，我有一個兒子。", "Yǒu, wǒ yǒu yí ge érzi.", "Yes, I have a son."],
        ["A", "他幾歲？", "Tā jǐ suì?", "How old is he?"],
        ["B", "他三歲。", "Tā sān suì.", "He's three."]],
        qs:[{ lv:1, q:"How many people are in his family?", c:["5", "4", "3", "6"] },
            { lv:2, q:"Who is in his family?", c:["Dad, mum, two older sisters", "Dad, mum, two older brothers", "Mum and two younger sisters", "Dad, mum, one older sister"] },
            { lv:2, q:"Does he have children?", c:["Yes, a son", "Yes, a daughter", "No", "Yes, two sons"] },
            { lv:3, q:"How old is his son? Type it.", num:"3" }] }
    ]},
  { id:"di-food", name:"Ordering food & drinks", emoji:"🧋", desc:"Bubble tea, a noodle shop, a café.",
    rule:`<ul><li><b>要喝什麼？</b> What would you like to drink? · <b>我要…</b> I'd like…</li>
      <li>🧋 Bubble tea shops ask <b>甜度冰塊呢？</b> sugar and ice? → <b>半糖</b> half sugar · <b>少冰</b> less ice · <b>去冰</b> no ice</li>
      <li><b>大杯 / 中杯</b> large / medium · <b>幾位？</b> how many people? · <b>不用</b> no need</li></ul>`,
    dialogues:[
      { title:"Bubble tea", lines:[
        ["A", "你好，請問要喝什麼？", "Nǐ hǎo, qǐngwèn yào hē shénme?", "Hi, what would you like to drink?"],
        ["B", "我要一杯珍珠奶茶。", "Wǒ yào yì bēi zhēnzhū nǎichá.", "A bubble tea, please."],
        ["A", "大杯還是中杯？", "Dà bēi háishì zhōng bēi?", "Large or medium?"],
        ["B", "大杯。", "Dà bēi.", "Large."],
        ["A", "甜度冰塊呢？", "Tiándù bīngkuài ne?", "How much sugar and ice?"],
        ["B", "半糖少冰。", "Bàn táng shǎo bīng.", "Half sugar, less ice."],
        ["A", "好，一共六十五塊。", "Hǎo, yígòng liùshíwǔ kuài.", "OK, that's 65 dollars."]],
        qs:[{ lv:1, q:"What does the customer order?", c:["Bubble tea", "Coffee", "Black tea", "Juice"] },
            { lv:2, q:"Which size?", c:["Large", "Medium", "Small", "Two cups"] },
            { lv:2, q:"How much sugar?", c:["Half", "None", "Normal", "A lot"] },
            { lv:3, q:"How much does it cost? Type it.", num:"65" }] },
      { title:"Noodle shop", lines:[
        ["A", "歡迎光臨！幾位？", "Huānyíng guānglín! Jǐ wèi?", "Welcome! How many people?"],
        ["B", "兩位。", "Liǎng wèi.", "Two."],
        ["A", "這是菜單。", "Zhè shì càidān.", "Here's the menu."],
        ["B", "我們要兩碗牛肉麵和一盤青菜。", "Wǒmen yào liǎng wǎn niúròumiàn hé yì pán qīngcài.", "We'd like two bowls of beef noodles and a plate of vegetables."],
        ["A", "要喝什麼嗎？", "Yào hē shénme ma?", "Anything to drink?"],
        ["B", "不用，謝謝。", "Búyòng, xièxie.", "No, thanks."]],
        qs:[{ lv:1, q:"How many people?", c:["2", "3", "1", "4"] },
            { lv:2, q:"What do they order?", c:["Beef noodles and vegetables", "Dumplings and soup", "Rice and fish", "Beef noodles and soup"] },
            { lv:3, q:"How many bowls of noodles? Type it.", num:"2" },
            { lv:3, q:"Do they order drinks?", c:["No", "Yes, tea", "Yes, beer", "Yes, water"] }] },
      { title:"At a café", lines:[
        ["A", "我想喝咖啡，你呢？", "Wǒ xiǎng hē kāfēi, nǐ ne?", "I'd like a coffee. And you?"],
        ["B", "我不喝咖啡。我要一杯紅茶。", "Wǒ bù hē kāfēi. Wǒ yào yì bēi hóngchá.", "I don't drink coffee. I'll have a black tea."],
        ["A", "你要吃東西嗎？", "Nǐ yào chī dōngxi ma?", "Do you want something to eat?"],
        ["B", "好，我要一個三明治。", "Hǎo, wǒ yào yí ge sānmíngzhì.", "OK, I'll have a sandwich."],
        ["A", "這裡的蛋糕很好吃！", "Zhèlǐ de dàngāo hěn hǎochī!", "The cake here is really good!"],
        ["B", "真的嗎？那我也要一塊。", "Zhēnde ma? Nà wǒ yě yào yí kuài.", "Really? Then I'll have a piece too."]],
        qs:[{ lv:1, q:"What does the man drink?", c:["Black tea", "Coffee", "Milk", "Juice"] },
            { lv:2, q:"What does the man eat?", c:["A sandwich and cake", "Only cake", "A burger", "Nothing"] },
            { lv:3, q:"Why does he want cake?", c:["She says it's very good here", "It's cheap", "It's his birthday", "He's very hungry"] }] }
    ]},
  { id:"di-shop", name:"Shopping", emoji:"🛍️", desc:"Convenience store, night market, clothes.",
    rule:`<ul><li><b>多少錢？</b> How much? · <b>一共</b> in total · <b>太貴了！</b> too expensive!</li>
      <li>🏪 At the till: <b>要袋子嗎？</b> do you need a bag? · <b>有載具嗎？</b> do you have a receipt barcode? (a Taiwan e-receipt app) · <b>找您…</b> your change is…</li>
      <li>🏮 At the night market you call the stall owner <b>老闆</b> lǎobǎn (“boss”).</li><li><b>可以試穿嗎？</b> Can I try it on?</li></ul>`,
    dialogues:[
      { title:"Convenience store", lines:[
        ["A", "歡迎光臨！", "Huānyíng guānglín!", "Welcome!"],
        ["A", "一共八十九塊。要袋子嗎？", "Yígòng bāshíjiǔ kuài. Yào dàizi ma?", "That's 89 dollars. Do you need a bag?"],
        ["B", "不用，謝謝。", "Búyòng, xièxie.", "No, thanks."],
        ["A", "有載具嗎？", "Yǒu zàijù ma?", "Do you have a receipt barcode?"],
        ["B", "沒有。", "Méiyǒu.", "No."],
        ["A", "收您一百塊，找您十一塊。", "Shōu nín yìbǎi kuài, zhǎo nín shíyī kuài.", "100 dollars received, here's 11 change."]],
        qs:[{ lv:1, q:"Where are they?", c:["In a convenience store", "In a restaurant", "In a bank", "In a taxi"] },
            { lv:2, q:"Does the customer want a bag?", c:["No", "Yes", "Two bags", "A big bag"] },
            { lv:3, q:"How much does it cost? Type it.", num:"89" },
            { lv:3, q:"How much change does he get? Type it.", num:"11" }] },
      { title:"Night market", lines:[
        ["A", "老闆，這個多少錢？", "Lǎobǎn, zhège duōshǎo qián?", "Excuse me, how much is this?"],
        ["B", "一個五十塊，三個一百二十塊。", "Yí ge wǔshí kuài, sān ge yìbǎi èrshí kuài.", "50 dollars each, three for 120."],
        ["A", "太貴了！三個一百塊，好不好？", "Tài guì le! Sān ge yìbǎi kuài, hǎo bù hǎo?", "Too expensive! Three for 100, OK?"],
        ["B", "好啦好啦，一百塊。", "Hǎo la hǎo la, yìbǎi kuài.", "Fine, fine, 100."]],
        qs:[{ lv:1, q:"What does the woman think of the price?", c:["Too expensive", "Very cheap", "Fine", "She doesn't say"] },
            { lv:2, q:"How much is one? Type it.", num:"50" },
            { lv:3, q:"How much does she pay for three? Type it.", num:"100" }] },
      { title:"Buying clothes", lines:[
        ["A", "這件衣服很漂亮。可以試穿嗎？", "Zhè jiàn yīfú hěn piàoliàng. Kěyǐ shìchuān ma?", "This is pretty. Can I try it on?"],
        ["B", "可以，在那邊。", "Kěyǐ, zài nàbiān.", "Sure, over there."],
        ["A", "有沒有大一點的？", "Yǒu méiyǒu dà yìdiǎn de?", "Do you have a bigger one?"],
        ["B", "有，這件比較大。", "Yǒu, zhè jiàn bǐjiào dà.", "Yes, this one is bigger."],
        ["A", "多少錢？", "Duōshǎo qián?", "How much is it?"],
        ["B", "四百九十塊。", "Sìbǎi jiǔshí kuài.", "490 dollars."]],
        qs:[{ lv:1, q:"What is she buying?", c:["Clothes", "Shoes", "A book", "Fruit"] },
            { lv:2, q:"What does she ask for?", c:["A bigger one", "A smaller one", "A cheaper one", "Another colour"] },
            { lv:3, q:"How much is it? Type it.", num:"490" }] }
    ]},
  { id:"di-travel", name:"Getting around", emoji:"🚕", desc:"Asking the way, a taxi, a train ticket.",
    rule:`<ul><li><b>請問…在哪裡？</b> Excuse me, where is…? · <b>往前走</b> go straight · <b>左轉 / 右轉</b> turn left / right · <b>路口</b> intersection</li>
      <li><b>遠不遠？</b> is it far? · <b>走路五分鐘</b> five minutes on foot</li>
      <li>🚕 <b>請到…</b> to …, please · <b>可以刷卡嗎？</b> can I pay by card?</li><li>🎫 <b>一張去台中的票</b> a ticket to Taichung</li></ul>`,
    dialogues:[
      { title:"Asking the way", lines:[
        ["A", "不好意思，請問捷運站在哪裡？", "Bù hǎoyìsi, qǐngwèn jiéyùn zhàn zài nǎlǐ?", "Excuse me, where is the MRT station?"],
        ["B", "往前走，到了路口右轉。", "Wǎng qián zǒu, dào le lùkǒu yòu zhuǎn.", "Go straight, and turn right at the intersection."],
        ["A", "遠不遠？", "Yuǎn bù yuǎn?", "Is it far?"],
        ["B", "不遠，走路五分鐘。", "Bù yuǎn, zǒulù wǔ fēnzhōng.", "Not far, five minutes on foot."],
        ["A", "謝謝！", "Xièxie!", "Thank you!"],
        ["B", "不客氣。", "Bú kèqì.", "You're welcome."]],
        qs:[{ lv:1, q:"What is she looking for?", c:["The MRT station", "A bank", "A toilet", "A bus stop"] },
            { lv:2, q:"Which way?", c:["Straight on, then right", "Straight on, then left", "Left now", "Back the way she came"] },
            { lv:3, q:"How long does it take?", c:["5 minutes on foot", "15 minutes on foot", "5 minutes by bus", "50 minutes"] }] },
      { title:"Taxi", lines:[
        ["A", "你好，請到台北車站。", "Nǐ hǎo, qǐng dào Táiběi chēzhàn.", "Hi, Taipei Main Station, please."],
        ["B", "好。", "Hǎo.", "OK."],
        ["A", "要多久？", "Yào duōjiǔ?", "How long will it take?"],
        ["B", "二十分鐘左右。", "Èrshí fēnzhōng zuǒyòu.", "About twenty minutes."],
        ["B", "到了，一共兩百三十塊。", "Dào le, yígòng liǎngbǎi sānshí kuài.", "We're here. That's 230 dollars."],
        ["A", "可以刷卡嗎？", "Kěyǐ shuākǎ ma?", "Can I pay by card?"],
        ["B", "可以。", "Kěyǐ.", "Yes."]],
        qs:[{ lv:1, q:"Where is she going?", c:["Taipei Main Station", "The airport", "A hotel", "Taichung"] },
            { lv:2, q:"How long does it take?", c:["About 20 minutes", "About 2 hours", "About 10 minutes", "About 30 minutes"] },
            { lv:3, q:"How much is the taxi? Type it.", num:"230" },
            { lv:3, q:"How does she pay?", c:["By card", "In cash", "She doesn't pay", "With her phone"] }] },
      { title:"Train ticket", lines:[
        ["A", "你好，我要一張去台中的票。", "Nǐ hǎo, wǒ yào yì zhāng qù Táizhōng de piào.", "Hi, one ticket to Taichung, please."],
        ["B", "幾點的？", "Jǐ diǎn de?", "For what time?"],
        ["A", "十點半的。", "Shí diǎn bàn de.", "The ten thirty."],
        ["B", "好，七百塊。", "Hǎo, qībǎi kuài.", "OK, 700 dollars."]],
        qs:[{ lv:1, q:"Where is she going?", c:["Taichung", "Taipei", "Kaohsiung", "Tainan"] },
            { lv:2, q:"Which train?", c:["10:30", "10:00", "4:30", "11:30"] },
            { lv:3, q:"How much is the ticket? Type it.", num:"700" }] }
    ]},
  { id:"di-plans", name:"Making plans", emoji:"📆", desc:"Free time, the weekend, a phone call.",
    rule:`<ul><li><b>你明天有空嗎？</b> Are you free tomorrow? · <b>好不好？</b> shall we? / OK?</li>
      <li><b>幾點？</b> what time? · <b>在…見</b> see you at … · <b>明天見</b> see you tomorrow</li>
      <li><b>週末</b> weekend · <b>休息</b> rest · <b>一起</b> together · <b>…吧</b> let's…</li><li>📞 On the phone you say <b>喂？</b> wéi?</li></ul>`,
    dialogues:[
      { title:"Coffee tomorrow", lines:[
        ["A", "你明天有空嗎？", "Nǐ míngtiān yǒu kòng ma?", "Are you free tomorrow?"],
        ["B", "上午要上班，下午有空。", "Shàngwǔ yào shàngbān, xiàwǔ yǒu kòng.", "I work in the morning, but I'm free in the afternoon."],
        ["A", "我們去喝咖啡，好不好？", "Wǒmen qù hē kāfēi, hǎo bù hǎo?", "Shall we go for a coffee?"],
        ["B", "好啊！幾點？", "Hǎo a! Jǐ diǎn?", "Sure! What time?"],
        ["A", "三點半，在捷運站見。", "Sān diǎn bàn, zài jiéyùn zhàn jiàn.", "Half past three. See you at the MRT station."],
        ["B", "好，明天見！", "Hǎo, míngtiān jiàn!", "OK, see you tomorrow!"]],
        qs:[{ lv:1, q:"What will they do?", c:["Have a coffee", "See a film", "Go shopping", "Have dinner"] },
            { lv:2, q:"When is the man free?", c:["Tomorrow afternoon", "Tomorrow morning", "Today", "Tomorrow evening"] },
            { lv:3, q:"When and where will they meet?", c:["3:30 at the MRT station", "3:00 at the MRT station", "3:30 at the café", "4:30 at the station"] }] },
      { title:"The weekend", lines:[
        ["A", "你週末要做什麼？", "Nǐ zhōumò yào zuò shénme?", "What are you doing this weekend?"],
        ["B", "星期六我要去夜市。", "Xīngqíliù wǒ yào qù yèshì.", "On Saturday I'm going to the night market."],
        ["A", "星期天呢？", "Xīngqítiān ne?", "And on Sunday?"],
        ["B", "星期天我想在家休息。", "Xīngqítiān wǒ xiǎng zài jiā xiūxí.", "On Sunday I want to rest at home."],
        ["A", "我也想去夜市！", "Wǒ yě xiǎng qù yèshì!", "I want to go to the night market too!"],
        ["B", "好啊，我們一起去吧。", "Hǎo a, wǒmen yìqǐ qù ba.", "Great, let's go together."]],
        qs:[{ lv:1, q:"Where is he going on Saturday?", c:["To the night market", "To the park", "To the supermarket", "To Taipei"] },
            { lv:2, q:"What will he do on Sunday?", c:["Rest at home", "Work", "Go swimming", "Visit his family"] },
            { lv:3, q:"What do they decide?", c:["To go to the night market together", "To stay at home together", "To go on Sunday", "To go to the cinema"] }] },
      { title:"A phone call", lines:[
        ["A", "喂？", "Wéi?", "Hello?"],
        ["B", "喂，我是小明。今天下雨，我們不去公園了，好嗎？", "Wéi, wǒ shì Xiǎomíng. Jīntiān xiàyǔ, wǒmen bú qù gōngyuán le, hǎo ma?", "Hi, it's Xiaoming. It's raining today, so let's not go to the park, OK?"],
        ["A", "好啊。那我們去看電影吧！", "Hǎo a. Nà wǒmen qù kàn diànyǐng ba!", "OK. Then let's go and see a film!"],
        ["B", "好啊！幾點的電影？", "Hǎo a! Jǐ diǎn de diànyǐng?", "Great! What time is the film?"],
        ["A", "晚上七點。", "Wǎnshàng qī diǎn.", "Seven in the evening."]],
        qs:[{ lv:1, q:"What's the weather like?", c:["It's raining", "It's very hot", "It's cold", "It's sunny"] },
            { lv:2, q:"What will they do instead of the park?", c:["See a film", "Go swimming", "Stay at home", "Go to a café"] },
            { lv:3, q:"What time is the film?", c:["7 pm", "7 am", "1 pm", "10 pm"] }] }
    ]},
  { id:"di-health", name:"Health & weather", emoji:"🤒", desc:"At the doctor's, and talking about the weather.",
    rule:`<ul><li><b>你哪裡不舒服？</b> What's wrong? (where don't you feel well?) · <b>…很痛</b> … hurts</li>
      <li><b>感冒了</b> have a cold · <b>一天吃三次</b> take it three times a day · <b>多喝水，多休息</b> drink a lot, rest a lot</li>
      <li><b>天氣怎麼樣？</b> what's the weather like? · <b>風很大</b> very windy · <b>可能會下雨</b> it might rain</li></ul>`,
    dialogues:[
      { title:"At the doctor's", lines:[
        ["B", "你哪裡不舒服？", "Nǐ nǎlǐ bù shūfu?", "What seems to be the problem?"],
        ["A", "我頭很痛，眼睛也不舒服。", "Wǒ tóu hěn tòng, yǎnjīng yě bù shūfu.", "My head hurts, and my eyes don't feel good either."],
        ["B", "從什麼時候開始的？", "Cóng shénme shíhòu kāishǐ de?", "When did it start?"],
        ["A", "前天晚上。", "Qiántiān wǎnshàng.", "The night before last."],
        ["B", "你感冒了。這個藥一天吃三次，多喝水，多休息。", "Nǐ gǎnmào le. Zhège yào yì tiān chī sān cì, duō hē shuǐ, duō xiūxí.", "You've got a cold. Take this medicine three times a day, drink a lot of water and rest."],
        ["A", "好，謝謝醫生。", "Hǎo, xièxie yīshēng.", "OK, thank you, doctor."]],
        qs:[{ lv:1, q:"Where are they?", c:["At the doctor's", "At school", "At a restaurant", "At the station"] },
            { lv:2, q:"What hurts?", c:["Head", "Tummy", "Foot", "Ears"] },
            { lv:2, q:"When did it start?", c:["The night before last", "Last night", "This morning", "Last week"] },
            { lv:3, q:"How many times a day should she take the medicine? Type it.", num:"3" }] },
      { title:"The weather", lines:[
        ["A", "今天天氣怎麼樣？", "Jīntiān tiānqì zěnmeyàng?", "What's the weather like today?"],
        ["B", "外面風很大，也有點冷。", "Wàimiàn fēng hěn dà, yě yǒudiǎn lěng.", "It's very windy outside, and a bit cold."],
        ["A", "明天呢？", "Míngtiān ne?", "And tomorrow?"],
        ["B", "明天可能會下雨，也會很冷。你要多穿一點衣服。", "Míngtiān kěnéng huì xiàyǔ, yě huì hěn lěng. Nǐ yào duō chuān yìdiǎn yīfú.", "It might rain tomorrow, and it'll be cold. You should wear more clothes."],
        ["A", "好，那我們後天再去公園吧。", "Hǎo, nà wǒmen hòutiān zài qù gōngyuán ba.", "OK, then let's go to the park the day after tomorrow."]],
        qs:[{ lv:1, q:"What's the weather like today?", c:["Windy and a bit cold", "Hot and sunny", "Raining", "Very hot"] },
            { lv:2, q:"What about tomorrow?", c:["It might rain", "It'll be hot", "It'll be sunny", "It'll be windy and hot"] },
            { lv:3, q:"When will they go to the park?", c:["The day after tomorrow", "Tomorrow", "Today", "Next week"] }] }
    ]},
  { id:"di-school", name:"Class & home", emoji:"🏫", desc:"A Chinese class, and visiting a friend's home.",
    rule:`<ul><li><b>第五課</b> lesson five · <b>這個字怎麼念？</b> how do you read this character? · <b>功課</b> homework · <b>太多了！</b> too many!</li>
      <li>🏠 In Taiwan you take your shoes off at home: <b>要脫鞋子嗎？</b> should I take my shoes off?</li>
      <li><b>請進</b> come in · <b>請坐</b> sit down · <b>你住幾樓？</b> which floor do you live on?</li></ul>`,
    dialogues:[
      { title:"Chinese class", lines:[
        ["A", "大家好！今天我們學第五課。", "Dàjiā hǎo! Jīntiān wǒmen xué dì wǔ kè.", "Hello, everyone! Today we're doing lesson five."],
        ["B", "老師，這個字怎麼念？", "Lǎoshī, zhège zì zěnme niàn?", "Teacher, how do you read this character?"],
        ["A", "這個字念「書」。", "Zhège zì niàn \"shū\".", "This character is read \"shū\"."],
        ["B", "是什麼意思？", "Shì shénme yìsi?", "What does it mean?"],
        ["A", "就是我們上課用的書。好，今天的功課是寫十個句子。", "Jiù shì wǒmen shàngkè yòng de shū. Hǎo, jīntiān de gōngkè shì xiě shí ge jùzi.", "It's the book we use in class. OK, today's homework is to write ten sentences."],
        ["B", "十個？太多了！", "Shí ge? Tài duō le!", "Ten? That's too many!"]],
        qs:[{ lv:1, q:"Where are they?", c:["In a Chinese class", "In a bookshop", "In a library", "At home"] },
            { lv:2, q:"Which lesson are they doing?", c:["Lesson 5", "Lesson 4", "Lesson 10", "Lesson 1"] },
            { lv:2, q:"What does the student ask first?", c:["How to read a character", "What the homework is", "What time class ends", "Where his book is"] },
            { lv:3, q:"How many sentences do they have to write? Type it.", num:"10" }] },
      { title:"At a friend's home", lines:[
        ["A", "請進！歡迎！", "Qǐng jìn! Huānyíng!", "Come in! Welcome!"],
        ["B", "謝謝。要脫鞋子嗎？", "Xièxie. Yào tuō xiézi ma?", "Thanks. Should I take my shoes off?"],
        ["A", "要，在家裡我們不穿鞋子。請坐！", "Yào, zài jiā lǐ wǒmen bù chuān xiézi. Qǐng zuò!", "Yes, we don't wear shoes at home. Please sit down!"],
        ["B", "你家很漂亮！你住幾樓？", "Nǐ jiā hěn piàoliàng! Nǐ zhù jǐ lóu?", "Your home is lovely! Which floor do you live on?"],
        ["A", "我住七樓。你要喝茶還是咖啡？", "Wǒ zhù qī lóu. Nǐ yào hē chá háishì kāfēi?", "The seventh floor. Would you like tea or coffee?"],
        ["B", "茶，謝謝。", "Chá, xièxie.", "Tea, thanks."]],
        qs:[{ lv:1, q:"What does the guest ask first?", c:["Whether to take his shoes off", "Where the toilet is", "Which floor it is", "Whether to sit down"] },
            { lv:2, q:"What does the guest drink?", c:["Tea", "Coffee", "Water", "Juice"] },
            { lv:3, q:"Which floor does the host live on? Type it.", num:"7" }] }
    ]}
];

const RATE = { 1:.75, 2:.85, 3:1 };
function make(skill, level){
  // a question at this level, from any dialogue of the skill
  const all = skill.dialogues.flatMap(d => d.qs.filter(q => q.lv === level).map(q => ({ d, q })));
  const { d, q } = pick(all);
  const say = d.lines.map(([who, t, py, en]) => ({ who, t, py, en }));
  const base = { say, bubbles:true, rate:RATE[level], text:`<small class="muted">${d.title}</small><br>${q.q}`, wait:true, key:d.title + q.q,
    reveal:`<p class="muted" style="margin:0">Listen again with 🔊 and follow the text.</p>` };
  if (q.num) return Object.assign(base, { input:"num", answer:q.num });
  return Object.assign(base, { choices:shuffle(q.c.slice()), answer:q.c[0], long:true });
}

ZH.TOPICS.push({ id:"dialogues", title:"Conversations", emoji:"🎧", skills:SKILLS.map(s => Object.assign({
  levels:[
    { name:"The gist", desc:"Slowly. What is it about?" },
    { name:"Details", desc:"Who, what, which one?" },
    { name:"Normal speed", desc:"Numbers and finer details at normal speed" }
  ],
  make(level){ return make(this, level); }
}, s)) });
})();
