import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGlobe, faFire, faMeteor, faBrain, faStar } from '@fortawesome/free-solid-svg-icons'

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img className="invert w-10" src="/src/assets/images/dbboru.png" alt="Doragon Boru" />
          <span className="font-bold text-white text-lg tracking-tight hidden sm:block">
            Doragon Boru
          </span>
        </Link>
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none">
          {links.map(({ to, label, icon }) => {
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
                <span className="hidden md:block">{label}</span>
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
      </div>
    </nav>
  )
}
