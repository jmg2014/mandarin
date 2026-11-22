# 聽力 Mandarin (Taiwan) – Roadmap

Goal: an app like the maths trainer (`~/math`) and `~/git/lengua`, for an **adult starting from zero** who wants to
**understand basic everyday conversations in Taiwan Mandarin by listening**. A short session every day (10–15 min),
and over a few months the ear gets used to tones, numbers, survival phrases and short dialogues.

Like the other apps:
- one main page plus one page per topic, sharing `shared/engine.js`, `progress.js`, `topic.js`, `style.css`
- every skill has **3 levels**, 8/10 unlocks the next level, level 3 gives a ⭐
- the app remembers what's hard and a **daily mix** (每日聽力) brings it back
- works offline (service worker), runs from `python3 -m http.server 8002`, later on GitHub Pages
- its own storage key (`mandarin-tw-v1`) and its own cache name, so it doesn't touch math or lengua

### What's different from math and lengua
| | math / lengua | Mandarin |
|---|---|---|
| Learner | a child, already speaks the language | an adult, **no previous knowledge** |
| Focus | written answers | **listening**: audio first, text hidden until after answering |
| Audio | device voice for dictation only | **every question has audio**; it's the core of the app |
| Endless exercises | generated from word lists | generated from **templates + a recorded sentence bank** (see section 3) |
| Checking content | Spanish dictionary (hunspell) | pinyin checked against **CC-CEDICT**, Taiwan usage checked by hand |

### Why "Taiwan" matters
- **Characters:** Traditional (繁體) — 謝謝, 說, 機車, not 谢谢, 说.
- **Pronunciation:** Taiwan voices (zh-TW). Little or no 兒 (-r): 一點 not 一点儿, 哪裡 not 哪儿. Softer zh/ch/sh.
  Some words differ: 垃圾 lèsè, 星期 xīngqí, 和 hàn (often), fewer neutral tones (認識 rènshì).
- **Vocabulary:** 捷運 (MRT), 機車 (scooter), 便利商店 (convenience store), 計程車 (taxi), 腳踏車 (bike),
  塊 / 元 (dollars, NT$), 禮拜 alongside 星期, 珍珠奶茶, 載具 (receipt barcode).
- **Phonetic script:** Taiwan uses **Zhuyin / ㄅㄆㄇㄈ**. Default to **pinyin** (easier from Spanish/English), with a
  Zhuyin switch in settings.
- **Word list:** follow **TOCFL** (Taiwan's official test, 2023 list): Novice 1 (160 words) → Novice 2 (234) → Beginner/A1 (347),
  then Basic/A2 (485). This plays the role the Madrid curriculum plays in lengua. `tests/check.py` checks every word the app
  uses against the list (v1: 413 words, all Novice 1 – A1 except a few Taiwan everyday words used on purpose).

---

## 1. Teaching principles (from zero)

1. **Sounds before sentences.** Tones are the biggest barrier for a Spanish/English ear. Week 1 is mostly tones,
   but tones keep coming back as a 2-minute warm-up every day.
2. **Audio first, text after.** The question plays; you answer by ear; *then* the pinyin, characters and meaning appear.
   A "👂 Text off / pinyin / 漢字" switch lets you hide the support as you improve.
3. **Slow → normal speed.** Level 1 slow (0.75×), level 2 normal, level 3 normal + a second voice / background noise.
4. **Two or more voices** (female and male Taiwan voices), so the ear doesn't learn just one person.
5. **Comprehensible input.** Every new dialogue uses only words already met, plus 1–2 new ones.
6. **Shadowing.** After answering, a 🗣 button: listen, repeat aloud. Optional mic recording to compare (later).
7. **Short and daily beats long and rare.** A streak 🔥 and "minutes listened" counter.

---

## 2. Exercise types (inputs)

| Input | What you do | Used for |
|---|---|---|
| `tone` **(new)** | Hear a syllable, tap 1 of 4 tone buttons drawn as contours ˉ ˊ ˇ ˋ (+ neutral later) | tones |
| `tonepair` **(new)** | Hear a 2-syllable word, pick its tone pair (e.g. 3-4) | tone pairs, sandhi |
| `choice` (from lengua) | 2–4 buttons: syllables, pinyin, meanings | minimal pairs, word meaning |
| `picture` **(new)** | Hear a word/sentence, tap the matching emoji/picture from 4 | vocabulary, "which picture matches?" |
| `number` **(new)** | Hear a number, price, time or phone number; type it on a keypad | numbers, money, time, dates |
| `order` (from lengua) | Hear a sentence, tap the word cards in the order you heard them | word order, sentence patterns |
| `words` (from lengua) | Hear a sentence, tap the word(s) you heard among distractors | word spotting |
| `truefalse` **(new)** | Hear a sentence with a picture/fact, say ✓ or ✗ | quick comprehension |
| `dialogue` **(new)** | A player for 2–6 lines with two voices, then 2–4 questions (who / what / how much / where / when) | conversations |

Every question has `audio` (one clip or a list of lines with speakers) and a 🔊 replay button; replays are allowed
but counted (fewer replays = stronger mastery).

---

## 3. Where the audio comes from

**v1 uses the device's built-in Taiwan voice** (the tablet has one; checked with `tests/voices.html`), exactly like lengua.
It's free, works offline on the tablet, and needs no files. The plan below is for later, if the built-in voice
isn't good enough (single syllables, other devices without a Taiwan voice):

- **Pre-generate MP3s** with a neural Taiwan voice, e.g. Microsoft `zh-TW-HsiaoChenNeural` (F),
  `zh-TW-YunJheNeural` (M), `zh-TW-HsiaoYuNeural` (F), through the `edge-tts` Python package or Azure / Google Cloud TTS
  (`cmn-TW` voices). Script: `tools/make_audio.py` reads the sentence bank and writes `audio/<id>-<voice>-<speed>.mp3`.
- **Templates are expanded at build time**, not in the browser: e.g. `我要{N}{MW}{DRINK}` × numbers × drinks →
  a few hundred real sentences, each with its own audio file. Several thousand short clips are still only ~20–40 MB.
- **Syllables & numbers** are recorded once each, so number exercises can be generated freely in the browser.
- Fallback: Web Speech API zh-TW voice if a file is missing.
- Later: replace the most important dialogues with **real recordings** from a Taiwanese speaker.

---

## 4. Content for the basic level (TOCFL Novice → A1)

### Unit 0 – Sounds (week 1–2, then daily warm-up)
| Skill | Level 1 | Level 2 | Level 3 |
|---|---|---|---|
| The 4 tones | mā / má / mǎ / mà, 2 choices | 4 choices | random syllables, 2 voices |
| Tone pairs | 2 options (e.g. 1-4 vs 4-1) | all 20 pairs | real words (台灣 2-1, 謝謝 4-0, 你好 3-3→2-3) |
| Tricky initials | zh / j, ch / q, sh / x | z / zh, c / ch, s / sh | mixed in words |
| Tricky finals | an / ang, en / eng | u / ü, in / ing | mixed in words |
| Tone changes | 你好 (3+3) | 不 + 4 (bú shì) | 一 (yì bēi, yí ge) |

### Unit 1 – Numbers (huge payoff: prices, time, phone, age)
- 0–10 → 11–99 → 100–9999 (兩百, 三千五, 零 in 一百零五)
- **Prices:** 五十五塊, 一百二十元 → type 55, 120
- **Time:** 三點半, 十點十五分, 早上 / 下午 / 晚上
- **Dates & days:** 星期一 / 禮拜一, 五月十號, 今天 / 明天 / 昨天
- **Phone numbers:** 0912-345-678 (Taiwan mobile format; 一 often said as 幺 yāo — level 3)
- **Age & quantity:** 我二十五歲, 兩個, 三杯

### Unit 2 – Survival words (picture match)
Greetings and politeness, people & family, food & drink, places, transport, colours, everyday objects.
~150 words from TOCFL Level 1, each with an emoji, 2 voices, and grouped in sets of 8 so a set can be mastered.

### Unit 3 – Sentence patterns (one skill per pattern)
| Pattern | Example | Meaning |
|---|---|---|
| 是 | 我是西班牙人。Wǒ shì Xībānyárén. | I'm Spanish. |
| 叫 | 我叫安娜。Wǒ jiào Ānnà. | My name is Ana. |
| 嗎 question | 你是台灣人嗎？Nǐ shì Táiwānrén ma? | Are you Taiwanese? |
| 不 / 沒 | 我不喝咖啡。/ 我沒有車。 | I don't drink coffee. / I don't have a car. |
| 有 | 你有沒有小孩？Nǐ yǒu méiyǒu xiǎohái? | Do you have children? |
| 要 | 我要一杯咖啡。Wǒ yào yì bēi kāfēi. | I'd like a coffee. |
| 喜歡 | 我很喜歡台灣。Wǒ hěn xǐhuan Táiwān. | I really like Taiwan. |
| 在 (place) | 捷運站在哪裡？Jiéyùn zhàn zài nǎlǐ? | Where's the MRT station? |
| Question words | 什麼、誰、哪裡、幾、多少、什麼時候 | what, who, where, how many, how much, when |
| 呢 | 我很好，你呢？Wǒ hěn hǎo, nǐ ne? | I'm fine, and you? |
| Measure words | 一個人、兩杯茶、三張票 | one person, two teas, three tickets |
| Time before verb | 我明天去台北。Wǒ míngtiān qù Táiběi. | I'm going to Taipei tomorrow. |
| 了 (done) – end of A1 | 我吃飽了。Wǒ chībǎo le. | I'm full. |

Level 1: pick the meaning. Level 2: put the heard words in order. Level 3: true/false or picture, normal speed.

### Unit 4 – Situations (dialogues)
Each situation has 4–8 dialogues built from Units 1–3, with 2 voices. Examples:

**1. Meeting someone (認識新朋友)**
> A: 你好！我叫小明。你叫什麼名字？ *Nǐ hǎo! Wǒ jiào Xiǎomíng. Nǐ jiào shénme míngzi?*
> B: 我叫安娜。 *Wǒ jiào Ānnà.*
> A: 你是哪國人？ *Nǐ shì nǎ guó rén?*
> B: 我是西班牙人。 *Wǒ shì Xībānyárén.*
> A: 很高興認識你！ *Hěn gāoxìng rènshì nǐ!*
> ❓ What's the woman's name? Where is she from?

**2. Bubble tea shop (飲料店)**
> 店員: 你好，請問要喝什麼？ *Qǐngwèn yào hē shénme?*
> 客人: 我要一杯珍珠奶茶。 *Wǒ yào yì bēi zhēnzhū nǎichá.*
> 店員: 甜度冰塊呢？ *Tiándù bīngkuài ne?*
> 客人: 半糖少冰。 *Bàn táng shǎo bīng.*
> 店員: 好，五十五塊。 *Hǎo, wǔshíwǔ kuài.*
> ❓ What did she order? How much sugar? How much did it cost? (type 55)

**3. Convenience store (便利商店)**
> 店員: 歡迎光臨！ *Huānyíng guānglín!*
> 店員: 一共八十九塊。要袋子嗎？ *Yígòng bāshíjiǔ kuài. Yào dàizi ma?*
> 客人: 不用，謝謝。 *Búyòng, xièxie.*
> ❓ How much? Did the customer want a bag?

**4. Asking the way (問路)**
> A: 不好意思，請問捷運站在哪裡？ *Bù hǎoyìsi, qǐngwèn jiéyùn zhàn zài nǎlǐ?*
> B: 往前走，在左邊。 *Wǎng qián zǒu, zài zuǒbiān.*
> A: 謝謝！ B: 不客氣。 *Xièxie! — Bú kèqi.*
> ❓ What is he looking for? Left or right?

**5. Time & plans (約時間)**
> A: 你明天有空嗎？ *Nǐ míngtiān yǒu kòng ma?*
> B: 下午有空。 *Xiàwǔ yǒu kòng.*
> A: 我們三點半去喝咖啡，好不好？ *Wǒmen sān diǎn bàn qù hē kāfēi, hǎo bù hǎo?*
> B: 好啊！ *Hǎo a!*
> ❓ When do they meet? To do what?

Other A1 situations: family (你家有幾個人？), at a restaurant (菜單、買單), taxi (請到台北車站), buying a ticket,
weather (今天很熱), likes and hobbies, at the hotel, phone call (喂？), at the night market (這個多少錢？太貴了！).

### Typical listening questions for every dialogue
1. Gist: where are they / what's happening? (picture choice)
2. Detail: a number — price, time, quantity (keypad)
3. Detail: a choice — what, who, left/right, yes/no
4. Transcript reveal → shadow the dialogue line by line

---

## 5. The daily session (每日聽力, ~12 min)
1. **Warm-up (2 min):** 8 tone / tone-pair questions
2. **Numbers (2 min):** 5 prices / times
3. **Review (4 min):** the weakest words & patterns (spaced repetition)
4. **New (4 min):** one new dialogue: listen with no text → answer → listen with pinyin → see meaning → shadow
5. Summary: minutes listened, streak, what got stronger

---

## 6. Build order

### v1 – Device voice ✅ (2026-11-22)
- [x] Engine from lengua (namespace `ZH`), storage key `mandarin-tw-v1`, own cache name, English UI
- [x] Speaking with the device's zh-TW voice: one line or a conversation (A / B with different pitch), 🔊 replay, 🐢 slow, speed setting
- [x] Inputs: `choice`, `num` (number pad), `order` (word cards with pinyin + a decoy card); transcript after every answer
- [x] Settings: pinyin / characters on or off, speed; voice status and test on the main page
- [x] 🎵 Tones & sounds: 4 tones, tone pairs (incl. 3 + 3), similar sounds (j q x, zh ch sh, z c s, ü, an/ang…)
- [x] 🔢 Numbers: 0–10 & phone numbers, 11–99, hundreds & thousands, prices, time, days & dates, how many & age
- [x] 🗂️ Words: 7 themes, ~100 words, each heard alone and in a sentence
- [x] 💬 Phrases & questions: 29 everyday phrases with replies, 28 questions (什麼 誰 哪裡 幾 多少 為什麼 怎麼 嗎)
- [x] 🧩 Sentences: 是, 要, 喜歡, 有, 在, plans, generated from slots; wrong answers differ in one detail
- [x] 🎧 Conversations: 15 dialogues in 5 situations, 50 questions
- [x] 每日聽力 daily session, streak, minutes listened, weakest skills, backup
- [x] Tests: engine (33 checks), every skill (~13,000 questions), pinyin vs CC-CEDICT, words vs TOCFL

### v2 – All of Novice 1 and Novice 2 ✅ (2026-11-22)
- [x] Coverage test: every TOCFL Novice 1 and Novice 2 word (394) is heard on its own somewhere
- [x] 6 new word themes: opposites, body & health, time words, school, at home, weather & free time (+ drinks and food additions)
- [x] 7 little-words skills (hand-written sentences, wrong meanings that change just the little word): 也 都 只 還 又 跟 夠 · 可是 所以 因為 ·
      覺得 最 非常 有點 比 一樣 像 · 能 應該 得 一定 可能 別 怕 愛 · 過 了 著 在 得 看見 聽見 · 上面 裡面 外面 附近 從 進 帶 拿 · 你們 大家 自己 它 貴姓 第一次…
- [x] 4 new conversations: at the doctor's, the weather, a Chinese class, at a friend's home
- [x] 萬 (ten thousand) in numbers, 日 in dates
- [x] 📖 TOCFL map on the main page: every Novice 1 / Novice 2 / A1 word as not yet / heard / known
- [x] Independent native-level review of the new content

### Next
- [ ] Try it on the tablet for a week: is the voice clear on single syllables? Speed right? Too easy / too hard?
- [ ] Finish A1 (TOCFL Beginner): about 250 words still missing; more conversations (restaurant, hotel, bank, post office)
- [ ] Zhuyin (ㄅㄆㄇ) as a third transcript option
- [ ] Shadowing: a 🗣 button after each answer (listen, repeat aloud); later, the mic to compare
- [ ] Simulation (like lengua's `tests/simulate.html`): how many days to finish A1 at 10 min/day
- [ ] If needed: recorded MP3s (section 3) for the tones and the conversations

### Later levels
- **A2 (TOCFL Basic):** longer dialogues (8–12 lines), natural speed, 了 / 過 / 在 (progressive), comparisons (比),
  more situations (doctor, renting, work)
- **Real audio:** recordings from a Taiwanese speaker, background noise (MRT announcements, night market)
- **Listen & answer aloud:** speech recognition (zh-TW) for short replies
- **Taiwanese everyday flavour:** 喔, 啦, 欸, common Taiwan expressions; MRT / train announcements
