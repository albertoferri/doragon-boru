import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseKi, hiddenPower } from '../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faBolt, faFire, faWind, faTrophy, faHandshake, faRotateLeft, faHandFist } from '@fortawesome/free-solid-svg-icons'

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

    log.push({
      round,
      dmg1,
      dmg2,
      isCrit1,
      isCrit2,
      isDodge1,
      isDodge2,
      hp1: Math.max(0, hp1),
      hp2: Math.max(0, hp2),
    })
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

function FighterCard({ fighter, index, hp, isWinner, isLoser, fighting }) {
  const color = index === 0 ? '#3b82f6' : '#8b5cf6'
  const glowColor = index === 0 ? 'rgba(59,130,246,0.4)' : 'rgba(139,92,246,0.4)'

  return (
    <motion.div
      initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="relative rounded-2xl overflow-hidden text-center"
      style={{
        background: isWinner
          ? 'linear-gradient(160deg, #1a2e1a 0%, #162616 100%)'
          : isLoser
          ? 'linear-gradient(160deg, #2e1a1a 0%, #261616 100%)'
          : 'linear-gradient(160deg, #1e1e2e 0%, #181828 100%)',
        border: isWinner
          ? '1px solid rgba(34,197,94,0.4)'
          : isLoser
          ? '1px solid rgba(239,68,68,0.3)'
          : `1px solid ${index === 0 ? 'rgba(59,130,246,0.25)' : 'rgba(139,92,246,0.25)'}`,
        boxShadow: isWinner ? '0 0 20px rgba(34,197,94,0.15)' : 'none',
      }}
    >
      {isWinner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 left-1/2 -translate-x-1/2 text-xl text-yellow-400 z-10"
        >
          <FontAwesomeIcon icon={faCrown} />
        </motion.div>
      )}

      <div className="pt-8 pb-4 px-3">
        {/* Avatar with fight pulse */}
        <motion.div
          animate={fighting ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={fighting ? { repeat: Infinity, duration: 0.7, ease: 'easeInOut' } : {}}
          className="relative inline-block mb-3"
        >
          <div
            className="w-20 h-20 rounded-full overflow-hidden mx-auto"
            style={{
              border: `3px solid ${color}`,
              boxShadow: `0 0 16px ${glowColor}`,
              filter: isLoser ? 'grayscale(0.6) brightness(0.7)' : 'none',
            }}
          >
            <img
              src={fighter.image}
              alt={fighter.name}
              className="w-full h-full object-cover object-top"
              onError={e => { e.target.src = 'https://via.placeholder.com/80/262626/666?text=?' }}
            />
          </div>
        </motion.div>

        <h3 className="font-black text-white text-sm leading-tight mb-0.5">{fighter.name}</h3>
        <p className="text-xs text-neutral-500 mb-1">{fighter.race}</p>
        <p className="text-xs font-mono flex items-center justify-center gap-1" style={{ color }}>
          <FontAwesomeIcon icon={faBolt} className="text-xs" /> {fighter.ki || 'Unknown'}
        </p>

        {/* HP bar */}
        <div className="mt-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-neutral-500">HP</span>
            <motion.span
              key={hp}
              initial={{ scale: 1.3, color: '#f87171' }}
              animate={{ scale: 1, color: hp > 50 ? '#4ade80' : hp > 20 ? '#fbbf24' : '#f87171' }}
              transition={{ duration: 0.3 }}
              className="text-xs font-mono font-bold"
            >
              {hp}
            </motion.span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <motion.div
              animate={{ width: `${hp}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: '9999px',
                background: hpColor(hp),
                boxShadow: hp > 0 ? `0 0 8px ${hp > 50 ? 'rgba(74,222,128,0.4)' : hp > 20 ? 'rgba(251,191,36,0.4)' : 'rgba(248,113,113,0.5)'}` : 'none',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function KiBar({ ki1, ki2, name1, name2 }) {
  const total = ki1 + ki2 || 1
  const pct1 = Math.round((ki1 / total) * 100)
  return (
    <div className="rounded-xl p-4 mb-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <p className="text-xs text-neutral-500 mb-2 text-center uppercase tracking-widest">Confronto KI</p>
      <div className="flex items-center gap-2 text-xs mb-1">
        <span className="text-blue-400 font-semibold truncate flex-1">{name1}</span>
        <span className="text-neutral-400">{pct1}% — {100 - pct1}%</span>
        <span className="text-purple-400 font-semibold truncate flex-1 text-right">{name2}</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden flex" style={{ background: '#1f1f1f' }}>
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${pct1}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, #3b82f6, #60a5fa)' }}
        />
        <motion.div
          initial={{ width: '50%' }}
          animate={{ width: `${100 - pct1}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
        />
      </div>
    </div>
  )
}

function AttackLine({ fighter, dmg, isCrit, isDodge, color }) {
  if (isDodge) {
    return (
      <span style={{ color: '#a3a3a3' }}>
        <span style={{ color }} className="font-semibold">{fighter.name}</span>{' '}
        schiva! <FontAwesomeIcon icon={faWind} className="text-neutral-400" />
      </span>
    )
  }
  return (
    <span>
      <span style={{ color }} className="font-semibold">{fighter.name}</span>
      {isCrit
        ? <span className="text-yellow-400 font-bold"> CRITICO </span>
        : <span style={{ color: '#d4d4d4' }}> colpisce </span>}
      <span className="font-mono font-bold" style={{ color: isCrit ? '#fbbf24' : '#f87171' }}>
        -{dmg} HP
      </span>
      {isCrit && <FontAwesomeIcon icon={faFire} className="ml-1 text-yellow-400" />}
    </span>
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

    const ROUND_DELAY = 750

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
      }, i * ROUND_DELAY)
      timersRef.current.push(t)
    })
  }

  const handleReset = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    setHp1(100)
    setHp2(100)
    setFighting(false)
    setDone(false)
    setCurrentEntry(null)
    setBattleResult(null)
    setRoundNum(0)
    setTotalRounds(0)
    onReset()
  }

  return (
    <div className="space-y-4">
      {/* Fighters grid with VS badge */}
      <div className="relative grid grid-cols-2 gap-4">
        <FighterCard fighter={fighter1} index={0} hp={hp1} isWinner={isWinner1} isLoser={isLoser1} fighting={fighting} />
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
            style={{
              background: 'linear-gradient(135deg, #1e1e2e, #0d0d1a)',
              border: '2px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            }}
          >
            VS
          </div>
        </div>
        <FighterCard fighter={fighter2} index={1} hp={hp2} isWinner={isWinner2} isLoser={isLoser2} fighting={fighting} />
      </div>

      {/* Live attack feed */}
      <AnimatePresence mode="wait">
        {(fighting || currentEntry) && !done && (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-mono">
                Round {roundNum} / {totalRounds}
              </span>
              <div className="flex gap-0.5">
                {Array.from({ length: Math.min(totalRounds, 20) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 rounded-full"
                    style={{
                      width: `${Math.max(4, 200 / Math.min(totalRounds, 20))}px`,
                      background: i < roundNum ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                      transition: 'background 0.3s',
                    }}
                  />
                ))}
              </div>
            </div>

            {currentEntry ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentEntry.round}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faBolt} className="text-blue-400 text-sm" />
                    <AttackLine fighter={fighter1} dmg={currentEntry.dmg1} isCrit={currentEntry.isCrit1} isDodge={currentEntry.isDodge2} color="#60a5fa" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faBolt} className="text-purple-400 text-sm" />
                    <AttackLine fighter={fighter2} dmg={currentEntry.dmg2} isCrit={currentEntry.isCrit2} isDodge={currentEntry.isDodge1} color="#a78bfa" />
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.p
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="text-sm text-neutral-400 text-center flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faBolt} className="text-yellow-400" /> Combattimento in corso...
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* KI comparison bar */}
      {done && battleResult && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <KiBar ki1={battleResult.ki1} ki2={battleResult.ki2} name1={fighter1.name} name2={fighter2.name} />
        </motion.div>
      )}

      {/* Fight button */}
      {!fighting && !done && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={startBattle}
          className="w-full py-4 rounded-xl font-black text-lg text-white flex items-center justify-center gap-2"
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
                border: battleResult.winner ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(234,179,8,0.35)',
                boxShadow: battleResult.winner ? '0 0 30px rgba(34,197,94,0.15)' : '0 0 20px rgba(234,179,8,0.1)',
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

            <button onClick={handleReset} className="btn-secondary w-full flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faRotateLeft} /> Nuova Battaglia
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
