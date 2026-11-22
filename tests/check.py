#!/usr/bin/env python3
"""Run the app's automated checks in headless Chrome, then check every piece of Chinese in the app:

    python3 tests/check.py            # add -v to list every word above the A1 level
    python3 tests/check.py --taiwan   # also compare every word's pinyin with Taiwan's MOE dictionary (萌典, needs internet the first time)

1. tests/skills.html generates thousands of questions from every skill and level and checks they are well formed.
   It prints every (characters, pinyin) pair the app can show.
2. Pinyin: each pair is checked character by character against CC-CEDICT (with its Taiwan readings) and the TOCFL list.
   A tone that doesn't match any reading of the character is an error. The neutral tone (no mark) and the usual
   tone changes of 一 (yí / yì) and 不 (bú) are always accepted.
3. Traditional characters: no character may be a Simplified-only form (from CC-CEDICT's traditional / simplified columns).
4. Level: every sentence is split into words using the TOCFL list. Each word must be in the list or in EXTRAS below
   (Taiwan everyday words, names and places used on purpose). Words above A1 are counted and listed with -v.

Needs Google Chrome. The first run downloads the TOCFL word list (a cleaned-up CSV of the official 2023 list, from
github.com/ivankra/tocfl) and CC-CEDICT (from mdbg.net) into tests/data/, which is not committed.
"""
import gzip
import html
import json
import pathlib
import re
import subprocess
import sys
import unicodedata
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "tests" / "data"
TOCFL_URL = "https://raw.githubusercontent.com/ivankra/tocfl/master/tocfl-202307.csv"
CEDICT_URL = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz"
LEVEL_NAMES = {"L0-1": "Novice 1", "L0-2": "Novice 2", "L1": "A1", "L2": "A2", "L3": "B1", "L4": "B2", "L5": "C1"}
BASIC = {"Novice 1", "Novice 2", "A1"}

# Words used on purpose that are above A1 or not in the TOCFL list: everyday Taiwan words, names, places, nationalities.
EXTRAS = """
珍珠奶茶 奶茶 捷運 捷運站 便利商店 機車 夜市 高鐵 光臨 歡迎光臨 掰掰 加油 半糖 少冰 甜度 冰塊 載具 牛肉麵 刷卡 便當
台北 台中 台南 高雄 花蓮 台北車站 西班牙 英國 法國 德國 韓國 美國 日本 台灣
小美 小明 大衛 安娜 王 讓座 棟 早餐 牠 牠們 煮飯 白飯 客運 試穿 驗 上午 早安 晚安 青菜 試試看 三明治 夏天 冬天 姊姊 醫生 下個月 多久 左右 收 找 您 盤 鉛筆 拔 靶 姨 椅 億 屋 無 霧 躺 燙 詩 史 騎
竹 主 舔 煙 鹽 眼 燕 玉 滑 肥 費 紡 方 房 居 需 蘇 區 粗 入 拋 踏 科 雞 知 罵 麻 衣 話 努 商
""".split()


def fetch(url, path):
    if not path.exists():
        DATA.mkdir(parents=True, exist_ok=True)
        print(f"downloading {url}")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (mandarin app tests)"})
        with urllib.request.urlopen(req, timeout=60) as r:
            path.write_bytes(r.read())
    return path


def run_page(page):
    url = (ROOT / page).as_uri()
    res = subprocess.run(
        ["google-chrome", "--headless=new", "--disable-gpu", "--no-sandbox", "--allow-file-access-from-files",
         "--virtual-time-budget=60000", "--dump-dom", url],
        capture_output=True, text=True, timeout=300)
    m = re.search(r'<pre id="out"[^>]*>(.*?)</pre>', res.stdout, re.S)
    if not m:
        return [], [f"FAIL {page}: no output (Chrome said: {res.stderr.strip()[-300:]})"]
    pairs, lines = [], []
    for line in html.unescape(m.group(1)).splitlines():
        if line.startswith("PAIRS "):
            pairs += json.loads(line[6:])
        elif line.strip():
            lines.append(line)
    return pairs, lines


# ---------- pinyin ----------
MARKS = {1: "āēīōūǖ", 2: "áéíóúǘ", 3: "ǎěǐǒǔǚ", 4: "àèìòùǜ"}
PLAIN = "aeiouü"


def mark(syl, tone):
    """ni3 → nǐ (the mark goes on a or e, on o in ou, otherwise on the last vowel)"""
    s = syl.lower().replace("u:", "ü").replace("v", "ü")
    if tone not in MARKS:
        return s
    i = next((k for k, c in enumerate(s) if c in "ae"), -1)
    if i < 0:
        i = s.find("ou")
    if i < 0:
        i = max((k for k, c in enumerate(s) if c in PLAIN), default=-1)
    if i < 0:
        return s
    return s[:i] + MARKS[tone][PLAIN.index(s[i])] + s[i + 1:]


def numeric_to_marked(py):
    out = []
    for syl in py.split():
        m = re.fullmatch(r"([a-zA-Z:]+)([1-5])", syl)
        if m:
            out.append(mark(m.group(1), int(m.group(2))))
    return out


def plain(s):
    return "".join(c for c in unicodedata.normalize("NFD", s) if not unicodedata.combining(c)).replace("ü", "u")


def norm_py(py):
    """lower case, only letters (with their tone marks), ü kept"""
    py = unicodedata.normalize("NFC", py.lower())
    return "".join(c for c in py if c.isalpha())


def is_cjk(c):
    return "一" <= c <= "鿿" or "㐀" <= c <= "䶿"


TRAD, SIMP = set(), set()


def load_readings():
    readings = {}

    def add(ch, syl):
        s = unicodedata.normalize("NFC", syl.lower())
        toneless = unicodedata.normalize("NFC", "".join(c for c in unicodedata.normalize("NFD", s) if not unicodedata.combining(c) or c == "\u0308"))
        readings.setdefault(ch, set()).update({s, toneless})

    with gzip.open(fetch(CEDICT_URL, DATA / "cedict.txt.gz"), "rt", encoding="utf-8") as f:
        for line in f:
            if line.startswith("#"):
                continue
            m = re.match(r"(\S+) (\S+) \[([^\]]+)\] /(.*)/", line)
            if not m:
                continue
            trad, simp, py, defs = m.groups()
            TRAD.update(trad)
            SIMP.update(simp)
            syls = numeric_to_marked(py)
            chars = [c for c in trad if is_cjk(c)]
            if len(syls) == len(chars):
                for c, s in zip(chars, syls):
                    add(c, s)
            for tw in re.findall(r"Taiwan pr\. \[([^\]]+)\]", defs):
                tsyl = numeric_to_marked(tw)
                if len(tsyl) == len(chars):
                    for c, s in zip(chars, tsyl):
                        add(c, s)
    for c, extra in [("一", ["yí", "yì", "yī"]), ("不", ["bú", "bù"])]:
        for s in extra:
            add(c, s)
    return readings


def check_pinyin(zh, py, readings):
    """None if every character can be matched to its pinyin, else a short explanation"""
    chars = [c for c in zh if is_cjk(c)]
    target = norm_py(py)
    best = [0, 0]
    memo = set()

    def go(i, pos):
        if (i, pos) in memo:
            return False
        memo.add((i, pos))
        if i > best[0]:
            best[:] = [i, pos]
        if i == len(chars):
            return pos == len(target)
        for r in sorted(readings.get(chars[i], ()), key=len, reverse=True):
            if target.startswith(r, pos) and go(i + 1, pos + len(r)):
                return True
        return False

    if go(0, 0):
        return None
    i, pos = best
    if i >= len(chars):
        return f"extra pinyin at the end: '{target[pos:]}'"
    known = "/".join(sorted(r for r in readings.get(chars[i], ()) if plain(r) != r or r[-1:] == "ü")) or "no reading known"
    return f"'{chars[i]}' (char {i + 1}) doesn't match '{target[pos:pos + 8]}…'; readings: {known}"


# ---------- TOCFL level ----------
def tocfl_entries():
    """[(id, level, [forms], pinyin)] from the TOCFL list; forms expand variants (你/妳) and optional parts (小孩(子))"""
    import csv
    out = []
    with open(fetch(TOCFL_URL, DATA / "tocfl.csv"), encoding="utf-8") as f:
        for row in csv.DictReader(f):
            lid = row["ID"]
            level = LEVEL_NAMES.get(lid[:4], LEVEL_NAMES.get(lid[:2], "?"))
            forms = []
            for form in row["Traditional"].split("/"):
                form = form.strip()
                m = re.fullmatch(r"(.*)\((.*)\)(.*)", form)
                forms += [m.group(1) + m.group(3), m.group(1) + m.group(2) + m.group(3)] if m else [form]
            out.append((lid, level, [w for w in forms if w], row["Pinyin"]))
    return out


def load_tocfl():
    words = {}
    import csv
    with open(fetch(TOCFL_URL, DATA / "tocfl.csv"), encoding="utf-8") as f:
        for row in csv.DictReader(f):
            lid = row["ID"]
            level = LEVEL_NAMES.get(lid[:4], LEVEL_NAMES.get(lid[:2], "?"))
            for form in row["Traditional"].split("/"):
                form = form.strip()
                m = re.fullmatch(r"(.*)\((.*)\)(.*)", form)
                forms = [m.group(1) + m.group(3), m.group(1) + m.group(2) + m.group(3)] if m else [form]
                for w in forms:
                    if w and (w not in words or order(level) < order(words[w])):
                        words[w] = level
    return words


LEVEL_ORDER = ["Novice 1", "Novice 2", "A1", "A2", "B1", "B2", "C1", "?"]


def order(level):
    return LEVEL_ORDER.index(level)


def segment(text, vocab):
    """split into words: the split with the fewest unknown words, then the fewest words, then the most basic levels
    (each word costs 1 + a tenth of its level): 一個兒子 is 一 個 兒子 (個兒 would leave 子 unknown), 日本人 is 日本 人, 大人 stays 大人"""
    cost = lambda w: 1 + (order(vocab[w]) if vocab.get(w) in LEVEL_ORDER else 2) / 10
    out = []
    for run in re.findall(r"[\u4e00-\u9fff]+", text):
        best = [(0, 0, [])] + [None] * len(run)
        for i in range(len(run)):
            if best[i] is None:
                continue
            unk, n, words = best[i]
            for k in range(1, min(6, len(run) - i) + 1):
                w = run[i:i + k]
                if k > 1 and w not in vocab:
                    continue
                cand = (unk + (w not in vocab), n + (cost(w) if w in vocab else 9), words + [w])
                if best[i + k] is None or cand[:2] < best[i + k][:2]:
                    best[i + k] = cand
        out += best[len(run)][2]
    return out


# ---------- Taiwan readings (--taiwan) ----------
def moedict(word, cache):
    """the readings of a word in Taiwan's Ministry of Education dictionary (via moedict.tw), cached in tests/data"""
    if word not in cache:
        import time, urllib.parse
        try:
            with urllib.request.urlopen("https://www.moedict.tw/uni/" + urllib.parse.quote(word), timeout=20) as r:
                cache[word] = [h.get("pinyin", "") for h in json.load(r).get("heteronyms", [])]
        except Exception:
            cache[word] = None
        time.sleep(0.1)
    return cache[word]


def align(chars, py, readings):
    """the syllable of each character, or None"""
    target, memo = norm_py(py), {}

    def go(i, pos):
        if (i, pos) not in memo:
            memo[(i, pos)] = None
            if i == len(chars):
                memo[(i, pos)] = [] if pos == len(target) else None
            else:
                for r in sorted(readings.get(chars[i], ()), key=len, reverse=True):
                    if target.startswith(r, pos):
                        rest = go(i + 1, pos + len(r))
                        if rest is not None:
                            memo[(i, pos)] = [r] + rest
                            break
        return memo[(i, pos)]
    return go(0, 0)


def tone_of(s):
    return next((t for t, m in MARKS.items() if any(c in m for c in s)), 0)


def toneless(s):
    return unicodedata.normalize("NFC", "".join(c for c in unicodedata.normalize("NFD", s) if not unicodedata.combining(c) or c == "\u0308"))


# Readings where Taiwan's two references disagree and the app follows TOCFL (what people say), checked by hand.
TW_OK = {"機場": "TOCFL jīchǎng, MOE jī cháng", "姊姊": "TOCFL jiějie, MOE zǐ zi (formal)", "喂": "TOCFL lists wéi and wèi",
         "台": "台 is the everyday form of 臺 tái", "它們": "TOCFL tāmen (what everyone says), MOE tuō men",
         "市場": "TOCFL shìchǎng, MOE shì cháng (like 機場)"}


def check_taiwan(pairs, readings, vocab):
    """Every word's pinyin against the MOE dictionary. A different tone is an error; a neutral tone where the MOE has a full
    tone (or the other way round) is only counted: Taiwan speech has fewer neutral tones than the dictionary, and TOCFL follows speech."""
    cache_f = DATA / "moedict.json"
    cache = json.loads(cache_f.read_text()) if cache_f.exists() else {}
    tone_bad, neutral = set(), set()
    for zh, py in pairs:
        chars = [c for c in zh if is_cjk(c)]
        syl = align(chars, py, readings)
        if not syl:
            continue
        pos = 0
        for w in segment("".join(chars), vocab):
            mine = syl[pos:pos + len(w)]
            pos += len(w)
            if w in TW_OK:
                continue
            cands = []
            for p in moedict(w, cache) or []:
                p = re.sub(r"[（(][^）)]*[）)]", " ", p)
                for alt in re.split(r"[，,、/]", p):
                    a = [norm_py(x) for x in alt.split() if norm_py(x)]
                    if len(a) == len(w):
                        cands.append(a)
            if not cands:
                continue

            def verdict(c):
                v = 0
                for ch, a, b in zip(w, mine, c):
                    if toneless(a) != toneless(b):
                        return 3
                    if tone_of(a) != tone_of(b) and ch not in "一不":
                        v = max(v, 1 if 0 in (tone_of(a), tone_of(b)) else 2)
                return v
            best = min(verdict(c) for c in cands)
            if best >= 2:
                tone_bad.add(f"{w} {' '.join(mine)} (MOE: {' | '.join(' '.join(c) for c in cands)}) in {zh}")
            elif best == 1:
                neutral.add(w)
    cache_f.write_text(json.dumps(cache, ensure_ascii=False))
    out = []
    if tone_bad:
        out.append(f"FAIL Taiwan readings: {len(tone_bad)} words differ from the MOE dictionary (if it's right, add it to TW_OK):\n    " + "\n    ".join(sorted(tone_bad)[:40]))
    else:
        out.append("PASS Taiwan readings: every word's tones match the MOE dictionary (萌典)")
    if neutral:
        out.append(f"INFO {len(neutral)} words have a full tone where the MOE dictionary has a neutral one (or the other way round), as in TOCFL: {' '.join(sorted(neutral))}")
    return out


def main():
    verbose = "-v" in sys.argv
    report, pairs = [], []
    for page in ["tests/engine.html", "tests/skills.html"]:
        p, lines = run_page(page)
        pairs += p
        if not any(l.startswith("DONE") for l in lines):
            lines.append(f"FAIL {page} did not finish")
        passed = [l for l in lines if l.startswith("PASS")]
        report += [l for l in lines if not l.startswith(("PASS", "DONE"))] + [f"PASS {page}: {len(passed)} checks"]

    readings = load_readings()
    bad = []
    for zh, py in pairs:
        why = check_pinyin(zh, py, readings)
        if why:
            bad.append(f"{zh}  {py}\n      → {why}")
    if bad:
        report.append(f"FAIL pinyin: {len(bad)} of {len(pairs)} don't match their characters:\n    " + "\n    ".join(bad[:60]))
    else:
        report.append(f"PASS pinyin: all {len(pairs)} texts match their characters")

    simp = sorted({c for zh, _ in pairs for c in zh if is_cjk(c) and c in SIMP and c not in TRAD})
    if simp:
        report.append(f"FAIL characters: Simplified forms (Taiwan uses Traditional): {' '.join(simp)}")
    else:
        report.append(f"PASS characters: all Traditional, no Simplified forms")

    tocfl = load_tocfl()
    vocab = dict(tocfl)
    for w in EXTRAS:
        vocab.setdefault(w, "extra")
    used = {}
    for zh, _ in pairs:
        for w in segment(zh, vocab):
            used[w] = vocab.get(w, "unknown")
    unknown = sorted(w for w, l in used.items() if l == "unknown")
    by_level = {}
    for w, l in used.items():
        by_level.setdefault(l, []).append(w)
    summary = ", ".join(f"{l}: {len(by_level[l])}" for l in ["Novice 1", "Novice 2", "A1", "A2", "B1", "B2", "C1", "extra"] if l in by_level)
    if unknown:
        report.append(f"FAIL level: not in the TOCFL list or EXTRAS (check them and add them to EXTRAS in tests/check.py): {' '.join(unknown)}")
    else:
        report.append(f"PASS level: all {len(used)} words are in the TOCFL list or EXTRAS ({summary})")
    # coverage: every Novice 1, Novice 2 and A1 word is heard on its own somewhere (not only inside another word)
    missing = {}
    for lid, level, forms, py in tocfl_entries():
        if level in BASIC and not any(f in used for f in forms):
            missing.setdefault(level, []).append(forms[0])
    if missing:
        report.append("FAIL coverage: TOCFL words never heard on their own: " + " · ".join(f"{l} ({len(w)}): {' '.join(w)}" for l, w in missing.items()))
    else:
        n = sum(1 for e in tocfl_entries() if e[1] in BASIC)
        report.append(f"PASS coverage: all {n} Novice 1, Novice 2 and A1 words are heard on their own")
    above = sorted((w for w, l in used.items() if l not in BASIC and l not in ("extra", "unknown")), key=lambda w: (order(used[w]), w))
    if above:
        report.append(f"INFO {len(above)} words above A1" + (": " + " ".join(f"{w}({used[w]})" for w in above) if verbose else " (run with -v to list them)"))

    if "--taiwan" in sys.argv:
        report += check_taiwan(pairs, readings, vocab)

    print("\n".join(report))
    fails = [l for l in report if l.startswith("FAIL")]
    print(f"\n{'❌ ' + str(len(fails)) + ' failing' if fails else '✅ all checks passed'}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
