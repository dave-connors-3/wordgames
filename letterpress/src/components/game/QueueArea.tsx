import type { LetterTile as LetterTileType } from '../../types/game';
import { LetterTile } from './LetterTile';
import './QueueArea.css';

interface QueueAreaProps {
  queue: LetterTileType[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function QueueArea({ queue, selectedIndex, onSelect }: QueueAreaProps) {
  const urgency = queue.length >= 4 ? 'urgent' : queue.length >= 3 ? 'warning' : '';

  return (
    <div className="queue-area" role="group" aria-label="Letter queue">
      <div className="queue-area__label">
        <span>Incoming</span>
        {queue.length > 0 && (
          <span className={`queue-area__count ${urgency ? `queue-area__count--${urgency}` : ''}`}>
            {queue.length}/5
          </span>
        )}
      </div>
      <div className="queue-area__tiles">
        {queue.length === 0 ? (
          <div className="queue-area__empty">Waiting for letters...</div>
        ) : (
          queue.map((tile, i) => (
            <LetterTile
              key={tile.id}
              letter={tile.letter}
              selected={i === selectedIndex}
              onClick={() => onSelect(i)}
              ariaLabel={`Queue letter ${tile.letter.toUpperCase()}${i === selectedIndex ? ', selected' : ''}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
