import React, { useState, useEffect, useMemo } from "react";

// =============================================================
// KANJI DATABASE
// Each syllable maps to an array of common name kanji with English meanings.
// This is intentionally curated — a real product would grow this from a
// source like the jinmeiyō list or jisho.org. Around 50 syllables here.
// =============================================================

const KANJI = {
  a: [
    { k: "亜", m: "second, Asia" },
    { k: "阿", m: "corner, nook" },
    { k: "愛", m: "love, affection" },
    { k: "安", m: "peace, calm" },
    { k: "明", m: "bright, light" },
    { k: "朝", m: "morning" },
    { k: "彩", m: "color, hue" },
    { k: "杏", m: "apricot" },
    { k: "吾", m: "I, my", expanded: true },
    { k: "亞", m: "second-rate (variant)", dark: true },
    { k: "唖", m: "mute, silent", dark: true },
  ],
  i: [
    { k: "伊", m: "this one, Italy" },
    { k: "衣", m: "garment, clothing" },
    { k: "依", m: "rely on, depend" },
    { k: "維", m: "tie, support, sustain" },
    { k: "偉", m: "admirable, great" },
    { k: "唯", m: "solely, only" },
    { k: "緯", m: "horizontal, latitude" },
    { k: "惟", m: "ponder, only", expanded: true },
    { k: "葦", m: "reed, rush", expanded: true },
    { k: "畏", m: "fear, awe", dark: true },
    { k: "萎", m: "wither, droop", dark: true },
  ],
  u: [
    { k: "宇", m: "universe, eaves" },
    { k: "羽", m: "feather, wing" },
    { k: "卯", m: "rabbit (zodiac)" },
    { k: "雨", m: "rain" },
    { k: "有", m: "exist, have" },
    { k: "優", m: "gentle, superior" },
    { k: "烏", m: "crow", expanded: true },
    { k: "憂", m: "melancholy, grief", dark: true },
  ],
  e: [
    { k: "江", m: "creek, inlet" },
    { k: "恵", m: "blessing, grace" },
    { k: "絵", m: "picture, drawing" },
    { k: "永", m: "eternity, perpetual" },
    { k: "英", m: "England, eminent" },
    { k: "映", m: "reflect, projection" },
    { k: "依", m: "rely on, depend", expanded: true },
    { k: "詠", m: "recite, compose poem", expanded: true },
    { k: "叡", m: "imperial, wisdom", expanded: true },
  ],
  o: [
    { k: "央", m: "center, middle" },
    { k: "桜", m: "cherry blossom" },
    { k: "緒", m: "cord, beginning" },
    { k: "旺", m: "prosperous, flourishing" },
    { k: "雄", m: "male, hero" },
    { k: "凰", m: "female phoenix" },
    { k: "奥", m: "interior, depth", expanded: true },
  ],
  ka: [
    { k: "香", m: "fragrance, perfume" },
    { k: "花", m: "flower, blossom" },
    { k: "華", m: "splendid, brilliant" },
    { k: "佳", m: "excellent, fine" },
    { k: "嘉", m: "esteemed, joyous" },
    { k: "歌", m: "song, sing" },
    { k: "果", m: "fruit, result" },
    { k: "夏", m: "summer" },
    { k: "樺", m: "birch tree", expanded: true },
    { k: "霞", m: "mist, haze", expanded: true },
    { k: "珂", m: "jade, hairpin", expanded: true },
    { k: "禍", m: "calamity, misfortune", dark: true },
    { k: "過", m: "excess, error", dark: true },
    { k: "苛", m: "harass, harsh", dark: true },
  ],
  ki: [
    { k: "希", m: "hope, rare" },
    { k: "紀", m: "chronicle, era" },
    { k: "季", m: "season" },
    { k: "貴", m: "noble, precious" },
    { k: "樹", m: "tree, timber" },
    { k: "喜", m: "rejoice, delight" },
    { k: "輝", m: "radiance, shine" },
    { k: "妃", m: "consort, princess" },
    { k: "綺", m: "elegant, beautiful", expanded: true },
    { k: "稀", m: "rare, uncommon", expanded: true },
    { k: "毅", m: "strong-willed, firm", expanded: true },
    { k: "葵", m: "hollyhock", expanded: true },
    { k: "鬼", m: "demon, ogre", dark: true },
    { k: "棄", m: "abandon, discard", dark: true },
    { k: "飢", m: "starve, hunger", dark: true },
    { k: "危", m: "danger, peril", dark: true },
    { k: "祈", m: "pray, supplicate" },
    { k: "亀", m: "turtle (longevity)" },
  ],
  ku: [
    { k: "久", m: "long time, eternity" },
    { k: "玖", m: "jade, nine" },
    { k: "来", m: "come, arrive" },
    { k: "空", m: "sky, emptiness" },
    { k: "紅", m: "crimson" },
    { k: "九", m: "nine" },
    { k: "駆", m: "gallop, run", expanded: true },
    { k: "矩", m: "carpenter's square", expanded: true },
    { k: "苦", m: "suffering, bitterness", dark: true },
    { k: "屈", m: "yield, succumb", dark: true },
    { k: "朽", m: "decay, rot", dark: true },
  ],
  ke: [
    { k: "慶", m: "celebrate, jubilation" },
    { k: "圭", m: "square jewel" },
    { k: "啓", m: "disclose, open" },
    { k: "恵", m: "blessing, grace" },
    { k: "景", m: "scenery, view" },
    { k: "健", m: "healthy, strong" },
    { k: "慧", m: "wise, intelligent", expanded: true },
    { k: "継", m: "inherit, succeed", expanded: true },
    { k: "怪", m: "suspicious, mystery", dark: true },
    { k: "倦", m: "weary, tired of", dark: true },
    { k: "詣", m: "pilgrimage, visit shrine", expanded: true },
  ],
  ko: [
    { k: "子", m: "child" },
    { k: "光", m: "light, radiance" },
    { k: "湖", m: "lake" },
    { k: "心", m: "heart, mind" },
    { k: "古", m: "old, ancient" },
    { k: "虎", m: "tiger" },
    { k: "幸", m: "happiness, good fortune" },
    { k: "瑚", m: "coral" },
    { k: "琥", m: "amber, tiger-jewel", expanded: true },
    { k: "鼓", m: "drum", expanded: true },
    { k: "枯", m: "wither, die plant", dark: true },
    { k: "孤", m: "solitary, orphan", dark: true },
    { k: "哭", m: "weep, wail", dark: true },
  ],
  sa: [
    { k: "沙", m: "sand" },
    { k: "紗", m: "thin silk, gauze" },
    { k: "早", m: "early, swift" },
    { k: "咲", m: "bloom, blossom" },
    { k: "佐", m: "assist, help" },
    { k: "桜", m: "cherry blossom" },
    { k: "彩", m: "color, hue" },
    { k: "冴", m: "clear, lucid" },
  ],
  shi: [
    { k: "史", m: "history, chronicle" },
    { k: "詩", m: "poem, poetry" },
    { k: "志", m: "intention, will" },
    { k: "至", m: "utmost, climax" },
    { k: "司", m: "rule, govern" },
    { k: "紫", m: "purple, violet" },
    { k: "思", m: "think, contemplate" },
    { k: "士", m: "gentleman, warrior" },
    { k: "獅", m: "lion" },
    { k: "紙", m: "paper", expanded: true },
    { k: "雫", m: "drop, droplet", expanded: true },
    { k: "死", m: "death", dark: true },
    { k: "屍", m: "corpse, dead body", dark: true },
    { k: "失", m: "lose, miss", dark: true },
    { k: "私", m: "private, humble I", expanded: true },
  ],
  su: [
    { k: "寿", m: "longevity, congratulations" },
    { k: "須", m: "must, ought" },
    { k: "朱", m: "vermilion, scarlet" },
    { k: "澄", m: "clear, lucid" },
    { k: "涼", m: "cool, refreshing" },
    { k: "素", m: "plain, element" },
    { k: "透", m: "transparent, see through", expanded: true },
    { k: "酢", m: "vinegar, sour", dark: true },
  ],
  se: [
    { k: "世", m: "world, generation" },
    { k: "瀬", m: "rapids, current" },
    { k: "星", m: "star" },
    { k: "聖", m: "holy, sage" },
    { k: "誠", m: "sincerity, truth" },
    { k: "征", m: "subjugate, expedition", expanded: true },
  ],
  so: [
    { k: "想", m: "concept, thought" },
    { k: "創", m: "create, originate" },
    { k: "颯", m: "swift wind" },
    { k: "蒼", m: "pale blue, lush" },
    { k: "宗", m: "sect, religion" },
    { k: "奏", m: "play music, present", expanded: true },
    { k: "素", m: "elementary, plain", expanded: true },
  ],
  ta: [
    { k: "太", m: "great, big" },
    { k: "多", m: "many, much" },
    { k: "田", m: "rice field" },
    { k: "泰", m: "peaceful, calm" },
    { k: "汰", m: "select, sift" },
    { k: "詫", m: "apologize, regret", expanded: true },
    { k: "堕", m: "fall, depraved", dark: true },
  ],
  chi: [
    { k: "千", m: "thousand" },
    { k: "智", m: "wisdom, intellect" },
    { k: "知", m: "know, knowledge" },
    { k: "馳", m: "gallop, sprint" },
    { k: "地", m: "earth, land" },
    { k: "致", m: "cause, deliver", expanded: true },
    { k: "稚", m: "young, naive", expanded: true },
    { k: "血", m: "blood", dark: true },
    { k: "恥", m: "shame, dishonor", dark: true },
  ],
  tsu: [
    { k: "津", m: "haven, harbor" },
    { k: "都", m: "capital, metropolis" },
    { k: "通", m: "pass through" },
  ],
  te: [
    { k: "天", m: "heaven, sky" },
    { k: "哲", m: "philosophy, wisdom" },
    { k: "鉄", m: "iron, steel" },
    { k: "手", m: "hand" },
  ],
  to: [
    { k: "斗", m: "dipper, ladle" },
    { k: "都", m: "capital, metropolis" },
    { k: "杜", m: "forest grove" },
    { k: "登", m: "climb, ascend" },
    { k: "冬", m: "winter" },
    { k: "兎", m: "rabbit" },
    { k: "透", m: "transparent" },
    { k: "翔", m: "soar, glide" },
    { k: "叶", m: "grant, fulfill" },
    { k: "倒", m: "topple, collapse", dark: true },
    { k: "闘", m: "fight, struggle", dark: true },
    { k: "屠", m: "slaughter, butcher", dark: true },
  ],
  na: [
    { k: "奈", m: "apple tree, what" },
    { k: "那", m: "what" },
    { k: "菜", m: "greens, vegetables" },
    { k: "凪", m: "lull, calm" },
    { k: "名", m: "name, fame" },
    { k: "七", m: "seven" },
    { k: "南", m: "south" },
    { k: "夏", m: "summer" },
    { k: "梛", m: "nagi tree", expanded: true },
  ],
  ni: [
    { k: "二", m: "two" },
    { k: "仁", m: "humanity, benevolence" },
    { k: "似", m: "resemble" },
    { k: "丹", m: "cinnabar, sincerity" },
    { k: "虹", m: "rainbow" },
    { k: "日", m: "sun, day" },
    { k: "尼", m: "nun, Buddhist priestess", dark: true },
  ],
  no: [
    { k: "乃", m: "from, possessive" },
    { k: "之", m: "of, this" },
    { k: "野", m: "field, wilderness" },
    { k: "望", m: "hope, wish" },
    { k: "農", m: "agriculture" },
    { k: "埜", m: "field variant", expanded: true },
    { k: "脳", m: "brain, mind", expanded: true },
  ],
  ne: [
    { k: "寧", m: "tranquil, peaceful" },
    { k: "音", m: "sound" },
    { k: "根", m: "root, source" },
    { k: "祢", m: "ancestral shrine", expanded: true },
  ],
  ha: [
    { k: "葉", m: "leaf" },
    { k: "羽", m: "feather, wing" },
    { k: "春", m: "spring (season)" },
    { k: "波", m: "wave" },
    { k: "巴", m: "comma, swirl" },
    { k: "萩", m: "bush clover" },
    { k: "陽", m: "sunshine, positive" },
    { k: "帆", m: "sail" },
    { k: "琶", m: "lute, biwa", expanded: true },
    { k: "破", m: "tear, break, destroy", dark: true },
    { k: "罵", m: "revile, abuse", dark: true },
    { k: "婆", m: "old woman", dark: true },
    { k: "覇", m: "supremacy, dominate", dark: true },
  ],
  hi: [
    { k: "妃", m: "princess, consort" },
    { k: "陽", m: "sunshine, positive" },
    { k: "緋", m: "scarlet, crimson" },
    { k: "飛", m: "fly, soar" },
    { k: "日", m: "sun, day" },
    { k: "響", m: "echo, resound" },
    { k: "光", m: "light, radiance" },
    { k: "斐", m: "beautiful, refined", expanded: true },
    { k: "彦", m: "youth, prince", expanded: true },
    { k: "悲", m: "sorrow, grief", dark: true },
    { k: "罷", m: "quit, dismiss", dark: true },
    { k: "卑", m: "lowly, base", dark: true },
  ],
  fu: [
    { k: "風", m: "wind, style" },
    { k: "富", m: "wealth, abundance" },
    { k: "楓", m: "maple tree" },
    { k: "芙", m: "lotus" },
    { k: "文", m: "writing, sentence" },
    { k: "普", m: "universal, widespread" },
    { k: "譜", m: "musical score, genealogy", expanded: true },
    { k: "浮", m: "float, drift", expanded: true },
    { k: "怖", m: "fear, dread", dark: true },
    { k: "巫", m: "shaman, miko", expanded: true },
  ],
  he: [
    { k: "平", m: "peaceful, flat" },
    { k: "辺", m: "edge, area" },
    { k: "ヘ", m: "katakana variant", kana: true },
    { k: "瓶", m: "bottle, jar", expanded: true },
    { k: "屁", m: "fart, trifle", dark: true },
    { k: "弊", m: "evil custom, abuse", dark: true },
  ],
  ho: [
    { k: "帆", m: "sail" },
    { k: "朋", m: "companion, friend" },
    { k: "歩", m: "step, walk" },
    { k: "穂", m: "ear of grain" },
    { k: "宝", m: "treasure" },
    { k: "芳", m: "fragrant, virtuous" },
    { k: "保", m: "protect, preserve" },
    { k: "輔", m: "assist, support", expanded: true },
    { k: "法", m: "dharma, law, Buddhist teaching" },
    { k: "鳳", m: "phoenix (mythical)" },
  ],
  ma: [
    { k: "真", m: "truth, genuine" },
    { k: "麻", m: "hemp, flax" },
    { k: "茉", m: "jasmine" },
    { k: "馬", m: "horse" },
    { k: "万", m: "ten thousand" },
    { k: "磨", m: "polish, grind" },
    { k: "舞", m: "dance" },
    { k: "満", m: "full, complete" },
    { k: "摩", m: "rub, polish", expanded: true },
    { k: "麿", m: "name suffix", expanded: true },
    { k: "魔", m: "demon, magic", dark: true },
    { k: "抹", m: "rub out, erase", dark: true },
  ],
  mi: [
    { k: "美", m: "beauty, beautiful" },
    { k: "海", m: "sea, ocean" },
    { k: "実", m: "fruit, reality" },
    { k: "深", m: "deep, profound" },
    { k: "見", m: "see, observe" },
    { k: "弥", m: "increasingly, all the more" },
    { k: "心", m: "heart, mind" },
    { k: "巳", m: "snake (zodiac)" },
  ],
  mu: [
    { k: "夢", m: "dream" },
    { k: "武", m: "martial, military" },
    { k: "牟", m: "barley, peer" },
    { k: "六", m: "six" },
    { k: "務", m: "duty, task", expanded: true },
    { k: "睦", m: "harmonious, friendly", expanded: true },
    { k: "無", m: "void, nothingness (Zen mu)" },
    { k: "矛", m: "halberd, spear", dark: true },
  ],
  me: [
    { k: "芽", m: "sprout, bud" },
    { k: "萌", m: "blossom, sprout" },
    { k: "命", m: "fate, life" },
    { k: "愛", m: "love, affection" },
    { k: "鳴", m: "cry, sing", expanded: true },
    { k: "滅", m: "destroy, ruin, annihilate", dark: true },
  ],
  mo: [
    { k: "萌", m: "sprout, bud" },
    { k: "桃", m: "peach" },
    { k: "茂", m: "luxuriant, flourishing" },
    { k: "望", m: "hope, wish" },
    { k: "百", m: "hundred" },
    { k: "文", m: "writing, literature" },
    { k: "紋", m: "crest, pattern" },
    { k: "藻", m: "seaweed, algae", expanded: true },
    { k: "妄", m: "deluded, reckless", dark: true },
    { k: "喪", m: "mourning, loss", dark: true },
  ],
  ya: [
    { k: "也", m: "to be (classical)" },
    { k: "矢", m: "arrow" },
    { k: "弥", m: "increasingly" },
    { k: "哉", m: "exclamation (classical)" },
    { k: "八", m: "eight" },
    { k: "夜", m: "night" },
    { k: "椰", m: "palm tree" },
    { k: "耶", m: "question particle", expanded: true },
    { k: "冶", m: "metallurgy, smelt", expanded: true },
    { k: "厄", m: "calamity, misfortune", dark: true },
    { k: "闇", m: "darkness, gloom", dark: true },
  ],
  yu: [
    { k: "優", m: "gentle, superior" },
    { k: "由", m: "reason, cause" },
    { k: "結", m: "tie, bind" },
    { k: "悠", m: "leisurely, calm" },
    { k: "友", m: "friend" },
    { k: "夕", m: "evening, dusk" },
    { k: "柚", m: "citron" },
    { k: "裕", m: "abundant, plentiful" },
    { k: "勇", m: "courage, brave", expanded: true },
    { k: "祐", m: "divine help", expanded: true },
    { k: "憂", m: "melancholy, sorrow", dark: true },
    { k: "幽", m: "ghost, ethereal", dark: true },
  ],
  yo: [
    { k: "世", m: "world, era" },
    { k: "代", m: "generation, era" },
    { k: "与", m: "give, participate" },
    { k: "誉", m: "honor, fame" },
    { k: "良", m: "good, virtuous" },
    { k: "陽", m: "sun, positive" },
    { k: "葉", m: "leaf, foliage", expanded: true },
    { k: "洋", m: "ocean, Western", expanded: true },
    { k: "妖", m: "bewitching, suspicious", dark: true },
  ],
  ra: [
    { k: "良", m: "good, virtuous" },
    { k: "蘭", m: "orchid" },
    { k: "羅", m: "thin silk, gauze" },
    { k: "楽", m: "comfort, music" },
    { k: "等", m: "equal, similar" },
    { k: "螺", m: "spiral, snail-shell", expanded: true },
    { k: "洛", m: "Kyoto, capital", expanded: true },
    { k: "落", m: "fall, drop", dark: true },
    { k: "裸", m: "naked, bare", dark: true },
  ],
  ri: [
    { k: "里", m: "village, league" },
    { k: "理", m: "logic, reason" },
    { k: "利", m: "benefit, advantage" },
    { k: "莉", m: "jasmine" },
    { k: "璃", m: "lapis lazuli, glass" },
    { k: "凛", m: "cold, dignified" },
    { k: "梨", m: "pear" },
    { k: "李", m: "plum" },
    { k: "俐", m: "clever", expanded: true },
    { k: "離", m: "separate, part from", dark: true },
    { k: "痢", m: "dysentery", dark: true },
  ],
  ru: [
    { k: "流", m: "flow, current" },
    { k: "留", m: "detain, keep" },
    { k: "琉", m: "gemstone" },
    { k: "瑠", m: "lapis lazuli" },
    { k: "塁", m: "rampart, base" },
    { k: "涙", m: "tears", dark: true },
  ],
  re: [
    { k: "玲", m: "sound of jewels" },
    { k: "麗", m: "lovely, graceful" },
    { k: "礼", m: "manners, courtesy" },
    { k: "怜", m: "wise, sympathetic" },
    { k: "嶺", m: "peak, ridge" },
    { k: "励", m: "encourage, strive" },
    { k: "零", m: "zero, drop", expanded: true },
    { k: "霊", m: "spirit, soul", expanded: true },
    { k: "涙", m: "tears", dark: true },
    { k: "戻", m: "return, revert", dark: true },
  ],
  ro: [
    { k: "路", m: "road, route" },
    { k: "朗", m: "cheerful, melodious" },
    { k: "露", m: "dew, expose" },
    { k: "楼", m: "tower, lookout" },
    { k: "蕗", m: "butterbur" },
    { k: "呂", m: "spine, musical pitch", expanded: true },
    { k: "廬", m: "hut, cottage", expanded: true },
    { k: "櫓", m: "tower, oar", expanded: true },
    { k: "牢", m: "prison, jail", dark: true },
    { k: "狼", m: "wolf", dark: true },
  ],
  wa: [
    { k: "和", m: "harmony, peace, Japan" },
    { k: "環", m: "ring, circle" },
    { k: "輪", m: "wheel, circle" },
    { k: "倭", m: "ancient name for Japan" },
  ],
  n: [
    { k: "ん", m: "syllabic n", kana: true },
  ],

  // CVN compound endings — common in Japanese names
  ren: [
    { k: "蓮", m: "lotus" },
    { k: "漣", m: "flowing continuously, ripple" },
    { k: "廉", m: "inexpensive, honest, clean" },
    { k: "恋", m: "romantic love" },
    { k: "怜", m: "wise" },
    { k: "練", m: "practice, refine" },
    { k: "錬", m: "forge, temper" },
  ],
  ran: [
    { k: "蘭", m: "orchid" },
    { k: "嵐", m: "storm, tempest" },
    { k: "藍", m: "indigo blue" },
    { k: "覧", m: "view, look at" },
  ],
  rin: [
    { k: "凛", m: "cold, dignified" },
    { k: "林", m: "forest, woods" },
    { k: "鈴", m: "bell" },
    { k: "輪", m: "wheel, circle" },
    { k: "麟", m: "kirin (mythical)" },
  ],
  ron: [
    { k: "論", m: "theory, argument" },
    { k: "ロン", m: "katakana variant", kana: true },
  ],
  kan: [
    { k: "寛", m: "tolerant, generous" },
    { k: "完", m: "perfection, completion" },
    { k: "感", m: "feeling, emotion" },
    { k: "幹", m: "tree trunk, main" },
    { k: "冠", m: "crown" },
    { k: "観", m: "contemplate, view (as in Kannon)" },
  ],
  ken: [
    { k: "健", m: "healthy, strong" },
    { k: "賢", m: "wise, intelligent" },
    { k: "研", m: "polish, study" },
    { k: "謙", m: "modest, humble" },
    { k: "剣", m: "sword" },
    { k: "憲", m: "constitution, law" },
  ],
  kin: [
    { k: "金", m: "gold, metal" },
    { k: "錦", m: "brocade, tapestry" },
    { k: "欣", m: "rejoice, happy" },
    { k: "近", m: "near, close" },
  ],
  kon: [
    { k: "今", m: "now, present" },
    { k: "紺", m: "navy blue" },
    { k: "魂", m: "soul, spirit" },
  ],
  san: [
    { k: "三", m: "three" },
    { k: "山", m: "mountain" },
    { k: "燦", m: "brilliant, sparkling" },
    { k: "賛", m: "praise, agree" },
    { k: "産", m: "birth, native, ujigami" },
  ],
  sen: [
    { k: "千", m: "thousand" },
    { k: "泉", m: "spring, fountain" },
    { k: "仙", m: "hermit, immortal" },
    { k: "繊", m: "slender, delicate" },
  ],
  shin: [
    { k: "心", m: "heart, mind" },
    { k: "真", m: "truth, genuine" },
    { k: "進", m: "advance, progress" },
    { k: "森", m: "forest" },
    { k: "神", m: "god, deity" },
    { k: "信", m: "belief, trust" },
    { k: "新", m: "new, fresh" },
    { k: "伸", m: "extend, stretch" },
  ],
  ten: [
    { k: "天", m: "heaven, sky" },
    { k: "典", m: "classic, ceremony" },
    { k: "展", m: "unfold, expand" },
    { k: "点", m: "point, dot" },
    { k: "店", m: "shop, store" },
  ],
  ton: [
    { k: "頓", m: "pause, suddenly" },
    { k: "敦", m: "sincerity, kindness" },
    { k: "屯", m: "gather, station" },
  ],
  nan: [
    { k: "南", m: "south" }, { k: "楠", m: "camphor tree" },
    { k: "男", m: "man, masculine" },
    { k: "難", m: "difficulty, hardship", dark: true },
    { k: "軟", m: "soft, weak", dark: true },
  ],
  hon: [
    { k: "本", m: "origin, book" },
    { k: "翻", m: "flip, translate" },
    { k: "奔", m: "run swiftly, free" },
  ],
  han: [
    { k: "範", m: "pattern, model" },
    { k: "繁", m: "flourish, prosper" },
    { k: "半", m: "half" },
    { k: "班", m: "group, squad" },
    { k: "般", m: "wisdom (as in prajna)", expanded: true },
  ],
  min: [
    { k: "民", m: "people, citizen" },
    { k: "稔", m: "harvest, ripen" },
    { k: "眠", m: "sleep, rest" },
  ],
  mon: [
    { k: "門", m: "gate, door" },
    { k: "紋", m: "crest, pattern" },
    { k: "問", m: "question, ask" },
    { k: "聞", m: "hear, listen" },
  ],
  jin: [
    { k: "仁", m: "humanity, benevolence" },
    { k: "陣", m: "battle camp, position" },
    { k: "甚", m: "very, exceedingly" },
    { k: "尋", m: "inquire, seek" },
  ],
  ban: [
    { k: "番", m: "turn, watch" },
    { k: "伴", m: "companion" },
    { k: "晩", m: "evening" },
    { k: "万", m: "ten thousand, all" },
    { k: "板", m: "board, plank" },
  ],
  bun: [
    { k: "文", m: "writing, literature" },
    { k: "分", m: "part, divide" },
    { k: "聞", m: "hear, listen" },
    { k: "紋", m: "crest, family emblem" },
  ],

  // Yō-on (CCV) digraphs
  sho: [
    { k: "翔", m: "soar, glide" },
    { k: "昭", m: "shining, bright" },
    { k: "章", m: "chapter, badge" },
    { k: "将", m: "commander, general" },
    { k: "笑", m: "laugh, smile" },
    { k: "尚", m: "esteem, value" },
    { k: "彰", m: "manifest, patent" },
    { k: "祥", m: "auspicious, fortunate", expanded: true },
    { k: "頌", m: "ode, hymn", expanded: true },
  ],
  sha: [
    { k: "紗", m: "gauze, thin silk" },
    { k: "車", m: "vehicle, wheel" },
    { k: "舎", m: "shed, hut" },
    { k: "射", m: "shoot, hit" },
    { k: "社", m: "shrine, sanctuary" },
  ],
  shu: [
    { k: "修", m: "discipline, master" },
    { k: "秀", m: "excellence, beauty" },
    { k: "朱", m: "vermilion" },
    { k: "周", m: "circumference" },
    { k: "州", m: "state, province" },
    { k: "祝", m: "celebrate, blessing, ritual" },
  ],
  cho: [
    { k: "蝶", m: "butterfly" },
    { k: "長", m: "long, leader" },
    { k: "朝", m: "morning" },
    { k: "兆", m: "omen, sign" },
    { k: "澄", m: "lucidity" },
    { k: "挑", m: "challenge, defy", expanded: true },
  ],
  cha: [
    { k: "茶", m: "tea" },
    { k: "チャ", m: "katakana variant", kana: true },
  ],
  chu: [
    { k: "中", m: "middle, center" },
    { k: "忠", m: "loyalty" },
    { k: "宙", m: "space, mid-air" },
    { k: "注", m: "pour, attention" },
    { k: "柱", m: "pillar, column" },
    { k: "鋳", m: "cast metal, mint", expanded: true },
    { k: "酎", m: "distilled spirit", expanded: true },
  ],
  kyo: [
    { k: "京", m: "capital city" },
    { k: "響", m: "echo, resound" },
    { k: "杏", m: "apricot" },
    { k: "恭", m: "respect, reverence" },
    { k: "匡", m: "rectify, correct" },
    { k: "経", m: "sutra, scripture, passage" },
  ],
  kyu: [
    { k: "究", m: "investigate, research" },
    { k: "九", m: "nine" },
    { k: "久", m: "long time" },
    { k: "休", m: "rest, repose" },
    { k: "球", m: "sphere, ball" },
    { k: "宮", m: "sacred palace, shrine" },
  ],
  ryu: [
    { k: "流", m: "flow, current" },
    { k: "龍", m: "dragon" },
    { k: "竜", m: "dragon (simplified)" },
    { k: "隆", m: "prosperity" },
  ],
  ryo: [
    { k: "亮", m: "clear, bright" },
    { k: "涼", m: "cool, refreshing" },
    { k: "了", m: "finish, complete" },
    { k: "良", m: "good, virtuous" },
    { k: "凌", m: "overcome, endure" },
    { k: "遼", m: "distant, far" },
  ],

  // Voiced (dakuten) syllables
  ga: [
    { k: "雅", m: "elegance, grace" },
    { k: "賀", m: "congratulation, joy" },
    { k: "我", m: "self, ego" },
    { k: "画", m: "painting, picture" },
    { k: "牙", m: "fang, tusk", dark: true },
    { k: "餓", m: "hunger, starve", dark: true },
  ],
  gi: [
    { k: "義", m: "righteousness" },
    { k: "儀", m: "ceremony, rule" },
    { k: "技", m: "skill, technique" },
    { k: "宜", m: "fitting, suitable" },
  ],
  gu: [
    { k: "具", m: "tool, equipment" },
    { k: "偶", m: "pair, doll, by chance" },
    { k: "グ", m: "katakana variant", kana: true },
    { k: "遇", m: "meet, treat", expanded: true },
    { k: "隅", m: "corner, nook", expanded: true },
    { k: "愚", m: "foolish, stupid", dark: true },
  ],
  ge: [
    { k: "芸", m: "art, accomplishment" },
    { k: "夏", m: "summer (variant)" },
    { k: "解", m: "untie, solve" },
    { k: "下", m: "below, descend" },
    { k: "迎", m: "welcome, meet", expanded: true },
    { k: "源", m: "source, origin", expanded: true },
  ],
  go: [
    { k: "吾", m: "I, my" },
    { k: "悟", m: "enlightenment" },
    { k: "五", m: "five" },
    { k: "護", m: "protect, guard" },
    { k: "碁", m: "go (board game)" },
    { k: "梧", m: "paulownia tree", expanded: true },
    { k: "獄", m: "prison, hell", dark: true },
    { k: "御", m: "honorific, divine (prefix)" },
  ],
  ji: [
    { k: "治", m: "rule, govern" },
    { k: "次", m: "next, order" },
    { k: "時", m: "time, hour" },
    { k: "慈", m: "mercy, compassion" },
    { k: "寺", m: "temple" },
    { k: "滋", m: "nourish" },
    { k: "二", m: "two" },
    { k: "耳", m: "ear", expanded: true },
    { k: "痔", m: "hemorrhoid", dark: true },
  ],
  zu: [
    { k: "図", m: "diagram, figure" },
    { k: "頭", m: "head, top" },
    { k: "厨", m: "kitchen, larder" },
  ],
  zo: [
    { k: "蔵", m: "storehouse, hide" },
    { k: "造", m: "create, make" },
    { k: "像", m: "image, statue" },
    { k: "贈", m: "give, present" },
  ],
  da: [
    { k: "駄", m: "horse load" },
    { k: "打", m: "strike, hit" },
    { k: "妥", m: "compromise, peace" },
    { k: "ダ", m: "katakana variant", kana: true },
    { k: "惰", m: "laziness, sloth", dark: true },
    { k: "唾", m: "saliva, spittle", dark: true },
  ],
  de: [
    { k: "出", m: "exit, emerge" },
    { k: "デ", m: "katakana variant", kana: true },
  ],
  do: [
    { k: "土", m: "earth, soil" },
    { k: "道", m: "road, way" },
    { k: "堂", m: "hall, temple" },
    { k: "銅", m: "copper" },
    { k: "努", m: "exert, strive", expanded: true },
    { k: "瞳", m: "pupil of eye", expanded: true },
  ],
  ba: [
    { k: "馬", m: "horse" },
    { k: "葉", m: "leaf" },
    { k: "場", m: "place, location" },
    { k: "バ", m: "katakana variant", kana: true },
    { k: "芭", m: "banana plant, basho", expanded: true },
    { k: "把", m: "grasp, handle", expanded: true },
  ],
  bi: [
    { k: "美", m: "beauty" },
    { k: "備", m: "preparation" },
    { k: "尾", m: "tail, end" },
    { k: "微", m: "delicate, faint" },
    { k: "毘", m: "help, assist", expanded: true },
  ],
  bu: [
    { k: "武", m: "martial, military" },
    { k: "部", m: "section, division" },
    { k: "舞", m: "dance" },
    { k: "撫", m: "stroke, caress", expanded: true },
    { k: "葡", m: "grape", expanded: true },
    { k: "不", m: "not, un-", dark: true },
    { k: "侮", m: "insult, despise", dark: true },
  ],
  be: [
    { k: "辺", m: "edge, area" },
    { k: "部", m: "section" },
    { k: "ベ", m: "katakana variant", kana: true },
    { k: "倍", m: "double, twice", expanded: true },
  ],
  bo: [
    { k: "坊", m: "monk, boy" },
    { k: "望", m: "hope, wish" },
    { k: "帽", m: "cap, hat" },
    { k: "母", m: "mother" },
    { k: "募", m: "recruit, gather" },
    { k: "簿", m: "ledger, register", expanded: true },
    { k: "牡", m: "male animal", expanded: true },
    { k: "墓", m: "grave, tomb", dark: true },
    { k: "暮", m: "sunset, dusk", dark: true },
  ],

  // Voiced syllables — additional
  ja: [
    { k: "蛇", m: "serpent" },
    { k: "ジャ", m: "katakana variant", kana: true },
    { k: "寂", m: "tranquility, Zen solitude" },
  ],
  je: [{ k: "ジェ", m: "foreign sound", kana: true }],
  ye: [{ k: "イェ", m: "foreign sound", kana: true }],
  ju: [
    { k: "寿", m: "longevity, congratulations" },
    { k: "樹", m: "tree, wood" },
    { k: "受", m: "receive, accept" },
    { k: "ジュ", m: "katakana variant", kana: true },
    { k: "珠", m: "pearl, gem", expanded: true },
    { k: "従", m: "follow, obey", expanded: true },
    { k: "呪", m: "curse, incantation", dark: true },
  ],
  jo: [
    { k: "助", m: "help, assist" },
    { k: "譲", m: "yield, defer" },
    { k: "城", m: "castle, citadel" },
    { k: "ジョ", m: "katakana variant", kana: true },
    { k: "叙", m: "describe, narrate", expanded: true },
  ],
  za: [
    { k: "座", m: "seat, position" },
    { k: "ザ", m: "katakana variant", kana: true },
  ],
  ze: [
    { k: "是", m: "this, just so" },
    { k: "瀬", m: "rapids, current" },
    { k: "ゼ", m: "katakana variant", kana: true },
  ],
  zen: [
    { k: "禅", m: "Zen, meditation, dhyana" },
    { k: "善", m: "virtue, good, righteousness" },
    { k: "全", m: "whole, entire, complete" },
    { k: "然", m: "natural, thus, so", expanded: true },
  ],

  // Handakuten P-row — primarily katakana in modern names
  // (these sounds appear mostly in foreign loanwords)
  pa: [{ k: "パ", m: "foreign sound", kana: true }],
  pi: [{ k: "ピ", m: "foreign sound", kana: true }],
  pu: [{ k: "プ", m: "foreign sound", kana: true }],
  pe: [{ k: "ペ", m: "foreign sound", kana: true }],
  po: [{ k: "ポ", m: "foreign sound", kana: true }],

  // F-row — strictly foreign loanword sounds.
  // The native F syllable is "fu"; fa/fi/fe/fo are written
  // with small kana in katakana only (no kanji equivalent).
  fa: [{ k: "ファ", m: "foreign sound", kana: true }],
  fi: [{ k: "フィ", m: "foreign sound", kana: true }],
  fe: [{ k: "フェ", m: "foreign sound", kana: true }],
  fo: [{ k: "フォ", m: "foreign sound", kana: true }],
};

// =============================================================
// SYLLABLE PARSER + TRANSLITERATION LAYER
//
// Two-stage analysis:
//   1. Basic — assumes the input is roughly Japanese-shaped. Applies
//      only L→R and V→B (sounds Japanese has no native form for) and
//      then tries to chunk it into syllables that exist in the kanji DB.
//      Used for names like Hiroshi, Sakura, Aren, Lisa.
//
//   2. Full transliteration — kicks in when basic parsing leaves
//      stranded consonants (e.g., the trailing 'd' in Mohammed, the
//      'ch' cluster in Christopher). Applies digraph rules
//      (ph→f, ch+consonant→k, th→s, qu→ku, ck→k, x→kus), forbidden-
//      phoneme corrections (si→shi, ti→chi, hu→fu, etc.), and inserts
//      epenthetic vowels so every syllable ends in a vowel or 'n'.
//
// This mirrors how Japanese natively absorbs foreign names:
//   Mohammed   → mohamedo   → mo·ha·me·do
//   Christopher → kurisutoferu → ku·ri·su·to·fe·ru
//   Felix      → ferikusu   → fe·ri·ku·su
// =============================================================

const VOWELS = new Set(["a", "i", "u", "e", "o"]);
const CONSONANT_CLUSTERS = ["sh", "ch", "ts", "ky", "ry"];

// Grouped syllable inventory for the dropdown editor.
// Mirrors the gojuon (五十音) table organization, which is also how
// Japanese learners memorize the kana — vowels, then consonant rows,
// then voiced (dakuten), handakuten, foreign-only, and compounds.
// All 107 keys of KANJI are accounted for here.
const SYLLABLE_GROUPS = [
  { label: "Vowels", items: ["a", "i", "u", "e", "o"] },
  { label: "K-row", items: ["ka", "ki", "ku", "ke", "ko"] },
  { label: "S-row", items: ["sa", "shi", "su", "se", "so"] },
  { label: "T-row", items: ["ta", "chi", "tsu", "te", "to"] },
  { label: "N-row", items: ["na", "ni", "ne", "no"] },
  { label: "H / F-row", items: ["ha", "hi", "fu", "he", "ho"] },
  { label: "M-row", items: ["ma", "mi", "mu", "me", "mo"] },
  { label: "Y-row", items: ["ya", "yu", "yo"] },
  { label: "R-row", items: ["ra", "ri", "ru", "re", "ro"] },
  { label: "W / final N", items: ["wa", "n"] },
  { label: "G-row (voiced K)", items: ["ga", "gi", "gu", "ge", "go"] },
  { label: "Z / J-row (voiced S)", items: ["za", "ji", "zu", "ze", "zo"] },
  { label: "D-row (voiced T)", items: ["da", "de", "do"] },
  { label: "B-row (voiced H)", items: ["ba", "bi", "bu", "be", "bo"] },
  { label: "P-row (handakuten)", items: ["pa", "pi", "pu", "pe", "po"] },
  { label: "Compounds (sh/ch/j/ky/ry + vowel)", items: [
    "sha", "shu", "sho",
    "cha", "chu", "cho",
    "ja", "ju", "jo",
    "kyo", "kyu",
    "ryo", "ryu",
  ]},
  { label: "-n trigraphs (CVN)", items: [
    "ban", "bun", "han", "hon", "jin", "kan", "ken", "kin", "kon",
    "min", "mon", "nan", "ran", "ren", "rin", "ron", "san", "sen",
    "shin", "ten", "ton", "zen",
  ]},
  { label: "Foreign-only sounds", items: ["fa", "fi", "fe", "fo", "je", "ye"] },
];

// =============================================================
// THEMATIC TAGS
// Curated reverse-index of which kanji belong to each theme. A kanji
// can carry multiple tags (桜 is both nature and beauty; 龍 is both
// strength and spirit). Stored as theme→[kanji] rather than annotating
// each DB entry, so the DB stays compact and re-curating is a single-
// place edit.
// =============================================================

const THEME_KANJI = {
  nature: ["桜", "樹", "樺", "梛", "梧", "椰", "楓", "楠", "桃", "李", "杏", "梨", "柚", "柱", "森", "林", "萩", "蕗", "莉", "茉", "茶", "葵", "葉", "華", "花", "芽", "萌", "茂", "芙", "芭", "葡", "葦", "蘭", "藍", "藻", "螺", "菜", "芳", "蓮", "鳳", "鳴", "虎", "龍", "竜", "獅", "狼", "蛇", "馬", "麟", "鬼", "烏", "蝶", "亀", "卯", "巳", "兎", "山", "嶺", "江", "海", "湖", "泉", "津", "地", "土", "野", "埜", "田", "州", "雨", "風", "霞", "露", "虹", "嵐", "春", "夏", "冬", "季"],
  light: ["星", "陽", "日", "空", "天", "光", "明", "映", "輝", "燦", "景", "昭", "朝", "旺", "彰", "晩", "暮", "春", "夕", "夜", "玲", "珂", "珠", "琥", "瑚", "瑠", "琉", "璃", "紅", "金", "錦"],
  water: ["海", "江", "湖", "泉", "津", "波", "漣", "流", "深", "浮", "澄", "注", "治", "沙", "洋", "洛", "泰", "満", "雨", "露", "雫", "涼"],
  strength: ["武", "剣", "矢", "矛", "闘", "征", "破", "駆", "馳", "勇", "虎", "龍", "竜", "獅", "鬼", "魔", "覇", "牙", "毅", "忠", "真", "誠", "健", "果", "隆", "旺", "堂", "至"],
  wisdom: ["智", "賢", "知", "哲", "慧", "悟", "明", "了", "究", "研", "詩", "文", "史", "紀", "章", "典", "誉", "論", "歌", "奏", "楽", "舞", "絵", "画", "結", "譜", "技", "秀", "優", "練", "錬", "修", "稔"],
  spirit: ["禅", "法", "経", "観", "般", "寂", "蓮", "慈", "無", "悟", "空", "真", "神", "社", "宮", "御", "祈", "祝", "巫", "産", "詣", "祢", "祥", "幸", "霊", "魂", "聖", "仙", "龍", "鳳", "鬼", "魔", "幽", "奥", "哉", "虎", "獅", "亀", "麟"],
  beauty: ["美", "麗", "雅", "綺", "彩", "紗", "華", "花", "彦", "斐", "凛", "玲", "珂", "珠", "琥", "瑚", "瑠", "琉", "璃", "錦", "紅", "紫", "蒼", "紺", "環", "琶", "鼓", "雫", "蝶", "桜", "萩", "愛", "怜", "恵", "優", "佳", "良", "希", "咲"],
  virtue: ["善", "誠", "仁", "義", "真", "愛", "睦", "恵", "慈", "信", "忠", "恭", "謙", "廉", "寛", "佳", "良", "和", "保", "護", "助", "誉", "賢", "聖", "実", "澄", "敦", "哲", "志"],
};

// Display labels and ordering for the theme picker UI.
const THEME_META = [
  { id: "nature",   label: "nature",   hint: "trees, weather, terrain, creatures" },
  { id: "light",    label: "light",    hint: "stars, dawn, brilliance" },
  { id: "water",    label: "water",    hint: "rivers, sea, rain" },
  { id: "strength", label: "strength", hint: "martial, fierce, resolute" },
  { id: "wisdom",   label: "wisdom",   hint: "scholarship, art, mastery" },
  { id: "spirit",   label: "spirit",   hint: "Buddhist, Shinto, mystical" },
  { id: "beauty",   label: "beauty",   hint: "elegance, ornament, refinement" },
  { id: "virtue",   label: "virtue",   hint: "moral character, kindness" },
];

// Reverse index: kanji → set of theme ids. Built once at module load.
const KANJI_THEMES = (() => {
  const map = new Map();
  for (const [theme, list] of Object.entries(THEME_KANJI)) {
    for (const k of list) {
      if (!map.has(k)) map.set(k, new Set());
      map.get(k).add(theme);
    }
  }
  return map;
})();

function basicNormalize(s) {
  return s
    .toLowerCase()
    // Drop silent terminal h after a vowel (Hannah → hanna, Sarah → sara).
    // The vowel lookbehind preserves digraphs like th/sh/ch/ph at word end.
    .replace(/(?<=[aeiou])h$/, "")
    // Collapse double n before a vowel (Anna → ana, Joanna → joana).
    // English doubles n with no audible gemination; Japanese gemination
    // is rare in transliterated foreign names anyway.
    .replace(/nn(?=[aeiouy])/g, "n")
    .replace(/l/g, "r")
    .replace(/v/g, "b");
}

function fullTransliterate(input) {
  let s = input
    .toLowerCase()
    // Same pre-normalization as the basic path: drop silent terminal h,
    // collapse double n before vowel. Both shape the input before the
    // phase pipeline runs.
    .replace(/(?<=[aeiou])h$/, "")
    .replace(/nn(?=[aeiouy])/g, "n");

  // Phase 1 — digraph substitutions (run before single-letter rules)
  s = s.replace(/ph/g, "f");                  // Phil → fir...
  s = s.replace(/ch(?=[^aeiou]|$)/g, "k");    // Christ → krist (ch+consonant = /k/)
  s = s.replace(/th/g, "s");                  // Beth → bes (heuristic)
  s = s.replace(/qu/g, "ku");                 // Quincy → kuincy
  s = s.replace(/ck/g, "k");                  // Jack → jak
  s = s.replace(/x/g, "kus");                 // Felix → felikus

  // Phase 2 — l/v substitution (no native L or V in Japanese)
  s = s.replace(/l/g, "r");
  s = s.replace(/v/g, "b");

  // Phase 3 — forbidden-phoneme corrections
  // ti before a/o/u becomes ch (Japanese has cha/cho/chu but not "tya")
  s = s.replace(/ti(?=[aou])/g, "ch");        // Sebastian → sebaschan
  s = s.replace(/tie/g, "che");
  s = s.replace(/ti/g, "chi");                // Tina → china (= chi-na)
  // di parallels
  s = s.replace(/di(?=[aou])/g, "j");
  s = s.replace(/di/g, "ji");
  // Other forbidden sequences
  s = s.replace(/tu/g, "tsu");                // Tuesday → tsuesday-ish
  s = s.replace(/si/g, "shi");                // Lisa already handled by L→R, but Sid → shid
  s = s.replace(/zi/g, "ji");
  s = s.replace(/hu/g, "fu");                 // Hugh → fug
  s = s.replace(/wu/g, "u");
  s = s.replace(/wi/g, "i");
  s = s.replace(/we/g, "e");
  // w before consonant or end → u (Andrew → andreu)
  s = s.replace(/w(?=[^aeiou]|$)/g, "u");
  // y before consonant or end → i (Tony → toni, Jenny → jenni)
  s = s.replace(/y(?=[^aeiou]|$)/g, "i");

  // Phase 4 — c handling (preserves "ch" digraph via negative lookahead)
  s = s.replace(/c(?!h)(?=[eiy])/g, "s");     // Cecil → seshir
  s = s.replace(/c(?!h)/g, "k");              // Carlos → karros, Erica → erika

  // Phase 5 — strip non-alphabetic
  s = s.replace(/[^a-z]/g, "");

  // Phase 5b — drop silent 'h' in two specific contexts:
  //   (1) trailing after a vowel (Hannah, Sarah, Noah, Mariah —
  //       silent in both English and Japanese transliteration).
  //   (2) initial Vh followed by a consonant (Ahmed, Ahmad, Ohlson),
  //       where the h is typically very weak in English.
  //       Crucially this does NOT fire on Brahma, Mahmoud, Mahler,
  //       etc., because in those names the V is preceded by another
  //       consonant — the h there is genuinely pronounced and the
  //       parser correctly renders it as 'fu' (ブラフマ, マフムード).
  s = s.replace(/([aeiou])h(?=[^a-z]|$)/g, "$1");
  s = s.replace(/^([aeiou])h(?=[bcdfgjklmnpqrstvwxyz])/, "$1");

  // Phase 6 — collapse doubled consonants. Includes 'n' so that
  // names like Anna, Joanna, Hannah, Donna, Jenny render as
  // a·na, jo·a·na, ha·na, do·na, je·ni rather than preserving
  // the syllabic ン of strict-Japanese transliteration. The strict
  // form is still reachable through the syllable editor.
  s = s.replace(/([bcdfghjkmnprstwz])\1/g, "$1");

  // Phase 7 — walk the string, inserting epenthetic vowels for stranded
  // consonants. This is the core operation: every consonant must end in
  // a vowel (Japanese phonotactics).
  let result = "";
  let i = 0;
  while (i < s.length) {
    const c = s[i];

    // Vowel: emit as-is
    if (VOWELS.has(c)) {
      result += c;
      i++;
      continue;
    }

    // 'n' before a consonant or at end: standalone (syllabic) n
    if (c === "n") {
      const next = s[i + 1];
      if (next === undefined || (!VOWELS.has(next) && next !== "y")) {
        result += "n";
        i++;
        continue;
      }
      // n + vowel: falls through to CV handling below
    }

    // Consonant cluster (digraph)
    if (i + 1 < s.length) {
      const two = s.substring(i, i + 2);
      if (CONSONANT_CLUSTERS.includes(two)) {
        // Special: "ts" only forms a Japanese cluster before 'u' (tsu).
        // Otherwise t + s should be split (Watson → wa·to·so·n, not wa·tso·n).
        const skipCluster = (two === "ts" && (i + 2 >= s.length || s[i + 2] !== "u"));
        if (!skipCluster) {
          if (i + 2 < s.length && VOWELS.has(s[i + 2])) {
            result += two + s[i + 2];
            i += 3;
          } else {
            // Stranded digraph: insert epenthetic vowel
            const epen = (two === "sh" || two === "ch") ? "i" : "u";
            result += two + epen;
            i += 2;
          }
          continue;
        }
      }
    }

    // Regular consonant + vowel
    if (i + 1 < s.length && VOWELS.has(s[i + 1])) {
      result += c + s[i + 1];
      i += 2;
      continue;
    }

    // Stranded consonant: insert epenthetic vowel
    // t/d → 'o' (Mohammed → -do, David → -do)
    // j → 'i' (rare, but jin/ji are in DB)
    // others → 'u' (Felix → -kus-)
    let epen;
    if (c === "t" || c === "d") epen = "o";
    else if (c === "j") epen = "i";
    else epen = "u";

    result += c + epen;
    i++;
  }

  // Post-walk cleanup: re-apply hu → fu, since the walk may have
  // inserted epenthetic 'u' after a stranded 'h' (Ahmed → ahumedo
  // → afumedo, which then parses as a·fu·me·do — matching real
  // Japanese アフメド). The Phase 3 hu→fu rule ran on the input
  // before epenthesis introduced new hu sequences.
  result = result.replace(/hu/g, "fu");

  return result;
}

function parseFromForm(s) {
  // Split on non-alpha to respect hyphens / spaces as syllable boundaries
  const chunks = s.split(/[^a-z]+/).filter(Boolean);
  const out = [];
  for (const chunk of chunks) {
    out.push(...parseChunk(chunk));
  }
  return out;
}

function analyzeName(input) {
  const trimmed = (input || "").trim();
  if (!trimmed) {
    return { syllables: [], reading: "", changed: false, mode: "empty" };
  }

  const lower = trimmed.toLowerCase();

  // Some patterns are cleanly handled only by full transliteration,
  // even when basic parsing would technically produce a syllable list:
  //   - doubled consonants (Anna, Joanna, Hannah, Bobby, Tommy):
  //     the user expects [a, na] not [a, n, na], so we collapse rather
  //     than preserve the syllabic ン pattern of strict-Japanese
  //     transliteration. The strict form is still reachable through
  //     the syllable editor.
  //   - trailing silent h after a vowel (Sarah, Noah, Hannah, Mariah):
  //     basic mode would leave it as a stranded consonant; full mode
  //     drops it the way Japanese does (サラ, ノア, ハンナ, マライア).
  const hasDoubledConsonant = /([bcdfghjklmnpqrstvwxyz])\1/.test(lower);
  const hasTrailingSilentH = /([aeiou])h(?=[^a-z]|$)/.test(lower);
  const forceFull = hasDoubledConsonant || hasTrailingSilentH;

  if (!forceFull) {
    // Stage 1: basic normalize and parse
    const basicForm = basicNormalize(lower);
    const basicSyl = parseFromForm(basicForm);

    const hasStranded = basicSyl.some(
      (s) => s.length === 1 && !VOWELS.has(s) && s !== "n"
    );

    if (!hasStranded && basicSyl.length > 0) {
      return {
        syllables: basicSyl,
        reading: basicForm,
        changed: basicForm !== lower,
        mode: basicForm !== lower ? "basic" : "direct",
      };
    }
  }

  // Stage 2: full transliteration
  const fullForm = fullTransliterate(lower);
  const fullSyl = parseFromForm(fullForm);

  return {
    syllables: fullSyl,
    reading: fullForm,
    changed: fullForm !== lower,
    mode: "full",
  };
}

function parseChunk(s) {
  const out = [];
  let i = 0;

  const has = (key) => Object.prototype.hasOwnProperty.call(KANJI, key);

  while (i < s.length) {
    let matched = false;

    // Try 4-char CCVN (e.g. "shin", "chen") — only if next is end or non-vowel
    if (i + 4 <= s.length) {
      const four = s.substring(i, i + 4);
      const next = s[i + 4];
      const cluster2 = four.substring(0, 2);
      const v = four[2];
      const n = four[3];
      if (
        CONSONANT_CLUSTERS.includes(cluster2) &&
        VOWELS.has(v) &&
        n === "n" &&
        (next === undefined || !VOWELS.has(next))
      ) {
        if (has(four)) {
          out.push(four);
          i += 4;
          matched = true;
        }
      }
    }

    // Try 3-char CVN (e.g. "ren", "ken") — only if next is end or non-vowel
    if (!matched && i + 3 <= s.length) {
      const three = s.substring(i, i + 3);
      const next = s[i + 3];
      if (
        !VOWELS.has(three[0]) &&
        VOWELS.has(three[1]) &&
        three[2] === "n" &&
        (next === undefined || !VOWELS.has(next))
      ) {
        if (has(three)) {
          out.push(three);
          i += 3;
          matched = true;
        }
      }
    }

    // Try 3-char CCV (e.g. "sha", "kyo")
    if (!matched && i + 3 <= s.length) {
      const three = s.substring(i, i + 3);
      const cluster2 = three.substring(0, 2);
      if (CONSONANT_CLUSTERS.includes(cluster2) && VOWELS.has(three[2])) {
        if (has(three)) {
          out.push(three);
          i += 3;
          matched = true;
        }
      }
    }

    // Try 2-char CV (e.g. "ka", "ro")
    if (!matched && i + 2 <= s.length) {
      const two = s.substring(i, i + 2);
      if (has(two) && !VOWELS.has(two[0])) {
        out.push(two);
        i += 2;
        matched = true;
      }
    }

    // Standalone 'n' (before consonant or end)
    if (!matched && s[i] === "n") {
      const next = s[i + 1];
      if (next === undefined || !VOWELS.has(next) || next === "n") {
        out.push("n");
        i += 1;
        matched = true;
      }
    }

    // Single vowel
    if (!matched && VOWELS.has(s[i])) {
      out.push(s[i]);
      i += 1;
      matched = true;
    }

    // Fallback: lone consonant gets attached as best-effort syllable
    if (!matched) {
      // try [consonant + next vowel] (in case like "li" → "ri" approximation skip — leave to user)
      out.push(s[i]);
      i += 1;
    }
  }

  return out;
}

// =============================================================
// COMPONENT
// =============================================================

export default function App() {
  const [name, setName] = useState("Ara");
  const [editingSyllables, setEditingSyllables] = useState(false);
  const [manualOverride, setManualOverride] = useState(null); // string or null
  const [selections, setSelections] = useState({}); // { syllableIndex: kanjiIndex }
  const [copied, setCopied] = useState(false);
  const [openAccordions, setOpenAccordions] = useState(() => new Set()); // syllable indices currently expanded
  const [showExpanded, setShowExpanded] = useState(false); // include kanji flagged `expanded: true`
  const [showDark, setShowDark] = useState(false); // include kanji flagged `dark: true`
  const [savedNames, setSavedNames] = useState([]); // [{ id, name, syllables, reading, entries }]
  const [viewMode, setViewMode] = useState("current"); // "current" | "saved"
  const [savedCopiedId, setSavedCopiedId] = useState(null); // which saved-row's copy button just fired
  const [activeThemes, setActiveThemes] = useState(() => new Set()); // selected theme ids
  const [themePanelOpen, setThemePanelOpen] = useState(false);

  // Does an entry match any of the currently-active themes? When no
  // themes are active, every entry "matches" — themes are additive.
  const matchesActiveTheme = (entry) => {
    if (activeThemes.size === 0) return true;
    if (!entry) return false;
    const tags = KANJI_THEMES.get(entry.k);
    if (!tags) return false;
    for (const t of activeThemes) if (tags.has(t)) return true;
    return false;
  };

  // What themes does this entry carry? Returns array of theme ids (for
  // rendering tag chips on tile cards).
  const themesForEntry = (entry) => {
    if (!entry) return [];
    const tags = KANJI_THEMES.get(entry.k);
    return tags ? [...tags] : [];
  };

  const toggleTheme = (id) => {
    setActiveThemes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearThemes = () => setActiveThemes(new Set());

  // Visibility filter for kanji entries based on toggles. Core entries
  // (no expanded or dark flag) are always visible. Tagged entries are
  // gated behind their respective toggle.
  const isVisible = (entry) => {
    if (entry.expanded && !showExpanded) return false;
    if (entry.dark && !showDark) return false;
    return true;
  };

  // Filtered options for a syllable, respecting the toggle state.
  const visibleOpts = (syl) => (KANJI[syl] || []).filter(isVisible);

  // Compute parsed syllables and reading (or use manual override)
  const analysis = useMemo(() => {
    if (manualOverride !== null) {
      const parts = manualOverride
        .split(/[\s\-·]+/)
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      return { syllables: parts, reading: parts.join(""), changed: false, mode: "manual" };
    }
    return analyzeName(name);
  }, [name, manualOverride]);

  const syllables = analysis.syllables;

  // Reset selections when syllables change
  useEffect(() => {
    const next = {};
    syllables.forEach((_, idx) => {
      next[idx] = 0; // default to first kanji
    });
    setSelections(next);
    // Collapse all accordions on syllable change — fresh names start
    // with the result board front-and-center, no panels open.
    setOpenAccordions(new Set());
  }, [syllables.join("|")]);

  const toggleAccordion = (idx) => {
    setOpenAccordions((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const randomize = () => {
    const next = {};
    syllables.forEach((syl, idx) => {
      const opts = KANJI[syl];
      if (!opts || opts.length === 0) return;
      // Visible pool, then narrow to themed if any themes are active.
      // If no themed options exist for this syllable, fall back to the
      // full visible pool so we don't strand a syllable with no choice.
      const visible = opts.filter(isVisible);
      if (visible.length === 0) return;
      const themed = activeThemes.size > 0 ? visible.filter(matchesActiveTheme) : visible;
      const pool = themed.length > 0 ? themed : visible;
      const pickedEntry = pool[Math.floor(Math.random() * pool.length)];
      next[idx] = opts.indexOf(pickedEntry);
    });
    setSelections(next);
  };

  const reset = () => {
    const next = {};
    syllables.forEach((_, idx) => {
      next[idx] = 0;
    });
    setSelections(next);
  };

  // Resolve which entry to show for a syllable. The user's saved
  // selection lives in `selections[idx]` as an index into the FULL
  // options array (so it stays put when toggles flip). If that entry
  // happens to be hidden by current toggles, we display the first
  // visible entry instead — re-enabling the toggle restores the
  // original pick non-destructively.
  const resolveEntry = (syl, idx) => {
    const opts = KANJI[syl];
    if (!opts || opts.length === 0) return null;
    const savedIdx = selections[idx] ?? 0;
    const saved = opts[savedIdx];
    if (saved && isVisible(saved)) return saved;
    const firstVisible = opts.find(isVisible);
    return firstVisible || null;
  };

  const assembled = syllables.map((syl, idx) => resolveEntry(syl, idx));

  // Kana entries (hiragana ん or katakana フェ/ジェ/etc.) carry a
  // `kana: true` flag in the DB. They render in the meanings line
  // with their stored descriptor — "syllabic n", "foreign sound",
  // or "katakana variant" — alongside the glyph itself, italicized
  // and bracketed: 〈syllabic n (ん)〉 or 〈foreign sound (フェ)〉.
  const isKana = (a) => Boolean(a && a.kana);

  const fullKanji = assembled.map((a) => (a ? a.k : "")).join("");

  const copyResult = () => {
    const text = `${fullKanji}  (${syllables.join("·")})\n${assembled
      .map((a, i) => (a ? `${a.k} (${syllables[i]}) — ${a.m}` : null))
      .filter(Boolean)
      .join("\n")}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // Build a snapshot of the current name for saving. Resolves kanji
  // entries directly so the saved version is independent of toggle
  // state — turning the dark/expanded toggles off later won't change
  // a name you've already saved.
  const saveCurrent = () => {
    if (syllables.length === 0) return;
    const entries = assembled.map((a) => (a ? { k: a.k, m: a.m, kana: !!a.kana } : null));
    const snapshot = {
      id: Date.now() + Math.random(),
      name: name.trim() || "(untitled)",
      syllables: [...syllables],
      reading: syllables.join("·"),
      entries,
    };
    setSavedNames((prev) => [snapshot, ...prev]);
  };

  const removeSaved = (id) => {
    setSavedNames((prev) => prev.filter((s) => s.id !== id));
  };

  const copySaved = (snapshot) => {
    const fullK = snapshot.entries.map((e) => (e ? e.k : "?")).join("");
    const text = `${fullK}  (${snapshot.reading})\n${snapshot.entries
      .map((e, i) => (e ? `${e.k} (${snapshot.syllables[i]}) — ${e.m}` : null))
      .filter(Boolean)
      .join("\n")}`;
    navigator.clipboard?.writeText(text);
    setSavedCopiedId(snapshot.id);
    setTimeout(() => setSavedCopiedId(null), 1500);
  };

  // Whether the live name (current syllables + assembled kanji) is
  // already in the saved list — used to disable the save button so
  // users don't accidentally double-save.
  const currentSnapshotKey = `${syllables.join("|")}::${assembled.map((a) => (a ? a.k : "?")).join("")}`;
  const alreadySaved = savedNames.some(
    (s) =>
      `${s.syllables.join("|")}::${s.entries.map((e) => (e ? e.k : "?")).join("")}` ===
      currentSnapshotKey
  );

  const allSyllablesValid = syllables.every((s) => KANJI[s]);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#f3ecd9",
        color: "#1c1917",
        fontFamily: "'Spectral', 'EB Garamond', Georgia, serif",
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(167,50,37,0.04), transparent 50%), radial-gradient(circle at 90% 80%, rgba(160,136,80,0.06), transparent 60%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,700&family=Spectral:ital,wght@0,300;0,400;0,500;1,400&family=Noto+Serif+JP:wght@400;500;700&display=swap');
        .display { font-family: 'Fraunces', 'Spectral', Georgia, serif; font-optical-sizing: auto; }
        .jp { font-family: 'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', serif; }
        .smallcaps { font-variant: small-caps; letter-spacing: 0.18em; text-transform: lowercase; }
        .kanji-btn {
          transition: transform 180ms ease, background-color 180ms ease, border-color 180ms ease;
        }
        .kanji-btn:hover {
          transform: translateY(-2px);
        }
        .seal {
          font-family: 'Noto Serif JP', serif;
          background: #a73225;
          color: #f3ecd9;
          width: 3.5rem;
          height: 3.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          border-radius: 4px;
          box-shadow: 0 1px 0 rgba(0,0,0,0.05) inset, 1px 2px 0 rgba(0,0,0,0.05);
          transform: rotate(-4deg);
          flex-shrink: 0;
        }
        .rule {
          background: linear-gradient(to right, transparent, #b8a872 30%, #b8a872 70%, transparent);
          height: 1px;
        }
        .pill {
          background: #ebe2c8;
          border: 1px solid #d6cdb8;
        }
        .selected-bar {
          position: absolute;
          left: 50%;
          bottom: -2px;
          width: 30%;
          height: 3px;
          background: #a73225;
          transform: translateX(-50%);
          border-radius: 2px;
        }
        .ink-input {
          background: transparent;
          border: none;
          border-bottom: 1.5px solid #1c1917;
          outline: none;
          padding: 0.5rem 0;
          font-family: 'Fraunces', serif;
        }
        .ink-input:focus {
          border-bottom-color: #a73225;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 400ms ease-out both; }
        .pill-select {
          background: #ebe2c8;
          border: 1px solid #d6cdb8;
          border-radius: 9999px;
          padding: 0.3rem 1.75rem 0.3rem 0.85rem;
          font-size: 0.875rem;
          color: #1c1917;
          font-family: 'Spectral', 'EB Garamond', Georgia, serif;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><path fill='%235a4632' d='M4 6l4 4 4-4z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 0.55rem center;
          background-size: 0.7rem;
          cursor: pointer;
          transition: border-color 180ms ease, background-color 180ms ease;
        }
        .pill-select:hover { border-color: #b8a872; }
        .pill-select:focus { outline: none; border-color: #a73225; }
        .syl-remove {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: transparent;
          color: #8a7e6a;
          font-size: 14px;
          line-height: 1;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background-color 150ms ease, color 150ms ease;
        }
        .syl-remove:hover {
          background: #a73225;
          color: #f3ecd9;
        }
        .syl-insert {
          background: transparent;
          border: none;
          color: #b8a872;
          width: 18px;
          height: 18px;
          padding: 0;
          font-size: 14px;
          line-height: 1;
          font-family: 'Fraunces', serif;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          opacity: 0.55;
          transition: opacity 150ms ease, color 150ms ease, background-color 150ms ease, transform 150ms ease;
          margin: 0 -2px;
        }
        .syl-insert:hover, .syl-insert:focus {
          opacity: 1;
          color: #a73225;
          background: #ebe2c8;
          transform: scale(1.15);
          outline: none;
        }
        .accordion-header {
          transition: background-color 180ms ease;
        }
        .accordion-header:hover {
          background-color: #ebe2c8 !important;
        }
        .accordion-header:hover .chevron {
          color: #a73225 !important;
        }
        .accordion-header:focus-visible {
          outline: 1px solid #a73225;
          outline-offset: -2px;
        }
        .kanji-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Spectral', 'EB Garamond', Georgia, serif;
          font-size: 0.875rem;
          color: #5a4632;
          cursor: pointer;
          user-select: none;
          font-style: italic;
        }
        .kanji-toggle input[type="checkbox"] {
          appearance: none;
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border: 1px solid #b8a872;
          background: #f3ecd9;
          border-radius: 2px;
          cursor: pointer;
          position: relative;
          transition: border-color 150ms ease, background-color 150ms ease;
          flex-shrink: 0;
        }
        .kanji-toggle:hover input[type="checkbox"] {
          border-color: #a73225;
        }
        .kanji-toggle input[type="checkbox"]:checked {
          background: #a73225;
          border-color: #a73225;
        }
        .kanji-toggle input[type="checkbox"]:checked::after {
          content: "";
          position: absolute;
          left: 3px;
          top: 0px;
          width: 5px;
          height: 9px;
          border-right: 2px solid #f3ecd9;
          border-bottom: 2px solid #f3ecd9;
          transform: rotate(45deg);
        }
        .kanji-toggle:hover span {
          color: #1c1917;
        }
        .result-tabs {
          margin-bottom: -1px; /* tabs sit flush with the result-board top edge */
          padding-right: 1rem;
        }
        .result-tab {
          font-family: 'Fraunces', serif;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.4rem 1rem 0.55rem;
          border: 1px solid #a73225;
          border-bottom: none;
          border-radius: 4px 4px 0 0;
          cursor: pointer;
          transition: background-color 180ms ease, color 180ms ease, transform 180ms ease;
          position: relative;
          top: 1px;
        }
        .result-tab.active {
          background: #fbf6e7;
          color: #a73225;
          border-bottom: 1px solid #fbf6e7;
        }
        .result-tab:not(.active) {
          background: #a73225;
          color: #f3ecd9;
        }
        .result-tab:not(.active):hover {
          background: #8a2820;
          transform: translateY(-1px);
        }
        .saved-action, .saved-remove {
          font-family: 'Fraunces', serif;
          font-size: 0.75rem;
          letter-spacing: 0.06em;
          background: transparent;
          cursor: pointer;
          transition: background-color 150ms ease, color 150ms ease;
        }
        .saved-action {
          color: #5a4632;
          border: 1px solid #d6cdb8;
          padding: 0.3rem 0.7rem;
          border-radius: 2px;
        }
        .saved-action:hover {
          color: #a73225;
          border-color: #a73225;
        }
        .saved-remove {
          color: #8a7e6a;
          border: none;
          width: 22px;
          height: 22px;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .saved-remove:hover {
          background: #a73225;
          color: #f3ecd9;
        }
        .theme-chip {
          font-family: 'Fraunces', serif;
          font-size: 0.85rem;
          padding: 0.35rem 0.95rem;
          border-radius: 9999px;
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: background-color 160ms ease, color 160ms ease, transform 160ms ease;
        }
        .theme-chip:hover {
          transform: translateY(-1px);
        }
        .theme-chip-mini {
          font-family: 'Spectral', 'EB Garamond', Georgia, serif;
          font-size: 0.6rem;
          padding: 0.1rem 0.45rem;
          border-radius: 9999px;
          font-style: italic;
          letter-spacing: 0.03em;
          line-height: 1;
        }
        .theme-panel {
          border-radius: 0 0 4px 4px;
        }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        {/* HEADER */}
        <header className="flex items-start justify-between gap-6 mb-12">
          <div>
            <p className="smallcaps text-sm mb-3" style={{ color: "#a73225" }}>
              名前 · a study in name kanji
            </p>
            <h1 className="display text-5xl md:text-6xl leading-none mb-4" style={{ fontWeight: 500 }}>
              Your Name<br />
              <em style={{ fontStyle: "italic", fontWeight: 400, color: "#5a4632" }}>in Kanji</em>
            </h1>
            <p className="text-base md:text-lg max-w-md" style={{ color: "#3f3a32", lineHeight: 1.55 }}>
              Type a name. Watch it break into Japanese syllables. Try the kanji that
              could spell each one — and the meanings they bring along.
            </p>
          </div>
          <div className="seal jp" aria-hidden="true">名</div>
        </header>

        <div className="rule mb-12" />

        {/* INPUT */}
        <section className="mb-10">
          <label className="smallcaps text-xs block mb-2" style={{ color: "#5a4632" }}>
            enter a name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setManualOverride(null);
            }}
            placeholder="Ara, Sakura, Aren, Kenji…"
            className="ink-input w-full text-3xl md:text-4xl"
            style={{ color: "#1c1917" }}
          />

          {/* Reading line — appears when transliteration adapted the input */}
          {analysis.changed && (
            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 fade-up" key={analysis.reading}>
              <span className="smallcaps text-xs" style={{ color: "#5a4632" }}>
                reading
              </span>
              <span
                className="display text-lg"
                style={{ color: "#1c1917", fontStyle: "italic", letterSpacing: "0.01em" }}
              >
                {analysis.reading}
              </span>
              <span className="text-xs italic" style={{ color: "#8a7e6a" }}>
                {analysis.mode === "full"
                  ? "— foreign sounds adapted to Japanese phonology (every syllable ends in a vowel or n)"
                  : "— L → R, V → B (Japanese has no native L or V)"}
              </span>
            </div>
          )}

          {/* Parsed syllables display */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="smallcaps text-xs" style={{ color: "#5a4632" }}>
              parsed
            </span>
            {!editingSyllables ? (
              <>
                {syllables.length === 0 ? (
                  <span className="text-sm italic" style={{ color: "#8a7e6a" }}>
                    type a name above
                  </span>
                ) : (
                  syllables.map((syl, idx) => (
                    <span
                      key={idx}
                      className="pill px-3 py-1 text-sm rounded-full"
                      style={{
                        color: KANJI[syl] ? "#1c1917" : "#a73225",
                      }}
                      title={KANJI[syl] ? "" : "no kanji in database for this syllable"}
                    >
                      {syl}
                      {!KANJI[syl] && " ?"}
                    </span>
                  ))
                )}
                {syllables.length > 0 && (
                  <button
                    onClick={() => setEditingSyllables(true)}
                    className="text-xs underline ml-1"
                    style={{ color: "#5a4632" }}
                  >
                    edit
                  </button>
                )}
              </>
            ) : (
              <>
                {/* Insertion point at start */}
                <button
                  className="syl-insert"
                  aria-label="insert syllable at start"
                  title="insert here"
                  onClick={() => {
                    const next = ["a", ...syllables];
                    setManualOverride(next.join("-"));
                  }}
                >
                  +
                </button>
                {syllables.map((syl, idx) => (
                  <React.Fragment key={idx}>
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ position: "relative" }}
                    >
                      <select
                        className="pill-select"
                        value={KANJI[syl] ? syl : ""}
                        onChange={(e) => {
                          const next = [...syllables];
                          next[idx] = e.target.value;
                          setManualOverride(next.join("-"));
                        }}
                        aria-label={`syllable ${idx + 1}`}
                      >
                        {!KANJI[syl] && (
                          <option value="" disabled>
                            {syl} ?
                          </option>
                        )}
                        {SYLLABLE_GROUPS.map((g) => (
                          <optgroup key={g.label} label={g.label}>
                            {g.items.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <button
                        className="syl-remove"
                        aria-label="remove syllable"
                        onClick={() => {
                          const next = syllables.filter((_, i) => i !== idx);
                          setManualOverride(next.length > 0 ? next.join("-") : "a");
                        }}
                      >
                        ×
                      </button>
                    </span>
                    {/* Insertion point after this pill */}
                    <button
                      className="syl-insert"
                      aria-label={`insert syllable after position ${idx + 1}`}
                      title="insert here"
                      onClick={() => {
                        const next = [...syllables];
                        next.splice(idx + 1, 0, "a");
                        setManualOverride(next.join("-"));
                      }}
                    >
                      +
                    </button>
                  </React.Fragment>
                ))}
                <button
                  onClick={() => setEditingSyllables(false)}
                  className="text-xs underline ml-2"
                  style={{ color: "#5a4632" }}
                >
                  done
                </button>
              </>
            )}
          </div>
        </section>

        {/* RESULT BOARD */}
        {syllables.length > 0 && allSyllablesValid && (
          <div className="fade-up mb-12">
            {/* Manuscript-divider tabs above the result board.
                Two tabs always visible — the active one is filled
                vermilion, the inactive one is outlined. They sit
                above the upper-right corner of the board, evoking
                folder dividers poking up from a stack. */}
            <div className="result-tabs flex justify-end gap-1">
              <button
                className={`result-tab ${viewMode === "current" ? "active" : ""}`}
                onClick={() => setViewMode("current")}
              >
                current
              </button>
              <button
                className={`result-tab ${viewMode === "saved" ? "active" : ""}`}
                onClick={() => setViewMode("saved")}
              >
                saved · {savedNames.length}
              </button>
            </div>
          <section
            className="px-6 py-10 md:px-10 md:py-12 rounded-sm result-board"
            style={{
              backgroundColor: "#fbf6e7",
              border: "1px solid #d6cdb8",
              boxShadow: "0 1px 0 rgba(0,0,0,0.04), 0 18px 30px -28px rgba(0,0,0,0.25)",
            }}
            key={viewMode === "current" ? fullKanji : `saved-${savedNames.length}`}
          >
            {viewMode === "current" ? (
              <>
            <p className="smallcaps text-xs mb-6" style={{ color: "#a73225" }}>
              your name
            </p>

            {/* Paired kanji + syllable columns — the romanization sits
                directly under its kanji so users can match what's what.
                Hovering (or long-pressing on mobile) any column reveals
                the full meaning string, since the meanings line below
                only renders the first comma-segment of each gloss. */}
            <div className="flex flex-wrap items-end gap-x-2 md:gap-x-3 gap-y-6 mb-6">
              {assembled.map((a, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center"
                  title={a ? `${a.k} (${syllables[i]}) — ${a.m}` : undefined}
                >
                  <div className="jp text-7xl md:text-8xl leading-none">
                    {a ? a.k : "?"}
                  </div>
                  <div
                    className="display mt-3"
                    style={{
                      color: "#5a4632",
                      fontStyle: "italic",
                      fontSize: "1rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {syllables[i]}
                  </div>
                </div>
              ))}
            </div>

            {/* Meanings line — kanji entries get a quoted English gloss,
                kana entries (hiragana ん or katakana フェ etc.) get a
                bracketed italic descriptor with the glyph itself, e.g.
                〈syllabic n (ん)〉 or 〈foreign sound (フェ)〉. */}
            <p className="text-base md:text-lg" style={{ color: "#3f3a32", lineHeight: 1.6 }}>
              {assembled.map((a, i) => {
                if (!a) return null;
                return (
                  <span key={i}>
                    {i > 0 && (
                      <span style={{ margin: "0 0.5em", color: "#b8a872" }}>·</span>
                    )}
                    {isKana(a) ? (
                      <span style={{ fontStyle: "italic", color: "#5a4632" }}>
                        〈{a.m} (
                        <span className="jp" style={{ fontStyle: "normal" }}>
                          {a.k}
                        </span>
                        )〉
                      </span>
                    ) : (
                      <span title={a.m}>{`"${a.m.split(",")[0].trim()}"`}</span>
                    )}
                  </span>
                );
              })}
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={randomize}
                className="px-5 py-2 text-sm tracking-wide"
                style={{
                  backgroundColor: "#1c1917",
                  color: "#f3ecd9",
                  fontFamily: "'Fraunces', serif",
                }}
              >
                ↻ Random combination
              </button>
              <button
                onClick={reset}
                className="px-5 py-2 text-sm tracking-wide"
                style={{
                  backgroundColor: "transparent",
                  color: "#1c1917",
                  border: "1px solid #1c1917",
                  fontFamily: "'Fraunces', serif",
                }}
              >
                Reset
              </button>
              <button
                onClick={copyResult}
                className="px-5 py-2 text-sm tracking-wide"
                style={{
                  backgroundColor: "transparent",
                  color: "#5a4632",
                  border: "1px solid #d6cdb8",
                  fontFamily: "'Fraunces', serif",
                }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
              <button
                onClick={saveCurrent}
                disabled={alreadySaved}
                className="px-5 py-2 text-sm tracking-wide"
                style={{
                  backgroundColor: alreadySaved ? "transparent" : "#a73225",
                  color: alreadySaved ? "#a73225" : "#f3ecd9",
                  border: "1px solid #a73225",
                  fontFamily: "'Fraunces', serif",
                  cursor: alreadySaved ? "default" : "pointer",
                  opacity: alreadySaved ? 0.6 : 1,
                }}
              >
                {alreadySaved ? "✓ Saved" : "★ Save"}
              </button>
              {/* Themes button — sits at the far right of the action
                  row (lower-right corner of the result board). On click,
                  the theme picker panel drops down beneath the board. */}
              <button
                onClick={() => setThemePanelOpen((v) => !v)}
                className="px-5 py-2 text-sm tracking-wide ml-auto"
                style={{
                  backgroundColor: themePanelOpen ? "#5a4632" : "transparent",
                  color: themePanelOpen ? "#f3ecd9" : "#5a4632",
                  border: "1px solid #5a4632",
                  fontFamily: "'Fraunces', serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                aria-expanded={themePanelOpen}
              >
                <span>themes</span>
                {activeThemes.size > 0 && (
                  <span
                    style={{
                      background: themePanelOpen ? "#f3ecd9" : "#a73225",
                      color: themePanelOpen ? "#5a4632" : "#f3ecd9",
                      borderRadius: "9999px",
                      padding: "0 0.5rem",
                      fontSize: "0.7rem",
                      lineHeight: "1.2rem",
                    }}
                  >
                    {activeThemes.size}
                  </span>
                )}
                <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>
                  {themePanelOpen ? "▴" : "▾"}
                </span>
              </button>
            </div>
              </>
            ) : (
              /* SAVED VIEW */
              <>
                <p className="smallcaps text-xs mb-6" style={{ color: "#a73225" }}>
                  saved names
                </p>
                {savedNames.length === 0 ? (
                  <p
                    className="text-base italic"
                    style={{ color: "#8a7e6a", lineHeight: 1.6 }}
                  >
                    No names saved yet. From the <em>current</em> tab, hit{" "}
                    <span style={{ color: "#a73225", fontStyle: "normal" }}>★ Save</span>{" "}
                    on a combination you'd like to keep — your saved names will collect here.
                  </p>
                ) : (
                  <ul className="space-y-6">
                    {savedNames.map((s) => (
                      <li
                        key={s.id}
                        className="saved-row pb-5"
                        style={{ borderBottom: "1px solid #e0d6bd" }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                              <span
                                className="display text-sm"
                                style={{ color: "#a73225", fontWeight: 500 }}
                              >
                                {s.name}
                              </span>
                              <span
                                className="display text-xs italic"
                                style={{ color: "#8a7e6a" }}
                              >
                                {s.reading}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-end gap-x-2 gap-y-3 mb-2">
                              {s.entries.map((e, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col items-center"
                                  title={e ? `${e.k} (${s.syllables[i]}) — ${e.m}` : undefined}
                                >
                                  <div
                                    className="jp leading-none"
                                    style={{ fontSize: "2.5rem" }}
                                  >
                                    {e ? e.k : "?"}
                                  </div>
                                  <div
                                    className="display mt-1"
                                    style={{
                                      color: "#8a7e6a",
                                      fontStyle: "italic",
                                      fontSize: "0.7rem",
                                      letterSpacing: "0.04em",
                                    }}
                                  >
                                    {s.syllables[i]}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <p
                              className="text-sm"
                              style={{ color: "#5a4632", lineHeight: 1.5 }}
                            >
                              {s.entries.map((e, i) => {
                                if (!e) return null;
                                return (
                                  <span key={i}>
                                    {i > 0 && (
                                      <span style={{ margin: "0 0.4em", color: "#b8a872" }}>·</span>
                                    )}
                                    {isKana(e) ? (
                                      <span style={{ fontStyle: "italic", color: "#8a7e6a" }}>
                                        〈{e.m} (
                                        <span className="jp" style={{ fontStyle: "normal" }}>
                                          {e.k}
                                        </span>
                                        )〉
                                      </span>
                                    ) : (
                                      <span title={e.m}>
                                        {`"${e.m.split(",")[0].trim()}"`}
                                      </span>
                                    )}
                                  </span>
                                );
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => copySaved(s)}
                              className="saved-action"
                              title="copy this name"
                            >
                              {savedCopiedId === s.id ? "✓" : "copy"}
                            </button>
                            <button
                              onClick={() => removeSaved(s.id)}
                              className="saved-remove"
                              aria-label="remove from saved"
                              title="remove from saved"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </section>

          {/* THEME PICKER PANEL — drops down beneath the result board
              when the themes button is toggled on. Renders as a smaller
              attached folio insert: same paper-cream color, narrower
              padding, no top border so it visually fuses with the board
              above. */}
          {themePanelOpen && (
            <div
              className="theme-panel fade-up"
              style={{
                backgroundColor: "#f3ecd9",
                border: "1px solid #d6cdb8",
                borderTop: "none",
                padding: "1.25rem 1.5rem 1.5rem",
                marginTop: 0,
              }}
            >
              <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                <p className="smallcaps text-xs" style={{ color: "#a73225" }}>
                  themes — bias the randomizer & sort the kanji shelf
                </p>
                {activeThemes.size > 0 && (
                  <button
                    onClick={clearThemes}
                    className="text-xs underline"
                    style={{ color: "#5a4632", background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {THEME_META.map((t) => {
                  const active = activeThemes.has(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTheme(t.id)}
                      className="theme-chip"
                      title={t.hint}
                      style={{
                        background: active ? "#a73225" : "transparent",
                        color: active ? "#f3ecd9" : "#5a4632",
                        border: `1px solid ${active ? "#a73225" : "#b8a872"}`,
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
              <p
                className="text-xs italic mt-3"
                style={{ color: "#8a7e6a", lineHeight: 1.5 }}
              >
                {activeThemes.size === 0
                  ? "Select one or more themes to bias which kanji the randomizer prefers and which appear first in each syllable's options. Selected kanji that don't match a theme stay put — themes are non-destructive."
                  : "Hit ↻ Random combination to draw a new name from the themed pool. Open any syllable's accordion to see themed kanji listed first; non-matches dim but stay clickable."}
              </p>
            </div>
          )}
          </div>
        )}

        {/* PER-SYLLABLE KANJI SELECTORS (accordion)
            Each syllable becomes a collapsible row. Default state is
            all-collapsed — the result board stays the centerpiece, and
            the user opens panels only when they want to refine. Multiple
            panels can be open at once for A/B comparison across
            syllables. */}
        {syllables.length > 0 && (
          <section className="space-y-2">
            <div className="mb-6">
              <p
                className="smallcaps text-sm mb-3"
                style={{ color: "#a73225" }}
              >
                Different kanji, different meanings
              </p>
              {/* Toggles for the additional kanji sets. Default off so
                  newcomers see only the curated core; enabling either
                  reveals more options across all syllables at once. */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                <label
                  className="kanji-toggle"
                  title="Reveal additional name-kanji beyond the curated core"
                >
                  <input
                    type="checkbox"
                    checked={showExpanded}
                    onChange={(e) => setShowExpanded(e.target.checked)}
                  />
                  <span>show more kanji</span>
                </label>
                <label
                  className="kanji-toggle"
                  title="Reveal kanji with darker, harsher, or more sorrowful meanings — for the curious"
                >
                  <input
                    type="checkbox"
                    checked={showDark}
                    onChange={(e) => setShowDark(e.target.checked)}
                  />
                  <span>include darker meanings</span>
                </label>
              </div>
            </div>
            {syllables.map((syl, sylIdx) => {
              const opts = KANJI[syl];
              const visible = opts ? opts.filter(isVisible) : [];
              const isOpen = openAccordions.has(sylIdx);
              const selected = resolveEntry(syl, sylIdx);

              if (!opts || visible.length === 0) {
                const reason = !opts
                  ? "no kanji in database for this syllable"
                  : "all options are hidden by current toggles";
                return (
                  <div
                    key={sylIdx}
                    className="accordion-row"
                    style={{
                      borderBottom: "1px solid #e0d6bd",
                      padding: "0.9rem 0.25rem",
                    }}
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        className="display text-sm"
                        style={{ color: "#a73225", fontWeight: 500, minWidth: "1.5rem" }}
                      >
                        {String(sylIdx + 1).padStart(2, "0")}
                      </span>
                      <span className="display text-2xl" style={{ fontStyle: "italic" }}>
                        {syl}
                      </span>
                      <span className="text-xs italic ml-auto" style={{ color: "#8a7e6a" }}>
                        {reason}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={sylIdx}
                  className="accordion-row"
                  style={{ borderBottom: "1px solid #e0d6bd" }}
                >
                  <button
                    onClick={() => toggleAccordion(sylIdx)}
                    aria-expanded={isOpen}
                    className="accordion-header w-full flex items-center gap-4 text-left"
                    style={{
                      padding: "0.9rem 0.25rem",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <span
                      className="display text-sm"
                      style={{ color: "#a73225", fontWeight: 500, minWidth: "1.5rem" }}
                    >
                      {String(sylIdx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="display text-2xl md:text-3xl"
                      style={{ fontStyle: "italic", color: "#1c1917" }}
                    >
                      {syl}
                    </span>
                    {selected && (
                      <span
                        className="jp text-2xl md:text-3xl ml-2"
                        style={{ color: "#3f3a32" }}
                      >
                        {selected.k}
                      </span>
                    )}
                    {selected && !isKana(selected) && (
                      <span
                        className="text-sm italic hidden md:inline"
                        style={{ color: "#5a4632" }}
                      >
                        "{selected.m.split(",")[0].trim()}"
                      </span>
                    )}
                    <span className="text-sm ml-auto" style={{ color: "#5a4632" }}>
                      {(() => {
                        const kanaN = visible.filter((o) => o.kana).length;
                        const kanjiN = visible.length - kanaN;
                        if (kanaN === 0) return `${kanjiN} kanji`;
                        if (kanjiN === 0) return `${kanaN} kana`;
                        return `${kanjiN} kanji + ${kanaN} kana`;
                      })()}
                    </span>
                    <span
                      className="chevron"
                      style={{
                        color: "#5a4632",
                        fontSize: "1.1rem",
                        transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 220ms ease",
                        display: "inline-block",
                        width: "1rem",
                        textAlign: "center",
                      }}
                    >
                      ▸
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      className="accordion-body fade-up"
                      style={{
                        padding: "0.5rem 0 1.25rem 0",
                      }}
                    >
                      <div
                        className="grid gap-3"
                        style={{
                          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                        }}
                      >
                        {(() => {
                          // When themes are active, sort matching kanji
                          // first; non-matches dim. When inactive, render
                          // in DB order.
                          const sorted = activeThemes.size > 0
                            ? [...visible].sort((a, b) => {
                                const am = matchesActiveTheme(a) ? 0 : 1;
                                const bm = matchesActiveTheme(b) ? 0 : 1;
                                return am - bm;
                              })
                            : visible;
                          return sorted.map((opt) => {
                            const fullIdx = opts.indexOf(opt);
                            const isSelected = selected === opt;
                            const matches = matchesActiveTheme(opt);
                            const themed = activeThemes.size > 0;
                            const dimmed = themed && !matches;
                            return (
                              <button
                                key={fullIdx}
                                onClick={() =>
                                  setSelections((prev) => ({ ...prev, [sylIdx]: fullIdx }))
                                }
                                className="kanji-btn relative text-left p-4 rounded-sm"
                                title={`${opt.k} — ${opt.m}`}
                                style={{
                                  backgroundColor: isSelected ? "#fbf6e7" : "transparent",
                                  border: isSelected
                                    ? "1px solid #a73225"
                                    : "1px solid #d6cdb8",
                                  cursor: "pointer",
                                  opacity: dimmed ? 0.4 : 1,
                                  transition: "opacity 200ms ease",
                                }}
                              >
                                <div
                                  className="jp text-5xl mb-2 leading-none"
                                  style={{
                                    color: isSelected ? "#1c1917" : "#2a241c",
                                  }}
                                >
                                  {opt.k}
                                </div>
                                <div
                                  className="text-xs leading-tight"
                                  style={{
                                    color: isSelected ? "#3f3a32" : "#5a4632",
                                    fontStyle: "italic",
                                  }}
                                >
                                  {opt.m}
                                </div>
                                {/* Theme chips — only render if entry has themes
                                    AND themes are active (avoid clutter otherwise) */}
                                {themed && themesForEntry(opt).length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {themesForEntry(opt).map((t) => (
                                      <span
                                        key={t}
                                        className="theme-chip-mini"
                                        style={{
                                          background: activeThemes.has(t) ? "#a73225" : "#ebe2c8",
                                          color: activeThemes.has(t) ? "#f3ecd9" : "#5a4632",
                                        }}
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                {isSelected && <span className="selected-bar" />}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* FOOTER */}
        <footer className="mt-20 pt-8" style={{ borderTop: "1px solid #d6cdb8" }}>
          <p className="text-xs leading-relaxed" style={{ color: "#8a7e6a" }}>
            A name written in kanji is a small act of choosing. Every Japanese
            name uses kanji whose <em>readings</em> match the sound — the
            <em> meanings</em> are an artist's choice. The same name can be
            written dozens of ways, each carrying its own tone. This tool only
            knows a few hundred kanji; a serious dictionary would draw from the
            jinmeiyō (人名用) list of around 863 name-kanji.
          </p>
        </footer>
      </div>
    </div>
  );
}
