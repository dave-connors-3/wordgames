import { useState } from 'react';
import './LetterTile.css';

export type TileAnimState = 'idle' | 'pressing' | 'invalid' | 'entering' | 'ink';

interface LetterTileProps {
  letter: string;
  animState?: TileAnimState;
  selected?: boolean;
  onClick?: () => void;
  delay?: number;
  ariaLabel?: string;
}

export function LetterTile({
  letter,
  animState: externalAnimState,
  selected = false,
  onClick,
  delay = 0,
  ariaLabel,
}: LetterTileProps) {
  const [internalAnim, setInternalAnim] = useState<TileAnimState>('idle');
  const animState = externalAnimState ?? internalAnim;

  const className = [
    'letter-tile',
    animState !== 'idle' ? `letter-tile--${animState}` : '',
    selected ? 'letter-tile--selected' : '',
    onClick ? 'letter-tile--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={className}
      onClick={onClick}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
      onAnimationEnd={() => setInternalAnim('idle')}
      aria-label={ariaLabel ?? `Letter ${letter.toUpperCase()}`}
      disabled={!onClick}
      type="button"
    >
      {letter.toUpperCase()}
    </button>
  );
}
