import type { AdjacencyGraph } from '../types/game';

/**
 * Pick a starting word with high connectivity (many single-substitution neighbors).
 * This ensures the player has plenty of options from the start.
 */
export function pickInitialWord(graph: AdjacencyGraph): string {
  const candidates: Array<{ word: string; neighbors: number }> = [];

  for (const [word, successors] of graph) {
    if (successors.length >= 10) {
      candidates.push({ word, neighbors: successors.length });
    }
  }

  if (candidates.length === 0) {
    // Fallback: pick the word with the most neighbors
    let bestWord = '';
    let bestCount = 0;
    for (const [word, successors] of graph) {
      if (successors.length > bestCount) {
        bestCount = successors.length;
        bestWord = word;
      }
    }
    return bestWord;
  }

  // Pick randomly from top-tier candidates (top 25% by neighbor count)
  candidates.sort((a, b) => b.neighbors - a.neighbors);
  const topTier = candidates.slice(0, Math.max(1, Math.floor(candidates.length * 0.25)));
  return topTier[Math.floor(Math.random() * topTier.length)].word;
}
