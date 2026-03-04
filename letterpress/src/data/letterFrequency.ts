// Letter frequency weights for 5-letter English words (higher = more common)
export const LETTER_FREQUENCY: Record<string, number> = {
  e: 11.0, a: 8.5, r: 7.5, o: 7.2, t: 7.0,
  l: 6.3, i: 6.2, s: 6.0, n: 5.8, h: 4.2,
  c: 3.8, u: 3.6, d: 3.5, p: 3.0, m: 2.8,
  g: 2.5, y: 2.4, b: 2.1, w: 1.8, f: 1.7,
  k: 1.3, v: 1.1, j: 0.3, x: 0.3, z: 0.3,
  q: 0.2,
};

// Scrabble-style bonus points for rarer letters
export const LETTER_BONUS: Record<string, number> = {
  q: 20, z: 20, x: 20, j: 20,
  k: 10, v: 10, w: 10, y: 10,
};
