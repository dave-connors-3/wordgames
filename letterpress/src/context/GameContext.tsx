import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { GameState, GameAction, AdjacencyGraph } from '../types/game';
import { useGameState } from '../hooks/useGameState';
import { precomputeAdjacencyGraph } from '../engine/letterGenerator';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  graph: AdjacencyGraph;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useGameState();

  const graph = useMemo(() => precomputeAdjacencyGraph(), []);

  const value = useMemo(
    () => ({ state, dispatch, graph }),
    [state, dispatch, graph],
  );

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
