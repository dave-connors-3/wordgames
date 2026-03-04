import './ScoreDisplay.css';

interface ScoreDisplayProps {
  score: number;
  comboCount: number;
  comboMultiplier: number;
}

export function ScoreDisplay({ score, comboCount, comboMultiplier }: ScoreDisplayProps) {
  return (
    <div className="score-display">
      <div className="score-display__score" aria-live="polite">
        {score.toLocaleString()}
      </div>
      {comboCount > 0 && (
        <div className="score-display__combo" key={comboCount}>
          {comboMultiplier.toFixed(1)}x combo
        </div>
      )}
    </div>
  );
}
