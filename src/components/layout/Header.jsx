// src/components/layout/Header.jsx
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { FaFileAlt } from 'react-icons/fa'

export default function Header({ title, subtitle, showBack = false, showDoc = false, onDocPress }) {
  const navigate = useNavigate()
  return (
    <header className="bg-brand-700 text-white px-4 pt-[env(safe-area-inset-top)] pt-4 pb-5
                       flex items-center gap-3 relative">
      {showBack ? (
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15
                     active:bg-white/25 transition-colors shrink-0">
          <FiArrowLeft className="text-lg" />
        </button>
      ) : <div className="w-9" />}

      <div className="flex-1 text-center">
        <h1 className="font-bold text-base leading-tight">{title}</h1>
        {subtitle && <p className="text-white/75 text-xs mt-0.5">{subtitle}</p>}
      </div>

      {showDoc ? (
        <button onClick={onDocPress}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15
                     active:bg-white/25 transition-colors shrink-0">
          <FaFileAlt className="text-base" />
        </button>
      ) : <div className="w-9" />}
    </header>
  )
}
