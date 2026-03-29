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
import stellaPiena from '../assets/images/stella-piena.png'
import stellaVuota from '../assets/images/stella-vuota.png'

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="text-neutral-400 hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors">
        ← Back to Characters
      </Link>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-xl carta overflow-hidden border border-neutral-700 bg-neutral-800"
          style={{marginTop : '82px', height : 'fit-content'}}
        >
          <img
            src={character.image}
            alt={character.name}
            className="character-detail-image"
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
                src={isFav ? stellaPiena : stellaVuota}
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
            Transformations{' '}
            <span className="text-neutral-500 font-normal text-base">({transformations.length})</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {transformations.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i }}
                className="group relative rounded-2xl overflow-hidden cursor-default"
                style={{
                  background: 'linear-gradient(160deg, #1a1a2e 0%, #0d0d1a 100%)',
                  border: '1px solid rgba(234,179,8,0.15)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                whileHover={{
                  borderColor: 'rgba(234,179,8,0.5)',
                  boxShadow: '0 0 24px rgba(234,179,8,0.18), 0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                {/* Image area — tall enough to show full character */}
                <div
                  className="relative flex items-end justify-center overflow-hidden"
                  style={{ height: '220px', background: 'radial-gradient(ellipse at 50% 110%, rgba(234,179,8,0.07) 0%, transparent 65%)' }}
                >
                  <img
                    src={t.image}
                    alt={t.name}
                    className="h-full w-full object-contain object-bottom"
                    style={{
                      filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.7))',
                      transition: 'transform 0.35s ease, filter 0.35s ease',
                    }}
                    onError={e => { e.target.src = 'https://via.placeholder.com/200x200/1a1a2e/666?text=?' }}
                  />
                  {/* Bottom gradient so text is readable */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(13,13,26,0.95) 0%, rgba(13,13,26,0.2) 40%, transparent 100%)' }}
                  />
                </div>

                {/* Info */}
                <div className="px-3 pb-3 pt-1">
                  <p className="text-white text-sm font-bold leading-snug line-clamp-2">{t.name}</p>
                  {t.ki && (
                    <p className="text-yellow-400 text-xs mt-1 flex items-center gap-1 font-medium">
                      <FontAwesomeIcon icon={faBolt} className="text-[10px]" />
                      {t.ki}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
