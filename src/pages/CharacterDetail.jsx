import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getCharacterById } from '../services/api'
import useFetch from '../hooks/useFetch'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import { useFavorites } from '../context/FavoritesContext'
import { getRaceBadgeStyle } from '../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faSun, faGlobe, faFlag } from '@fortawesome/free-solid-svg-icons'

export default function CharacterDetail() {
  const { id } = useParams()
  const { data: character, loading, error, refetch } = useFetch(() => getCharacterById(id), [id])
  const { toggleFavCharacter, isFavCharacter } = useFavorites()

  if (loading) return <Loader text="Loading fighter data..." />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />
  if (!character) return null

  const isFav = isFavCharacter(character.id)
  const transformations = character.transformations || []

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/" className="text-neutral-400 hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors">
        ← Back to Characters
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl overflow-hidden border border-neutral-700 bg-neutral-800"
        >
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-96 object-cover object-top"
            onError={e => { e.target.src = 'https://via.placeholder.com/600x600/262626/666?text=?' }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">{character.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${getRaceBadgeStyle(character.race)}`}>
                  {character.race || 'Unknown'}
                </span>
                {character.gender && (
                  <span className="text-xs px-2 py-0.5 rounded-full border bg-neutral-700/40 text-neutral-400 border-neutral-600">
                    {character.gender}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => toggleFavCharacter(character)}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all"
            >
              <img
                src={isFav ? "/src/assets/images/stella-piena.png" : "/src/assets/images/stella-vuota.png"}
                alt={isFav ? "Favorite" : "Not Favorite"}
                className="w-7 h-7"
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'KI',          value: character.ki,          icon: faBolt,  color: 'text-yellow-400' },
              { label: 'Max KI',      value: character.maxKi,       icon: faSun,   color: 'text-orange-400' },
              { label: 'Affiliation', value: character.affiliation,  icon: faFlag,  color: 'text-blue-400' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="card-base p-3">
                <p className="text-neutral-500 text-xs mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={icon} className="text-xs" /> {label}
                </p>
                <p className={`font-semibold text-sm ${color} truncate`}>{value || '—'}</p>
              </div>
            ))}
            {character.originPlanet && (
              <Link
                to={`/planets/${character.originPlanet.id}`}
                className="card-base p-3 hover:border-purple-600 transition-colors"
              >
                <p className="text-neutral-500 text-xs mb-1 flex items-center gap-1">
                  <FontAwesomeIcon icon={faGlobe} className="text-xs" /> Origin Planet
                </p>
                <p className="text-purple-400 font-semibold text-sm">{character.originPlanet.name}</p>
              </Link>
            )}
          </div>

          {character.description && (
            <div className="card-base p-4">
              <h3 className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Description</h3>
              <p className="text-neutral-200 text-sm leading-relaxed">{character.description}</p>
            </div>
          )}
        </motion.div>
      </div>

      {transformations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">
            Transformations <span className="text-neutral-500 font-normal text-base">({transformations.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {transformations.map(t => (
              <div key={t.id} className="card-base overflow-hidden hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-shadow">
                <div className="h-36 overflow-hidden bg-neutral-900/50">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover object-top"
                    onError={e => { e.target.src = 'https://via.placeholder.com/200x200/262626/666?text=?' }}
                  />
                </div>
                <div className="p-3">
                  <p className="text-white text-sm font-medium truncate">{t.name}</p>
                  {t.ki && (
                    <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1">
                      <FontAwesomeIcon icon={faBolt} className="text-xs" /> {t.ki}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
