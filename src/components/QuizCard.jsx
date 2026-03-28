import { motion } from 'framer-motion'

export default function QuizCard({ question, options, onAnswer, answered, correct, selected }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card-base p-6 space-y-4"
    >
      <div className="text-center">
        {question.image && (
          <img
            src={question.image}
            alt="Quiz"
            className="w-40 h-40 object-cover object-top rounded-xl mx-auto mb-4 border border-neutral-700"
            onError={e => { e.target.src = 'https://via.placeholder.com/160/262626/666?text=?' }}
          />
        )}
        {question.text && (
          <p className="text-neutral-300 text-sm leading-relaxed">{question.text}</p>
        )}
        <p className="text-white font-semibold mt-3">{question.question}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          let cls = 'border border-neutral-700 bg-neutral-800 text-neutral-300 hover:border-neutral-500 hover:text-white'
          if (answered) {
            if (opt === correct) cls = 'border-green-600 bg-green-900/30 text-green-400 shadow-[0_0_12px_rgba(74,222,128,0.2)]'
            else if (opt === selected && opt !== correct) cls = 'border-red-600 bg-red-900/30 text-red-400'
            else cls = 'border-neutral-700 bg-neutral-800 text-neutral-500'
          }
          return (
            <button
              key={i}
              onClick={() => !answered && onAnswer(opt)}
              disabled={answered}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${cls}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}
