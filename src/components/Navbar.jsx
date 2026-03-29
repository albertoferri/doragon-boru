import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGlobe, faFire, faMeteor, faBrain, faStar } from '@fortawesome/free-solid-svg-icons'
import dbboru from '../assets/images/dbboru.png'
import NeoToggle from './NeoToggle'

const links = [
  { to: '/characters',    label: 'Characters',  icon: faUser },
  { to: '/planets',       label: 'Planets',     icon: faGlobe },
  { to: '/battle',        label: 'Battle',      icon: faFire },
  { to: '/planet-battle', label: 'Planet War',  icon: faMeteor },
  { to: '/quiz',          label: 'Quiz',        icon: faBrain },
  { to: '/favorites',     label: 'Favorites',   icon: faStar },
]

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHome = location.pathname === '/'

  const handleLinkClick = () => setMobileOpen(false)

  const desktopLinks = isHome ? links.filter(l => l.to === '/favorites') : links

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 w-full h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={handleLinkClick}>
          <img className="invert w-10" src={dbboru} alt="Doragon Boru" />
          <span className="font-bold text-white text-lg tracking-tight hidden sm:block">
            Doragon Boru
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {desktopLinks.map(({ to, label, icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <FontAwesomeIcon icon={icon} className="text-base w-4" />
                <span className="hidden lg:block">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-neutral-700 -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center">
          <NeoToggle isOpen={mobileOpen} onToggle={() => setMobileOpen(o => !o)} />
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-neutral-800"
            style={{ background: 'rgba(17,17,17,0.98)', backdropFilter: 'blur(8px)' }}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map(({ to, label, icon }) => {
                const isActive = location.pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-neutral-700 text-white'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <FontAwesomeIcon icon={icon} className="w-4 text-base" />
                    {label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
