import { useGame } from '../../context/GameContext';
import './ResultsScreen.css';

export function ResultsScreen() {
  const { state, dispatch } = useGame();

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <div className="results-screen">
      <div className="results-screen__header">
        <h2 className="results-screen__title">
          {state.gameOverReason === 'overflow' ? 'Overflow!' : 'Time\'s Up!'}
        </h2>
        <p className="results-screen__subtitle">
          {state.gameOverReason === 'overflow'
            ? 'Too many letters piled up'
            : 'The clock ran out'}
        </p>
      </div>

      <div className="results-screen__score">
        <span className="results-screen__score-label">Final Score</span>
        <span className="results-screen__score-value">{state.score.toLocaleString()}</span>
      </div>

      <div className="results-screen__stats">
        <div className="results-screen__stat">
          <span className="results-screen__stat-value">{state.wordsFormed.length}</span>
          <span className="results-screen__stat-label">Words</span>
        </div>
        <div className="results-screen__stat">
          <span className="results-screen__stat-value">{state.bestCombo}</span>
          <span className="results-screen__stat-label">Best Combo</span>
        </div>
      </div>

      {state.wordsFormed.length > 0 && (
        <div className="results-screen__words">
          <span className="results-screen__words-label">Word chain</span>
          <div className="results-screen__chain">
            {state.wordsFormed.map((word, i) => {
              const prev = i > 0 ? state.wordsFormed[i - 1] : null;
              return (
                <div key={i} className="results-screen__chain-item">
                  {i > 0 && <span className="results-screen__chain-arrow">↓</span>}
                  <span className="results-screen__word">
                    {word.split('').map((ch, j) => (
                      <span
                        key={j}
                        className={prev && prev[j] !== ch ? 'results-screen__word-changed' : ''}
                      >
                        {ch.toUpperCase()}
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button className="results-screen__play-again" onClick={handlePlayAgain} type="button">
        PLAY AGAIN
      </button>
    </div>
  );
}
