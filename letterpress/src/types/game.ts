export type GamePhase = 'start' | 'playing' | 'ended';

export interface LetterTile {
  id: string;
  letter: string;
  timestamp: number;
}

export interface Successor {
  letter: string;
  position: number;
  resultWord: string;
}

export type AdjacencyGraph = Map<string, Successor[]>;

export interface GameState {
  phase: GamePhase;
  currentWord: string[];
  queue: LetterTile[];
  selectedQueueIndex: number | null;
  score: number;
  wordsFormed: string[];
  usedWords: Set<string>;
  comboCount: number;
  comboMultiplier: number;
  bestCombo: number;
  lastWordTimestamp: number | null;
  timeRemaining: number;
  lettersGenerated: number;
  gameOverReason: 'time' | 'overflow' | null;
}

export type GameAction =
  | { type: 'START_GAME'; payload: { initialWord: string[] } }
  | { type: 'SELECT_QUEUE_LETTER'; payload: { index: number } }
  | { type: 'PLACE_LETTER'; payload: { position: number } }
  | { type: 'WORD_VALID'; payload: { word: string; score: number; timestamp: number } }
  | { type: 'WORD_INVALID' }
  | { type: 'ADD_LETTER_TO_QUEUE'; payload: { tile: LetterTile } }
  | { type: 'TICK_TIMER'; payload: { remaining: number } }
  | { type: 'CLEAN_QUEUE'; payload: { validTileIds: Set<string> } }
  | { type: 'GAME_OVER'; payload: { reason: 'time' | 'overflow' } }
  | { type: 'RESET' };
