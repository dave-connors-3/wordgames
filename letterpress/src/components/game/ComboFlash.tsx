import './ComboFlash.css';

interface ComboFlashProps {
  points: number;
  multiplier: number;
}

export function ComboFlash({ points, multiplier }: ComboFlashProps) {
  return (
    <div className="combo-flash" key={`${points}-${Date.now()}`}>
      <span className="combo-flash__points">+{points}</span>
      {multiplier > 1 && (
        <span className="combo-flash__multiplier">{multiplier.toFixed(1)}x</span>
      )}
    </div>
  );
}
