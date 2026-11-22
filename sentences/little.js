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
