import { motion, AnimatePresence } from 'framer-motion'
import { useFavorites } from '../context/FavoritesContext'
import CharacterCard from '../components/CharacterCard'
import PlanetCard from '../components/PlanetCard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGlobe, faStar } from '@fortawesome/free-solid-svg-icons'
import stellaGrande from '../assets/images/stella-grande.png'

export default function Favorites() {
  const { favCharacters, favPlanets } = useFavorites()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="flex items-center gap-2 text-4xl font-black text-white mb-2">
          <img className="w-10 h-10" src={stellaGrande} alt="" />
          Favorites
        </h1>
        <p className="text-neutral-400">Your saved characters and planets</p>
      </motion.div>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Characters <span className="text-neutral-500 font-normal text-base ml-1">({favCharacters.length})</span>
          </h2>
        </div>
        <AnimatePresence>
          {favCharacters.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favCharacters.map(char => (
                <CharacterCard key={char.id} character={char} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-base p-10 text-center"
            >
              <FontAwesomeIcon icon={faUser} className="text-4xl text-neutral-600 mb-3" />
              <p className="text-neutral-400">No favorite characters yet</p>
              <p className="text-neutral-500 text-sm mt-1 flex items-center justify-center gap-1">
                Click the <FontAwesomeIcon icon={faStar} className="text-yellow-400" /> on any character card to save them here
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            Planets <span className="text-neutral-500 font-normal text-base ml-1">({favPlanets.length})</span>
          </h2>
        </div>
        <AnimatePresence>
          {favPlanets.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favPlanets.map(planet => (
                <PlanetCard key={planet.id} planet={planet} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-base p-10 text-center"
            >
              <FontAwesomeIcon icon={faGlobe} className="text-4xl text-neutral-600 mb-3" />
              <p className="text-neutral-400">No favorite planets yet</p>
              <p className="text-neutral-500 text-sm mt-1 flex items-center justify-center gap-1">
                Click the <FontAwesomeIcon icon={faStar} className="text-yellow-400" /> on any planet card to save them here
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
