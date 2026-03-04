import { useGame } from '../../context/GameContext';
import { pickInitialWord } from '../../engine/initialWordPicker';
import './StartScreen.css';

export function StartScreen() {
  const { dispatch, graph } = useGame();

  const handlePlay = () => {
    const word = pickInitialWord(graph);
    dispatch({
      type: 'START_GAME',
      payload: { initialWord: word.split('') },
    });
  };

  return (
    <div className="start-screen">
      <div className="start-screen__logo">
        <h1 className="start-screen__title">Letter</h1>
        <h1 className="start-screen__title start-screen__title--accent">Press</h1>
      </div>

      <p className="start-screen__tagline">Stack letters. Form words. Beat the clock.</p>

      <div className="start-screen__instructions">
        <div className="start-screen__rule">
          <span className="start-screen__rule-num">1</span>
          <span>New letters appear above your word</span>
        </div>
        <div className="start-screen__rule">
          <span className="start-screen__rule-num">2</span>
          <span>Click a position to stamp the letter down</span>
        </div>
        <div className="start-screen__rule">
          <span className="start-screen__rule-num">3</span>
          <span>Form valid words quickly for combo bonuses</span>
        </div>
        <div className="start-screen__rule">
          <span className="start-screen__rule-num">4</span>
          <span>Don't let 5 letters pile up — or it's game over</span>
        </div>
      </div>

      <button className="start-screen__play" onClick={handlePlay} type="button">
        PLAY
      </button>

      <div className="start-screen__hint">
        Press <kbd>1</kbd>-<kbd>5</kbd> to place letters with keyboard
      </div>
    </div>
  );
}
