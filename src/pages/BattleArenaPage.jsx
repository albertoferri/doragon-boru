import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllCharacters } from '../services/api'
import BattleArena from '../components/BattleArena'
import DragonBallOrb from '../components/DragonBallOrb'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TypewriterText from '../components/TypewriterText'
import { faHandFist, faXmark, faUser, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { getRaceBadgeStyle } from '../utils/helpers'

const RACE_AURA = {
  'Saiyan':       'rgba(250,204,21,0.8)',
  'Human':        'rgba(59,130,246,0.8)',
  'Namekian':     'rgba(34,197,94,0.8)',
  'Frieza Race':  'rgba(167,139,250,0.8)',
  'Android':      'rgba(34,211,238,0.8)',
  'Majin':        'rgba(244,114,182,0.8)',
  'God':          'rgba(251,191,36,0.8)',
  'Angel':        'rgba(255,255,255,0.7)',
}
const getRaceAura = (race) => RACE_AURA[race] || 'rgba(99,102,241,0.7)'

function SlotPanel({ fighter, selecting, slot, onClear }) {
  const isBlue = slot === 1
  const color = isBlue ? '#3b82f6' : '#ef4444'
  const colorDim = isBlue ? 'rgba(59,130,246,0.25)' : 'rgba(239,68,68,0.25)'
  const label = isBlue ? 'P1' : 'P2'

  return (
    <motion.div
      className="flex-1 relative overflow-hidden rounded-xl"
      style={{
        background: isBlue ? '#04080f' : '#0f0404',
        border: `2px solid ${fighter ? color : colorDim}`,
      }}
      animate={selecting ? {
        boxShadow: [`0 0 12px ${colorDim}`, `0 0 36px ${color}66`, `0 0 12px ${colorDim}`],
      } : { boxShadow: fighter ? `0 0 16px ${colorDim}` : 'none' }}
      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
    >
      <div className={`absolute top-2 z-10 ${isBlue ? 'left-2' : 'right-2'}`}>
        <span className="text-xs font-black tracking-widest px-2 py-0.5 rounded" style={{ background: color, color: '#fff' }}>
          {label}
        </span>
      </div>

      {fighter ? (
        <>
          <img
            src={fighter.image}
            alt={fighter.name}
            className="w-full h-full object-cover object-top"
            onError={e => { e.target.src = 'https://via.placeholder.com/400x320/0d0d1a/666?text=?' }}
          />
          {/* Race aura tint */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at bottom, ${getRaceAura(fighter.race).replace('0.8', '0.3')} 0%, transparent 65%)`,
          }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.04) 50%, transparent 100%)' }} />

          <div className={`absolute bottom-2 left-2 right-2 ${!isBlue ? 'text-right' : ''}`}>
            <p className="text-white font-black text-sm uppercase tracking-wide truncate">{fighter.name}</p>
            <div className={`flex items-center gap-1 flex-wrap mt-1 ${!isBlue ? 'justify-end' : ''}`}>
              {fighter.race && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${getRaceBadgeStyle(fighter.race)}`}>
                  {fighter.race}
                </span>
              )}
              {fighter.ki && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold font-mono"
                  style={{ background: 'rgba(234,179,8,0.18)', color: '#fbbf24', border: '1px solid rgba(234,179,8,0.35)' }}>
                  ⚡{fighter.ki.length > 10 ? fighter.ki.slice(0, 10) + '…' : fighter.ki}
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
          <FontAwesomeIcon icon={faUser} className="text-4xl" style={{ color: colorDim }} />
          <p className="text-xs font-black tracking-widest uppercase" style={{ color: colorDim }}>
            {selecting ? '▶ SCEGLI ◀' : 'VUOTO'}
          </p>
        </div>
      )}
    </motion.div>
  )
}

export default function BattleArenaPage() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fighter1, setFighter1] = useState(null)
  const [fighter2, setFighter2] = useState(null)
  const [selecting, setSelecting] = useState(1)
  const [battleStarted, setBattleStarted] = useState(false)
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState(null)
  const [showGrid, setShowGrid] = useState(true)

  useEffect(() => {
    getAllCharacters()
      .then(data => setCharacters(data.items || data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (c) => {
    if (fighter1?.id === c.id || fighter2?.id === c.id) return
    if (selecting === 1) {
      setFighter1(c)
      setSelecting(2)
    } else if (selecting === 2) {
      setFighter2(c)
      setSelecting(null)
      setShowGrid(false)
    }
  }

  const handleReset = () => {
    setFighter1(null)
    setFighter2(null)
    setSelecting(1)
    setBattleStarted(false)
    setSearch('')
    setShowGrid(true)
  }

  if (loading) return <Loader text="Caricamento combattenti..." />
  if (error) return <ErrorMessage message={error} />

  if (battleStarted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BattleArena fighter1={fighter1} fighter2={fighter2} onReset={handleReset} />
      </div>
    )
  }

  const bothSelected = fighter1 && fighter2

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #001525 0%, #000d18 50%, #000508 100%)' }}>
      <DragonBallOrb />

      {/* Title */}
      <div className="pt-5 pb-3 text-center shrink-0">
        <h1
          className="text-2xl font-black tracking-[0.2em] uppercase"
          style={{ color: '#60a5fa', textShadow: '0 0 24px rgba(96,165,250,0.7), 0 0 48px rgba(96,165,250,0.3)' }}
        >
          <FontAwesomeIcon icon={faHandFist} className="mr-2" />
          <TypewriterText text="Battle Arena" speed={55} />
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
            fighter={fighter1}
            selecting={selecting === 1}
            slot={1}
            onClear={() => { setFighter1(null); setSelecting(1); setShowGrid(true) }}
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
            fighter={fighter2}
            selecting={selecting === 2}
            slot={2}
            onClear={() => { setFighter2(null); setSelecting(fighter1 ? 2 : 1); setShowGrid(true) }}
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
                className="mx-auto px-12 py-3 rounded-xl font-black text-lg uppercase tracking-widest flex items-center gap-3 text-white"
                style={{
                  background: 'linear-gradient(90deg, #1d4ed8 0%, #7c3aed 50%, #b91c1c 100%)',
                  boxShadow: '0 0 30px rgba(59,130,246,0.4)',
                }}
                whileHover={{ scale: 1.02, boxShadow: '0 0 45px rgba(59,130,246,0.7)' }}
                whileTap={{ scale: 0.97 }}
              >
                <FontAwesomeIcon icon={faHandFist} />
                ENTRA NELL'ARENA!
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
                <p className="text-sm font-black tracking-widest uppercase"
                  style={{ color: selecting === 1 ? '#3b82f6' : '#ef4444' }}>
                  {selecting === 1 ? '▶  Seleziona il Combattente 1  ◀' : '▶  Seleziona il Combattente 2  ◀'}
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
                  placeholder="Cerca personaggio..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg text-sm text-white placeholder-neutral-600 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                />
              </div>

              <div className="flex-1 overflow-y-auto pb-24">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {characters.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((c) => {
                    const isP1 = fighter1?.id === c.id
                    const isP2 = fighter2?.id === c.id
                    const isSelected = isP1 || isP2
                    const isDisabled = isSelected || (bothSelected && !isSelected)
                    const isHovered = hoveredId === c.id && !isDisabled
                    const aura = getRaceAura(c.race)

                    return (
                      <motion.button
                        key={c.id}
                        onClick={() => handleSelect(c)}
                        disabled={isDisabled}
                        onMouseEnter={() => !isDisabled && setHoveredId(c.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        whileTap={!isDisabled ? { scale: 0.94 } : {}}
                        className="relative flex flex-col rounded-lg"
                        style={{
                          border: isP1 ? '2px solid #3b82f6'
                            : isP2 ? '2px solid #ef4444'
                            : isHovered ? `2px solid ${aura}`
                            : '2px solid rgba(255,255,255,0.07)',
                          boxShadow: isP1 ? '0 0 16px rgba(59,130,246,0.65)'
                            : isP2 ? '0 0 16px rgba(239,68,68,0.65)'
                            : isHovered ? `0 0 26px ${aura}, 0 0 50px ${aura.replace('0.8', '0.3')}`
                            : '0 2px 8px rgba(0,0,0,0.5)',
                          opacity: isDisabled && !isSelected ? 0.35 : 1,
                          background: '#07070f',
                          cursor: isDisabled ? 'default' : 'pointer',
                          overflow: 'visible',
                          zIndex: isHovered ? 10 : 1,
                          transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                        }}
                      >
                        {/* Image with clipPath pop-out effect */}
                        <div
                          style={{
                            position: 'relative',
                            height: '200px',
                            overflow: 'visible',
                            clipPath: isHovered
                              ? 'inset(-22% -12% 0% -12% round 8px)'
                              : 'inset(0% round 8px)',
                            transition: 'clip-path 0.4s cubic-bezier(0.34, 1.4, 0.64, 1)',
                          }}
                        >
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-full h-full object-cover object-top"
                            style={{
                              transform: isHovered ? 'scale(1.18)' : 'scale(1)',
                              transformOrigin: 'top center',
                              transition: 'transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1)',
                            }}
                            onError={e => { e.target.src = 'https://via.placeholder.com/120x200/0d0d1a/666?text=?' }}
                          />

                          {/* Bottom gradient (fades on hover) */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(7,7,15,0.9) 0%, transparent 50%)',
                            opacity: isHovered ? 0 : 1,
                            transition: 'opacity 0.3s ease',
                            pointerEvents: 'none',
                          }} />

                          {/* Selected overlay */}
                          {isSelected && (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ background: isP1 ? 'rgba(59,130,246,0.4)' : 'rgba(239,68,68,0.4)' }}
                            >
                              <span
                                className="font-black text-2xl"
                                style={{ color: isP1 ? '#3b82f6' : '#ef4444', textShadow: '0 0 14px currentColor' }}
                              >
                                {isP1 ? 'P1' : 'P2'}
                              </span>
                            </div>
                          )}

                          {/* Race badge */}
                          {c.race && !isSelected && !isHovered && (
                            <div className="absolute bottom-0 left-0 right-0 px-1 pb-0.5"
                              style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                              <span className={`text-[9px] px-1 py-0.5 rounded font-bold ${getRaceBadgeStyle(c.race)}`}>
                                {c.race}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Name strip */}
                        <div className="px-1 py-1" style={{ background: 'rgba(0,0,0,0.8)' }}>
                          <p className="text-white text-xs font-bold truncate text-center leading-tight">{c.name}</p>
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
