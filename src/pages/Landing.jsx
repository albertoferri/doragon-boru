import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { getAllCharacters } from '../services/api'

import TypewriterText from '../components/TypewriterText'
import wallImg    from '../assets/images/wall1.jpg'
import imgChars   from '../assets/images/gokuchar.jpg'
import imgPlanets from '../assets/images/kaiplanet.jpg'
import imgBattle  from '../assets/images/vegetabat.jpg'
import imgPlanetB from '../assets/images/planetibatt.jpg'
import imgQuiz    from '../assets/images/quiz.jpg'

const TITLE_SEGS = [
  { text: 'Doragon ', className: '' },
  { text: 'Boru', className: 'text-blue-400' },
]

const NAV_ITEMS = [
  { to: '/characters',    label: 'Personaggi',        phrase: 'Saiyan pronti alla battaglia!',  color: '#3b82f6', img: imgChars   },
  { to: '/planets',       label: 'Pianeti',            phrase: 'Esplora nuovi mondi!',            color: '#10b981', img: imgPlanets },
  { to: '/battle',        label: 'Battaglia',          phrase: 'Combatti senza pietà!',           color: '#ef4444', img: imgBattle  },
  { to: '/planet-battle', label: 'Battaglia Pianeti',  phrase: 'Distruggi interi pianeti!',       color: '#8b5cf6', img: imgPlanetB },
  { to: '/quiz',          label: 'Quiz',               phrase: 'Metti alla prova le tue conoscenze!', color: '#f59e0b', img: imgQuiz },
]

function OrbitalLink({ char, item, angle, radius }) {
  const [hovered, setHovered] = useState(false)

  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius

  return (
    <motion.div
      className="absolute"
      style={{ left: '50%', top: '50%', zIndex: 5 }}
      animate={{ x: x - 44, y: y - 55 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    >
      <Link
        to={item.to}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="block relative"
        style={{ width: 88 }}
      >
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
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.5, y: hovered ? 0 : 2 }}
          transition={{ duration: 0.2 }}
          className="text-center text-xs font-bold mt-1"
          style={{ color: item.color }}
        >
          {item.label}
        </motion.div>
        <motion.div
          initial={{ x: '-50%', opacity: 0, scale: 0.88, y: 6 }}
          animate={{ x: '-50%', opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.88, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.15 }}
          className="absolute pointer-events-none"
          style={{ bottom: 'calc(100% + 10px)', left: '50%', whiteSpace: 'nowrap', zIndex: 50 }}
        >
          <div style={{
            background: '#fff',
            border: '2.5px solid #111',
            borderRadius: '10px',
            padding: '5px 11px',
            position: 'relative',
            boxShadow: '3px 3px 0px #111',
            fontWeight: 900,
            fontSize: '11px',
            color: '#111',
            letterSpacing: '0.01em',
          }}>
            {item.phrase}
            {/* Tail outer (black border) */}
            <div style={{
              position: 'absolute', bottom: -11, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '10px solid #111',
            }} />
            {/* Tail inner (white fill) */}
            <div style={{
              position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '8px solid #fff',
            }} />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function Landing() {
  const [chars, setChars] = useState([])

  // Disable scroll on mobile
  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    if (isMobile) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'auto' }
  }, [])

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

      {/* Background orbs — desktop only */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="bg-orb" style={{ width: 500, height: 500, background: '#3b82f6', top: '20%', left: '20%' }} />
        <div className="bg-orb" style={{ width: 400, height: 400, background: '#8b5cf6', bottom: '20%', right: '20%' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, background: '#06b6d4', top: '60%', left: '10%' }} />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">

        {/* ── Desktop: orbital ring ── */}
        <div className="hidden lg:block relative" style={{ width: 800, height: 800 }}>
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{ border: '1px dashed rgba(255,255,255,0.08)' }} />
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 px-8"
          >
            <h1 className="text-4xl xl:text-5xl font-black text-white mb-2 leading-tight">
              <TypewriterText segments={TITLE_SEGS} speed={60} />
            </h1>
            <p className="text-neutral-400 text-sm xl:text-base">
              <TypewriterText text="Explore fighters, planets and epic battles" speed={28} delay={780} />
            </p>
          </motion.div>
          {chars.slice(0, NAV_ITEMS.length).map((char, i) => {
            const total = NAV_ITEMS.length
            const angle = (i / total) * Math.PI * 2 - Math.PI / 2
            return (
              <OrbitalLink key={char.id} char={char} item={NAV_ITEMS[i]} angle={angle} radius={300} />
            )
          })}
        </div>

        {/* ── Mobile: fullscreen bg + Swiper cards ── */}
        <div className="landing-mobile lg:hidden" style={{ backgroundImage: `url(${wallImg})` }}>
          <div className="landing-mobile__overlay" />
          <div className="landing-mobile__content">

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="landing-mobile__title"
            >
              <h1>Dragon Ball</h1>
              <h2>Universe</h2>
              <p>Swipe per esplorare</p>
            </motion.div>

            {/* Swiper */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="landing-mobile__swiper-wrap"
            >
              <Swiper
                effect="cards"
                grabCursor
                modules={[EffectCards]}
                className="landing-swiper"
              >
                {NAV_ITEMS.map(item => (
                  <SwiperSlide key={item.to}>
                    <Link to={item.to} className="block w-full h-full">
                      <img src={item.img} alt={item.label} />
                      <div className="slide-overlay" />
                      <div className="slide-info">
                        <span className="slide-accent" style={{ background: item.color }} />
                        <p className="slide-label">{item.label}</p>
                        <p className="slide-phrase">{item.phrase}</p>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

          </div>
        </div>

      </div>
    </div>
  )
}
