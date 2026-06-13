# 名前 — a study in name kanji

An editorial tool for rendering names — Japanese and foreign — into kanji, with
phonological adaptation, transparent transliteration, and thematic curation.

## What it does

Type any name. The tool parses it into syllables, transliterating foreign
phonology into Japanese-shaped sounds where necessary (Mohammed → mo·ha·me·do,
Christopher → ku·ri·su·to·fe·ru), and offers kanji for each syllable from a
curated database of ~670 entries.

The transliteration layer is shown to the user when it activates, so the
adaptation isn't hidden — every step is legible.

## Features

- **Two-stage parser.** A basic L→R, V→B path for names that already fit
  Japanese phonology, with a full transliteration fallback for names that
  don't (handling doubled consonants, silent h, foreign clusters, epenthetic
  vowel insertion, and more).
- **Grouped syllable editor.** Each syllable becomes a dropdown grouped by
  the gojuon (五十音) table — vowels, then consonant rows, then voiced,
  handakuten, compounds, foreign-only. Click insertion points between pills
  let you restructure a name without retyping.
- **Curated kanji shelves.** Each syllable has 1–9 kanji options. Hover any
  tile for the full meaning string.
- **Expanded and dark sets.** Toggle on to reveal additional kanji beyond the
  curated core, or kanji with darker, harsher, or more sorrowful meanings.
- **Thematic tags.** Bias the randomizer and sort each syllable's kanji shelf
  by theme — nature, light, water, strength, wisdom, spirit, beauty, virtue.
  Selected kanji that don't match a theme stay put — themes are non-destructive.
- **Saved names.** Build a name you like, hit Save, and it lives in a second
  tab attached to the result board until you remove it. Each entry has its
  own copy and remove actions. Session-only by default; see the README's
  "persistence" note below for adding localStorage.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Build

```bash
npm run build
```

Output goes to `dist/`. Vercel, Netlify, and Cloudflare Pages all auto-deploy
this with no configuration — point them at the repo, accept defaults.

## Persistence (optional)

The saved-names list is session-only by default. To make it persist across
page reloads, wrap the `savedNames` state initializer and add an effect:

```js
const [savedNames, setSavedNames] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem("kanjiSavedNames") || "[]");
  } catch { return []; }
});

useEffect(() => {
  localStorage.setItem("kanjiSavedNames", JSON.stringify(savedNames));
}, [savedNames]);
```

## Architecture notes

- `src/App.jsx` is the entire application. It contains the kanji database
  (~670 entries, tagged with `expanded`, `dark`, `kana` flags as appropriate),
  the thematic tag index, the two-stage parser, and the React component.
- The parser pipeline lives at the top of the file, organized into numbered
  phases: digraph substitution, L→R/V→B, forbidden-phoneme corrections,
  c-handling, doubled-consonant collapse, and an epenthetic-vowel walk.
- The component uses only React hooks (useState, useEffect, useMemo) and
  Tailwind utility classes plus a few editorial helper classes defined in
  `src/index.css`.

## License

Your call. MIT is a reasonable default.
