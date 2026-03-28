import { motion } from 'framer-motion'

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-neutral-700 border-t-blue-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-neutral-400 text-sm">{text}</p>
    </div>
  )
}
