# 👂 聽力 Mandarin (Taiwan)

A listening trainer for **Taiwan Mandarin, starting from zero**. The goal is to understand basic everyday conversations
by practising a little every day. Everything you hear comes first; the characters, pinyin and meaning appear after you answer.
Most exercises are generated, so they never run out, and the app remembers what you find hard.
See [ROADMAP.md](ROADMAP.md) for what's built and what comes next.

It's built like the maths app (`~/math`) and `~/git/lengua`, and reuses their design and engine.

| Topic | Address | Skills |
|---|---|---|
| 🎵 Tones & sounds | `tones/` | The 4 tones · Tone pairs · Similar sounds (j q x, zh ch sh, ü…) |
| 🔢 Numbers | `numbers/` | 0–10 & phone numbers · 11–99 · Hundreds & thousands · Prices · Time · Days & dates · How many |
| 🗂️ Words | `words/` | Drinks · Food · People · Places · Getting around · Actions · How is it? |
| 💬 Phrases & questions | `phrases/` | Everyday phrases · Questions (什麼 誰 哪裡 幾 多少…) |
| 🧩 Sentences | `sentences/` | 是 · 要 · 喜歡 · 有 · 在 · Plans (when + where) |
| 🎧 Conversations | `dialogues/` | Meeting people · Food & drinks · Shopping · Getting around · Making plans |

Every skill has 3 levels: get 8 out of 10 to unlock the next, pass level 3 for a ⭐.
The **每日聽力 Daily listening** session on the main page mixes ~12 questions: a tone warm-up, numbers, the skills that need it most,
and a conversation once you've started them.

## The voice
This first version uses the **device's own Taiwan Mandarin voice** (the browser's text-to-speech), like lengua does for dictation.
- On Android: Settings → Text-to-speech → *Speech Services by Google* → install **Chinese (Taiwan)**.
- Check what a device has with `tests/voices.html`, or in ⚙️ *Settings & voice* on the main page.
- In conversations the second speaker uses a lower pitch (or a second Taiwan voice, if the device has one).
- 🔊 plays again, 🐢 plays slowly, and the speed setting changes every exercise. On a computer, `r` replays and `R` replays slowly.

Later versions may use recorded MP3s instead (see the roadmap).

## How to start it on the home network
```bash
cd ~/git/mandarin
python3 -m http.server 8002
```
Then on the tablet (same Wi-Fi) open **http://192.168.1.206:8002**. Port 8002 is used so it can run at the same time as math (8000)
and lengua (8001). If the tablet can't reach it, allow the port once:
```bash
sudo ufw allow from 192.168.1.0/24 to any port 8002 proto tcp
```
Optional: *Add to Home screen* in the browser menu so it opens like an app.

On GitHub Pages it works offline after the first visit. It saves progress under its own key (`mandarin-tw-v1`), and its offline
file (`sw.js`) only deletes its own old copies, so it can share an address with math and lengua.

## How it's organised
```
index.html            main page: daily listening, topic tiles, progress, settings & voice, backup
sw.js                 offline support (add new files to FILES and change the number in CACHE)
shared/engine.js      question engine: speaking (Taiwan voice, two speakers), 🔊 / 🐢, choice, number pad, word cards, transcripts, results
shared/progress.js    saving, levels, stars, daily streak, settings, backup
shared/topic.js       a topic page: skill tabs, tip card, 3 levels, stars
shared/zh.js          numbers / prices / times / dates in characters + pinyin (Taiwan usage: 兩百, 兩點), tones, the 一 tone change
shared/words.js       the word bank by theme (TOCFL Novice 1 – A1 + everyday Taiwan words), with the sentences each word is heard in
tones/ … dialogues/   one folder per topic: index.html + skills.js
tests/                automated checks, and voices.html to see the voices on a device
```

### A question
```js
{ say:"我要兩杯咖啡。", rate:.8,                 // or a conversation: [{ t:"…", py:"…", en:"…", who:"A" }, …] with bubbles:true
  text:"What does it mean?", choices:[…], answer:"I'd like two coffees.",
  reveal:ZH.line("我要兩杯咖啡。", "Wǒ yào liǎng bēi kāfēi.", "I'd like two coffees.") }
```
Inputs: `choice` (2–4 buttons), `num` (number pad), `order` (word cards with pinyin, plus a decoy card).

## Tests
```bash
python3 tests/check.py        # -v lists the words above A1
```
- **Engine** (`tests/engine.html`): plays sessions by tapping the real buttons: answers, retries, the number pad, word cards, conversations, settings, progress, backup, the daily session.
- **Every skill** (`tests/skills.html`): ~13,000 generated questions; each has exactly one right answer, no repeated options, a transcript that matches what is spoken.
- **Pinyin**: every text the app can show (~4,700) is checked character by character against **CC-CEDICT** (with its Taiwan readings). A wrong tone fails.
- **Traditional characters**: no Simplified forms (from CC-CEDICT's traditional / simplified columns).
- **Taiwan readings** (`--taiwan`): every word's tones are compared with Taiwan's Ministry of Education dictionary (萌典, cached in `tests/data/`).
  Where TOCFL and the MOE dictionary disagree (機場, 姊姊, 喂) the app follows TOCFL; those are listed in `TW_OK`.
- **Never again**: sentences a native-speaker review found wrong (吃湯, 請給我三個人, April 31…) are checked so they can't come back.
- **Level**: every sentence is split into words, and each word must be in the **TOCFL** list or in `EXTRAS` in `tests/check.py`
  (everyday Taiwan words like 捷運, 珍珠奶茶, names and places, used on purpose).
- The first run downloads the TOCFL list ([ivankra/tocfl](https://github.com/ivankra/tocfl), from the official
  [華語八千詞](https://tocfl.edu.tw/index.php/exam/download)) and [CC-CEDICT](https://www.mdbg.net/chinese/dictionary?page=cedict) into `tests/data/` (not committed).
