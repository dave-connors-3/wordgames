const fs = require('fs');
const content = fs.readFileSync('/Users/daveconnors/wordgames/letterpress/src/data/wordList.ts', 'utf8');

// Extract all quoted strings
const words = content.match(/"([a-z]+)"/g).map(w => w.replace(/"/g, ''));

// Filter only 5-letter words, deduplicate, sort
const unique5 = [...new Set(words.filter(w => w.length === 5))].sort();

console.log('Unique 5-letter words:', unique5.length);

// Generate TypeScript file content
let output = 'const WORD_LIST: string[] = [\n';
unique5.forEach((w, i) => {
  output += `  "${w}",\n`;
});
output += '];\n\nexport const WORDS: Set<string> = new Set(WORD_LIST);\n';

fs.writeFileSync('/Users/daveconnors/wordgames/letterpress/src/data/wordList_clean.ts', output);
console.log('Written clean file');
