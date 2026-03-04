# wordgames

A collection of browser-based word games built with React + TypeScript.

## Games

### LetterPress

A timed word-stacking challenge. You start with a valid 5-letter word, and new letters appear in a queue. Click a position (or press 1-5) to stamp a letter onto the word, forming a new valid word. Keep up as letters arrive faster and faster — if 5 pile up, you lose!

- 30-second rounds with accelerating letter delivery
- Combo multipliers for forming words in quick succession
- Speed bonuses for placing letters quickly
- ~2,300 curated words based on common 5-letter English words

#### Run locally

```bash
cd letterpress
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

#### Build for production

```bash
cd letterpress
npm run build
```

Output goes to `letterpress/dist/`.
