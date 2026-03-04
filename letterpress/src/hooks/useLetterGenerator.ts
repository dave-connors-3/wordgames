import { useEffect, useRef } from 'react';
import type { GameAction, AdjacencyGraph } from '../types/game';
import { generateNextLetter, getLetterInterval } from '../engine/letterGenerator';

let tileIdCounter = 0;

export function useLetterGenerator(
  isPlaying: boolean,
  currentWord: string[],
  usedWords: Set<string>,
  lettersGenerated: number,
  queueLength: number,
  graph: AdjacencyGraph,
  dispatch: React.Dispatch<GameAction>,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const recentPositionsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const wordStr = currentWord.join('');
    // Quick delivery when queue is empty (short breather), otherwise paced interval
    const EMPTY_QUEUE_DELAY = 500;
    const interval = queueLength === 0 ? EMPTY_QUEUE_DELAY : getLetterInterval(lettersGenerated);

    timeoutRef.current = setTimeout(() => {
      const result = generateNextLetter(
        wordStr,
        graph,
        usedWords,
        recentPositionsRef.current,
      );

      if (result) {
        const positions = result.validPlacements.map(p => p.position);
        recentPositionsRef.current = [
          ...recentPositionsRef.current.slice(-2),
          ...positions,
        ].slice(-3);

        dispatch({
          type: 'ADD_LETTER_TO_QUEUE',
          payload: {
            tile: {
              id: `tile-${++tileIdCounter}`,
              letter: result.letter,
              timestamp: Date.now(),
            },
          },
        });
      }
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentWord, usedWords, lettersGenerated, queueLength, graph, dispatch]);
}
