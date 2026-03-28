import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt } from '@fortawesome/free-solid-svg-icons'

const RACES = ['All', 'Saiyan', 'Human', 'Namekian', 'Frieza Race', 'Android', 'Majin', 'God', 'Angel', 'Unknown']

export default function FilterPanel({ selectedRace, onRaceChange, sortByKi, onSortToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-wrap gap-2 items-center"
    >
      <div className="flex flex-wrap gap-1.5">
        {RACES.map(race => (
          <button
            key={race}
            onClick={() => onRaceChange(race === 'All' ? '' : race)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
              (race === 'All' && !selectedRace) || selectedRace === race
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'
            }`}
          >
            {race}
          </button>
        ))}
      </div>
      <button
        onClick={onSortToggle}
        className={`ml-auto px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1.5 ${
          sortByKi
            ? 'bg-purple-700 border-purple-600 text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
            : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white'
        }`}
      >
        <FontAwesomeIcon icon={faBolt} /> Sort by KI
      </button>
    </motion.div>
  )
}
