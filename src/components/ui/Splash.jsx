// src/components/ui/Splash.jsx
import { motion } from 'framer-motion'
import { FaTruck } from 'react-icons/fa'

export default function Splash() {
  return (
    <div className="fixed inset-0 bg-brand-700 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ duration: 0.4, ease: 'backOut' }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center">
          <FaTruck className="text-white text-4xl" />
        </div>
        <p className="text-white font-semibold text-lg">Canhoto de Entrega</p>
        <div className="flex gap-1.5 mt-2">
          {[0,1,2].map(i => (
            <motion.div key={i} className="w-2 h-2 bg-white/60 rounded-full"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
