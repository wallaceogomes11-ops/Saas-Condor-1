// src/components/ui/EmptyState.jsx
import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
        <Icon className="text-gray-400 text-3xl" />
      </div>
      <h3 className="font-bold text-gray-700 text-base mb-1">{title}</h3>
      {description && <p className="text-gray-400 text-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </motion.div>
  )
}
