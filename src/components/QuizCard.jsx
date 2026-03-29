import { motion } from 'framer-motion'

export default function QuizCard({ question, options, onAnswer, answered, correct, selected }) {
  return (
    <div className="card-base p-6 space-y-5">
      <div className="text-center">

        {/* Normal or silhouette image */}
        {question.image && (question.type === 'character' || question.type === 'silhouette') && (
          <div
            className="relative inline-block mb-4 rounded-2xl overflow-hidden"
            style={
              question.type === 'silhouette' && !answered
                ? { outline: '2px solid rgba(251,191,36,0.25)', outlineOffset: '2px' }
                : {}
            }
          >
            <img
              src={question.image}
              alt={answered ? correct : '???'}
              className="w-48 h-52 object-cover object-top block"
              style={
                question.type === 'silhouette'
                  ? {
                      filter: answered ? 'none' : 'brightness(0)',
                      transition: 'filter 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                    }
                  : {}
              }
              onError={e => { e.target.src = 'https://via.placeholder.com/200x220/262626/666?text=?' }}
            />

            {/* Pulsing "?" overlay on silhouette */}
            {question.type === 'silhouette' && !answered && (
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <span className="text-6xl font-black select-none" style={{ color: 'rgba(251,191,36,0.2)' }}>?</span>
              </motion.div>
            )}
          </div>
        )}

        {/* Description text */}
        {question.text && (
          <div
            className="rounded-xl p-4 mb-4 text-left"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <p className="text-neutral-300 text-sm leading-relaxed">"{question.text}"</p>
          </div>
        )}

        {/* Reveal character portrait after description answer */}
        {question.type === 'description' && answered && question.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
            className="flex flex-col items-center gap-1.5 mb-3"
          >
            <img
              src={question.image}
              alt={correct}
              className="w-16 h-16 object-cover object-top rounded-full border-2"
              style={{ borderColor: selected === correct ? '#22c55e' : '#ef4444' }}
              onError={e => { e.target.src = 'https://via.placeholder.com/80/262626/666?text=?' }}
            />
            <span className="text-xs font-semibold" style={{ color: selected === correct ? '#22c55e' : '#ef4444' }}>
              {correct}
            </span>
          </motion.div>
        )}

        <p className="text-white font-semibold mt-1">{question.question}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          let cls = 'border border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500 hover:text-white'
          let extraStyle = {}
          if (answered) {
            if (opt === correct) {
              cls = 'border-green-600 bg-green-900/30 text-green-400'
              extraStyle = { boxShadow: '0 0 12px rgba(74,222,128,0.2)' }
            } else if (opt === selected && opt !== correct) {
              cls = 'border-red-600 bg-red-900/30 text-red-400'
            } else {
              cls = 'border-neutral-800 bg-neutral-800/50 text-neutral-600'
            }
          }
          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(opt)}
              disabled={answered}
              style={extraStyle}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
