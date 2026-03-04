const fs = require('fs');
const content = fs.readFileSync('/Users/daveconnors/wordgames/letterpress/src/data/wordList.ts', 'utf8');

// Extract all quoted strings
const words = content.match(/"([a-z]+)"/g).map(w => w.replace(/"/g, ''));

console.log('Total entries in array:', words.length);

// Check for non-5-letter words
const bad = words.filter(w => w.length !== 5);
console.log('Non-5-letter words:', bad.length, bad);

// Check unique count
const unique = new Set(words);
const unique5 = [...unique].filter(w => w.length === 5);
console.log('Unique 5-letter words:', unique5.length);
console.log('Unique words total:', unique.size);

// Check duplicates
const counts = {};
words.forEach(w => { counts[w] = (counts[w] || 0) + 1; });
const dups = Object.entries(counts).filter(([k,v]) => v > 1);
console.log('Duplicated words:', dups.length);
if (dups.length > 0) {
  dups.forEach(([w, c]) => console.log('  ', w, 'x' + c));
}
