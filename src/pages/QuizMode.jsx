import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllCharacters, getPlanets } from '../services/api'
import QuizCard from '../components/QuizCard'
import Loader from '../components/Loader'
import { shuffle } from '../utils/helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain, faUser, faGlobe, faTrophy, faStar, faDumbbell, faRotate } from '@fortawesome/free-solid-svg-icons'

export default function QuizMode() {
  const [characters, setCharacters] = useState([])
  const [planets, setPlanets] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('menu')
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
      const options = shuffle([c.name, ...wrong])
      return { image: c.image, question: 'Who is this character?', correct: c.name, options }
    })
  }

  const buildPlanetQuiz = () => {
    const pool = shuffle(planets.filter(p => p.description && p.description.length > 20)).slice(0, 10)
    return pool.map(p => {
      const wrong = shuffle(planets.filter(x => x.id !== p.id)).slice(0, 3).map(x => x.name)
      const options = shuffle([p.name, ...wrong])
      return {
        text: p.description?.slice(0, 200) + (p.description?.length > 200 ? '...' : ''),
        question: 'Which planet is described?',
        correct: p.name,
        options
      }
    })
  }

  const startQuiz = (type) => {
    const qs = type === 'character' ? buildCharacterQuiz() : buildPlanetQuiz()
    setQuestions(qs)
    setCurrent(0)
    setScore(0)
    setAnswered(false)
    setSelected(null)
    setMode(type)
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
    }, 1200)
  }

  if (loading) return <Loader text="Building quiz..." />

  const currentQ = questions[current]
  const resultIcon = score >= 8 ? faTrophy : score >= 5 ? faStar : faDumbbell

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-black text-white mb-2 flex items-center justify-center gap-3">
          <FontAwesomeIcon icon={faBrain} className="text-purple-400" /> Quiz Mode
        </h1>
        <p className="text-neutral-400">Test your Dragon Ball knowledge</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <button
              onClick={() => startQuiz('character')}
              className="card-base p-8 text-center hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-shadow duration-300 hover:border-blue-700"
            >
              <FontAwesomeIcon icon={faUser} className="text-5xl text-neutral-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Character Quiz</h3>
              <p className="text-neutral-400 text-sm">Identify characters from their images</p>
              <p className="text-blue-400 text-xs mt-2">10 questions</p>
            </button>
            <button
              onClick={() => startQuiz('planet')}
              className="card-base p-8 text-center hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-shadow duration-300 hover:border-purple-700"
            >
              <FontAwesomeIcon icon={faGlobe} className="text-5xl text-neutral-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Planet Quiz</h3>
              <p className="text-neutral-400 text-sm">Identify planets from their descriptions</p>
              <p className="text-purple-400 text-xs mt-2">10 questions</p>
            </button>
          </motion.div>
        )}

        {(mode === 'character' || mode === 'planet') && currentQ && (
          <motion.div
            key={`q-${current}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <p className="text-neutral-400 text-sm">Question {current + 1} / {questions.length}</p>
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
              question={currentQ}
              options={currentQ.options}
              onAnswer={handleAnswer}
              answered={answered}
              correct={currentQ.correct}
              selected={selected}
            />
          </motion.div>
        )}

        {mode === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-base p-10 text-center"
          >
            <FontAwesomeIcon
              icon={resultIcon}
              className="text-7xl mb-4"
              style={{ color: score >= 8 ? '#facc15' : score >= 5 ? '#a78bfa' : '#60a5fa' }}
            />
            <h2 className="text-3xl font-black text-white mb-2">
              {score} / {questions.length}
            </h2>
            <p className="text-neutral-400 mb-6">
              {score >= 8 ? 'Incredible! You know the Dragon Ball universe inside out!'
                : score >= 5 ? 'Good job! Your power level is over 9000!'
                : 'Keep training, young warrior!'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setMode('menu')} className="btn-secondary">
                ← Back to Menu
              </button>
              <button onClick={() => startQuiz(mode === 'result' ? 'character' : mode)} className="btn-primary flex items-center gap-2">
                <FontAwesomeIcon icon={faRotate} /> Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
