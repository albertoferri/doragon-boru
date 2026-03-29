import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPlanetById } from '../services/api'
import useFetch from '../hooks/useFetch'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import CharacterCard from '../components/CharacterCard'
import { useFavorites } from '../context/FavoritesContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSkull, faCircleCheck, faGhost } from '@fortawesome/free-solid-svg-icons'
import stellaPiena from '../assets/images/stella-piena.png'
import stellaVuota from '../assets/images/stella-vuota.png'

export default function PlanetDetail() {
  const { id } = useParams()
  const { data: planet, loading, error, refetch } = useFetch(() => getPlanetById(id), [id])
  const { toggleFavPlanet, isFavPlanet } = useFavorites()

  if (loading) return <Loader text="Loading planet data..." />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />
  if (!planet) return null

  const characters = planet.characters || []
  const isFav = isFavPlanet(planet.id)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/planets" className="text-neutral-400 hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors">
        ← Back to Planets
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl overflow-hidden border border-neutral-700"
        >
          <img
            src={planet.image}
            alt={planet.name}
            className="w-full h-80 object-cover"
            onError={e => { e.target.src = 'https://via.placeholder.com/600x400/262626/666?text=?' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.07 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-black text-white">{planet.name}</h1>
              <span className={`mt-2 inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full border ${
                planet.isDestroyed
                  ? 'bg-red-900/40 text-red-400 border-red-800'
                  : 'bg-green-900/40 text-green-400 border-green-800'
              }`}>
                <FontAwesomeIcon icon={planet.isDestroyed ? faSkull : faCircleCheck} className="text-xs" />
                {planet.isDestroyed ? 'Destroyed' : 'Alive'}
              </span>
            </div>
            <button
              onClick={() => toggleFavPlanet(planet)}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            >
              <img
                src={isFav ? stellaPiena : stellaVuota}
                alt={isFav ? "Favorite" : "Not Favorite"}
                className="w-7 h-7"
              />
            </button>
          </div>

          {planet.description && (
            <div className="card-base p-4">
              <h3 className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Description</h3>
              <p className="text-neutral-200 text-sm leading-relaxed">{planet.description}</p>
            </div>
          )}

          <div className="card-base p-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-neutral-500 text-xs">Status</p>
              <p className="text-white font-medium">{planet.isDestroyed ? 'Destroyed' : 'Active'}</p>
            </div>
            <div>
              <p className="text-neutral-500 text-xs">Residents</p>
              <p className="text-white font-medium">{characters.length} known</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Residents <span className="text-neutral-500 font-normal text-base">({characters.length})</span>
        </h2>
        {characters.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {characters.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        ) : (
          <div className="card-base p-8 text-center">
            <FontAwesomeIcon icon={faGhost} className="text-4xl text-neutral-600 mb-3" />
            <p className="text-neutral-400">No known residents for this planet</p>
          </div>
        )}
      </div>
    </div>
  )
}
