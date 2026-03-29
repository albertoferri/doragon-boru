import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPlanets } from '../services/api'
import useFetch from '../hooks/useFetch'
import PlanetCard from '../components/PlanetCard'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faSkull, faCircleCheck, faMeteor } from '@fortawesome/free-solid-svg-icons'
import TypewriterText from '../components/TypewriterText'

export default function Planets() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const { data, loading, error, refetch } = useFetch(() => getPlanets())

  const planets = data?.items || data || []

  const filtered = planets
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => {
      if (filter === 'alive') return !p.isDestroyed
      if (filter === 'destroyed') return p.isDestroyed
      return true
    })

  if (loading) return <Loader text="Scanning the universe..." />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />

  const FILTERS = [
    { key: 'all',       icon: faGlobe,        label: 'All' },
    { key: 'alive',     icon: faCircleCheck,  label: 'Alive' },
    { key: 'destroyed', icon: faSkull,        label: 'Destroyed' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
          <FontAwesomeIcon icon={faGlobe} className="text-purple-400" />
          <TypewriterText text="Planets" speed={55} />
        </h1>
        <p className="text-neutral-400">Discover worlds across the Dragon Ball universe</p>
      </motion.div>

      <div className="space-y-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search planets..." />
        <div className="flex gap-2">
          {FILTERS.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-1.5 ${
                filter === key
                  ? 'bg-purple-700 border-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
              }`}
            >
              <FontAwesomeIcon icon={icon} className="text-xs" /> {label}
              <span className="ml-1 text-xs opacity-70">
                ({key === 'all' ? planets.length : planets.filter(p => key === 'alive' ? !p.isDestroyed : p.isDestroyed).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-neutral-500 text-sm mb-4">{filtered.length} planet{filtered.length !== 1 ? 's' : ''}</p>

      <AnimatePresence>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(planet => (
              <PlanetCard key={planet.id} planet={planet} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FontAwesomeIcon icon={faMeteor} className="text-5xl text-neutral-700 mb-4" />
            <p className="text-neutral-400">No planets found</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
