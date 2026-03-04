import { useReducer } from 'react';
import type { GameState, GameAction } from '../types/game';

const INITIAL_TIME = 30000;

export const initialState: GameState = {
  phase: 'start',
  currentWord: [],
  queue: [],
  selectedQueueIndex: null,
  score: 0,
  wordsFormed: [],
  usedWords: new Set(),
  comboCount: 0,
  comboMultiplier: 1,
  bestCombo: 0,
  lastWordTimestamp: null,
  timeRemaining: INITIAL_TIME,
  lettersGenerated: 0,
  gameOverReason: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const word = action.payload.initialWord;
      const wordStr = word.join('');
      return {
        ...initialState,
        phase: 'playing',
        currentWord: word,
        wordsFormed: [wordStr],
        usedWords: new Set([wordStr]),
        timeRemaining: INITIAL_TIME,
      };
    }

    case 'SELECT_QUEUE_LETTER': {
      return {
        ...state,
        selectedQueueIndex: action.payload.index,
      };
    }

    case 'PLACE_LETTER': {
      if (state.selectedQueueIndex === null) return state;
      const selectedTile = state.queue[state.selectedQueueIndex];
      if (!selectedTile) return state;

      const newWord = [...state.currentWord];
      newWord[action.payload.position] = selectedTile.letter;

      const newQueue = state.queue.filter((_, i) => i !== state.selectedQueueIndex);

      return {
        ...state,
        currentWord: newWord,
        queue: newQueue,
        selectedQueueIndex: newQueue.length > 0 ? 0 : null,
      };
    }

    case 'WORD_VALID': {
      const { word, score, timestamp } = action.payload;
      const isCombo = state.lastWordTimestamp !== null &&
        (timestamp - state.lastWordTimestamp) <= 2000;
      const newComboCount = isCombo ? state.comboCount + 1 : 0;
      const newMultiplier = 1 + newComboCount * 0.5;

      return {
        ...state,
        score: state.score + score,
        wordsFormed: [...state.wordsFormed, word],
        usedWords: new Set([...state.usedWords, word]),
        comboCount: newComboCount,
        comboMultiplier: newMultiplier,
        bestCombo: Math.max(state.bestCombo, newComboCount),
        lastWordTimestamp: timestamp,
      };
    }

    case 'WORD_INVALID': {
      return state; // The UI handles the visual feedback
    }

    case 'ADD_LETTER_TO_QUEUE': {
      const newQueue = [...state.queue, action.payload.tile];
      // Auto-select if this is the only letter
      const newSelected = newQueue.length === 1 ? 0 : state.selectedQueueIndex;

      if (newQueue.length > 5) {
        return {
          ...state,
          queue: newQueue,
          phase: 'ended',
          gameOverReason: 'overflow',
        };
      }

      return {
        ...state,
        queue: newQueue,
        selectedQueueIndex: newSelected,
        lettersGenerated: state.lettersGenerated + 1,
      };
    }

    case 'CLEAN_QUEUE': {
      const { validTileIds } = action.payload;
      const cleaned = state.queue.filter(t => validTileIds.has(t.id));
      if (cleaned.length === state.queue.length) return state; // nothing to clean
      return {
        ...state,
        queue: cleaned,
        selectedQueueIndex: cleaned.length > 0 ? 0 : null,
      };
    }

    case 'TICK_TIMER': {
      return {
        ...state,
        timeRemaining: action.payload.remaining,
      };
    }

    case 'GAME_OVER': {
      return {
        ...state,
        phase: 'ended',
        gameOverReason: action.payload.reason,
      };
    }

    case 'RESET': {
      return initialState;
    }

    default:
      return state;
  }
}

export function useGameState() {
  return useReducer(gameReducer, initialState);
}
