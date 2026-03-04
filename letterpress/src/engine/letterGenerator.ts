import { WORDS } from '../data/wordList';
import { LETTER_FREQUENCY } from '../data/letterFrequency';
import type { AdjacencyGraph, Successor } from '../types/game';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Precompute the adjacency graph: for each word, find all words
 * reachable by changing exactly one letter.
 */
export function precomputeAdjacencyGraph(): AdjacencyGraph {
  const graph: AdjacencyGraph = new Map();

  for (const word of WORDS) {
    const successors: Successor[] = [];
    const chars = word.split('');

    for (let pos = 0; pos < 5; pos++) {
      const original = chars[pos];
      for (const letter of ALPHABET) {
        if (letter === original) continue;
        chars[pos] = letter;
        const candidate = chars.join('');
        if (WORDS.has(candidate)) {
          successors.push({ letter, position: pos, resultWord: candidate });
        }
      }
      chars[pos] = original;
    }

    graph.set(word, successors);
  }

  return graph;
}

interface GenerationWeights {
  branchingFactor: number;
  letterCommonness: number;
  positionDiversity: number;
}

const DEFAULT_WEIGHTS: GenerationWeights = {
  branchingFactor: 0.4,
  letterCommonness: 0.3,
  positionDiversity: 0.3,
};

/**
 * Generate the next letter tile for the player.
 * Guarantees at least one valid placement exists.
 */
export function generateNextLetter(
  currentWord: string,
  graph: AdjacencyGraph,
  usedWords: Set<string>,
  recentPositions: number[],
  _weights: GenerationWeights = DEFAULT_WEIGHTS,
): { letter: string; validPlacements: Array<{ position: number; resultWord: string }> } | null {
  const successors = graph.get(currentWord);
  if (!successors) return null;

  // Filter out successors that lead to already-used words
  const available = successors.filter(s => !usedWords.has(s.resultWord));
  if (available.length === 0) return null;

  // Group by letter (a single letter might work in multiple positions)
  const letterOptions = new Map<string, Array<{ position: number; resultWord: string }>>();
  for (const s of available) {
    if (!letterOptions.has(s.letter)) {
      letterOptions.set(s.letter, []);
    }
    letterOptions.get(s.letter)!.push({ position: s.position, resultWord: s.resultWord });
  }

  // Score each letter option
  const scored: Array<{ letter: string; score: number; placements: Array<{ position: number; resultWord: string }> }> = [];

  for (const [letter, placements] of letterOptions) {
    let score = 0;

    // Branching factor: how many successors do the result words have?
    const avgBranching = placements.reduce((sum, p) => {
      const nextSuccessors = graph.get(p.resultWord) ?? [];
      return sum + nextSuccessors.filter(s => !usedWords.has(s.resultWord)).length;
    }, 0) / placements.length;
    score += (avgBranching / 30) * _weights.branchingFactor; // normalize ~30 max

    // Letter commonness
    const freq = LETTER_FREQUENCY[letter] ?? 1;
    score += (freq / 11) * _weights.letterCommonness; // normalize by max freq (e=11)

    // Position diversity: prefer positions not recently targeted
    const positionsUsed = placements.map(p => p.position);
    const diversityBonus = positionsUsed.some(p => !recentPositions.includes(p)) ? 1 : 0.3;
    score += diversityBonus * _weights.positionDiversity;

    scored.push({ letter, score, placements });
  }

  // Weighted random selection based on scores
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0);
  if (totalScore === 0) {
    // Fallback: pick random
    const pick = scored[Math.floor(Math.random() * scored.length)];
    return { letter: pick.letter, validPlacements: pick.placements };
  }

  let rand = Math.random() * totalScore;
  for (const option of scored) {
    rand -= option.score;
    if (rand <= 0) {
      return { letter: option.letter, validPlacements: option.placements };
    }
  }

  // Fallback (shouldn't reach here)
  const last = scored[scored.length - 1];
  return { letter: last.letter, validPlacements: last.placements };
}

/**
 * Check if a letter can form any valid word by replacing one position
 * in the current word. Used to clean stale queue letters after a word change.
 */
export function letterHasValidPlacement(
  letter: string,
  currentWord: string,
  usedWords: Set<string>,
  graph: AdjacencyGraph,
): boolean {
  const successors = graph.get(currentWord);
  if (!successors) return false;
  return successors.some(
    s => s.letter === letter && !usedWords.has(s.resultWord),
  );
}

/**
 * Calculate the interval before the next letter appears.
 * Starts slow, accelerates over time.
 */
export function getLetterInterval(lettersGenerated: number): number {
  const BASE_INTERVAL = 5000;
  const DECAY_RATE = 0.88;
  const MIN_INTERVAL = 1500;
  return Math.max(MIN_INTERVAL, BASE_INTERVAL * Math.pow(DECAY_RATE, lettersGenerated));
}
