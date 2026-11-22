/* Words (詞語): one skill per theme of the word bank (shared/words.js).
   Level 1: hear the word, choose the picture + meaning. Level 2: meaning only, normal speed. Level 3: hear it inside a sentence. */
(function(){
"use strict";
const ZH = window.ZH, { pick, shuffle } = ZH;

function skillFor(theme, id, desc){
  const T = ZH.WORDS[theme], list = ZH.wordList(theme);
  return {
    id, name:T.name, emoji:T.emoji, desc,
    rule:`<p>Listen first, then look. Tap 🔊 to hear it again, 🐢 to hear it slowly.</p>
      <p>After each answer you'll see the word in characters and pinyin. Say it out loud with the voice: that helps your ear too.</p>
      <p class="muted">Words: ${list.map(w => `${w.zh} <i>${w.py}</i>`).join(" · ")}</p>`,
    levels:[
      { name:"Picture", desc:"Hear a word, choose its picture" },
      { name:"Meaning", desc:"Hear a word, choose its meaning (no pictures)" },
      { name:"In a sentence", desc:"Hear a short sentence: which word was in it?" }
    ],
    words:list,
    make(level){
      const w = pick(list);
      const label = x => level === 2 ? x.en : `${x.emoji} ${x.en}`;
      const choices = ZH.choicesFrom(w, list, 4, x => label(x)).map(label);
      const wordLine = ZH.line(w.zh, w.py, w.en);
      if (level === 3){
        const f = pick(ZH.framesOf(w));
        // never offer a word that is also inside the sentence (蛋 in 蛋糕, 奶茶 in 珍珠奶茶, 麵 in 麵包)
        const pool = list.filter(x => x === w || !f.zh.includes(x.zh));
        const ch3 = ZH.choicesFrom(w, pool, 4, x => label(x)).map(label);
        return { say:f.zh, rate:.9, text:"Which word did you hear?", choices:ch3, answer:label(w), long:true,
          reveal:ZH.line(f.zh, f.py, f.en), solution:`${w.zh} ${w.py} – ${w.en}`, key:"w3" + f.zh };
      }
      return { say:w.zh, rate:level === 1 ? .7 : .9, text:"What does it mean?", choices, answer:label(w), long:true,
        reveal:wordLine, solution:`${w.zh} ${w.py} – ${w.en}`, key:"w" + level + w.zh };
    }
  };
}

ZH.TOPICS.push({ id:"words", title:"Words", emoji:"🗂️", skills:[
  skillFor("drinks", "wo-drinks", "Water, tea, coffee… and bubble tea 珍珠奶茶."),
  skillFor("food", "wo-food", "Rice, noodles, dumplings, fruit…"),
  skillFor("people", "wo-people", "Family and people you meet."),
  skillFor("places", "wo-places", "Places in town: station, bank, convenience store…"),
  skillFor("transport", "wo-transport", "MRT, bus, taxi, scooter…"),
  skillFor("actions", "wo-actions", "Everyday actions: eat, sleep, work, read…"),
  skillFor("describe", "wo-describe", "Tired, hungry, hot, expensive…")
]});
})();
