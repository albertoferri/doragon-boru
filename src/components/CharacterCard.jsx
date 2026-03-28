import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavorites } from '../context/FavoritesContext'
import { getRaceBadgeStyle } from '../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'

export default function CharacterCard({ character }) {
  const { toggleFavCharacter, isFavCharacter } = useFavorites()
  const isFav = isFavCharacter(character.id)
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16
    setTilt({ x, y })
  }

  const handleMouseEnter = () => setHovered(true)

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative cursor-pointer group"
      style={{
        transform: `perspective(900px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transition: hovered
          ? 'transform 0.1s ease, box-shadow 0.3s ease'
          : 'transform 0.5s ease, box-shadow 0.3s ease',
        boxShadow: hovered
          ? '0 0 28px rgba(59,130,246,0.28), 0 20px 40px rgba(0,0,0,0.45)'
          : '0 4px 12px rgba(0,0,0,0.25)',
        zIndex: hovered ? 20 : 1,
        borderRadius: '0.75rem',
        background: '#262626',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.35)' : 'rgba(64,64,64,0.8)'}`,
      }}
    >
      <Link to={`/characters/${character.id}`} className="block">
        {/* Image container */}
        <div
          className="relative rounded-t-xl bg-neutral-900/60"
          style={{
            height: '12rem',
            overflow: 'visible',
            clipPath: hovered
              ? 'inset(-22% -12% 0% -12% round 12px)'
              : 'inset(0% round 12px)',
            transition: 'clip-path 0.4s cubic-bezier(0.34, 1.4, 0.64, 1)',
          }}
        >
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-full object-cover object-top"
            style={{
              transform: hovered ? 'scale(1.18)' : 'scale(1)',
              transformOrigin: 'center center',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
            loading="lazy"
            onError={e => {
              e.currentTarget.src = 'https://placehold.co/300x400/171717/404040?text=?'
            }}
          />
          {/* Gradient overlay (only when not hovered) */}
          <div
            className="absolute inset-0 pointer-events-none rounded-t-xl"
            style={{
              background: 'linear-gradient(to top, rgba(38,38,38,0.85) 0%, transparent 60%)',
              opacity: hovered ? 0 : 1,
              transition: 'opacity 0.3s ease',
            }}
          />
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-white text-sm truncate mb-2 leading-snug">
            {character.name}
          </h3>
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getRaceBadgeStyle(character.race)}`}>
              {character.race || 'Unknown'}
            </span>
            {character.ki && (
              <span className="text-xs text-yellow-400 font-mono flex items-center gap-1 shrink-0">
                <FontAwesomeIcon icon={faBolt} className="text-xs" />
                {character.ki.length > 10 ? character.ki.slice(0, 10) + '…' : character.ki}
              </span>
            )}
          </div>
          {character.affiliation && (
            <p className="text-xs text-neutral-500 mt-1.5 truncate">{character.affiliation}</p>
          )}
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={e => { e.preventDefault(); toggleFavCharacter(character) }}
        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
        style={{
          zIndex: 30,
          background: 'transparent',
          border: 'transparent',
        }}
      >
        <img src={
          isFav
            ? "/src/assets/images/stella-piena.png"
            : "/src/assets/images/stella-vuota.png"
          }
          alt={isFav ? "Favorite" : "Not Favorite"}
          className="w-6 h-6"
        />
      </button>
    </motion.div>
  )
}
