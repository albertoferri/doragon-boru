import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getAllCharacters } from '../services/api'
import BattleArena from '../components/BattleArena'
import DragonBallOrb from '../components/DragonBallOrb'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHandFist, faBolt, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function BattleArenaPage() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fighter1, setFighter1] = useState(null)
  const [fighter2, setFighter2] = useState(null)
  const [search1, setSearch1] = useState('')
  const [search2, setSearch2] = useState('')
  const [step, setStep] = useState('select')

  useEffect(() => {
    getAllCharacters()
      .then(data => {
        const items = data.items || data
        setCharacters(items)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered1 = characters.filter(c =>
    c.name.toLowerCase().includes(search1.toLowerCase()) && c.id !== fighter2?.id
  )
  const filtered2 = characters.filter(c =>
    c.name.toLowerCase().includes(search2.toLowerCase()) && c.id !== fighter1?.id
  )

  const handleReset = () => {
    setFighter1(null)
    setFighter2(null)
    setSearch1('')
    setSearch2('')
    setStep('select')
  }

  if (loading) return <Loader text="Loading fighters..." />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-black text-white mb-2 flex items-center justify-center gap-3">
          <FontAwesomeIcon icon={faHandFist} className="text-blue-400" /> Battle Arena
        </h1>
        <p className="text-neutral-400">Select two fighters and let the battle begin</p>
      </motion.div>

      <DragonBallOrb />

      {step === 'select' ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: 'Fighter 1', fighter: fighter1, setFighter: setFighter1, search: search1, setSearch: setSearch1, filtered: filtered1, color: 'blue' },
              { label: 'Fighter 2', fighter: fighter2, setFighter: setFighter2, search: search2, setSearch: setSearch2, filtered: filtered2, color: 'purple' },
            ].map(({ label, fighter, setFighter, search, setSearch, filtered }) => (
              <div key={label} className="card-base p-4">
                <h3 className="font-bold text-white mb-3">{label}</h3>
                {fighter ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-700/50"
                  >
                    <img src={fighter.image} alt={fighter.name} className="w-14 h-14 rounded-full object-cover object-top border-2 border-neutral-600" onError={e => { e.target.src = 'https://via.placeholder.com/56/262626/666?text=?' }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{fighter.name}</p>
                      <p className="text-xs text-neutral-400">{fighter.race}</p>
                      <p className="text-xs text-yellow-400 flex items-center gap-1">
                        <FontAwesomeIcon icon={faBolt} className="text-xs" /> {fighter.ki || 'Unknown'}
                      </p>
                    </div>
                    <button onClick={() => setFighter(null)} className="text-neutral-500 hover:text-white text-lg">
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </motion.div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search fighter..."
                      className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 mb-2"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {filtered.slice(0, 20).map(c => (
                        <button
                          key={c.id}
                          onClick={() => { setFighter(c); setSearch('') }}
                          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-700 transition-colors text-left"
                        >
                          <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full object-cover object-top" onError={e => { e.target.src = 'https://via.placeholder.com/32/262626/666?text=?' }} />
                          <div className="min-w-0">
                            <p className="text-white text-sm truncate">{c.name}</p>
                            <p className="text-neutral-500 text-xs">{c.race}</p>
                          </div>
                        </button>
                      ))}
                      {filtered.length === 0 && (
                        <p className="text-neutral-500 text-sm text-center py-4">No fighters found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {fighter1 && fighter2 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setStep('battle')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 to-purple-700 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faHandFist} /> Enter the Arena
            </motion.button>
          )}
        </div>
      ) : (
        <BattleArena fighter1={fighter1} fighter2={fighter2} onReset={handleReset} />
      )}
    </div>
  )
}
