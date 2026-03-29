import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseKi, hiddenPower } from '../utils/helpers'
import { getPlanetById } from '../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy, faSkull, faCircleCheck, faBolt, faRotateLeft, faGlobe, faFire, faScaleBalanced, faUsers } from '@fortawesome/free-solid-svg-icons'

const fmt = (n) => {
  if (n >= 1e15) return (n / 1e15).toFixed(1) + 'Q'
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T'
  if (n >= 1e9)  return (n / 1e9).toFixed(1)  + 'B'
  if (n >= 1e6)  return (n / 1e6).toFixed(1)  + 'M'
  if (n >= 1e3)  return (n / 1e3).toFixed(1)  + 'K'
  return n.toLocaleString()
}

function getCharPower(char) {
  const ki = parseKi(char.ki)
  return ki > 0 ? ki : hiddenPower(char.id)
}

function KiCompare({ adj1, adj2, name1, name2 }) {
  const total = adj1 + adj2 || 1
  const pct1 = Math.round((adj1 / total) * 100)
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-xs text-neutral-500 mb-2 text-center uppercase tracking-widest">KI Totale Combinato</p>
      <div className="flex items-center gap-2 text-xs mb-1.5">
        <span className="text-purple-400 font-semibold truncate flex-1">{name1}</span>
        <span className="text-neutral-400 text-xs">{pct1}% — {100 - pct1}%</span>
        <span className="text-red-400 font-semibold truncate flex-1 text-right">{name2}</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: '#1f1f1f' }}>
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${pct1}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
        />
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${100 - pct1}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, #b91c1c, #f87171)' }}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-purple-400 font-mono">{fmt(adj1)}</span>
        <span className="text-red-400 font-mono">{fmt(adj2)}</span>
      </div>
    </div>
  )
}

function PlanetBattleCard({ planet, index, result }) {
  const isWinner = result?.winner?.id === planet.id
  const isLoser  = result && result.winner && result.winner.id !== planet.id
  const chars    = result ? (index === 0 ? result.chars1 : result.chars2) : []
  const adj      = result ? (index === 0 ? result.adjusted1 : result.adjusted2) : 0
  const isBlue   = index === 0
  const color    = isBlue ? '#a78bfa' : '#f87171'
  const glow     = isBlue ? 'rgba(167,139,250,0.5)' : 'rgba(248,113,113,0.5)'

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl flex flex-col overflow-hidden"
      style={{
        background: isWinner
          ? 'linear-gradient(160deg, #1a1a2e 0%, #0d0d20 100%)'
          : isLoser
          ? 'linear-gradient(160deg, #2e1a1a 0%, #1a0d0d 100%)'
          : `linear-gradient(160deg, ${isBlue ? '#08060f' : '#0f0608'} 0%, #050508 100%)`,
        border: isWinner
          ? '1px solid rgba(167,139,250,0.55)'
          : isLoser
          ? '1px solid rgba(239,68,68,0.25)'
          : `1px solid ${isBlue ? 'rgba(139,92,246,0.35)' : 'rgba(239,68,68,0.35)'}`,
        boxShadow: isWinner ? `0 0 28px ${glow}` : 'none',
      }}
    >
      {isWinner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 text-2xl z-10 text-yellow-400"
        >
          <FontAwesomeIcon icon={faTrophy} />
        </motion.div>
      )}

      {/* Planet image */}
      <div className="relative overflow-hidden" style={{ height: '130px' }}>
        <img
          src={planet.image}
          alt={planet.name}
          className="w-full h-full object-cover"
          style={{ filter: isLoser ? 'grayscale(0.75) brightness(0.5)' : 'none' }}
          onError={e => { e.target.src = 'https://via.placeholder.com/400x200/0d0d1a/444?text=?' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,8,0.97) 0%, rgba(5,5,8,0.1) 55%, transparent 100%)' }} />

        {/* Status badge */}
        <div style={{ position: 'absolute', top: 8, left: 8 }}>
          <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black flex items-center gap-1 ${
            planet.isDestroyed
              ? 'bg-red-900/80 text-red-400 border border-red-800/60'
              : 'bg-green-900/80 text-green-400 border border-green-800/60'
          }`}>
            <FontAwesomeIcon icon={planet.isDestroyed ? faSkull : faCircleCheck} />
            {planet.isDestroyed ? 'DIST.' : 'VIVO'}
          </span>
        </div>

        {/* P1/P2 badge */}
        <div style={{ position: 'absolute', top: 8, [isBlue ? 'right' : 'left']: 8 }}>
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ background: color, color: '#fff' }}>
            {isBlue ? 'P1' : 'P2'}
          </span>
        </div>

        {/* Name on image */}
        <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, padding: '0 8px', textAlign: 'center' }}>
          <p className="font-black text-white text-xs truncate" style={{ textShadow: '0 1px 6px rgba(0,0,0,1)' }}>
            {planet.name}
          </p>
        </div>
      </div>

      {/* Stat blocks */}
      <div className="p-2 space-y-1.5">

        {/* Destroyed penalty notice */}
        {planet.isDestroyed && (
          <div className="rounded-xl px-2.5 py-1.5 text-center"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)' }}>
            <p className="text-[9px] font-black uppercase tracking-wider text-red-400">
              <FontAwesomeIcon icon={faSkull} className="mr-1" />−40% penalità potere
            </p>
          </div>
        )}

        {/* Warriors + Power row */}
        <div className="grid grid-cols-2 gap-1.5">

          {/* Warriors block */}
          <div className="rounded-xl px-2 py-2" style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${color}33` }}>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-1" style={{ color: color + 'aa' }}>
              <FontAwesomeIcon icon={faUsers} className="mr-0.5" />Guerrieri
            </p>
            <p className="text-base font-black leading-tight" style={{ color }}>
              {result ? chars.length : '—'}
            </p>
          </div>

          {/* Power block */}
          <div className="rounded-xl px-2 py-2" style={{
            background: result && isWinner ? `${glow.replace('0.5', '0.1')}` : 'rgba(0,0,0,0.6)',
            border: result && isWinner ? `1px solid ${color}55` : '1px solid rgba(249,115,22,0.25)',
          }}>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-1" style={{ color: 'rgba(249,115,22,0.7)' }}>
              <FontAwesomeIcon icon={faBolt} className="mr-0.5" />Potere
            </p>
            <p className="text-sm font-black font-mono leading-tight truncate"
              style={{ color: result ? (isWinner ? '#fbbf24' : color) : 'rgba(255,255,255,0.15)' }}>
              {result ? fmt(adj) : '???'}
            </p>
          </div>
        </div>

        {/* Status chip row */}
        <div className="rounded-xl px-2.5 py-1.5 flex items-center justify-between"
          style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[9px] font-black uppercase tracking-[0.15em] text-neutral-500">Stato</p>
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
            planet.isDestroyed
              ? 'bg-red-900/60 text-red-400 border border-red-800/50'
              : 'bg-green-900/60 text-green-400 border border-green-800/50'
          }`}>
            <FontAwesomeIcon icon={planet.isDestroyed ? faSkull : faCircleCheck} />
            {planet.isDestroyed ? 'Pianeta Distrutto' : 'Pianeta Esistente'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function PlanetBattle({ planet1, planet2, onReset }) {
  const [result, setResult] = useState(null)
  const [calculating, setCalculating] = useState(false)

  const calculate = async () => {
    setCalculating(true)
    try {
      const [p1Detail, p2Detail] = await Promise.all([
        getPlanetById(planet1.id),
        getPlanetById(planet2.id),
      ])

      const chars1 = p1Detail.characters || []
      const chars2 = p2Detail.characters || []

      const totalKi1 = chars1.reduce((s, c) => s + getCharPower(c), 0)
      const totalKi2 = chars2.reduce((s, c) => s + getCharPower(c), 0)

      const adjusted1 = planet1.isDestroyed ? totalKi1 * 0.6 : totalKi1
      const adjusted2 = planet2.isDestroyed ? totalKi2 * 0.6 : totalKi2

      const winner = adjusted1 > adjusted2 ? planet1 : adjusted2 > adjusted1 ? planet2 : null
      setResult({ winner, totalKi1, totalKi2, adjusted1, adjusted2, chars1, chars2 })
    } finally {
      setCalculating(false)
    }
  }

  return (
    <div className="space-y-4">

      {/* Planet cards with VS */}
      <div className="relative grid grid-cols-2 gap-3">
        <PlanetBattleCard planet={planet1} index={0} result={result} />

        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
            style={{
              background: 'linear-gradient(135deg, #0d0d1a, #050510)',
              border: '2px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.65)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
            }}
          >
            VS
          </div>
        </div>

        <PlanetBattleCard planet={planet2} index={1} result={result} />
      </div>

      {/* KI comparison after calculation */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <KiCompare adj1={result.adjusted1} adj2={result.adjusted2} name1={planet1.name} name2={planet2.name} />
        </motion.div>
      )}

      {/* Action button */}
      {!result ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={calculate}
          disabled={calculating}
          className="w-full py-4 rounded-xl font-black text-lg text-white flex items-center justify-center gap-2"
          style={{
            background: calculating
              ? 'linear-gradient(90deg, #4c1d95, #7f1d1d)'
              : 'linear-gradient(90deg, #7c3aed, #b91c1c)',
            boxShadow: '0 0 28px rgba(139,92,246,0.35)',
          }}
        >
          {calculating ? (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faGlobe} spin /> Calcolo in corso...
            </motion.span>
          ) : (
            <>
              <FontAwesomeIcon icon={faFire} /> GUERRA TRA PIANETI!
            </>
          )}
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: result.winner
                  ? 'linear-gradient(135deg, #1a1a2e 0%, #0d0d20 100%)'
                  : 'linear-gradient(135deg, #1c1a0d 0%, #141209 100%)',
                border: result.winner
                  ? '1px solid rgba(167,139,250,0.45)'
                  : '1px solid rgba(234,179,8,0.35)',
                boxShadow: result.winner
                  ? '0 0 32px rgba(139,92,246,0.18)'
                  : '0 0 20px rgba(234,179,8,0.1)',
              }}
            >
              {result.winner ? (
                <>
                  <p className="text-purple-400/60 text-xs uppercase tracking-widest mb-1">Pianeta Dominante</p>
                  <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" /> {result.winner.name}
                  </h2>
                  <p className="text-purple-400/50 text-xs mt-1">KI superiore determina la vittoria</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-yellow-400 flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faScaleBalanced} /> Stallo!
                  </h2>
                  <p className="text-yellow-400/60 text-xs mt-1">KI totale identico su entrambi i pianeti</p>
                </>
              )}
            </div>

            <button onClick={onReset} className="btn-secondary w-full flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faRotateLeft} /> Nuova Battaglia tra Pianeti
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
