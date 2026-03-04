import { WORDS } from '../data/wordList';

export function isValidWord(word: string): boolean {
  return WORDS.has(word.toLowerCase());
}
