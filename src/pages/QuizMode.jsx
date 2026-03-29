import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllCharacters, getPlanets } from '../services/api'
import QuizCard from '../components/QuizCard'
import Loader from '../components/Loader'
import { shuffle } from '../utils/helpers'
import { translateText } from '../utils/translate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TypewriterText from '../components/TypewriterText'
import {
  faBrain, faUser, faGlobe, faTrophy, faStar, faDumbbell,
  faRotate, faEyeSlash, faScroll, faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

const QUIZ_TYPES = [
  {
    id: 'character',
    label: 'Character Quiz',
    desc: 'Identify fighters from their image',
    icon: faUser,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.22)',
    border: 'rgba(59,130,246,0.5)',
  },
  {
    id: 'silhouette',
    label: 'Silhouette Quiz',
    desc: 'Guess who hides in the shadow',
    icon: faEyeSlash,
    color: '#f97316',
    glow: 'rgba(249,115,22,0.22)',
    border: 'rgba(249,115,22,0.5)',
  },
  {
    id: 'description',
    label: 'Lore Quiz',
    desc: 'Read the hint, name the fighter',
    icon: faScroll,
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.22)',
    border: 'rgba(34,197,94,0.5)',
  },
  {
    id: 'planet',
    label: 'Planet Quiz',
    desc: 'Identify planets from their lore',
    icon: faGlobe,
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.22)',
    border: 'rgba(168,85,247,0.5)',
  },
]

export default function QuizMode() {
  const [characters, setCharacters] = useState([])
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('menu')
  const [lastMode, setLastMode] = useState('character')
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    Promise.all([getAllCharacters(), getPlanets()])
      .then(([cData, pData]) => {
        setCharacters(cData.items || cData)
        setPlanets(pData.items || pData)
      })
      .finally(() => setLoading(false))
  }, [])

  const buildCharacterQuiz = () => {
    const pool = shuffle(characters.filter(c => c.image)).slice(0, 10)
    return pool.map(c => {
      const wrong = shuffle(characters.filter(x => x.id !== c.id)).slice(0, 3).map(x => x.name)
      return { type: 'character', image: c.image, question: 'Who is this fighter?', correct: c.name, options: shuffle([c.name, ...wrong]) }
    })
  }

  const buildSilhouetteQuiz = () => {
    const pool = shuffle(characters.filter(c => c.image)).slice(0, 10)
    return pool.map(c => {
      const wrong = shuffle(characters.filter(x => x.id !== c.id)).slice(0, 3).map(x => x.name)
      return { type: 'silhouette', image: c.image, question: 'Who hides in the shadow?', correct: c.name, options: shuffle([c.name, ...wrong]) }
    })
  }

  const buildDescriptionQuiz = () => {
    const pool = shuffle(characters.filter(c => c.description && c.description.length > 40)).slice(0, 10)
    return pool.map(c => {
      const wrong = shuffle(characters.filter(x => x.id !== c.id)).slice(0, 3).map(x => x.name)
      return {
        type: 'description',
        text: c.description.slice(0, 240) + (c.description.length > 240 ? '...' : ''),
        image: c.image,
        question: 'Which fighter is described?',
        correct: c.name,
        options: shuffle([c.name, ...wrong]),
      }
    })
  }

  const buildPlanetQuiz = () => {
    const pool = shuffle(planets.filter(p => p.description && p.description.length > 20)).slice(0, 10)
    return pool.map(p => {
      const wrong = shuffle(planets.filter(x => x.id !== p.id)).slice(0, 3).map(x => x.name)
      return {
        type: 'planet',
        text: p.description?.slice(0, 220) + (p.description?.length > 220 ? '...' : ''),
        question: 'Which planet is described?',
        correct: p.name,
        options: shuffle([p.name, ...wrong]),
      }
    })
  }

  const startQuiz = async (type) => {
    const builders = {
      character: buildCharacterQuiz,
      silhouette: buildSilhouetteQuiz,
      description: buildDescriptionQuiz,
      planet: buildPlanetQuiz,
    }
    const qs = builders[type]()
    setCurrent(0)
    setScore(0)
    setAnswered(false)
    setSelected(null)
    setLastMode(type)
    setMode(type)
    setQuestions(qs)

    // Translate text fields in background — swap when ready
    const needsTranslation = qs.filter(q => q.text)
    if (needsTranslation.length === 0) return
    const translated = await Promise.all(
      needsTranslation.map(q => translateText(q.text))
    )
    setQuestions(prev =>
      prev.map(q => {
        if (!q.text) return q
        const idx = needsTranslation.indexOf(q)
        return idx !== -1 ? { ...q, text: translated[idx] } : q
      })
    )
  }

  const handleAnswer = (opt) => {
    setSelected(opt)
    setAnswered(true)
    if (opt === questions[current].correct) setScore(s => s + 1)
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(c => c + 1)
        setAnswered(false)
        setSelected(null)
      } else {
        setMode('result')
      }
    }, 1400)
  }

  if (loading) return <Loader text="Building quiz..." />

  const currentQ = questions[current]
  const resultIcon = score >= 8 ? faTrophy : score >= 5 ? faStar : faDumbbell
  const isPlaying = ['character', 'silhouette', 'description', 'planet'].includes(mode)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-black text-white mb-2 flex items-center justify-center gap-3">
          <FontAwesomeIcon icon={faBrain} className="text-purple-400" />
          <TypewriterText text="Quiz Mode" speed={55} />
        </h1>
        <p className="text-neutral-400">Test your Dragon Ball knowledge</p>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── Menu ── */}
        {mode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {QUIZ_TYPES.map(qt => (
              <motion.button
                key={qt.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                onClick={() => startQuiz(qt.id)}
                className="card-base p-7 text-left group transition-all duration-300"
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 0 28px ${qt.glow}`
                  e.currentTarget.style.borderColor = qt.border
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.borderColor = ''
                }}
              >
                <FontAwesomeIcon icon={qt.icon} className="text-4xl mb-4 block" style={{ color: qt.color }} />
                <h3 className="text-lg font-bold text-white mb-1">{qt.label}</h3>
                <p className="text-neutral-400 text-sm mb-4">{qt.desc}</p>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${qt.color}22`, color: qt.color }}
                >
                  10 questions
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* ── Playing ── */}
        {isPlaying && currentQ && (
          <motion.div
            key={`q-${current}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="space-y-4 max-w-xl mx-auto"
          >
            {/* Progress bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMode('menu')}
                  className="flex items-center gap-1.5 text-neutral-500 hover:text-white text-xs font-medium transition-colors"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="text-xs" /> Menu
                </button>
                <p className="text-neutral-400 text-sm">Question {current + 1} / {questions.length}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-yellow-400 font-semibold flex items-center gap-1">
                  <FontAwesomeIcon icon={faStar} className="text-xs" /> {score}
                </p>
                <div className="w-32 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <QuizCard
              key={current}
              question={currentQ}
              options={currentQ.options}
              onAnswer={handleAnswer}
              answered={answered}
              correct={currentQ.correct}
              selected={selected}
            />
          </motion.div>
        )}

        {/* ── Result ── */}
        {mode === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-base p-10 text-center max-w-md mx-auto"
          >
            <FontAwesomeIcon
              icon={resultIcon}
              className="text-7xl mb-4"
              style={{ color: score >= 8 ? '#facc15' : score >= 5 ? '#a78bfa' : '#60a5fa' }}
            />
            <h2 className="text-3xl font-black text-white mb-2">{score} / {questions.length}</h2>
            <p className="text-neutral-400 mb-6">
              {score >= 8
                ? 'Incredible! You know the Dragon Ball universe inside out!'
                : score >= 5
                ? 'Good job! Your power level is over 9000!'
                : 'Keep training, young warrior!'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setMode('menu')} className="btn-secondary">
                ← Back to Menu
              </button>
              <button onClick={() => startQuiz(lastMode)} className="btn-primary flex items-center gap-2">
                <FontAwesomeIcon icon={faRotate} /> Play Again
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
