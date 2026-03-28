import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllCharacters } from '../services/api'

const NAV_ITEMS = [
  { to: '/characters',    label: 'Personaggi',       phrase: 'Saiyan pronti alla battaglia!',  color: '#3b82f6' },
  { to: '/planets',       label: 'Pianeti',          phrase: 'Esplora nuovi mondi!',            color: '#10b981' },
  { to: '/battle',        label: 'Battaglia',        phrase: 'Combatti senza pietà!',           color: '#ef4444' },
  { to: '/planet-battle', label: 'Battaglia Pianeti', phrase: 'Distruggi interi pianeti!',      color: '#8b5cf6' },
  { to: '/favorites',     label: 'Preferiti',        phrase: 'I tuoi guerrieri preferiti!',     color: '#f59e0b' },
]

function OrbitalLink({ char, item, angle, radius }) {
  const [hovered, setHovered] = useState(false)

  // Position derived from angle so it's clean — no external style prop needed
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius

  return (
    <motion.div
      className="absolute"
      style={{
        left: '50%',
        top: '50%',
        zIndex: 5,
      }}
      animate={{
        x: x - 44,  // -44 = half of 88px image width to center it
        y: y - 55,  // -55 = half of 110px image height
      }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      <Link
        to={item.to}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block relative"
        style={{ width: 88 }}
      >
        {/* Character image */}
        <motion.img
          src={char.image}
          alt={char.name}
          animate={{
            scale: hovered ? 1.18 : 1,
            filter: hovered
              ? `drop-shadow(0 0 20px ${item.color}99)`
              : `drop-shadow(0 0 8px ${item.color}55)`,
            y: [0, -6, 0],
          }}
          transition={
            hovered
              ? { scale: { duration: 0.2 }, filter: { duration: 0.2 } }
              : {
                  scale: { duration: 0.2 },
                  filter: { duration: 0.2 },
                  y: { repeat: Infinity, duration: 2.5 + (angle * 0.3), ease: 'easeInOut' },
                }
          }
          className="h-[110px] w-auto object-contain mx-auto block"
          onError={e => { e.target.src = 'https://via.placeholder.com/80/262626/666?text=?' }}
        />

        {/* Nav label */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : 2 }}
          transition={{ duration: 0.2 }}
          className="text-center text-xs font-bold mt-1"
          style={{ color: item.color }}
        >
          {item.label}
        </motion.div>

        {/* Speech balloon */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? -4 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute pointer-events-none"
          style={{
            bottom: '120%',
            right: '-40%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            className="text-black text-xs px-3 py-2 rounded-xl shadow-xl relative font-semibold"
            style={{ background: 'white' }}
          >
            {item.phrase}
            {/* Arrow */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"
              style={{ bottom: -5 }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function Landing() {
  const [chars, setChars] = useState([])

  useEffect(() => {
    getAllCharacters()
      .then(data => {
        const items = data.items || data
        const picks = [0, 3, 6, 10, 15].map(i => items[i]).filter(Boolean)
        setChars(picks)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="relative overflow-hidden" style={{ minHeight: 'calc(100vh - 4rem)' }}>

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb" style={{ width: 500, height: 500, background: '#3b82f6', top: '20%', left: '20%' }} />
        <div className="bg-orb" style={{ width: 400, height: 400, background: '#8b5cf6', bottom: '20%', right: '20%' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, background: '#06b6d4', top: '60%', left: '10%' }} />
      </div>

      {/* Content — centered on page */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">

        {/* Orbital ring — desktop */}
        <div
          className="hidden lg:block relative"
          style={{ width: 800, height: 800 }}
        >
          {/* Dashed orbit circle */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ border: '1px dashed rgba(255,255,255,0.08)' }}
          />

          {/* Title at center of ring */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 px-8"
          >
            <h1 className="text-4xl xl:text-5xl font-black text-white mb-2 leading-tight">
              Doragon{' '}
              <span className="text-blue-400">Boru</span>
            </h1>
            <p className="text-neutral-400 text-sm xl:text-base">
              Explore fighters, planets and epic battles
            </p>
          </motion.div>

          {/* Characters (remain absolute inside this container) */}
          {chars.slice(0, NAV_ITEMS.length).map((char, i) => {
            const total = NAV_ITEMS.length
            const angle = (i / total) * Math.PI * 2 - Math.PI / 2
            const radius = 300
            return (
              <OrbitalLink
                key={char.id}
                char={char}
                item={NAV_ITEMS[i]}
                angle={angle}
                radius={radius}
              />
            )
          })}
        </div>

        {/* Mobile: title + grid */}
        <div className="lg:hidden flex flex-col items-center px-4 py-12">
          <h1 className="text-4xl font-black text-white mb-2 text-center">
            Dragon Ball <span className="text-blue-400">Universe</span>
          </h1>
          <p className="text-neutral-400 text-sm mb-8 text-center">
            Explore fighters, planets and epic battles
          </p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-xl p-4 text-center font-bold text-sm transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${item.color}44`,
                  color: item.color,
                }}
              >
                {item.label}
                <p className="text-xs text-neutral-500 font-normal mt-1">{item.phrase}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
