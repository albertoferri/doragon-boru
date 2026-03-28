import { motion } from 'framer-motion'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div className="text-5xl">⚠️</div>
      <p className="text-neutral-300 text-center max-w-md">{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-2">
          Try Again
        </button>
      )}
    </motion.div>
  )
}
