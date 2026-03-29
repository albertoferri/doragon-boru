import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPlanets, getPlanetById } from '../services/api'
import PlanetBattle from '../components/PlanetBattle'
import DragonBallOrb from '../components/DragonBallOrb'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faFire, faSkull, faCircleCheck, faXmark, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'

function Starfield({ seed = 1 }) {
  const stars = Array.from({ length: 50 }, (_, i) => {
    const n = (seed * 31 + i * 137 + i * 7) & 0xffff
    return { x: n % 100, y: (n * 7 + i * 13) % 100, r: (n % 3) * 0.3 + 0.2, op: 0.15 + (n % 5) * 0.08 }
  })
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.op} />)}
    </svg>
  )
}

function SlotPanel({ planet, selecting, slot, onClear }) {
  const isBlue = slot === 1
  const color = isBlue ? '#3b82f6' : '#ef4444'
  const colorDim = isBlue ? 'rgba(59,130,246,0.25)' : 'rgba(239,68,68,0.25)'
  const label = isBlue ? 'P1' : 'P2'

  return (
    <motion.div
      className="flex-1 relative overflow-hidden rounded-xl"
      style={{
        background: isBlue ? '#04080f' : '#0f0404',
        border: `2px solid ${planet ? color : colorDim}`,
      }}
      animate={selecting ? {
        boxShadow: [`0 0 12px ${colorDim}`, `0 0 36px ${color}66`, `0 0 12px ${colorDim}`],
      } : { boxShadow: planet ? `0 0 16px ${colorDim}` : 'none' }}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
    >
      <div className={`absolute top-2 z-10 ${isBlue ? 'left-2' : 'right-2'}`}>
        <span className="text-xs font-black tracking-widest px-2 py-0.5 rounded" style={{ background: color, color: '#fff' }}>
          {label}
        </span>
      </div>

      {planet ? (
        <>
          <img
            src={planet.image}
            alt={planet.name}
            className="w-full h-full object-cover"
            onError={e => { e.target.src = 'https://via.placeholder.com/400x320/0d0d1a/6666aa?text=?' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.04) 50%, transparent 100%)' }} />

          <div className={`absolute bottom-2 left-2 right-2 ${!isBlue ? 'text-right' : ''}`}>
            <p className="text-white font-black text-sm uppercase tracking-wide truncate">{planet.name}</p>
            <div className={`flex items-center gap-1 flex-wrap mt-1 ${!isBlue ? 'justify-end' : ''}`}>
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 ${
                planet.isDestroyed
                  ? 'bg-red-900/70 text-red-400 border border-red-800/50'
                  : 'bg-green-900/70 text-green-400 border border-green-800/50'
              }`}>
                <FontAwesomeIcon icon={planet.isDestroyed ? faSkull : faCircleCheck} className="text-[8px]" />
                {planet.isDestroyed ? 'Distrutto' : 'Esistente'}
              </span>
              {planet.isDestroyed && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                  style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                  −40% KI
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClear}
            className="absolute top-2 z-20 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            style={{ [isBlue ? 'right' : 'left']: '8px' }}
          >
            <FontAwesomeIcon icon={faXmark} className="text-xs" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-2">
          <Starfield seed={slot * 99} />
          <FontAwesomeIcon icon={faGlobe} className="text-4xl" style={{ color: colorDim }} />
          <p className="text-xs font-black tracking-widest uppercase" style={{ color: colorDim }}>
            {selecting ? '▶ SCEGLI ◀' : 'VUOTO'}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default function PlanetBattlePage() {
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [planet1, setPlanet1] = useState(null)
  const [planet2, setPlanet2] = useState(null)
  const [selecting, setSelecting] = useState(1)
  const [battleStarted, setBattleStarted] = useState(false)
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState(null)
  const [showGrid, setShowGrid] = useState(true)

  useEffect(() => {
    getPlanets()
      .then(pData => {
        const list = pData.items || pData
        return Promise.allSettled(list.map(p => getPlanetById(p.id)))
      })
      .then(results => {
        const withChars = results
          .filter(r => r.status === 'fulfilled' && (r.value.characters?.length ?? 0) > 0)
          .map(r => r.value)
        setPlanets(withChars)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (planet) => {
    if (planet1?.id === planet.id || planet2?.id === planet.id) return
    if (selecting === 1) {
      setPlanet1(planet)
      setSelecting(2)
    } else if (selecting === 2) {
      setPlanet2(planet)
      setSelecting(null)
      setShowGrid(false)
    }
  }

  const handleReset = () => {
    setPlanet1(null)
    setPlanet2(null)
    setSelecting(1)
    setBattleStarted(false)
    setShowGrid(true)
  }

  if (loading) return <Loader text="Caricamento dati pianeti..." />
  if (error) return <ErrorMessage message={error} />

  if (battleStarted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PlanetBattle planet1={planet1} planet2={planet2} onReset={handleReset} />
      </div>
    )
  }

  const bothSelected = planet1 && planet2
  const filtered = planets.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #0d0025 0%, #050010 50%, #020008 100%)' }}>
      <DragonBallOrb />

      {/* Title */}
      <div className="pt-5 pb-3 text-center shrink-0">
        <h1
          className="text-2xl font-black tracking-[0.2em] uppercase"
          style={{ color: '#c084fc', textShadow: '0 0 24px rgba(192,132,252,0.7), 0 0 48px rgba(192,132,252,0.3)' }}
        >
          <FontAwesomeIcon icon={faGlobe} className="mr-2 text-purple-400" />
          Planet Battle
          <FontAwesomeIcon icon={faFire} className="ml-2 text-red-400" />
        </h1>
      </div>

      {/* Inner wrapper */}
      <div className="flex flex-col flex-1 min-h-0 max-w-7xl mx-auto w-full px-4">

        {/* VS Panels — expand when grid is hidden */}
        <div
          className="flex items-stretch gap-2 mb-3 shrink-0"
          style={{
            height: (bothSelected && !showGrid) ? 'calc(100dvh - 255px)' : '260px',
            minHeight: '260px',
            transition: 'height 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <SlotPanel
            planet={planet1}
            selecting={selecting === 1}
            slot={1}
            onClear={() => { setPlanet1(null); setSelecting(1); setShowGrid(true) }}
          />

          <div className="flex flex-col items-center justify-center shrink-0 px-1" style={{ width: '40px' }}>
            <motion.span
              className="font-black text-2xl"
              style={{ color: '#ff6600', textShadow: '0 0 16px rgba(255,100,0,0.9)', writingMode: 'vertical-rl', letterSpacing: '0.15em' }}
              animate={{ textShadow: ['0 0 10px rgba(255,100,0,0.5)', '0 0 28px rgba(255,100,0,1)', '0 0 10px rgba(255,100,0,0.5)'] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              VS
            </motion.span>
          </div>

          <SlotPanel
            planet={planet2}
            selecting={selecting === 2}
            slot={2}
            onClear={() => { setPlanet2(null); setSelecting(planet1 ? 2 : 1); setShowGrid(true) }}
          />
        </div>

        {/* Start button / hint */}
        <div className="mb-2 shrink-0">
          <AnimatePresence mode="wait">
            {bothSelected ? (
              <motion.button
                key="start"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setBattleStarted(true)}
                className="w-full py-3 rounded-xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 text-white"
                style={{
                  background: 'linear-gradient(90deg, #6d00ff 0%, #cc0000 100%)',
                  boxShadow: '0 0 30px rgba(140,0,255,0.5)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 45px rgba(140,0,255,0.8)' }}
                whileTap={{ scale: 0.97 }}
              >
                <FontAwesomeIcon icon={faGlobe} />
                <FontAwesomeIcon icon={faFire} />
                INIZIA LA GUERRA!
              </motion.button>
            ) : (
              <motion.div
                key={`sel-${selecting}`}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p
                  className="text-sm font-black tracking-widest uppercase"
                  style={{ color: selecting === 1 ? '#3b82f6' : '#ef4444' }}
                >
                  {selecting === 1 ? '▶  Seleziona il Pianeta 1  ◀' : '▶  Seleziona il Pianeta 2  ◀'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle grid button — only when both selected */}
        <AnimatePresence>
          {bothSelected && (
            <motion.button
              key="toggle-grid"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGrid(v => !v)}
              className="mb-2 w-full py-2 rounded-xl text-xs font-bold uppercase tracking-widest shrink-0 flex items-center justify-center gap-2"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.45)',
              }}
            >
              <FontAwesomeIcon icon={showGrid ? faChevronUp : faChevronDown} className="text-[10px]" />
              {showGrid ? 'Nascondi Griglia' : 'Modifica Selezione'}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Grid — collapses when both selected and hidden */}
        <AnimatePresence>
          {showGrid && (
            <motion.div
              key="grid-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="mb-2 shrink-0">
                <input
                  type="text"
                  placeholder="Cerca pianeta..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-sm text-white placeholder-neutral-600 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div className="flex-1 overflow-y-auto pb-24">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 overflow-hidden p-6 lg:grid-cols-5 gap-3">
                  {filtered.map((p) => {
                    const isP1 = planet1?.id === p.id
                    const isP2 = planet2?.id === p.id
                    const isSelected = isP1 || isP2
                    const isDisabled = isSelected || (bothSelected && !isSelected)
                    const isHovered = hoveredId === p.id && !isDisabled

                    return (
                      <motion.button
                        key={p.id}
                        onClick={() => handleSelect(p)}
                        disabled={isDisabled}
                        onMouseEnter={() => !isDisabled && setHoveredId(p.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        whileHover={!isDisabled ? { scale: 1.03 } : {}}
                        whileTap={!isDisabled ? { scale: 0.94 } : {}}
                        className="relative flex flex-col overflow-hidden rounded-lg"
                        style={{
                          border: isP1 ? '2px solid #3b82f6'
                            : isP2 ? '2px solid #ef4444'
                            : isHovered ? '2px solid rgba(167,139,250,0.7)'
                            : '2px solid rgba(255,255,255,0.07)',
                          boxShadow: isP1 ? '0 0 16px rgba(59,130,246,0.65)'
                            : isP2 ? '0 0 16px rgba(239,68,68,0.65)'
                            : isHovered ? '0 0 24px rgba(139,92,246,0.65), 0 0 48px rgba(139,92,246,0.25)'
                            : '0 2px 8px rgba(0,0,0,0.5)',
                          opacity: isDisabled && !isSelected ? 0.35 : 1,
                          background: '#07070f',
                          cursor: isDisabled ? 'default' : 'pointer',
                          transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                        }}
                      >
                        <div className="relative" style={{ height: '160px' }}>
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://via.placeholder.com/200x160/0d0d1a/6666aa?text=?' }}
                          />
                          {/* Destroyed tint */}
                          {p.isDestroyed && !isSelected && (
                            <div className="absolute inset-0" style={{ background: 'rgba(120,0,0,0.35)' }} />
                          )}
                          {/* Bottom gradient */}
                          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,7,15,0.85) 0%, transparent 50%)' }} />

                          {/* Selected overlay */}
                          {isSelected && (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ background: isP1 ? 'rgba(59,130,246,0.35)' : 'rgba(239,68,68,0.35)' }}
                            >
                              <span
                                className="font-black text-2xl"
                                style={{ color: isP1 ? '#3b82f6' : '#ef4444', textShadow: '0 0 14px currentColor' }}
                              >
                                {isP1 ? 'P1' : 'P2'}
                              </span>
                            </div>
                          )}

                          {/* Destroyed skull */}
                          {p.isDestroyed && !isSelected && (
                            <div className="absolute top-1 right-1">
                              <FontAwesomeIcon icon={faSkull} className="text-red-400" style={{ fontSize: '10px', opacity: 0.85 }} />
                            </div>
                          )}
                        </div>

                        <div className="px-1 py-1" style={{ background: 'rgba(0,0,0,0.8)' }}>
                          <p className="text-white text-xs font-bold truncate text-center leading-tight">{p.name}</p>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
