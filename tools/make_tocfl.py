#!/usr/bin/env python3
"""Write shared/tocfl.js: the TOCFL Novice 1, Novice 2 and Beginner (A1) words, for the TOCFL map on the main page.

    python3 tools/make_tocfl.py

Reads tests/data/tocfl.csv (downloaded by tests/check.py: a cleaned-up CSV of the official 2023 list,
from github.com/ivankra/tocfl). Each word: [forms separated by "/", pinyin, level 1 / 2 / 3].
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tests"))
import check  # noqa: E402

LEVEL = {"Novice 1": 1, "Novice 2": 2, "A1": 3}
rows = [["/".join(dict.fromkeys(forms)), py, LEVEL[level]] for lid, level, forms, py in check.tocfl_entries() if level in LEVEL]
js = ("/* The TOCFL word list (華語八千詞, 2023): Novice 1 (1), Novice 2 (2) and Beginner A1 (3). Made by tools/make_tocfl.py.\n"
      "   Each word: [forms separated by \"/\", pinyin, level]. */\n"
      "window.ZH = window.ZH || {};\nZH.TOCFL = [\n" + ",\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n];\n")
(ROOT / "shared" / "tocfl.js").write_text(js, encoding="utf-8")
print(f"wrote shared/tocfl.js: {len(rows)} words")
