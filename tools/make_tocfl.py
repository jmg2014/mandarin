#!/usr/bin/env python3
"""Write shared/tocfl.js: the TOCFL Novice 1, Novice 2 and Beginner (A1) words with their English meaning,
for the TOCFL map on the main page.

    python3 tools/make_tocfl.py

Reads tests/data/tocfl.csv and tests/data/cedict.txt.gz (both downloaded by tests/check.py):
- the words: a cleaned-up CSV of the official 2023 TOCFL list (github.com/ivankra/tocfl)
- the meanings: CC-CEDICT (www.mdbg.net/chinese/dictionary?page=cedict), licensed CC BY-SA 4.0.
  For each word, the CC-CEDICT entry whose pinyin matches TOCFL's is used; its first one or two meanings are kept.
  MEANING below overrides the ones that come out unclear for a beginner.
Each word: [forms separated by "/", pinyin, level 1 / 2 / 3, English, optional example to say (see SAY)].
"""
import gzip
import json
import pathlib
import re
import sys
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
import check  # noqa: E402

LEVEL = {"Novice 1": 1, "Novice 2": 2, "A1": 3}

# Meanings checked by hand where CC-CEDICT's first meaning isn't the one a beginner needs (key: first form).
MEANING = {
    "的": "'s, of (links a description to a noun)", "了": "(marks a finished action or a change)", "嗎": "(turns a sentence into a yes/no question)",
    "呢": "and…? (question); (softens a sentence)", "吧": "let's…; …right? (suggestion)", "得": "(links a verb to how well it is done)",
    "著": "(an action or state that continues)", "過": "to pass; (have ever done)", "地": "-ly (makes an adverb); ground",
    "啊": "ah, oh (adds feeling)", "啦": "(friendly emphasis)", "呀": "(friendly emphasis, like 啊)", "喂": "hello? (on the phone)",
    "個": "(the general measure word)", "位": "(polite measure word for people)", "張": "(measure word for flat things: tickets, tables)",
    "本": "(measure word for books)", "件": "(measure word for clothes, matters)", "隻": "(measure word for animals)",
    "枝": "(measure word for pens)", "支": "(measure word for pens, phones)", "輛": "(measure word for vehicles)", "台": "(measure word for machines, cars)",
    "條": "(measure word for long things: roads, trousers)", "雙": "a pair", "片": "a slice, a piece", "份": "a portion, a copy",
    "道": "(measure word for dishes of food)", "部": "(measure word for films)", "場": "(measure word for matches, shows)",
    "種": "a kind, a type", "間": "(measure word for rooms)", "盒": "a box", "名": "(measure word for people, places in a ranking)",
    "句": "(measure word for sentences)", "次": "a time (once, twice)", "杯": "a cup, a glass", "碗": "a bowl", "瓶": "a bottle",
    "塊": "dollar (spoken); a piece", "元": "dollar (written)", "號": "day of the month; number", "點": "o'clock; a little; to order",
    "分": "minute; to divide", "半": "half", "歲": "years old", "樓": "floor (storey); building",
    "我": "I, me", "你": "you", "他": "he, him", "我們": "we, us", "你們": "you (plural)", "他們": "they, them", "它": "it", "它們": "they (things)",
    "要": "to want; will; need to", "會": "can (a skill); will", "能": "can, be able to", "可以": "can, may", "想": "to want to; to think; to miss",
    "在": "at, in; (doing right now)", "是": "to be (am, is, are)", "有": "to have; there is", "沒": "not (have), didn't", "不": "not, no",
    "就": "then; just; right away", "才": "only then, not until", "還": "still; also; else", "也": "also, too", "都": "all, both",
    "再": "again", "又": "again (already happened)", "只": "only", "很": "very (often just links a description)", "太": "too (much)",
    "最": "most", "真": "really", "跟": "with; and", "和": "and, with", "從": "from", "對": "right, correct; towards", "給": "to give; for",
    "把": "(puts the object before the verb)", "被": "(passive: done by)", "讓": "to let, to make", "替": "for, instead of",
    "比": "than (comparing)", "像": "to look like", "向": "towards", "往": "towards", "離": "away from (distance)",
    "打": "to hit; to play (ball); to make (a call)", "開": "to open; to drive; to turn on", "關": "to close; to turn off",
    "上": "on, up; to go to", "下": "under, down; next", "裡": "inside", "中": "middle", "外": "outside",
    "那": "that", "這": "this", "哪": "which", "那裡": "there", "這裡": "here", "哪裡": "where",
    "多": "many, much", "少": "few, little", "大": "big", "小": "small", "好": "good, well", "高": "tall, high", "長": "long",
    "早": "early; morning", "晚": "late; evening", "快": "fast", "慢": "slow", "新": "new", "舊": "old (things)", "老": "old (people)",
    "行": "OK, fine; to go", "棒": "great!", "差不多": "about, almost", "一點": "a little", "有點": "a bit (too)", "一些": "some",
    "東西": "thing, stuff", "事": "matter, thing (to do)", "地方": "place", "時候": "time, when…", "意思": "meaning", "名字": "name",
    "先生": "Mr; husband", "小姐": "Miss; young lady", "太太": "Mrs; wife", "老闆": "boss, shop owner", "客氣": "polite; to stand on ceremony",
    "不客氣": "you're welcome", "沒關係": "it doesn't matter, that's OK", "對不起": "sorry", "不好意思": "excuse me, sorry",
    "謝謝": "thank you", "再見": "goodbye", "請問": "excuse me, may I ask…", "請": "please; to invite",
    "便宜": "cheap", "貴": "expensive", "怎麼": "how; why", "怎麼樣": "how is it? how about…?", "為什麼": "why", "什麼": "what",
    "幾": "how many; a few", "多少": "how many, how much", "誰": "who",
    # CC-CEDICT's first sense isn't the everyday one
    "大學": "university", "回": "to go back, to return", "看": "to look, to watch, to read", "告訴": "to tell",
    "漢堡": "hamburger", "蘋果": "apple", "加": "to add", "美": "beautiful", "熱": "hot", "累": "tired",
    "別": "don't…!", "更": "even more", "帶": "to bring, to take along", "穿": "to wear, to put on", "故事": "story",
    "黃色": "yellow", "白色": "white", "肚": "tummy, belly", "跑": "to run", "來": "to come", "看見": "to see",
    "您": "you (polite)", "時間": "time", "國": "country", "字": "Chinese character, word", "筆": "pen",
    "說": "to speak, to say", "叫": "to be called; to call", "久": "a long time", "水": "water", "做": "to do, to make",
    "去": "to go", "開車": "to drive", "難": "difficult", "吃": "to eat", "可是": "but", "還是": "or (in questions); still",
    "沒有": "not have; there isn't; didn't", "男": "male, man", "大家": "everyone", "日": "day; sun", "後天": "the day after tomorrow",
    "家人": "family (members)", "矮": "short (not tall)", "瘦": "thin", "萬": "ten thousand", "工作": "work; to work",
    "醫生": "doctor", "英文": "English (language)", "餐廳": "restaurant", "讀": "to read, to study", "念": "to read aloud; to study",
    "課": "class, lesson", "門": "door", "床": "bed", "不錯": "pretty good, not bad", "風": "wind", "山": "mountain",
    "咖啡": "coffee", "用": "to use", "方便": "convenient", "先": "first", "唱": "to sing", "歌": "song", "介紹": "to introduce",
    "左": "left", "右": "right", "旁": "side (next to)", "附近": "nearby", "拿": "to take, to hold", "站": "to stand; station",
    "進": "to come in, to enter", "手": "hand", "腳": "foot", "頭": "head", "耳朵": "ear", "嘴巴": "mouth", "看病": "to see a doctor",
    "見": "to see, to meet", "店": "shop", "夠": "enough", "菜": "dish (of food); vegetables", "酒": "alcohol (wine, spirits)",
    "巧克力": "chocolate", "甜": "sweet", "一起": "together", "所以": "so, therefore", "可能": "maybe, possible", "得|děi": "to have to, must",
    "邊": "side", "哪|na": "(softens a sentence, like 啊)", "禮拜": "week (spoken)", "生氣": "angry", "辛苦": "hard work; tiring",
    "願意": "to be willing", "習慣": "to be used to; habit", "當然": "of course", "開學": "school starts", "答": "to answer",
    "還|huán": "to give back, to return", "行|háng": "a line of work, a trade", "長|zhǎng": "to grow", "地|dì": "ground, floor",
    "沙發": "sofa", "雪": "snow", "河": "river", "馬": "horse", "貓": "cat", "樹": "tree", "火": "fire", "跑步": "to run, running",
    "踢": "to kick", "活動": "event, activity", "平常": "usually", "寄": "to send (by post)", "接": "to pick up (someone); to answer (the phone)",
    "麻煩": "trouble; to bother (someone)", "見面": "to meet", "飛機場": "airport", "西": "west", "北": "north", "東": "east",
    "中間": "middle, between", "送": "to give (a present); to deliver", "一直": "straight on; all the time", "啤酒": "beer",
    "那麼": "so, that (much)", "不過": "but, however", "有的": "some", "一下": "a moment, a bit (after a verb)", "包": "bag; to wrap",
    "管": "", "褲": "trousers", "裙": "skirt", "襪": "socks", "帽": "hat", "刀": "knife", "叉": "fork", "盤": "plate",
    "冷氣": "air conditioning", "宿舍": "dormitory", "作業": "homework", "成績": "grades (results)", "華語": "Mandarin Chinese",
    "字典": "dictionary", "想法": "idea, opinion", "學習": "to learn, to study", "辦法": "way, solution", "大樓": "building",
    "電梯": "lift, elevator", "姓名": "full name", "第": "(before a number) the …th: 第一 first", "名字": "name",
    "等": "to wait", "走": "to walk; to leave", "找": "to look for", "回答": "to answer", "交": "to hand in", "借": "to borrow, to lend",
    "流": "", "生日": "birthday", "鼻": "nose", "電視": "TV", "車": "car", "筷": "chopsticks", "餃": "dumplings", "鞋": "shoe",
    "房": "house, room", "桌": "table", "椅": "chair", "屋": "house, room", "窗": "window", "盒": "box", "瓶": "bottle",
    "杯": "cup, glass", "零": "zero", "上學": "to go to school", "下班": "to finish work", "開始": "to start", "比較": "fairly; to compare",
    "有空": "to be free (have time)", "照相": "to take a photo", "汽車": "car", "袋子": "bag", "賣": "to sell", "健康": "healthy; health",
    # shorter or clearer for a learner
    "一": "one", "二": "two", "兩": "two (before a measure word)", "百": "hundred", "雞": "chicken", "牛": "cow, ox", "同學": "classmate",
    "星期": "week", "小朋友": "child, kid", "參觀": "to visit (a place)", "以為": "to think (wrongly)", "錯": "wrong; mistake",
    "飯": "rice; meal", "騎": "to ride (a bike, a scooter)", "酸": "sour", "鹹": "salty", "苦": "bitter", "輕": "light (not heavy)",
    "重": "heavy", "草": "grass", "心": "heart", "試": "to try", "短": "short (not long)", "痛": "to hurt; painful",
    "樣子": "look, appearance", "顏色": "colour", "大衣": "winter coat", "外套": "jacket", "這麼": "so, this (much)",
    "地|de": "-ly (makes an adverb)", "後來": "later, afterwards", "最近": "recently, lately", "經過": "to go past; to go through",
    "掉": "to fall, to drop", "放": "to put", "近": "near, close", "遠": "far", "忙": "busy", "學": "to learn, to study", "書": "book",
    "聽": "to listen, to hear", "花": "flower; to spend", "低": "low", "跳": "to jump", "球": "ball; ball game", "玩": "to play, to have fun",
    "一樣": "the same", "肉": "meat", "冰": "ice", "湯": "soup", "蛋": "egg", "麵": "noodles", "牛奶": "milk",
    "奶奶": "grandma (father's mother)", "爺爺": "grandpa (father's father)", "媽媽": "mum", "爸爸": "dad", "運動": "sport, exercise",
    "打算": "to plan to", "準備": "to prepare", "講": "to speak, to tell", "經驗": "experience", "相信": "to believe", "決定": "to decide",
    "票": "ticket", "班": "class (group of students)", "年級": "school year, grade", "餓": "hungry", "病": "illness", "變": "to change, to become",
    "壞": "bad; broken", "信": "letter; to believe", "掛": "to hang", "脫": "to take off (clothes, shoes)", "搬": "to move (house, things)",
    "餐": "meal", "電": "electricity", "燈": "light, lamp", "太陽": "sun", "海": "sea", "今天": "today", "現在": "now",
    "住": "to live (somewhere); to stay", "姓": "surname; to be surnamed", "覺得": "to feel, to think", "喜歡": "to like",
    "買": "to buy", "學生": "student", "知道": "to know", "問題": "question; problem", "說話": "to talk", "非常": "very, extremely",
    "空氣": "air", "功課": "homework", "樓梯": "stairs", "客廳": "living room", "冰箱": "fridge", "房租": "rent", "租": "to rent",
    "打電話": "to phone, to call", "起床": "to get up", "睡覺": "to sleep, to go to bed", "走路": "to walk", "唱歌": "to sing",
    "外頭": "outside", "裡面": "inside", "身體": "body; health", "眼睛": "eyes", "感冒": "a cold; to catch a cold", "生病": "to get ill",
    "藥": "medicine", "公園": "park", "國家": "country", "怕": "to be afraid (of)", "應該": "should", "真的": "really, truly",
    "工人": "worker", "司機": "driver", "大人": "adult", "老人": "elderly person", "男生": "boy; man", "女生": "girl; woman",
    "家庭": "family", "別人": "other people", "笑": "to laugh, to smile", "哭": "to cry", "緊張": "nervous", "高興": "happy, glad",
    "可愛": "cute", "聰明": "clever", "努力": "to work hard", "能力": "ability", "機會": "chance, opportunity", "如果": "if",
    "注意": "to pay attention", "讀書": "to study", "認為": "to think (an opinion)", "清楚": "clear", "記得": "to remember", "忘": "to forget",
    "算": "to count, to work out", "方法": "method, way", "進步": "to improve; progress", "洗手間": "toilet", "家具": "furniture",
    "關": "to close; to turn off", "乾淨": "clean", "雪": "snow", "洗": "to wash", "洗澡": "to have a shower, to bathe",
    "發現": "to notice, to find out", "過年": "to celebrate Chinese New Year", "游泳": "to swim", "足球": "football",
    "網球": "tennis", "比賽": "match, competition", "上網": "to go online", "網路": "the internet", "報紙": "newspaper",
    "電影院": "cinema", "聊天": "to chat", "客人": "guest; customer", "禮物": "present, gift", "歡迎": "welcome",
    "幫忙": "to help", "幫助": "to help; help", "認識": "to know (someone); to meet", "聽說": "to hear (that…)",
    "事情": "matter, thing", "幫": "to help", "錢包": "wallet", "拉": "to pull", "怎麼辦": "what shall I do?", "車站": "station",
    "馬路": "road", "路口": "intersection", "十字路口": "crossroads", "對面": "opposite, across the road", "旅行": "to travel",
    "飯店": "hotel; restaurant", "旅館": "hotel", "照相機": "camera", "照片": "photo", "風景": "scenery", "離開": "to leave",
    "轉": "to turn", "最後": "in the end; last", "病人": "patient", "頭髮": "hair", "臉": "face", "舒服": "comfortable; feeling well",
    "眼鏡": "glasses", "付": "to pay", "希望": "to hope; hope", "書店": "bookshop", "商店": "shop", "市場": "market",
    "超級市場": "supermarket", "重要": "important", "手錶": "watch", "皮包": "handbag", "小心": "careful!", "戴": "to wear (glasses, a hat, a watch)",
    "特別": "special", "簡單": "simple", "其他": "other", "聲音": "sound; voice", "好像": "to seem", "奇怪": "strange",
    "點心": "snacks, pastries", "青菜": "vegetables", "糖": "sugar; sweets", "湯匙": "spoon", "味道": "taste, flavour", "香": "fragrant, smells good",
    "全部": "all, the whole", "所有": "all", "需要": "to need", "烤": "to grill, to roast", "雖然": "although", "本來": "originally; at first",
    "有時候": "sometimes", "總是": "always", "已經": "already", "各": "each, every", "從前": "in the past; once upon a time",
    "剛剛": "just now", "一會兒": "a moment, a while", "結婚": "to get married", "春天": "spring", "夏天": "summer", "秋天": "autumn", "冬天": "winter",
    "醫院": "hospital", "公司": "company", "辦公室": "office", "護士": "nurse", "上班": "to go to work", "計畫": "plan", "小學": "primary school",
    "高中": "high school", "語言": "language", "黑板": "blackboard", "課本": "textbook", "部分": "part", "練習": "to practise; exercise",
    "參加": "to take part (in)", "文化": "culture", "棒球": "baseball", "籃球": "basketball", "網站": "website", "次": "time (once, twice)",
    "音樂": "music", "地址": "address", "號碼": "number", "市": "city (as in 台北市)", "城市": "city", "街": "street", "電子郵件": "email",
    "地圖": "map", "照相": "to take a photo", "南": "south", "健康": "healthy; health", "渴": "thirsty", "賣": "to sell",
}
MEANING = {k: v for k, v in MEANING.items() if v}

MARKS = check.MARKS


def toneless(s):
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if not unicodedata.combining(c) or c == "̈").replace("ü", "u")


def load_cedict():
    d = {}
    with gzip.open(ROOT / "tests" / "data" / "cedict.txt.gz", "rt", encoding="utf-8") as f:
        for line in f:
            m = re.match(r"(\S+) \S+ \[([^\]]+)\] /(.*)/", line)
            if m:
                d.setdefault(m.group(1), []).append((m.group(2), m.group(3).split("/")))
    return d


def clean(defs):
    """CC-CEDICT senses made readable: no pinyin or characters, no cross-references, no classifiers"""
    out = []
    for x in defs:
        x = re.sub(r"\s*\[[^\]]*\]", "", x)                                    # pinyin in brackets
        x = re.sub(r"\([^()]*[\u4e00-\u9fff][^()]*\)", "", x)                    # (as in 回來…) with characters
        x = re.sub(r"[\u4e00-\u9fff|]+", "", x)
        x = re.sub(r"\((Tw|coll\.|old|literary|loanword|bound form|dialect|slang|of a person|of an animal|attributive)\)\s*", "", x)
        x = re.sub(r"\s+", " ", x).strip(" ;,")
        if not x or x.count("(") != x.count(")"):
            continue
        if re.match(r"(?i)(surname|see |variant of|old variant|CL:|abbr\. for|also written|used in|classifier for|Taiwan pr\.|also pr\.)", x):
            continue
        if x not in out:
            out.append(x)
    return out


def meaning(forms, py, cedict):
    key = forms[0] + "|" + py.split("/")[0]
    if key in MEANING:
        return MEANING[key]
    if forms[0] in MEANING:
        return MEANING[forms[0]]
    want = toneless(py.split("/")[0].replace(" ", ""))
    best = None
    for f in forms:
        for cpy, defs in cedict.get(f, []):
            mine = toneless("".join(check.numeric_to_marked(cpy)))
            score = (mine == want, not any(x.lower().startswith("surname") for x in defs[:1]), cpy[:1].islower())
            senses = clean(defs)
            if senses and (best is None or score > best[0]):
                best = (score, senses)
    if not best:
        return ""
    senses, out = best[1], []
    for x in senses:                       # the first sense, plus a second one if it is short
        if out and len("; ".join(out + [x])) > 40:
            break
        out.append(x)
    return "; ".join(out)


# Characters the voice would read with another reading when they are said alone: say a short example instead.
SAY = {"行|háng": "哪一行", "得|děi": "我得走了", "得|de": "說得很好", "還|huán": "還錢", "還|hái": "還有", "長|zhǎng": "長大", "長|cháng": "很長",
       "地|de": "慢慢地", "地|dì": "地上", "了|le": "好了", "著|zhe": "坐著", "的|de": "我的", "哪|na": "好哪", "喂|wèi": "喂，你好",
       "過|guò": "去過", "給|gěi": "給我", "要|yào": "我要", "會|huì": "我會", "便宜|piányí": "很便宜", "大學|dàxué": "大學生"}


cedict = load_cedict()
rows = []
for lid, level, forms, py in check.tocfl_entries():
    if level in LEVEL:
        forms = list(dict.fromkeys(forms))
        row = ["/".join(forms), py, LEVEL[level], meaning(forms, py, cedict)]
        say = SAY.get(forms[0] + "|" + py.split("/")[0])
        if say:
            row.append(say)
        rows.append(row)
missing = [r[0] for r in rows if not r[3]]
js = ("/* The TOCFL word list (華語八千詞, 2023): Novice 1 (1), Novice 2 (2) and Beginner A1 (3). Made by tools/make_tocfl.py.\n"
      "   Each word: [forms separated by \"/\", pinyin, level, English, example to say instead of the word alone (optional)].\n"
      "   English meanings from CC-CEDICT (https://www.mdbg.net/chinese/dictionary?page=cedict), CC BY-SA 4.0, some edited by hand. */\n"
      "window.ZH = window.ZH || {};\nZH.TOCFL = [\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n];\n")
(ROOT / "shared" / "tocfl.js").write_text(js, encoding="utf-8")
print(f"wrote shared/tocfl.js: {len(rows)} words, {len(missing)} without a meaning: {' '.join(missing)}")
