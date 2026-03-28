import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faChevronRight, faHandFist, faGlobe } from '@fortawesome/free-solid-svg-icons'
import db4Sphere from '../assets/images/db4sphere.png'

const RULES = [
  {
    title: 'Battle Arena — Personaggi',
    icon: faHandFist,
    color: '#60a5fa',
    items: [
      'Seleziona due combattenti dalla lista.',
      'Il KI (livello di potere) di ciascun personaggio determina il danno base per round.',
      'Ogni round entrambi i combattenti attaccano simultaneamente.',
      'Colpo Critico (20% di probabilità) raddoppia il danno inflitto.',
      'Schivata (10% di probabilità) azzera il danno ricevuto in quel round.',
      'I personaggi iniziano con 100 HP; chi rimane in piedi vince.',
      'Se entrambi finiscono a 0 HP nello stesso round, è un pareggio.',
      'I personaggi con KI "Sconosciuto" ricevono un valore nascosto deterministico unico.',
      'I personaggi con KI "Infinito" sono i più potenti e vincono quasi sempre.',
    ],
  },
  {
    title: 'Planet Battle — Pianeti',
    icon: faGlobe,
    color: '#a78bfa',
    items: [
      'Seleziona due pianeti da far scontrare.',
      'La forza di ogni pianeta è la somma del KI di tutti i suoi personaggi.',
      'I pianeti distrutti subiscono una penalità del -40% sulla forza totale.',
      'Il pianeta con il KI totale corretto più alto vince.',
      'Se il KI è identico, la battaglia termina in stallo.',
    ],
  },
]

export default function DragonBallOrb() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Floating orb button */}
      <motion.button
        onClick={() => setOpen(true)}
        title="Regolamento battaglie"
        className="fixed right-5 bottom-20 z-40 focus:outline-none"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.93 }}
        style={{ filter: 'drop-shadow(0 0 14px rgba(255,140,0,0.6))' }}
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <img src={db4Sphere} alt="Dragon Ball" width={60} height={60} style={{ objectFit: 'contain' }} />
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            className="fixed z-[60] inset-x-4 top-1/2 -translate-y-1/2 max-w-lg mx-auto"
          >
            <div style={{
              background: 'linear-gradient(145deg, #1c1c2e 0%, #16213e 60%, #0d1b2a 100%)',
              border: '1px solid rgba(255,149,0,0.28)',
              borderRadius: '1.25rem',
              boxShadow: '0 0 0 1px rgba(255,149,0,0.08), 0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(255,100,0,0.12)',
            }}>
              {/* Header */}
              <div
                className="flex items-center gap-3 px-5 pt-5 pb-4"
                style={{ borderBottom: '1px solid rgba(255,149,0,0.15)' }}
              >
                <img src={db4Sphere} alt="Dragon Ball" width={38} height={38} style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(255,140,0,0.5))' }} />
                <div className="flex-1 min-w-0">
                  <p className="font-black text-white text-lg leading-tight">Regolamento</p>
                  <p className="text-xs" style={{ color: '#ff9500' }}>Dragon Ball Battle System</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-5 max-h-[55vh] overflow-y-auto">
                {RULES.map((section, si) => (
                  <div key={si}>
                    <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: section.color }}>
                      <FontAwesomeIcon icon={section.icon} />
                      {section.title}
                    </h3>
                    <ul className="space-y-1.5">
                      {section.items.map((item, ii) => (
                        <li key={ii} className="flex gap-2 text-sm text-neutral-300 leading-snug">
                          <span className="mt-0.5 flex-shrink-0" style={{ color: '#ff9500' }}>
                            <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,149,0,0.12)' }}>
                <p className="text-xs text-center text-neutral-600">
                  Clicca ovunque fuori per chiudere
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
