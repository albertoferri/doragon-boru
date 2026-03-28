import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getPlanets, getAllCharacters } from '../services/api'
import PlanetBattle from '../components/PlanetBattle'
import DragonBallOrb from '../components/DragonBallOrb'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faFire, faSkull, faCircleCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function PlanetBattlePage() {
  const [planets, setPlanets] = useState([])
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [planet1, setPlanet1] = useState(null)
  const [planet2, setPlanet2] = useState(null)
  const [step, setStep] = useState('select')

  useEffect(() => {
    Promise.all([getPlanets(), getAllCharacters()])
      .then(([pData, cData]) => {
        setPlanets(pData.items || pData)
        setCharacters(cData.items || cData)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleReset = () => {
    setPlanet1(null)
    setPlanet2(null)
    setStep('select')
  }

  if (loading) return <Loader text="Loading planet data..." />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-black text-white mb-2 flex items-center justify-center gap-3">
          <FontAwesomeIcon icon={faGlobe} className="text-purple-400" />
          <FontAwesomeIcon icon={faFire} className="text-red-400" />
          Planet Battle
        </h1>
        <p className="text-neutral-400">Which planet dominates? Combined KI determines the victor.</p>
      </motion.div>

      <DragonBallOrb />

      {step === 'select' ? (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: 'Planet 1', planet: planet1, setPlanet: setPlanet1, other: planet2 },
              { label: 'Planet 2', planet: planet2, setPlanet: setPlanet2, other: planet1 },
            ].map(({ label, planet, setPlanet, other }) => (
              <div key={label} className="card-base p-4">
                <h3 className="font-bold text-white mb-3">{label}</h3>
                {planet ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="h-28 rounded-lg overflow-hidden mb-3">
                      <img src={planet.image} alt={planet.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://via.placeholder.com/400x200/262626/666?text=?' }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white">{planet.name}</p>
                        <span className={`text-xs flex items-center gap-1 ${planet.isDestroyed ? 'text-red-400' : 'text-green-400'}`}>
                          <FontAwesomeIcon icon={planet.isDestroyed ? faSkull : faCircleCheck} className="text-xs" />
                          {planet.isDestroyed ? ' Destroyed' : ' Alive'}
                        </span>
                      </div>
                      <button onClick={() => setPlanet(null)} className="text-neutral-500 hover:text-white text-lg">
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {planets.filter(p => p.id !== other?.id).map(p => (
                      <button
                        key={p.id}
                        onClick={() => setPlanet(p)}
                        className="flex flex-col items-center p-2 rounded-lg hover:bg-neutral-700 transition-colors"
                      >
                        <img src={p.image} alt={p.name} className="w-full h-16 object-cover rounded-md mb-1" onError={e => { e.target.src = 'https://via.placeholder.com/100x60/262626/666?text=?' }} />
                        <p className="text-white text-xs font-medium text-center truncate w-full">{p.name}</p>
                        <span className={`text-xs ${p.isDestroyed ? 'text-red-400' : 'text-green-400'}`}>
                          <FontAwesomeIcon icon={p.isDestroyed ? faSkull : faCircleCheck} className="text-xs" />
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {planet1 && planet2 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setStep('battle')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-700 to-red-700 text-white font-bold text-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faGlobe} />
              <FontAwesomeIcon icon={faFire} />
              Start Planet War!
            </motion.button>
          )}
        </div>
      ) : (
        <PlanetBattle planet1={planet1} planet2={planet2} characters={characters} onReset={handleReset} />
      )}
    </div>
  )
}
