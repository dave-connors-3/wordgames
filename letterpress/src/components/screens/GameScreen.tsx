import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { useTimer } from '../../hooks/useTimer';
import { useLetterGenerator } from '../../hooks/useLetterGenerator';
import { isValidWord } from '../../engine/wordValidator';
import { letterHasValidPlacement } from '../../engine/letterGenerator';
import { calculateWordScore, getComboMultiplier, isWithinComboWindow, isWithinSpeedWindow } from '../../engine/scoring';
import { TimerBar } from '../game/TimerBar';
import { ScoreDisplay } from '../game/ScoreDisplay';
import { QueueArea } from '../game/QueueArea';
import { WordSlots } from '../game/WordSlots';
import './GameScreen.css';

export function GameScreen() {
  const { state, dispatch, graph } = useGame();
  const isPlaying = state.phase === 'playing';
  const [lastWordFlash, setLastWordFlash] = useState<string | null>(null);

  useTimer(isPlaying, dispatch);
  useLetterGenerator(
    isPlaying,
    state.currentWord,
    state.usedWords,
    state.lettersGenerated,
    state.queue.length,
    graph,
    dispatch,
  );

  // Store current word as ref for keyboard handler
  const stateRef = useRef(state);
  stateRef.current = state;

  const handleSlotClick = useCallback(
    (position: number): boolean => {
      const s = stateRef.current;
      if (s.selectedQueueIndex === null) return false;

      const selectedTile = s.queue[s.selectedQueueIndex];
      if (!selectedTile) return false;

      // Build the new word
      const newWord = [...s.currentWord];
      newWord[position] = selectedTile.letter;
      const wordStr = newWord.join('');

      // Check if valid and not already used
      if (!isValidWord(wordStr) || s.usedWords.has(wordStr)) {
        dispatch({ type: 'WORD_INVALID' });
        return false;
      }

      // Place the letter first
      dispatch({ type: 'PLACE_LETTER', payload: { position } });

      // Calculate score
      const now = Date.now();
      const isCombo = isWithinComboWindow(s.lastWordTimestamp, now);
      const newComboCount = isCombo ? s.comboCount + 1 : 0;
      const multiplier = getComboMultiplier(newComboCount);
      const speedBonus = isWithinSpeedWindow(selectedTile.timestamp, now);
      const score = calculateWordScore(wordStr, multiplier, speedBonus);

      dispatch({
        type: 'WORD_VALID',
        payload: { word: wordStr, score, timestamp: now },
      });

      // Clean stale queue letters that no longer have valid placements
      const remainingQueue = s.queue.filter((_, i) => i !== s.selectedQueueIndex);
      const newUsedWords = new Set([...s.usedWords, wordStr]);
      const validTileIds = new Set(
        remainingQueue
          .filter(t => letterHasValidPlacement(t.letter, wordStr, newUsedWords, graph))
          .map(t => t.id),
      );
      if (validTileIds.size < remainingQueue.length) {
        dispatch({ type: 'CLEAN_QUEUE', payload: { validTileIds } });
      }

      setLastWordFlash(wordStr.toUpperCase());
      setTimeout(() => setLastWordFlash(null), 600);

      return true;
    },
    [dispatch, graph],
  );

  const handleSelectQueue = useCallback(
    (index: number) => {
      dispatch({ type: 'SELECT_QUEUE_LETTER', payload: { index } });
    },
    [dispatch],
  );

  // Keyboard shortcuts: 1-5 to place letter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5) {
        handleSlotClick(num - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSlotClick]);

  return (
    <div className="game-screen">
      <div className="game-screen__header">
        <ScoreDisplay
          score={state.score}
          comboCount={state.comboCount}
          comboMultiplier={state.comboMultiplier}
        />
      </div>

      <TimerBar timeRemaining={state.timeRemaining} />

      <div className="game-screen__play-area">
        <QueueArea
          queue={state.queue}
          selectedIndex={state.selectedQueueIndex}
          onSelect={handleSelectQueue}
        />

        <div className="game-screen__word-container">
          {lastWordFlash && (
            <div className="game-screen__word-flash" key={lastWordFlash}>
              {lastWordFlash}
            </div>
          )}
          <WordSlots
            currentWord={state.currentWord}
            onSlotClick={handleSlotClick}
          />
        </div>

        <div className="game-screen__current-word">
          {state.currentWord.join('').toUpperCase()}
        </div>
      </div>

      <div className="game-screen__word-count">
        {state.wordsFormed.length} word{state.wordsFormed.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
