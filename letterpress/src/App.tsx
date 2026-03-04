import { GameProvider } from './context/GameContext'
import { useGame } from './context/GameContext'
import { StartScreen } from './components/screens/StartScreen'
import { GameScreen } from './components/screens/GameScreen'
import { ResultsScreen } from './components/screens/ResultsScreen'
import './App.css'

function GameRouter() {
  const { state } = useGame()

  switch (state.phase) {
    case 'start':
      return <StartScreen />
    case 'playing':
      return <GameScreen />
    case 'ended':
      return <ResultsScreen />
  }
}

function App() {
  return (
    <GameProvider>
      <div className="app">
        <GameRouter />
      </div>
    </GameProvider>
  )
}

export default App
