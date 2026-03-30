import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Planets from './pages/Planets'
import PlanetDetail from './pages/PlanetDetail'
import CharacterDetail from './pages/CharacterDetail'
import BattleArenaPage from './pages/BattleArenaPage'
import PlanetBattlePage from './pages/PlanetBattlePage'
import QuizMode from './pages/QuizMode'
import Favorites from './pages/Favorites'
import ErrorBoundary from './components/ErrorBoundary'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-900">
      <Navbar />
      <main className="pt-16">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/characters" element={<Home />} />
            <Route path="/planets" element={<Planets />} />
            <Route path="/planets/:id" element={<PlanetDetail />} />
            <Route path="/characters/:id" element={<CharacterDetail />} />
            <Route path="/battle" element={<BattleArenaPage />} />
            <Route path="/planet-battle" element={<PlanetBattlePage />} />
            <Route path="/quiz" element={<QuizMode />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </div>
  )
}
