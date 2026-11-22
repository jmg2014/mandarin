/* Little words (虛詞): 也 都 只 還 又, 可是 所以, 覺得 最 比, 能 應該 得, 過 了 著, where things are, people…
   These can't be shown with a picture, so each one is practised in hand-written sentences.
   Each sentence: [characters split into words with spaces, pinyin split into the same words with " / ", English, three wrong meanings].
   The wrong meanings change exactly the little word (only ↔ also ↔ not…), so you have to hear it.
   Loaded after sentences/skills.js, and adds its skills to the Sentences topic. */
(function(){
"use strict";
const ZH = window.ZH, { pick, shuffle } = ZH;

const GROUPS = [
  { id:"se-also", name:"也 都 只 還 又", emoji:"➕", desc:"Also, all, only, still, again, with.",
    rule:`<ul><li><b>也</b> yě also · <b>都</b> dōu all / both · <b>只</b> zhǐ only</li>
      <li><b>還</b> hái still, else · <b>還沒</b> not yet · <b>又</b> yòu again</li><li><b>跟</b> gēn with · <b>夠</b> gòu enough</li>
      <li>They go <i>before</i> the verb: 我們<b>都</b>是台灣人 = we're all Taiwanese.</li></ul>`,
    items:[
      ["我們 都 是 台灣人。", "Wǒmen / dōu / shì / Táiwān rén.", "We're all Taiwanese.", ["We're Taiwanese too.", "Only we are Taiwanese.", "We're not all Taiwanese."]],
      ["他們 都 不 喝 酒。", "Tāmen / dōu / bù / hē / jiǔ.", "None of them drink alcohol.", ["They all drink alcohol.", "Only one of them drinks alcohol.", "They drink a little alcohol."]],
      ["我 只 有 一百塊。", "Wǒ / zhǐ / yǒu / yìbǎi kuài.", "I only have 100 dollars.", ["I have 100 dollars too.", "I don't have 100 dollars.", "I have more than 100 dollars."]],
      ["他 只 喝 水。", "Tā / zhǐ / hē / shuǐ.", "He only drinks water.", ["He drinks water too.", "He doesn't drink water.", "He drinks a lot of water."]],
      ["我 也 要 一杯 咖啡。", "Wǒ / yě / yào / yì bēi / kāfēi.", "I'd like a coffee too.", ["I only want a coffee.", "I don't want a coffee.", "I'd like another coffee."]],
      ["你 還 要 什麼？", "Nǐ / hái / yào / shénme?", "What else would you like?", ["What did you want?", "Why do you want it?", "Do you want it too?"]],
      ["他 還沒 來。", "Tā / háiméi / lái.", "He hasn't come yet.", ["He's already here.", "He isn't coming.", "He's come again."]],
      ["他 又 來 了。", "Tā / yòu / lái / le.", "He's come again.", ["He's come too.", "He hasn't come yet.", "He's only just come."]],
      ["我 跟 朋友 去 看 電影。", "Wǒ / gēn / péngyǒu / qù / kàn / diànyǐng.", "I'm going to see a film with a friend.", ["My friend is going to see a film.", "I'm going to see a film without my friend.", "I'm going to see a film for my friend."]],
      ["一百塊 夠 嗎？", "Yìbǎi kuài / gòu / ma?", "Is 100 dollars enough?", ["Is it 100 dollars?", "Is it more than 100 dollars?", "Do you have 100 dollars?"]]
    ]},
  { id:"se-but", name:"可是 所以 因為", emoji:"🔗", desc:"But, so, because: joining two ideas.",
    rule:`<ul><li><b>可是</b> kěshì but · <b>所以</b> suǒyǐ so · <b>因為</b> yīnwèi because</li>
      <li>因為… 所以… go together: <b>因為</b>下雨，<b>所以</b>我不去 = because it's raining, (so) I'm not going.</li>
      <li><b>先</b>… <b>然後</b>… first… then…</li></ul>`,
    items:[
      ["我 想 去， 可是 我 很 忙。", "Wǒ / xiǎng / qù, / kěshì / wǒ / hěn / máng.", "I want to go, but I'm busy.", ["I want to go because I'm not busy.", "I'm busy, so I'm going.", "I don't want to go because I'm busy."]],
      ["今天 下雨， 所以 我 不 去 公園。", "Jīntiān / xiàyǔ, / suǒyǐ / wǒ / bú / qù / gōngyuán.", "It's raining today, so I'm not going to the park.", ["It's raining today, but I'm going to the park.", "It isn't raining today, so I'm going to the park.", "I'm going to the park because it's raining."]],
      ["因為 我 感冒 了， 所以 今天 不 上班。", "Yīnwèi / wǒ / gǎnmào / le, / suǒyǐ / jīntiān / bú / shàngbān.", "I've got a cold, so I'm not going to work today.", ["I've got a cold, but I'm going to work today.", "I'm not going to work tomorrow.", "My colleague has a cold."]],
      ["這個 很 便宜， 可是 不 好吃。", "Zhège / hěn / piányí, / kěshì / bù / hǎochī.", "This is cheap, but it doesn't taste good.", ["This is cheap and tasty.", "This is expensive but tasty.", "This is cheap because it's not tasty."]],
      ["他 很 累， 所以 很 早 睡覺。", "Tā / hěn / lèi, / suǒyǐ / hěn / zǎo / shuìjiào.", "He's tired, so he goes to bed early.", ["He's tired, but he goes to bed late.", "He isn't tired, but he goes to bed early.", "He isn't tired, so he goes to bed late."]],
      ["我 喜歡 台灣， 因為 台灣人 很 好。", "Wǒ / xǐhuān / Táiwān, / yīnwèi / Táiwān rén / hěn / hǎo.", "I like Taiwan because Taiwanese people are nice.", ["I like Taiwan, but Taiwanese people aren't nice.", "I don't like Taiwan.", "Taiwanese people like me."]]
    ]},
  { id:"se-think", name:"覺得 最 比 一樣", emoji:"⚖️", desc:"Opinions and comparing: I think, the most, more than, the same.",
    rule:`<ul><li><b>覺得</b> juéde think / feel · <b>怎麼樣？</b> how is it? what do you think?</li>
      <li><b>最</b> zuì most · <b>非常</b> fēicháng extremely · <b>真</b> zhēn really · <b>有點</b> yǒudiǎn a bit (usually for something negative)</li>
      <li><b>A 比 B</b> + adjective: 哥哥<b>比</b>我高 = my brother is taller than me</li>
      <li><b>A 跟 B 一樣</b> A is the same as B · <b>像</b> xiàng look like</li></ul>`,
    items:[
      ["我 覺得 中文 不 難。", "Wǒ / juéde / Zhōngwén / bù / nán.", "I think Chinese isn't difficult.", ["I think Chinese is very difficult.", "He thinks Chinese isn't difficult.", "I think English isn't difficult."]],
      ["你 覺得 怎麼樣？", "Nǐ / juéde / zěnmeyàng?", "What do you think?", ["How are you?", "Where are you going?", "What do you want?"]],
      ["我 最 喜歡 夏天。", "Wǒ / zuì / xǐhuān / xiàtiān.", "I like summer best.", ["I don't like summer.", "I like summer a bit.", "I like winter best."]],
      ["今天 非常 熱。", "Jīntiān / fēicháng / rè.", "It's extremely hot today.", ["It's a bit hot today.", "It isn't hot today.", "It's extremely cold today."]],
      ["這件 衣服 有點 貴。", "Zhè jiàn / yīfú / yǒudiǎn / guì.", "This piece of clothing is a bit expensive.", ["This piece of clothing is very cheap.", "This is the most expensive piece of clothing.", "This piece of clothing isn't expensive."]],
      ["台灣 真 漂亮！", "Táiwān / zhēn / piàoliàng!", "Taiwan is really beautiful!", ["Is Taiwan beautiful?", "Taiwan isn't very beautiful.", "Taiwan is a bit beautiful."]],
      ["哥哥 比 我 高。", "Gēge / bǐ / wǒ / gāo.", "My older brother is taller than me.", ["I'm taller than my older brother.", "My older brother is as tall as me.", "My older brother is short."]],
      ["我的 手機 跟 你的 一樣。", "Wǒ de / shǒujī / gēn / nǐ de / yíyàng.", "My phone is the same as yours.", ["My phone is better than yours.", "My phone is different from yours.", "My phone is with yours."]],
      ["他 很 像 他 爸爸。", "Tā / hěn / xiàng / tā / bàba.", "He looks a lot like his dad.", ["He likes his dad a lot.", "He doesn't look like his dad.", "He's waiting for his dad."]]
    ]},
  { id:"se-can", name:"能 可以 應該 得", emoji:"✋", desc:"Can, may, should, must, maybe, don't.",
    rule:`<ul><li><b>會</b> huì can (a skill) · <b>能</b> néng can (be able to) · <b>可以</b> kěyǐ may, can (allowed)</li>
      <li><b>應該</b> yīnggāi should · <b>得</b> děi have to · <b>一定</b> yídìng definitely, must</li>
      <li><b>可能</b> kěnéng maybe · <b>別</b> bié don't! · <b>怕</b> pà be afraid of · <b>愛</b> ài love</li></ul>`,
    items:[
      ["我 明天 不能 來。", "Wǒ / míngtiān / bù néng / lái.", "I can't come tomorrow.", ["I can come tomorrow.", "I can't come today.", "I don't want to come tomorrow."]],
      ["你 應該 休息。", "Nǐ / yīnggāi / xiūxí.", "You should rest.", ["You're resting.", "You can't rest.", "I should rest."]],
      ["我 得 走 了。", "Wǒ / děi / zǒu / le.", "I have to go now.", ["I've already gone.", "I don't want to go.", "I can go now."]],
      ["你 一定 要 來！", "Nǐ / yídìng / yào / lái!", "You must come!", ["You don't have to come.", "Maybe you'll come.", "Are you coming?"]],
      ["明天 可能 會 下雨。", "Míngtiān / kěnéng / huì / xiàyǔ.", "It might rain tomorrow.", ["It will definitely rain tomorrow.", "It won't rain tomorrow.", "It rained yesterday."]],
      ["別 怕！", "Bié / pà!", "Don't be afraid!", ["Don't talk!", "Don't go!", "I'm afraid!"]],
      ["我 怕 狗。", "Wǒ / pà / gǒu.", "I'm afraid of dogs.", ["I love dogs.", "I have a dog.", "The dog is afraid of me."]],
      ["我 愛 台灣。", "Wǒ / ài / Táiwān.", "I love Taiwan.", ["I'm in Taiwan.", "I'm going to Taiwan.", "I'm afraid of Taiwan."]],
      ["這裡 可以 照相 嗎？", "Zhèlǐ / kěyǐ / zhàoxiàng / ma?", "Can I take photos here?", ["Can I sit here?", "Do you take photos here?", "Is there a camera here?"]],
      ["別 忘了 帶 手機。", "Bié / wàng le / dài / shǒujī.", "Don't forget to bring your phone.", ["Don't use your phone.", "I forgot my phone.", "Please buy a phone."]]
    ]},
  { id:"se-done", name:"過 了 著 在", emoji:"⏱️", desc:"Have you ever…? It's done. It's happening now.",
    rule:`<ul><li>verb + <b>過</b> guò: have ever done it · 你去<b>過</b>日本嗎？ = have you ever been to Japan?</li>
      <li>verb + <b>了</b> le: it's done · 我吃飽<b>了</b> = I'm full</li><li><b>在</b> + verb: doing it right now · 他<b>在</b>睡覺</li>
      <li>verb + <b>著</b> zhe: a state that continues · 門開<b>著</b> = the door is open</li>
      <li>verb + <b>得</b> de + how: 她說<b>得</b>很好 = she speaks very well · <b>看見</b> see · <b>聽見</b> hear</li></ul>`,
    items:[
      ["你 去過 日本 嗎？", "Nǐ / qù guò / Rìběn / ma?", "Have you ever been to Japan?", ["Are you going to Japan?", "Do you live in Japan?", "Do you like Japan?"]],
      ["我 沒 去過 台南。", "Wǒ / méi / qù guò / Táinán.", "I've never been to Tainan.", ["I've been to Tainan.", "I'm not going to Tainan.", "I live in Tainan."]],
      ["我 吃飽 了。", "Wǒ / chībǎo / le.", "I'm full.", ["I'm hungry.", "I'm eating.", "I want to eat."]],
      ["他 在 睡覺。", "Tā / zài / shuìjiào.", "He's sleeping.", ["He wants to sleep.", "He isn't sleeping.", "He's at home."]],
      ["門 開著。", "Mén / kāi zhe.", "The door is open.", ["The door is closed.", "Please open the door.", "Who opened the door?"]],
      ["他 站 在 門口。", "Tā / zhàn / zài / ménkǒu.", "He's standing at the door.", ["He's sitting at the door.", "He's going out of the door.", "He's waiting at the station."]],
      ["我 看見 他 了。", "Wǒ / kànjiàn / tā / le.", "I saw him.", ["I heard him.", "I didn't see him.", "I'm looking for him."]],
      ["你 聽見 了 嗎？", "Nǐ / tīngjiàn / le / ma?", "Did you hear that?", ["Did you see that?", "Are you listening?", "Did you understand?"]],
      ["他 中文 說得 很 好。", "Tā / Zhōngwén / shuō de / hěn / hǎo.", "He speaks Chinese very well.", ["He speaks Chinese a bit.", "He doesn't speak Chinese well.", "He likes speaking Chinese."]],
      ["請 站起來。", "Qǐng / zhàn qǐlái.", "Please stand up.", ["Please sit down.", "Please come in.", "Please wait."]]
    ]},
  { id:"se-place", name:"Where: inside, outside, nearby", emoji:"🧭", desc:"裡面, 外面, 上面, 附近, 從, 進…",
    rule:`<ul><li><b>上面</b> on · <b>下面</b> under · <b>裡面</b> inside · <b>外面 / 外頭</b> outside</li>
      <li><b>附近</b> fùjìn nearby · <b>那裡</b> nàlǐ there · <b>地方</b> dìfāng place</li>
      <li><b>從</b> cóng from · <b>進</b> jìn come in · <b>帶</b> dài bring · <b>拿</b> ná take, hold · <b>就</b> jiù just, right (here)</li></ul>`,
    items:[
      ["手機 在 桌子 上面。", "Shǒujī / zài / zhuōzi / shàngmiàn.", "The phone is on the table.", ["The phone is under the table.", "The phone is next to the table.", "The table is on the phone."]],
      ["鞋子 在 床 下面。", "Xiézi / zài / chuáng / xiàmiàn.", "The shoes are under the bed.", ["The shoes are on the bed.", "The shoes are next to the bed.", "The bed is under the shoes."]],
      ["他 在 外面 等 你。", "Tā / zài / wàimiàn / děng / nǐ.", "He's waiting for you outside.", ["He's waiting for you inside.", "He's outside looking for you.", "You're waiting for him outside."]],
      ["外頭 很 冷。", "Wàitou / hěn / lěng.", "It's cold outside.", ["It's hot outside.", "It's cold inside.", "It's cold today."]],
      ["請 進！", "Qǐng / jìn!", "Come in, please!", ["Please go!", "Please wait!", "Please sit down!"]],
      ["裡面 有 人 嗎？", "Lǐmiàn / yǒu / rén / ma?", "Is there anyone inside?", ["Is there anyone outside?", "Who is inside?", "How many people are inside?"]],
      ["這 附近 有 便利商店 嗎？", "Zhè / fùjìn / yǒu / biànlì shāngdiàn / ma?", "Is there a convenience store near here?", ["Where is the convenience store?", "Is the convenience store open?", "Is this a convenience store?"]],
      ["那裡 人 很 多。", "Nàlǐ / rén / hěn / duō.", "There are a lot of people there.", ["There are few people there.", "There are a lot of people here.", "Who is there?"]],
      ["這 是 什麼 地方？", "Zhè / shì / shénme / dìfāng?", "What place is this?", ["What is this?", "Where are you going?", "Where is the toilet?"]],
      ["他 從 日本 來。", "Tā / cóng / Rìběn / lái.", "He comes from Japan.", ["He's going to Japan.", "He lives in Japan.", "He doesn't like Japan."]],
      ["車站 就 在 前面。", "Chēzhàn / jiù / zài / qiánmiàn.", "The station is just ahead.", ["The station is far away.", "The station is behind us.", "Where's the station?"]],
      ["請 幫 我 拿 一下。", "Qǐng / bāng / wǒ / ná / yíxià.", "Could you hold / get this for me?", ["Could you wait a moment?", "Could you buy this for me?", "Could you say that again?"]],
      ["門口 有 一輛 計程車。", "Ménkǒu / yǒu / yí liàng / jìchéngchē.", "There's a taxi at the door.", ["There's a bus at the door.", "There are two taxis at the door.", "Please call a taxi."]]
    ]},
  { id:"se-people", name:"People: you all, everyone, myself", emoji:"🧑‍🤝‍🧑", desc:"你們, 大家, 自己, 它, surnames, the first time…",
    rule:`<ul><li><b>你們</b> you (plural) · <b>大家</b> everyone · <b>自己</b> oneself · <b>它 / 它們</b> it / they (things) · 🇹🇼 for animals Taiwan writes <b>牠 / 牠們</b> (same sound, tā)</li>
      <li><b>貴姓？</b> your surname? (polite) → <b>我姓王</b> my surname is Wang · <b>姓名</b> full name</li>
      <li><b>第一次</b> the first time · <b>家人</b> family · <b>國家</b> country · <b>小姐</b> miss · <b>男</b> man, male · <b>孩子</b> child</li></ul>`,
    items:[
      ["你們 好！", "Nǐmen / hǎo!", "Hello, all of you!", ["Hello! (to one person)", "Goodbye, everyone!", "Thank you, everyone!"]],
      ["大家 好！", "Dàjiā / hǎo!", "Hello, everyone!", ["Goodbye, everyone!", "Thank you, everyone!", "Hello, teacher!"]],
      ["請問 您 貴姓？", "Qǐngwèn / nín / guìxìng?", "May I ask your surname?", ["May I ask how old you are?", "May I ask where you live?", "May I ask your phone number?"]],
      ["我 姓 王。", "Wǒ / xìng / Wáng.", "My surname is Wang.", ["My first name is Wang.", "I know Mr Wang.", "I'm Wang's friend."]],
      ["請 寫 你的 姓名。", "Qǐng / xiě / nǐ de / xìngmíng.", "Please write your full name.", ["Please say your full name.", "Please write your address.", "Please write your phone number."]],
      ["這 是 我 第一次 來 台灣。", "Zhè / shì / wǒ / dì yī cì / lái / Táiwān.", "This is my first time in Taiwan.", ["This is my second time in Taiwan.", "I come to Taiwan every year.", "I've never been to Taiwan."]],
      ["我 學 中文 學了 兩年。", "Wǒ / xué / Zhōngwén / xué le / liǎng nián.", "I've studied Chinese for two years.", ["I've studied Chinese for two months.", "I'll study Chinese for two years.", "I studied Chinese two years ago."]],
      ["我 有 一個 兒子， 一個 女兒。", "Wǒ / yǒu / yí ge / érzi, / yí ge / nǚ'ér.", "I have a son and a daughter.", ["I have two sons.", "I have two daughters.", "I don't have any children."]],
      ["你的 孩子 是 男 的 還是 女 的？", "Nǐ de / háizi / shì / nán / de / háishì / nǚ / de?", "Is your child a boy or a girl?", ["How old is your child?", "Where is your child?", "Do you have any children?"]],
      ["小姐， 請問 洗手間 在 哪裡？", "Xiǎojiě, / qǐngwèn / xǐshǒujiān / zài / nǎlǐ?", "Excuse me, miss, where's the toilet?", ["Excuse me, sir, where's the toilet?", "Excuse me, miss, where's the station?", "Excuse me, miss, how much is this?"]],
      ["我 很 想 我的 家人。", "Wǒ / hěn / xiǎng / wǒ de / jiārén.", "I miss my family a lot.", ["I live with my family.", "My family misses me.", "I'm going to see my family."]],
      ["你 去過 幾個 國家？", "Nǐ / qù guò / jǐ ge / guójiā?", "How many countries have you been to?", ["Which country are you from?", "Which countries do you like?", "How many people are in your family?"]],
      ["我 自己 煮飯。", "Wǒ / zìjǐ / zhǔfàn.", "I cook for myself.", ["My mum cooks for me.", "I don't cook.", "We cook together."]],
      ["我 有 一隻 狗， 牠 很 可愛。", "Wǒ / yǒu / yì zhī / gǒu, / tā / hěn / kě'ài.", "I have a dog; it's very cute.", ["I have a cat; it's very cute.", "I have two dogs.", "I want a dog."]],
      ["我 有 兩隻 貓， 牠們 都 很 胖。", "Wǒ / yǒu / liǎng zhī / māo, / tāmen / dōu / hěn / pàng.", "I have two cats, and they're both fat.", ["I have two cats, and they're both thin.", "I have one fat cat.", "I have two dogs, and they're both fat."]],
      ["我的 手機 很 舊 了， 它 常常 有 問題。", "Wǒ de / shǒujī / hěn / jiù / le, / tā / chángcháng / yǒu / wèntí.", "My phone is old now; it often has problems.", ["My phone is new; it never has problems.", "My phone is old, but it works well.", "I often have problems with my computer."]],
      ["這些 書 都 很 舊， 它們 是 我 爸爸 的。", "Zhèxiē / shū / dōu / hěn / jiù, / tāmen / shì / wǒ / bàba / de.", "These books are all old; they're my dad's.", ["These books are all new; they're my dad's.", "These books are old; they're mine.", "My dad wants to buy these old books."]],
      ["沒事， 我 很 好。", "Méishì, / wǒ / hěn / hǎo.", "It's nothing, I'm fine.", ["I'm busy, sorry.", "I'm not well.", "I have no money."]],
      ["我 想 買 一些 水果。", "Wǒ / xiǎng / mǎi / yìxiē / shuǐguǒ.", "I'd like to buy some fruit.", ["I'd like to eat some fruit.", "I don't want any fruit.", "I'd like to buy a lot of fruit."]]
    ]},
  { id:"se-already", name:"已經 剛剛 才 總是", emoji:"🕰️", desc:"Already, just now, only then, always, sometimes, lately…",
    rule:`<ul><li><b>已經</b> yǐjīng already · <b>剛剛</b> gānggāng just now · <b>一會兒</b> yìhuǐr a moment</li>
      <li><b>有時候</b> sometimes · <b>平常</b> usually · <b>總是</b> always · <b>最近</b> lately</li>
      <li><b>才</b> cái only then (later than expected): 他十點<b>才</b>來 = he didn't come until ten</li>
      <li><b>後來</b> later on · <b>最後</b> in the end · <b>本來</b> originally · <b>從前</b> once upon a time · <b>過年</b> (celebrate) New Year</li></ul>`,
    items:[
      ["我 已經 吃飯 了。", "Wǒ / yǐjīng / chīfàn / le.", "I've already eaten.", ["I haven't eaten yet.", "I'm going to eat.", "I never eat here."]],
      ["他 剛剛 走 了。", "Tā / gānggāng / zǒu / le.", "He's just left.", ["He left a long time ago.", "He's about to leave.", "He hasn't left yet."]],
      ["我們 休息 一會兒 吧。", "Wǒmen / xiūxí / yìhuǐr / ba.", "Let's rest for a moment.", ["Let's rest all day.", "We rested for an hour.", "Let's not rest."]],
      ["我 有時候 坐 捷運， 有時候 騎 機車。", "Wǒ / yǒushíhòu / zuò / jiéyùn, / yǒushíhòu / qí / jīchē.", "Sometimes I take the MRT, sometimes I ride a scooter.", ["I always take the MRT.", "I take the MRT, then ride a scooter.", "I never ride a scooter."]],
      ["你 平常 幾點 起床？", "Nǐ / píngcháng / jǐ diǎn / qǐchuáng?", "What time do you usually get up?", ["What time did you get up today?", "What time will you get up tomorrow?", "Why do you get up so early?"]],
      ["他 總是 很 忙。", "Tā / zǒngshì / hěn / máng.", "He's always busy.", ["He's sometimes busy.", "He's never busy.", "He's busy today."]],
      ["一直 往 前 走。", "Yìzhí / wǎng / qián / zǒu.", "Go straight on.", ["Turn left.", "Go back.", "Stop here."]],
      ["他 十點 才 來。", "Tā / shí diǎn / cái / lái.", "He didn't come until ten.", ["He came before ten.", "He left at ten.", "He came at nine."]],
      ["他 後來 去 了 美國。", "Tā / hòulái / qù / le / Měiguó.", "Later on, he went to America.", ["He went to America first.", "He never went to America.", "He's going to America tomorrow."]],
      ["最後， 我們 去 了 夜市。", "Zuìhòu, / wǒmen / qù / le / yèshì.", "In the end, we went to the night market.", ["First we went to the night market.", "We didn't go to the night market.", "We go to the night market every day."]],
      ["從前 有 一個 老人……", "Cóngqián / yǒu / yí ge / lǎorén……", "Once upon a time there was an old man…", ["Now there's an old man…", "Is there an old man?", "There will be an old man…"]],
      ["我 本來 想 去， 可是 下雨 了。", "Wǒ / běnlái / xiǎng / qù, / kěshì / xiàyǔ / le.", "I was going to go, but it rained.", ["I went because it rained.", "I didn't want to go.", "I'll go when it rains."]],
      ["你 最近 好 嗎？", "Nǐ / zuìjìn / hǎo / ma?", "How have you been lately?", ["How was your day?", "Where have you been?", "Are you OK now?"]],
      ["過年 的 時候， 我們 都 回家。", "Guònián / de / shíhòu, / wǒmen / dōu / huí jiā.", "At New Year, we all go home.", ["At New Year, we all go travelling.", "At New Year, we stay in Taipei.", "We go home every weekend."]]
    ]},
  { id:"se-if", name:"如果 雖然 或是 當然", emoji:"🔀", desc:"If, although, or, of course, even more, seems, almost…",
    rule:`<ul><li><b>如果 / 要是</b>… <b>就</b>… if… then… · <b>雖然</b>… <b>但是</b>… although… (but)…</li>
      <li><b>不過</b> but, however · <b>或是</b> or · <b>當然</b> of course · <b>更</b> even more</li>
      <li><b>這麼 / 那麼</b> so (this / that) · <b>好像</b> seems · <b>差不多</b> almost, about · <b>以為</b> thought (wrongly) · <b>呀</b> softens: 好呀！</li></ul>`,
    items:[
      ["如果 明天 下雨， 我們 就 不 去。", "Rúguǒ / míngtiān / xiàyǔ, / wǒmen / jiù / bú / qù.", "If it rains tomorrow, we won't go.", ["It's raining tomorrow, so we won't go.", "Even if it rains tomorrow, we'll go.", "If it doesn't rain tomorrow, we won't go."]],
      ["要是 你 有空， 來 我 家 吧。", "Yàoshì / nǐ / yǒukòng, / lái / wǒ / jiā / ba.", "If you're free, come over to my place.", ["If you're busy, come over to my place.", "If you're free, I'll come to your place.", "You're never free."]],
      ["雖然 很 貴， 但是 很 好吃。", "Suīrán / hěn / guì, / dànshì / hěn / hǎochī.", "Although it's expensive, it's delicious.", ["It's expensive and not very good.", "It's cheap and delicious.", "Because it's expensive, it's delicious."]],
      ["這家 店 不錯， 不過 有點 遠。", "Zhè jiā / diàn / búcuò, / búguò / yǒudiǎn / yuǎn.", "This shop is good, but it's a bit far.", ["This shop is good and close by.", "This shop isn't good, and it's far.", "This shop is far, so it isn't good."]],
      ["我們 可以 坐 捷運 或是 公車。", "Wǒmen / kěyǐ / zuò / jiéyùn / huòshì / gōngchē.", "We can take the MRT or the bus.", ["We have to take the MRT and then the bus.", "We can only take the MRT.", "We can't take the bus."]],
      ["當然 可以！", "Dāngrán / kěyǐ!", "Of course!", ["Maybe.", "No, you can't.", "I don't know."]],
      ["今天 比 昨天 更 冷。", "Jīntiān / bǐ / zuótiān / gèng / lěng.", "Today is even colder than yesterday.", ["Today is warmer than yesterday.", "Yesterday was colder than today.", "Today is as cold as yesterday."]],
      ["中文 沒有 那麼 難。", "Zhōngwén / méiyǒu / nàme / nán.", "Chinese isn't that difficult.", ["Chinese is very difficult.", "Chinese is more difficult than English.", "Chinese is the most difficult language."]],
      ["你的 中文 怎麼 這麼 好？", "Nǐ de / Zhōngwén / zěnme / zhème / hǎo?", "How is your Chinese so good?", ["Is your Chinese good?", "Your Chinese isn't very good.", "How do you study Chinese?"]],
      ["他 好像 生病 了。", "Tā / hǎoxiàng / shēngbìng / le.", "He seems to be ill.", ["He's definitely ill.", "He isn't ill.", "He was ill yesterday."]],
      ["我們 差不多 到 了。", "Wǒmen / chàbùduō / dào / le.", "We're almost there.", ["We've already arrived.", "We're still a long way away.", "We're lost."]],
      ["我 以為 你 是 日本人。", "Wǒ / yǐwéi / nǐ / shì / Rìběn rén.", "I thought you were Japanese.", ["I know you're Japanese.", "You think I'm Japanese.", "I hope you're Japanese."]],
      ["好 呀！", "Hǎo / ya!", "Sure, sounds good!", ["No way!", "Really?", "Maybe later."]]
    ]},
  { id:"se-ba", name:"把 被 讓 替", emoji:"🔄", desc:"Doing something to something: 把, 被, 讓, 替, and -ly (地).",
    rule:`<ul><li><b>把</b> bǎ puts the thing before the verb: 請<b>把</b>門關上 = please close the door</li>
      <li><b>被</b> bèi: something is done <i>to</i> it: 蛋糕<b>被</b>弟弟吃了 = the cake was eaten by my brother</li>
      <li><b>讓</b> ràng let, make · <b>替</b> tì for, instead of · <b>地</b> de makes “-ly”: 慢慢<b>地</b>說 = speak slowly</li>
      <li><b>掉</b> fall, drop · <b>變</b> become · <b>拉</b> pull · <b>壞</b> broken · <b>掛</b> hang</li></ul>`,
    items:[
      ["請 把 門 關上。", "Qǐng / bǎ / mén / guān shàng.", "Please close the door.", ["Please open the door.", "The door is closed.", "Who closed the door?"]],
      ["把 衣服 掛起來。", "Bǎ / yīfú / guà qǐlái.", "Hang up your clothes.", ["Put your clothes on.", "Wash your clothes.", "Buy some clothes."]],
      ["我的 蛋糕 被 弟弟 吃 了。", "Wǒ de / dàngāo / bèi / dìdi / chī / le.", "My cake was eaten by my younger brother.", ["I ate my brother's cake.", "My brother gave me a cake.", "My brother wants to eat my cake."]],
      ["媽媽 不 讓 我 出去。", "Māma / bú / ràng / wǒ / chūqù.", "Mum won't let me go out.", ["Mum wants me to go out.", "Mum is going out.", "I won't let Mum go out."]],
      ["我 替 你 買。", "Wǒ / tì / nǐ / mǎi.", "I'll buy it for you.", ["You buy it for me.", "Let's buy it together.", "I bought it with you."]],
      ["請 慢慢 地 說。", "Qǐng / mànmàn / de / shuō.", "Please speak slowly.", ["Please speak louder.", "Please speak faster.", "Please don't speak."]],
      ["我的 手機 掉 在 地 上 了。", "Wǒ de / shǒujī / diào / zài / dì / shàng / le.", "My phone fell on the floor.", ["My phone is on the table.", "I can't find my phone.", "My phone is broken."]],
      ["天氣 變 冷 了。", "Tiānqì / biàn / lěng / le.", "The weather has turned cold.", ["The weather is hot.", "It'll be cold tomorrow.", "It's always cold here."]],
      ["請 拉 門。", "Qǐng / lā / mén.", "Pull the door, please.", ["Push the door, please.", "Close the door, please.", "Open the window, please."]],
      ["我的 電腦 壞 了。", "Wǒ de / diànnǎo / huài / le.", "My computer is broken.", ["My computer is new.", "I want a computer.", "My computer is very fast."]]
    ]},
  { id:"se-give", name:"Give, send, borrow, pay", emoji:"🎁", desc:"送, 寄, 借, 還, 接, 付, 賣, 試…",
    rule:`<ul><li><b>送</b> sòng give (a present) · <b>寄</b> jì send by post · <b>接</b> jiē pick up, meet · <b>借</b> jiè borrow, lend · <b>還</b> huán give back</li>
      <li><b>付</b> fù pay · <b>賣</b> mài sell (買 mǎi buy: only the tone differs!) · <b>試</b> shì try · <b>加</b> jiā add · <b>算</b> suàn count, work out</li>
      <li><b>講</b> jiǎng speak (Taiwan uses it a lot) · <b>回答 / 答</b> answer · <b>搬</b> move · <b>洗</b> wash · <b>沒電</b> out of battery</li></ul>`,
    items:[
      ["這 是 送 你 的 禮物。", "Zhè / shì / sòng / nǐ / de / lǐwù.", "This is a present for you.", ["This is my present.", "I want a present.", "Thank you for the present."]],
      ["我 要 寄 一封 信 到 西班牙。", "Wǒ / yào / jì / yì fēng / xìn / dào / Xībānyá.", "I'd like to send a letter to Spain.", ["I got a letter from Spain.", "I want to write a letter.", "I'm going to Spain."]],
      ["請 給 我 一個 信封。", "Qǐng / gěi / wǒ / yí ge / xìnfēng.", "Please give me an envelope.", ["Please give me a letter.", "Please give me some paper.", "Please give me a pen."]],
      ["我 去 機場 接 你。", "Wǒ / qù / jīchǎng / jiē / nǐ.", "I'll pick you up at the airport.", ["I'll take you to the airport.", "I'm at the airport.", "Pick me up at the airport."]],
      ["可以 借 我 一枝 筆 嗎？", "Kěyǐ / jiè / wǒ / yì zhī / bǐ / ma?", "Could you lend me a pen?", ["Could I buy a pen?", "Do you have a pen?", "Could you give me back my pen?"]],
      ["我 明天 還 你。", "Wǒ / míngtiān / huán / nǐ.", "I'll give it back to you tomorrow.", ["I'll buy it tomorrow.", "Give it back to me tomorrow.", "I gave it back yesterday."]],
      ["咖啡 要 加 糖 嗎？", "Kāfēi / yào / jiā / táng / ma?", "Would you like sugar in your coffee?", ["Is the coffee sweet?", "Would you like a coffee?", "Would you like milk in your coffee?"]],
      ["我 算 一下， 一共 三百五十塊。", "Wǒ / suàn / yíxià, / yígòng / sānbǎi wǔshí kuài.", "Let me add it up: 350 dollars in total.", ["Let me add it up: 315 dollars in total.", "That's 350 dollars each.", "Could you add it up for me?"]],
      ["請 講 慢 一點。", "Qǐng / jiǎng / màn / yìdiǎn.", "Please speak a bit more slowly.", ["Please speak louder.", "Please speak English.", "Please don't speak."]],
      ["請 回答 我的 問題。", "Qǐng / huídá / wǒ de / wèntí.", "Please answer my question.", ["Please ask me a question.", "I don't understand the question.", "Please repeat the question."]],
      ["這個 問題 很 難 答。", "Zhège / wèntí / hěn / nán / dá.", "This question is hard to answer.", ["This question is easy.", "I don't have any questions.", "Who asked this question?"]],
      ["我 來 付 錢。", "Wǒ / lái / fù / qián.", "I'll pay.", ["You pay.", "How much is it?", "I have no money."]],
      ["這家 店 賣 什麼？", "Zhè jiā / diàn / mài / shénme?", "What does this shop sell?", ["What did you buy in this shop?", "Where is this shop?", "When does this shop open?"]],
      ["我 可以 試試 嗎？", "Wǒ / kěyǐ / shìshì / ma?", "Can I try it?", ["Can I buy it?", "Do you like it?", "Can I see it?"]],
      ["幫 我 搬 這張 桌子， 好 嗎？", "Bāng / wǒ / bān / zhè zhāng / zhuōzi, / hǎo / ma?", "Could you help me move this table?", ["Could you help me buy this table?", "Is this table heavy?", "Can I sit at this table?"]],
      ["吃飯 以前 要 洗 手。", "Chīfàn / yǐqián / yào / xǐ / shǒu.", "Wash your hands before you eat.", ["Wash your hands after you eat.", "Do the washing-up before you eat.", "Don't eat with your hands."]],
      ["我的 手機 沒 電 了。", "Wǒ de / shǒujī / méi / diàn / le.", "My phone's battery is dead.", ["My phone is broken.", "I don't have a phone.", "My phone is fully charged."]]
    ]},
  { id:"se-plan", name:"相信 希望 打算 決定", emoji:"🧠", desc:"Believe, hope, plan, decide, remember, realise, need…",
    rule:`<ul><li><b>相信</b> believe · <b>願意</b> be willing · <b>習慣</b> be used to · <b>希望</b> hope</li>
      <li><b>打算</b> plan to · <b>準備</b> prepare · <b>決定</b> decide · <b>記得</b> remember · <b>認為</b> think (an opinion)</li>
      <li><b>發現</b> realise, find out · <b>聽說</b> hear that · <b>注意</b> pay attention · <b>努力</b> work hard · <b>進步</b> improve · <b>參加</b> take part · <b>需要</b> need</li></ul>`,
    items:[
      ["我 相信 你。", "Wǒ / xiāngxìn / nǐ.", "I believe you.", ["I don't believe you.", "Do you believe me?", "I'm waiting for you."]],
      ["你 願意 幫 我 嗎？", "Nǐ / yuànyì / bāng / wǒ / ma?", "Would you be willing to help me?", ["Do you want me to help you?", "Did you help me?", "Why won't you help me?"]],
      ["我 已經 習慣 台灣 的 天氣 了。", "Wǒ / yǐjīng / xíguàn / Táiwān / de / tiānqì / le.", "I'm used to Taiwan's weather now.", ["I don't like Taiwan's weather.", "Taiwan's weather is strange.", "I'm not used to Taiwan's weather."]],
      ["希望 明天 天氣 好。", "Xīwàng / míngtiān / tiānqì / hǎo.", "I hope the weather's nice tomorrow.", ["The weather will be nice tomorrow.", "The weather was nice yesterday.", "I hope it rains tomorrow."]],
      ["你 週末 打算 做 什麼？", "Nǐ / zhōumò / dǎsuàn / zuò / shénme?", "What are you planning to do this weekend?", ["What did you do last weekend?", "Do you work at weekends?", "Where do you go at weekends?"]],
      ["我 在 準備 考試。", "Wǒ / zài / zhǔnbèi / kǎoshì.", "I'm preparing for an exam.", ["I've finished my exam.", "I don't have an exam.", "I'm in the middle of an exam."]],
      ["我 決定 學 中文。", "Wǒ / juédìng / xué / Zhōngwén.", "I've decided to learn Chinese.", ["I've stopped learning Chinese.", "I'm thinking about learning Chinese.", "I've learned Chinese for years."]],
      ["你 記得 我 嗎？", "Nǐ / jìde / wǒ / ma?", "Do you remember me?", ["Do you like me?", "Can you see me?", "Are you looking for me?"]],
      ["我 認為 這個 辦法 很 好。", "Wǒ / rènwéi / zhège / bànfǎ / hěn / hǎo.", "I think this is a good solution.", ["I don't think this is a good solution.", "He thinks this is a good solution.", "This solution is too difficult."]],
      ["我 發現 我的 錢包 不見 了。", "Wǒ / fāxiàn / wǒ de / qiánbāo / bú jiàn / le.", "I realised my wallet was gone.", ["I found my wallet.", "I bought a new wallet.", "My wallet is in my bag."]],
      ["聽說 明天 會 下雪。", "Tīngshuō / míngtiān / huì / xiàxuě.", "I heard it's going to snow tomorrow.", ["It snowed yesterday.", "It won't snow tomorrow.", "I hope it snows tomorrow."]],
      ["上課 的 時候 要 注意 聽。", "Shàngkè / de / shíhòu / yào / zhùyì / tīng.", "Pay attention in class.", ["Don't talk in class.", "Class is about to start.", "Listen to music after class."]],
      ["他 很 努力。", "Tā / hěn / nǔlì.", "He works very hard.", ["He's very tired.", "He's very clever.", "He's very busy."]],
      ["你的 中文 進步 了 很 多。", "Nǐ de / Zhōngwén / jìnbù / le / hěn / duō.", "Your Chinese has improved a lot.", ["Your Chinese is perfect.", "Your Chinese hasn't improved.", "You speak a lot of Chinese."]],
      ["你 要 參加 比賽 嗎？", "Nǐ / yào / cānjiā / bǐsài / ma?", "Are you going to take part in the competition?", ["Are you going to watch the match?", "Did you win the match?", "When is the match?"]],
      ["你 需要 幫忙 嗎？", "Nǐ / xūyào / bāngmáng / ma?", "Do you need any help?", ["Can you help me?", "Thank you for your help.", "Who needs help?"]]
    ]},
  { id:"se-idea", name:"Ideas: important, useful, strange", emoji:"💡", desc:"想法, 經驗, 機會, 辦法, 重要, 有用, 清楚, 奇怪, 棒, 行…",
    rule:`<ul><li><b>想法</b> idea · <b>經驗</b> experience · <b>能力</b> ability · <b>機會</b> chance · <b>計畫</b> plan · <b>辦法</b> way, solution · <b>方法</b> method · <b>文化</b> culture</li>
      <li><b>重要</b> important · <b>有用</b> useful · <b>清楚</b> clear · <b>簡單</b> simple · <b>特別</b> special · <b>奇怪</b> strange</li>
      <li><b>棒</b> bàng great! · <b>行</b> xíng OK, will do · <b>行</b> háng a line of work</li></ul>`,
    items:[
      ["這 是 一個 好 想法。", "Zhè / shì / yí ge / hǎo / xiǎngfǎ.", "That's a good idea.", ["That's a bad idea.", "Whose idea is it?", "I don't have any ideas."]],
      ["你 有 工作 經驗 嗎？", "Nǐ / yǒu / gōngzuò / jīngyàn / ma?", "Do you have any work experience?", ["Do you have a job?", "Do you like your job?", "Where do you work?"]],
      ["他 有 能力 做 這個 工作。", "Tā / yǒu / nénglì / zuò / zhège / gōngzuò.", "He's able to do this job.", ["He doesn't want to do this job.", "He likes this job.", "He's looking for a job."]],
      ["這 是 一個 好 機會。", "Zhè / shì / yí ge / hǎo / jīhuì.", "This is a good opportunity.", ["This is a good idea.", "This is a big problem.", "This was a bad time."]],
      ["我們 的 計畫 是 什麼？", "Wǒmen / de / jìhuà / shì / shénme?", "What's our plan?", ["What's our problem?", "Where are we going?", "What's for dinner?"]],
      ["我 沒有 辦法。", "Wǒ / méiyǒu / bànfǎ.", "There's nothing I can do.", ["I've got an idea.", "I don't have time.", "I don't have any money."]],
      ["學 中文 最好 的 方法 是 什麼？", "Xué / Zhōngwén / zuì hǎo / de / fāngfǎ / shì / shénme?", "What's the best way to learn Chinese?", ["Why learn Chinese?", "Where can I learn Chinese?", "Is Chinese hard to learn?"]],
      ["台灣 的 文化 很 有意思。", "Táiwān / de / wénhuà / hěn / yǒu yìsi.", "Taiwanese culture is very interesting.", ["Taiwanese food is very interesting.", "Taiwanese culture is strange.", "I don't know Taiwanese culture."]],
      ["這件 事情 很 重要。", "Zhè jiàn / shìqíng / hěn / zhòngyào.", "This matter is very important.", ["This isn't important.", "This is very difficult.", "This is very simple."]],
      ["這本 書 很 有用。", "Zhè běn / shū / hěn / yǒuyòng.", "This book is very useful.", ["This book is very boring.", "This book is very new.", "This book is very cheap."]],
      ["我 聽 不 清楚。", "Wǒ / tīng / bù / qīngchǔ.", "I can't hear clearly.", ["I can hear you clearly.", "I can't see clearly.", "I don't want to listen."]],
      ["這個 問題 很 簡單。", "Zhège / wèntí / hěn / jiǎndān.", "This question is simple.", ["This question is very hard.", "This question is very strange.", "This isn't a question."]],
      ["這個 味道 很 特別。", "Zhège / wèidào / hěn / tèbié.", "This flavour is really unusual.", ["This tastes awful.", "This has no taste.", "This tastes like coffee."]],
      ["好 奇怪！", "Hǎo / qíguài!", "How strange!", ["How great!", "How beautiful!", "How sad!"]],
      ["你 真 棒！", "Nǐ / zhēn / bàng!", "You're great! Well done!", ["You're so funny!", "You look so tired!", "You're really late!"]],
      ["明天 三點， 行 嗎？", "Míngtiān / sān diǎn, / xíng / ma?", "Tomorrow at three, is that OK?", ["What time tomorrow?", "Tomorrow at three, where?", "Is it three o'clock now?"]],
      ["你 做 哪 一 行？", "Nǐ / zuò / nǎ / yì / háng?", "What line of work are you in?", ["Where do you live?", "What are you doing now?", "Which way are you going?"]]
    ]},
  { id:"se-measure", name:"Measure words & how much", emoji:"📏", desc:"雙 片 份 道 部 種 間 盒 名 句, half, all, some, others…",
    rule:`<ul><li><b>雙</b> shuāng a pair · <b>片</b> piàn a slice · <b>份</b> fèn a portion · <b>道</b> dào a dish · <b>部</b> bù a film · <b>場</b> chǎng a match, a show</li>
      <li><b>種</b> zhǒng a kind · <b>間</b> jiān a room · <b>盒</b> hé a box · <b>名</b> míng a place (第一名 first place) · <b>句</b> jù a sentence · <b>張</b> a picture, a ticket · <b>餐</b> cān a meal</li>
      <li><b>一半</b> half · <b>全部</b> all of it · <b>所有的</b> all · <b>其他</b> other · <b>各</b> each · <b>有的</b> some · <b>大部分</b> most</li></ul>`,
    items:[
      ["這雙 鞋子 多少錢？", "Zhè shuāng / xiézi / duōshǎo qián?", "How much is this pair of shoes?", ["How much is one shoe?", "How many shoes do you have?", "Where are my shoes?"]],
      ["我 吃 了 一片 蛋糕。", "Wǒ / chī / le / yí piàn / dàngāo.", "I ate a slice of cake.", ["I ate a whole cake.", "I ate two slices of cake.", "I bought a cake."]],
      ["我 要 一份 早餐。", "Wǒ / yào / yí fèn / zǎocān.", "One breakfast, please.", ["Two breakfasts, please.", "No breakfast, thanks.", "One coffee, please."]],
      ["這道 菜 叫 什麼？", "Zhè dào / cài / jiào / shénme?", "What's this dish called?", ["How much is this dish?", "Who made this dish?", "Is this dish spicy?"]],
      ["這部 電影 很 好看。", "Zhè bù / diànyǐng / hěn / hǎokàn.", "This film is really good.", ["This book is really good.", "I want to see this film.", "This film is very long."]],
      ["你 喜歡 哪種 水果？", "Nǐ / xǐhuān / nǎ zhǒng / shuǐguǒ?", "What kind of fruit do you like?", ["Do you like fruit?", "How much is the fruit?", "Where's the fruit?"]],
      ["這間 房間 很 大。", "Zhè jiān / fángjiān / hěn / dà.", "This room is big.", ["This room is small.", "This house is big.", "How big is this room?"]],
      ["我 買 了 一盒 點心。", "Wǒ / mǎi / le / yì hé / diǎnxīn.", "I bought a box of pastries.", ["I ate a box of pastries.", "I bought two boxes of pastries.", "I want to buy some pastries."]],
      ["他 是 我們 班 第一名。", "Tā / shì / wǒmen / bān / dì yī míng.", "He's top of our class.", ["He's new in our class.", "He's our class teacher.", "He's bottom of our class."]],
      ["我 只 會 說 幾句 中文。", "Wǒ / zhǐ / huì / shuō / jǐ jù / Zhōngwén.", "I can only say a few sentences in Chinese.", ["I can speak a lot of Chinese.", "I can't speak any Chinese.", "I can only read a little Chinese."]],
      ["請 看 這張 圖。", "Qǐng / kàn / zhè zhāng / tú.", "Please look at this picture.", ["Please draw a picture.", "Please look at this book.", "Please read this sentence."]],
      ["我 一天 吃 三餐。", "Wǒ / yì tiān / chī / sān cān.", "I eat three meals a day.", ["I eat twice a day.", "I eat three times a week.", "I ate three bowls of rice."]],
      ["我們 一人 一半。", "Wǒmen / yì rén / yíbàn.", "Let's go half and half.", ["You have all of it.", "I'll have all of it.", "Let's split it three ways."]],
      ["我 全部 都 要。", "Wǒ / quánbù / dōu / yào.", "I'll take all of them.", ["I'll take half.", "I don't want any of them.", "I only want one."]],
      ["所有 的 人 都 來 了。", "Suǒyǒu / de / rén / dōu / lái / le.", "Everyone has come.", ["Nobody came.", "Some people came.", "Everyone is leaving."]],
      ["還 有 其他 的 嗎？", "Hái / yǒu / qítā / de / ma?", "Are there any others?", ["Is this the last one?", "How much is the other one?", "Do you want another one?"]],
      ["各位， 歡迎！", "Gè wèi, / huānyíng!", "Welcome, everyone!", ["Goodbye, everyone!", "Thank you, everyone!", "Welcome, teacher!"]],
      ["有的 人 喜歡， 有的 人 不 喜歡。", "Yǒude / rén / xǐhuān, / yǒude / rén / bù / xǐhuān.", "Some people like it, and some don't.", ["Everyone likes it.", "Nobody likes it.", "I like it, but he doesn't."]],
      ["大部分 的 人 都 坐 捷運。", "Dàbùfèn / de / rén / dōu / zuò / jiéyùn.", "Most people take the MRT.", ["Everyone takes the MRT.", "Few people take the MRT.", "Nobody takes the MRT."]]
    ]},
  { id:"se-help", name:"Directions & asking for help", emoji:"🆘", desc:"離, 近, 中間, 經過, 南 北 東, 號碼, 怎麼辦, 麻煩, 幫忙…",
    rule:`<ul><li>A <b>離</b> B 很近 / 很遠: A is close to / far from B · <b>中間</b> between · <b>經過</b> go past · <b>向</b> towards · <b>離開</b> leave</li>
      <li><b>南部 / 北部 / 東部</b> the south / north / east · <b>號碼</b> number · <b>電子郵件</b> email · <b>見面</b> meet</li>
      <li><b>怎麼辦？</b> what shall I do? · <b>麻煩你</b> sorry to trouble you · <b>幫忙 / 幫助</b> help · <b>別客氣</b> don't mention it</li>
      <li><b>輕</b> light · <b>重</b> heavy · <b>樣子</b> look, style · <b>聲音</b> sound, voice</li></ul>`,
    items:[
      ["車站 離 這裡 很 近。", "Chēzhàn / lí / zhèlǐ / hěn / jìn.", "The station is close to here.", ["The station is far from here.", "The station is right here.", "Where's the station?"]],
      ["銀行 在 書店 和 郵局 中間。", "Yínháng / zài / shūdiàn / hé / yóujú / zhōngjiān.", "The bank is between the bookshop and the post office.", ["The bank is next to the bookshop.", "The bookshop is between the bank and the post office.", "The post office is opposite the bank."]],
      ["我 住 在 台北市。", "Wǒ / zhù / zài / Táiběi shì.", "I live in Taipei City.", ["I live in Taichung City.", "I work in Taipei City.", "I'm going to Taipei City."]],
      ["這班 公車 會 經過 夜市。", "Zhè bān / gōngchē / huì / jīngguò / yèshì.", "This bus goes past the night market.", ["This bus doesn't go near the night market.", "The night market is closed.", "There's no bus to the night market."]],
      ["向 左 轉。", "Xiàng / zuǒ / zhuǎn.", "Turn left.", ["Turn right.", "Go straight on.", "Go back."]],
      ["他 昨天 離開 台北 了。", "Tā / zuótiān / líkāi / Táiběi / le.", "He left Taipei yesterday.", ["He arrived in Taipei yesterday.", "He's leaving Taipei tomorrow.", "He lives in Taipei."]],
      ["台南 在 台灣 的 南部。", "Táinán / zài / Táiwān / de / nánbù.", "Tainan is in the south of Taiwan.", ["Tainan is in the north of Taiwan.", "Tainan is in the east of Taiwan.", "Tainan is in the middle of Taiwan."]],
      ["台北 在 北部， 花蓮 在 東部。", "Táiběi / zài / běibù, / Huālián / zài / dōngbù.", "Taipei is in the north, Hualien in the east.", ["Taipei is in the south, Hualien in the east.", "Taipei is in the north, Hualien in the west.", "Taipei and Hualien are both in the north."]],
      ["你的 電話 號碼 是 多少？", "Nǐ de / diànhuà / hàomǎ / shì / duōshǎo?", "What's your phone number?", ["What's your address?", "Do you have a phone?", "Can I call you?"]],
      ["請 寫 電子郵件 給 我。", "Qǐng / xiě / diànzǐyóujiàn / gěi / wǒ.", "Please send me an email.", ["Please call me.", "Please write me a letter.", "Please give me your address."]],
      ["我們 在 哪裡 見面？", "Wǒmen / zài / nǎlǐ / jiànmiàn?", "Where shall we meet?", ["When shall we meet?", "Where are you going?", "Where do you live?"]],
      ["我 有 一件 事情 想 問 你。", "Wǒ / yǒu / yí jiàn / shìqíng / xiǎng / wèn / nǐ.", "There's something I'd like to ask you.", ["I have a question for him.", "Can you ask me something?", "I have nothing to ask."]],
      ["下雨 了， 怎麼辦？", "Xiàyǔ / le, / zěnmebàn?", "It's raining. What shall we do?", ["It's raining. Great!", "Is it raining?", "It's stopped raining."]],
      ["麻煩 你 給 我 一杯 水。", "Máfán / nǐ / gěi / wǒ / yì bēi / shuǐ.", "Could you please give me a glass of water?", ["Thanks, I don't want any water.", "Is the water free?", "Could I have a glass of juice?"]],
      ["謝謝 你的 幫忙。", "Xièxie / nǐ de / bāngmáng.", "Thank you for your help.", ["Can you help me?", "I'll help you.", "I don't need any help."]],
      ["他 常常 幫助 別人。", "Tā / chángcháng / bāngzhù / biérén.", "He often helps other people.", ["Other people often help him.", "He never helps anyone.", "He needs help."]],
      ["別 客氣！", "Bié / kèqì!", "Don't mention it! / Make yourself at home!", ["Don't go!", "Be careful!", "Don't be late!"]],
      ["這個 很 輕。", "Zhège / hěn / qīng.", "This is light.", ["This is heavy.", "This is big.", "This is cheap."]],
      ["這個 皮包 好 重！", "Zhège / píbāo / hǎo / zhòng!", "This handbag is so heavy!", ["This handbag is so light!", "This handbag is so expensive!", "This handbag is so big!"]],
      ["他 的 樣子 很 累。", "Tā / de / yàngzi / hěn / lèi.", "He looks tired.", ["He looks happy.", "He isn't tired.", "He wants to sleep."]],
      ["你的 聲音 很 好聽。", "Nǐ de / shēngyīn / hěn / hǎotīng.", "You have a lovely voice.", ["I can't hear your voice.", "You speak very loudly.", "You sing very badly."]]
    ]}
];

const parse = it => {
  const zh = it[0].split(" "), py = it[1].split(" / ");
  return { zh:it[0].replace(/ /g, ""), py:it[1].replace(/ \/ /g, " "), en:it[2], wrong:it[3], parts:zh.map((z, i) => [z.replace(/[。？！，]/g, ""), (py[i] || "").replace(/[.?!,]/g, "")]), ok:zh.length === py.length };
};
const LEVELS = [
  { name:"Meaning", desc:"Hear a sentence, choose its meaning (slowly)" },
  { name:"Word order", desc:"Put the words in the order you hear them" },
  { name:"Normal speed", desc:"Choose the meaning at normal speed" }
];
const skills = GROUPS.map(g => {
  const items = g.items.map(parse);
  return { id:g.id, name:g.name, emoji:g.emoji, desc:g.desc, rule:g.rule, levels:LEVELS, bank:items,
    make(level){
      const s = pick(items), reveal = ZH.line(s.zh, s.py, s.en);
      if (level === 2){
        const cards = s.parts.map(p => p[0] + "|" + p[1]);
        // a decoy card: a word from another sentence of this skill that doesn't sound like any card here
        const decoys = items.flatMap(x => x.parts).map(p => p[0] + "|" + p[1]).filter(c => !cards.includes(c) && !cards.some(k => k.split("|")[1] === c.split("|")[1]));
        return { say:s.zh, rate:.8, input:"order", text:"Put the words in the order you hear them", items:cards, extra:decoys.length ? [pick(decoys)] : [],
          reveal, solution:`${s.zh} ${s.py}`, key:"o" + s.zh, wait:true };
      }
      return { say:s.zh, rate:level === 1 ? .7 : .95, text:"What does it mean?", choices:shuffle([s.en, ...s.wrong]), answer:s.en, long:true, explain:`It means <b>${ZH.esc(s.en)}</b>`,
        reveal, solution:`${s.zh} ${s.py}`, key:"m" + level + s.zh, wait:level === 3 };
    } };
});
ZH.TOPICS.find(T => T.id === "sentences").skills.push(...skills);
})();
