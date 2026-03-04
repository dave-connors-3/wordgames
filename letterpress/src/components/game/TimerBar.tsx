import './TimerBar.css';

const GAME_DURATION = 30000;

interface TimerBarProps {
  timeRemaining: number;
}

export function TimerBar({ timeRemaining }: TimerBarProps) {
  const progress = timeRemaining / GAME_DURATION;
  const isLow = timeRemaining <= 10000;
  const isCritical = timeRemaining <= 5000;
  const seconds = Math.ceil(timeRemaining / 1000);

  return (
    <div className="timer-bar" role="timer" aria-label={`${seconds} seconds remaining`}>
      <div className="timer-bar__track">
        <div
          className={`timer-bar__fill ${isLow ? 'timer-bar__fill--low' : ''} ${isCritical ? 'timer-bar__fill--critical' : ''}`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span
        className={`timer-bar__time ${isCritical ? 'timer-bar__time--critical' : ''}`}
      >
        {seconds}s
      </span>
    </div>
  );
}
