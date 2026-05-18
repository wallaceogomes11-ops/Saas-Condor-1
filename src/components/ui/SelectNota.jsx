// src/components/ui/SelectNota.jsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiCheck, FiSearch } from 'react-icons/fi'

export default function SelectNota({ notas, value, onChange, placeholder = 'Selecione a nota fiscal' }) {
  const [open,   setOpen]   = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  const filtered = notas.filter(n =>
    n.numero.includes(search) || n.cliente?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const select = (nota) => {
    onChange(nota)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={ref} className="relative">
      <button type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-200 bg-white
                   flex items-center justify-between text-sm font-medium transition-colors
                   focus:outline-none focus:border-brand-500"
        style={{ borderColor: open ? '#1a7a36' : undefined }}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value ? value.numero : placeholder}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className="text-gray-500 text-lg" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{    opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl
                       shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden"
          >
            {/* Search */}
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                <FiSearch className="text-gray-400 text-sm shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar nota..."
                  className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Nenhuma nota encontrada</p>
              ) : filtered.map(nota => (
                <button key={nota.id} type="button"
                  onClick={() => select(nota)}
                  className="w-full flex items-center justify-between px-5 py-3.5
                             hover:bg-brand-50 transition-colors text-left"
                  style={{ background: value?.id === nota.id ? '#f0faf2' : undefined }}
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{nota.numero}</p>
                    {nota.cliente && <p className="text-xs text-gray-500 mt-0.5">{nota.cliente}</p>}
                  </div>
                  {value?.id === nota.id && <FiCheck className="text-brand-600 text-base shrink-0" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
