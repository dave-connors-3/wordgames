import { useState, useCallback } from 'react';
import { LetterTile, type TileAnimState } from './LetterTile';
import './WordSlots.css';

interface WordSlotsProps {
  currentWord: string[];
  onSlotClick: (position: number) => boolean; // returns true if valid placement
}

export function WordSlots({ currentWord, onSlotClick }: WordSlotsProps) {
  const [slotAnims, setSlotAnims] = useState<TileAnimState[]>(
    Array(5).fill('idle'),
  );

  const handleClick = useCallback(
    (position: number) => {
      const isValid = onSlotClick(position);
      setSlotAnims(prev => {
        const next = [...prev];
        next[position] = isValid ? 'pressing' : 'invalid';
        return next;
      });
    },
    [onSlotClick],
  );

  const handleAnimEnd = useCallback((position: number) => {
    setSlotAnims(prev => {
      const next = [...prev];
      // After press animation, show ink spread briefly
      if (next[position] === 'pressing') {
        next[position] = 'ink';
      } else {
        next[position] = 'idle';
      }
      return next;
    });
  }, []);

  return (
    <div className="word-slots" role="group" aria-label="Current word">
      {currentWord.map((letter, i) => (
        <div
          key={i}
          className={`word-slot ${slotAnims[i] !== 'idle' ? `word-slot--${slotAnims[i]}` : ''}`}
          onAnimationEnd={() => handleAnimEnd(i)}
        >
          <LetterTile
            letter={letter}
            animState={slotAnims[i]}
            onClick={() => handleClick(i)}
            ariaLabel={`Position ${i + 1}: letter ${letter.toUpperCase()}`}
          />
          <span className="word-slot__number">{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
