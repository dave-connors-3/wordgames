import { LETTER_BONUS } from '../data/letterFrequency';

const COMBO_WINDOW_MS = 2000;
const SPEED_BONUS_WINDOW_MS = 1000;

export function calculateWordScore(
  word: string,
  comboMultiplier: number,
  placedWithinSpeedWindow: boolean,
): number {
  let base = 100;

  for (const ch of word) {
    base += LETTER_BONUS[ch] ?? 0;
  }

  if (placedWithinSpeedWindow) {
    base += 25;
  }

  return Math.round(base * comboMultiplier);
}

export function getComboMultiplier(comboCount: number): number {
  return 1 + comboCount * 0.5;
}

export function isWithinComboWindow(
  lastWordTimestamp: number | null,
  currentTimestamp: number,
): boolean {
  if (lastWordTimestamp === null) return false;
  return currentTimestamp - lastWordTimestamp <= COMBO_WINDOW_MS;
}

export function isWithinSpeedWindow(
  letterAppearedTimestamp: number,
  placedTimestamp: number,
): boolean {
  return placedTimestamp - letterAppearedTimestamp <= SPEED_BONUS_WINDOW_MS;
}
