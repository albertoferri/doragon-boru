import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllCharacters } from '../services/api'
import CharacterCard from '../components/CharacterCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { parseKi } from '../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faGear, faXmark, faBolt } from '@fortawesome/free-solid-svg-icons'

const RACES = ['Saiyan', 'Human', 'Namekian', 'Frieza Race', 'Android', 'Majin', 'God', 'Angel', 'Unknown']
const PAGE_SIZE = 24

export default function Home() {
  const [allChars, setAllChars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [race, setRace] = useState('')
  const [sortByKi, setSortByKi] = useState(false)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const load = () => {
    setLoading(true)
    setError(null)
    getAllCharacters()
      .then(data => setAllChars(data.items || data))
      .catch(e => setError(e.message || 'Failed to load characters'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = useMemo(() => {
    return allChars
      .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))
      .filter(c => !race || c.race === race)
      .sort((a, b) => sortByKi ? parseKi(b.ki) - parseKi(a.ki) : 0)
  }, [allChars, search, race, sortByKi])

  useEffect(() => { setPage(1) }, [search, race, sortByKi])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasActiveFilters = race || sortByKi

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (loading) return <Loader text="Loading characters..." />
  if (error) return <ErrorMessage message={error} onRetry={load} />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-black text-white mb-1">Characters</h1>
        <p className="text-neutral-500 text-sm">{allChars.length} fighters in the Dragon Ball Universe</p>
      </motion.div>

      {/* Search + Filter button */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm pointer-events-none">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-blue-500/70 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
          style={{
            background: hasActiveFilters ? 'rgba(37,99,235,0.2)' : 'rgba(38,38,38,1)',
            borderColor: hasActiveFilters ? 'rgba(59,130,246,0.6)' : 'rgba(64,64,64,1)',
            color: hasActiveFilters ? '#93c5fd' : '#a3a3a3',
          }}
        >
          <FontAwesomeIcon icon={faGear} /> Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
          )}
        </button>
      </div>

      {/* Results info */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-neutral-500 text-xs">
          {filtered.length === allChars.length
            ? `${allChars.length} characters`
            : `${filtered.length} of ${allChars.length} characters`}
          {totalPages > 1 && ` · page ${page} / ${totalPages}`}
        </p>
        {hasActiveFilters && (
          <button
            onClick={() => { setRace(''); setSortByKi(false) }}
            className="text-xs text-neutral-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <FontAwesomeIcon icon={faXmark} /> Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {paginated.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginated.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-5xl text-neutral-700 mb-4" />
            <p className="text-neutral-400 mb-2">No characters match your search</p>
            <button
              onClick={() => { setSearch(''); setRace(''); setSortByKi(false) }}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); scrollToTop() }}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm disabled:opacity-30 hover:bg-neutral-700 transition-all"
          >
            ← Prev
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4))
              const pageNum = start + i
              if (pageNum > totalPages) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => { setPage(pageNum); scrollToTop() }}
                  className="w-10 h-10 rounded-xl border text-sm font-medium transition-all"
                  style={{
                    background: pageNum === page ? '#2563eb' : '#262626',
                    borderColor: pageNum === page ? '#3b82f6' : '#404040',
                    color: pageNum === page ? '#fff' : '#a3a3a3',
                  }}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => { setPage(p => Math.min(totalPages, p + 1)); scrollToTop() }}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-white text-sm disabled:opacity-30 hover:bg-neutral-700 transition-all"
          >
            Next →
          </button>
        </div>
      )}

      {/* Filter Drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 h-full w-72 bg-neutral-900 border-l border-neutral-800 z-50 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-bold text-lg">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              {/* Race */}
              <div className="mb-8">
                <label className="text-neutral-300 font-medium text-sm mb-3 block">Race</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setRace('')}
                    className="px-3 py-1.5 rounded-full text-xs border transition-all"
                    style={{
                      background: !race ? '#2563eb' : '#262626',
                      borderColor: !race ? '#3b82f6' : '#404040',
                      color: !race ? '#fff' : '#a3a3a3',
                    }}
                  >
                    All
                  </button>
                  {RACES.map(r => (
                    <button
                      key={r}
                      onClick={() => setRace(r)}
                      className="px-3 py-1.5 rounded-full text-xs border transition-all"
                      style={{
                        background: race === r ? '#2563eb' : '#262626',
                        borderColor: race === r ? '#3b82f6' : '#404040',
                        color: race === r ? '#fff' : '#a3a3a3',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div className="mb-8">
                <label className="text-neutral-300 font-medium text-sm mb-3 block">Sort by</label>
                <button
                  onClick={() => setSortByKi(v => !v)}
                  className="w-full py-2.5 rounded-xl border text-sm text-left px-4 transition-all flex items-center gap-2"
                  style={{
                    background: sortByKi ? 'rgba(124,58,237,0.25)' : '#262626',
                    borderColor: sortByKi ? '#7c3aed' : '#404040',
                    color: sortByKi ? '#c4b5fd' : '#a3a3a3',
                  }}
                >
                  <FontAwesomeIcon icon={faBolt} /> Power Level (Ki) ↓
                </button>
              </div>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  onClick={() => { setRace(''); setSortByKi(false) }}
                  className="w-full py-2.5 rounded-xl border text-sm transition-all flex items-center justify-center gap-2"
                  style={{
                    background: 'rgba(127,29,29,0.3)',
                    borderColor: 'rgba(185,28,28,0.5)',
                    color: '#fca5a5',
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} /> Clear all filters
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
