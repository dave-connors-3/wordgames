import { useEffect, useRef } from 'react';
import type { GameAction } from '../types/game';

const TICK_INTERVAL = 100; // Update every 100ms for smooth timer bar
const GAME_DURATION = 30000;

export function useTimer(
  isPlaying: boolean,
  dispatch: React.Dispatch<GameAction>,
) {
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);

      dispatch({ type: 'TICK_TIMER', payload: { remaining } });

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        dispatch({ type: 'GAME_OVER', payload: { reason: 'time' } });
      }
    }, TICK_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, dispatch]);
}
