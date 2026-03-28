import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavorites } from '../context/FavoritesContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSkull, faGlobe } from '@fortawesome/free-solid-svg-icons'
import stellaPiena from '../assets/images/stella-piena.png'
import stellaVuota from '../assets/images/stella-vuota.png'

// Deterministic starfield based on planet id
function Stars({ seed }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const n = (seed * 31 + i * 127 + i) & 0x7fff
    return {
      x: n % 100,
      y: (n * 7 + i * 13) % 100,
      r: (n % 3) * 0.5 + 0.5,
      op: 0.25 + (n % 5) * 0.08,
    }
  })
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.op} />
      ))}
    </svg>
  )
}

export default function PlanetCard({ planet }) {
  const { toggleFavPlanet, isFavPlanet } = useFavorites()
  const isFav = isFavPlanet(planet.id)
  const [hovered, setHovered] = useState(false)
  const seedNum = (typeof planet.id === 'number' ? planet.id : parseInt(planet.id) || 7) & 0x7fff

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative overflow-hidden cursor-pointer group"
      style={{
        borderRadius: '1rem',
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0d0d22 40%, #08081a 100%)',
        border: hovered
          ? '1px solid rgba(139,92,246,0.5)'
          : '1px solid rgba(139,92,246,0.22)',
        boxShadow: hovered
          ? '0 0 24px rgba(139,92,246,0.25), 0 8px 30px rgba(0,0,0,0.5)'
          : '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'border 0.3s, box-shadow 0.3s',
      }}
    >
      {/* Starfield background */}
      <Stars seed={seedNum} />

      {/* Cosmic glow top-right */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '80px', height: '80px',
          borderRadius: '50%',
          background: planet.isDestroyed
            ? 'radial-gradient(circle, rgba(239,68,68,0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Link to={`/planets/${planet.id}`} className="block">
        <div className="flex items-center gap-3 p-3">
          {/* Circular planet image */}
          <div className="flex-shrink-0 relative">
            <div
              className="w-20 h-20 rounded-full overflow-hidden"
              style={{
                border: planet.isDestroyed
                  ? '2px solid rgba(239,68,68,0.5)'
                  : '2px solid rgba(139,92,246,0.5)',
                boxShadow: planet.isDestroyed
                  ? '0 0 12px rgba(239,68,68,0.2)'
                  : '0 0 12px rgba(139,92,246,0.25)',
              }}
            >
              <img
                src={planet.image}
                alt={planet.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                onError={e => { e.target.src = 'https://via.placeholder.com/80/0d0d1a/6666aa?text=?' }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm truncate leading-snug mb-1">
              {planet.name}
            </h3>
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mb-1.5 ${
              planet.isDestroyed
                ? 'bg-red-900/40 text-red-400 border border-red-800/50'
                : 'bg-purple-900/40 text-purple-400 border border-purple-800/50'
            }`}>
              <FontAwesomeIcon icon={planet.isDestroyed ? faSkull : faGlobe} className="text-xs" />
              {planet.isDestroyed ? ' Distrutto' : ' Esistente'}
            </span>
            {planet.description && (
              <p className="text-xs leading-snug line-clamp-2" style={{ color: 'rgba(180,170,220,0.55)' }}>
                {planet.description}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={e => { e.preventDefault(); toggleFavPlanet(planet) }}
        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
        style={{ background: 'transparent', border: 'transparent' }}
      >
        <img
          src={isFav ? stellaPiena : stellaVuota}
          alt={isFav ? "Favorite" : "Not Favorite"}
          className="w-6 h-6"
        />
      </button>
    </motion.div>
  )
}
