import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseKi, hiddenPower } from '../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faBolt, faFire, faTrophy, faHandshake, faRotateLeft, faHandFist, faShield } from '@fortawesome/free-solid-svg-icons'

function getPower(char) {
  const ki = parseKi(char.ki)
  if (ki > 0) return ki
  return hiddenPower(char.id)
}

function simulateBattle(c1, c2) {
  const ki1 = getPower(c1)
  const ki2 = getPower(c2)
  const total = ki1 + ki2
  const log = []
  let hp1 = 100, hp2 = 100
  let round = 1

  while (hp1 > 0 && hp2 > 0 && round <= 20) {
    const isCrit1  = Math.random() < 0.2
    const isDodge2 = Math.random() < 0.1
    const isCrit2  = Math.random() < 0.2
    const isDodge1 = Math.random() < 0.1

    const base1 = (ki1 / total) * 20
    const base2 = (ki2 / total) * 20
    const rand1 = Math.random() * 0.5 + 0.75
    const rand2 = Math.random() * 0.5 + 0.75

    const dmg1 = isDodge2 ? 0 : Math.round(base1 * rand1 * (isCrit1 ? 2 : 1))
    const dmg2 = isDodge1 ? 0 : Math.round(base2 * rand2 * (isCrit2 ? 2 : 1))

    hp2 = Math.max(0, hp2 - dmg1)
    hp1 = Math.max(0, hp1 - dmg2)

    log.push({ round, dmg1, dmg2, isCrit1, isCrit2, isDodge1, isDodge2, hp1: Math.max(0, hp1), hp2: Math.max(0, hp2) })
    round++
    if (hp1 <= 0 || hp2 <= 0) break
  }

  const winner = hp1 > hp2 ? c1 : hp2 > hp1 ? c2 : null
  return { winner, log, finalHp1: hp1, finalHp2: hp2, ki1, ki2 }
}

function hpColor(hp) {
  if (hp > 50) return 'linear-gradient(90deg, #16a34a, #4ade80)'
  if (hp > 20) return 'linear-gradient(90deg, #d97706, #fbbf24)'
  return 'linear-gradient(90deg, #dc2626, #f87171)'
}

function hpTextColor(hp) {
  if (hp > 50) return '#4ade80'
  if (hp > 20) return '#fbbf24'
  return '#f87171'
}

function FighterCard({ fighter, index, hp, isWinner, isLoser, fighting, lastEntry }) {
  const isBlue = index === 0
  const color = isBlue ? '#3b82f6' : '#8b5cf6'
  const glow = isBlue ? 'rgba(59,130,246,0.55)' : 'rgba(139,92,246,0.55)'

  // Damage this fighter dealt
  const atkDealt = lastEntry ? (isBlue ? lastEntry.dmg1 : lastEntry.dmg2) : null
  const wasCrit   = lastEntry ? (isBlue ? lastEntry.isCrit1  : lastEntry.isCrit2)  : false
  // Did opponent dodge this fighter's attack?
  const oppDodged = lastEntry ? (isBlue ? lastEntry.isDodge2 : lastEntry.isDodge1) : false
  // Did THIS fighter dodge?
  const thisDodged = lastEntry ? (isBlue ? lastEntry.isDodge1 : lastEntry.isDodge2) : false

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="relative rounded-2xl flex flex-col overflow-hidden"
      style={{
        background: isWinner
          ? 'linear-gradient(160deg, #091a09 0%, #0d200d 100%)'
          : isLoser
          ? 'linear-gradient(160deg, #1a0909 0%, #200d0d 100%)'
          : `linear-gradient(160deg, ${isBlue ? '#04080f' : '#08040f'} 0%, #020208 100%)`,
        border: isWinner
          ? '1px solid rgba(34,197,94,0.5)'
          : isLoser
          ? '1px solid rgba(239,68,68,0.3)'
          : `1px solid ${color}44`,
        boxShadow: isWinner
          ? '0 0 28px rgba(34,197,94,0.22)'
          : fighting
          ? `0 0 24px ${glow}`
          : 'none',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Winner crown */}
      {isWinner && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 text-yellow-400 text-2xl z-20"
        >
          <FontAwesomeIcon icon={faCrown} />
        </motion.div>
      )}

      {/* Character image */}
      <div style={{ height: '240px', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 110%, rgba(99,102,241,0.08) 0%, transparent 70%)' }}>
        <motion.img
          src={fighter.image}
          alt={fighter.name}
          className="w-full h-full object-contain object-bottom"
          animate={fighting ? { scale: [1, 1.05, 1] } : { scale: 1 }}
          transition={fighting ? { repeat: Infinity, duration: 0.85, ease: 'easeInOut' } : { duration: 0.5 }}
          style={{ filter: isLoser ? 'grayscale(0.75) brightness(0.5)' : 'none' }}
          onError={e => { e.target.src = 'https://via.placeholder.com/200x170/0d0d1a/666?text=?' }}
        />
        {/* Aura pulse when fighting */}
        {fighting && (
          <motion.div
            animate={{ opacity: [0, 0.45, 0] }}
            transition={{ repeat: Infinity, duration: 0.85 }}
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at center bottom, ${glow} 0%, transparent 60%)`,
            }}
          />
        )}
        {/* Gradient fade bottom */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,2,8,0.97) 0%, rgba(2,2,8,0.15) 55%, transparent 100%)' }} />

        {/* Player badge */}
        <div style={{ position: 'absolute', top: 8, [isBlue ? 'left' : 'right']: 8 }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: color, color: '#fff' }}>
            {isBlue ? 'P1' : 'P2'}
          </span>
        </div>

        {/* Name + race on image */}
        <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, padding: '0 8px', textAlign: 'center' }}>
          <p className="font-black text-white text-xs truncate" style={{ textShadow: '0 1px 6px rgba(0,0,0,1)' }}>
            {fighter.name}
          </p>
          {fighter.race && (
            <p className="text-[9px] mt-0.5" style={{ color: color + 'cc' }}>{fighter.race}</p>
          )}
        </div>
      </div>

      {/* Stat blocks */}
      <div className="p-2 space-y-1.5">

        {/* HP block */}
        <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-500">HP</span>
            <motion.span
              key={hp}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1, color: hpTextColor(hp) }}
              transition={{ duration: 0.25 }}
              className="text-xs font-mono font-black"
            >
              {hp}
            </motion.span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)' }}>
            <motion.div
              animate={{ width: `${hp}%` }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: '9999px', background: hpColor(hp) }}
            />
          </div>
        </div>

        {/* KI + ATK row */}
        <div className="grid grid-cols-2 gap-1.5">

          {/* KI block */}
          <div className="rounded-xl px-2 py-2" style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid ${color}40` }}>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-1" style={{ color: color + 'aa' }}>
              <FontAwesomeIcon icon={faBolt} className="mr-0.5" />KI
            </p>
            <p className="text-[10px] font-mono font-bold truncate leading-tight" style={{ color }}>
              {fighter.ki || '???'}
            </p>
          </div>

          {/* ATK block */}
          <div className="rounded-xl px-2 py-2" style={{
            background: wasCrit
              ? 'rgba(251,146,60,0.14)'
              : thisDodged
              ? 'rgba(14,165,233,0.1)'
              : 'rgba(0,0,0,0.6)',
            border: wasCrit
              ? '1px solid rgba(251,146,60,0.45)'
              : thisDodged
              ? '1px solid rgba(14,165,233,0.35)'
              : '1px solid rgba(249,115,22,0.25)',
            transition: 'background 0.25s, border-color 0.25s',
          }}>
            <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-1" style={{ color: 'rgba(249,115,22,0.7)' }}>
              ATK
            </p>
            {atkDealt !== null ? (
              <AnimatePresence mode="wait">
                <motion.p
                  key={`atk-${atkDealt}-${wasCrit}-${oppDodged}`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="text-[10px] font-mono font-black leading-tight"
                  style={{ color: oppDodged ? '#737373' : wasCrit ? '#fb923c' : '#f87171' }}
                >
                  {oppDodged ? 'MISS' : wasCrit ? `⚡ ${atkDealt}` : `-${atkDealt}`}
                </motion.p>
              </AnimatePresence>
            ) : (
              <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.12)' }}>—</p>
            )}
          </div>
        </div>

        {/* DODGE block — only flashes when this fighter dodged */}
        <AnimatePresence>
          {thisDodged && (
            <motion.div
              key="dodge"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 6 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl px-2 py-1.5 flex items-center justify-center gap-1.5"
              style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.35)' }}
            >
              <FontAwesomeIcon icon={faShield} className="text-[10px]" style={{ color: '#38bdf8' }} />
              <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#38bdf8' }}>SCHIVATA!</p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

function KiBar({ ki1, ki2, name1, name2 }) {
  const total = ki1 + ki2 || 1
  const pct1 = Math.round((ki1 / total) * 100)
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-xs text-neutral-500 mb-2 text-center uppercase tracking-widest">Confronto KI</p>
      <div className="flex items-center gap-2 text-xs mb-1.5">
        <span className="text-blue-400 font-semibold truncate flex-1">{name1}</span>
        <span className="text-neutral-400">{pct1}% — {100 - pct1}%</span>
        <span className="text-purple-400 font-semibold truncate flex-1 text-right">{name2}</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden flex" style={{ background: '#1f1f1f' }}>
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${pct1}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, #1d4ed8, #60a5fa)' }}
        />
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${100 - pct1}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-xs">
        <span className="text-blue-400 font-mono">{pct1}%</span>
        <span className="text-purple-400 font-mono">{100 - pct1}%</span>
      </div>
    </div>
  )
}

export default function BattleArena({ fighter1, fighter2, onReset }) {
  const [hp1, setHp1] = useState(100)
  const [hp2, setHp2] = useState(100)
  const [fighting, setFighting] = useState(false)
  const [currentEntry, setCurrentEntry] = useState(null)
  const [roundNum, setRoundNum] = useState(0)
  const [totalRounds, setTotalRounds] = useState(0)
  const [battleResult, setBattleResult] = useState(null)
  const [done, setDone] = useState(false)
  const timersRef = useRef([])

  const isWinner1 = done && battleResult?.winner?.id === fighter1.id
  const isLoser1  = done && battleResult?.winner && battleResult.winner.id !== fighter1.id
  const isWinner2 = done && battleResult?.winner?.id === fighter2.id
  const isLoser2  = done && battleResult?.winner && battleResult.winner.id !== fighter2.id

  const startBattle = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setFighting(true)
    setDone(false)
    setCurrentEntry(null)
    setBattleResult(null)
    setHp1(100)
    setHp2(100)

    const result = simulateBattle(fighter1, fighter2)
    setTotalRounds(result.log.length)

    result.log.forEach((entry, i) => {
      const t = setTimeout(() => {
        setRoundNum(entry.round)
        setCurrentEntry(entry)
        setHp1(entry.hp1)
        setHp2(entry.hp2)

        if (i === result.log.length - 1) {
          const t2 = setTimeout(() => {
            setBattleResult(result)
            setFighting(false)
            setDone(true)
          }, 900)
          timersRef.current.push(t2)
        }
      }, i * 750)
      timersRef.current.push(t)
    })
  }

  const handleReset = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setHp1(100); setHp2(100)
    setFighting(false); setDone(false)
    setCurrentEntry(null); setBattleResult(null)
    setRoundNum(0); setTotalRounds(0)
    onReset()
  }

  return (
    <div className="space-y-4">

      {/* Fighter cards */}
      <div className="relative grid grid-cols-2 gap-3">
        <FighterCard fighter={fighter1} index={0} hp={hp1} isWinner={isWinner1} isLoser={isLoser1} fighting={fighting} lastEntry={currentEntry} />

        {/* VS badge */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
          <motion.div
            animate={fighting ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={fighting ? { repeat: Infinity, duration: 0.85 } : {}}
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
            style={{
              background: 'linear-gradient(135deg, #1e1e2e, #0d0d1a)',
              border: '2px solid rgba(255,255,255,0.12)',
              color: fighting ? '#ff6600' : 'rgba(255,255,255,0.6)',
              boxShadow: fighting ? '0 0 16px rgba(255,100,0,0.6)' : '0 2px 12px rgba(0,0,0,0.5)',
              transition: 'color 0.3s, box-shadow 0.3s',
            }}
          >
            VS
          </motion.div>
        </div>

        <FighterCard fighter={fighter2} index={1} hp={hp2} isWinner={isWinner2} isLoser={isLoser2} fighting={fighting} lastEntry={currentEntry} />
      </div>

      {/* Round progress bar */}
      <AnimatePresence>
        {(fighting || (currentEntry && !done)) && (
          <motion.div
            key="rounds"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-mono">
                Round {roundNum} / {totalRounds}
              </span>
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="text-xs text-yellow-400 font-bold flex items-center gap-1"
              >
                <FontAwesomeIcon icon={faFire} /> COMBATTIMENTO
              </motion.span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: Math.min(totalRounds, 20) }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full flex-1"
                  style={{
                    background: i < roundNum ? '#3b82f6' : 'rgba(255,255,255,0.07)',
                    transition: 'background 0.3s',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KI comparison (after battle) */}
      {done && battleResult && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <KiBar ki1={battleResult.ki1} ki2={battleResult.ki2} name1={fighter1.name} name2={fighter2.name} />
        </motion.div>
      )}

      {/* Fight button */}
      {!fighting && !done && (
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(109,40,217,0.55)' }}
          whileTap={{ scale: 0.97 }}
          onClick={startBattle}
          className="mx-auto px-14 py-3 rounded-xl font-black text-lg text-white flex items-center gap-2"
          style={{
            background: 'linear-gradient(90deg, #1d4ed8, #7c3aed)',
            boxShadow: '0 0 24px rgba(109,40,217,0.35)',
          }}
        >
          <FontAwesomeIcon icon={faHandFist} /> COMBATTI!
        </motion.button>
      )}

      {/* Winner banner */}
      {done && battleResult && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div
              className="rounded-2xl p-5 text-center"
              style={{
                background: battleResult.winner
                  ? 'linear-gradient(135deg, #14532d 0%, #166534 100%)'
                  : 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
                border: battleResult.winner ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(234,179,8,0.4)',
                boxShadow: battleResult.winner ? '0 0 32px rgba(34,197,94,0.18)' : '0 0 20px rgba(234,179,8,0.12)',
              }}
            >
              {battleResult.winner ? (
                <>
                  <p className="text-green-400/70 text-xs uppercase tracking-widest mb-1">Vincitore</p>
                  <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" /> {battleResult.winner.name}
                  </h2>
                  <p className="text-green-400/60 text-xs mt-1">{battleResult.log.length} round combattuti</p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-black text-yellow-400 flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faHandshake} /> Pareggio!
                  </h2>
                  <p className="text-yellow-400/60 text-xs mt-1">Forze perfettamente bilanciate</p>
                </>
              )}
            </div>

            <button onClick={handleReset} className="btn-secondary mx-auto flex items-center gap-2 px-10">
              <FontAwesomeIcon icon={faRotateLeft} /> Nuova Battaglia
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
