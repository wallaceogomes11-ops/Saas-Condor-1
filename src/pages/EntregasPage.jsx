// src/pages/EntregasPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiTruck, FiChevronRight, FiRefreshCw } from 'react-icons/fi'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import EmptyState from '../components/ui/EmptyState'
import { getNotasFiscais } from '../services/storageService'

const STATUS_LABELS = {
  pendente: { label: 'Pendente',  cls: 'badge-pendente' },
  entregue: { label: 'Entregue', cls: 'badge-entregue'  },
}

export default function EntregasPage() {
  const navigate = useNavigate()
  const [notas,    setNotas]    = useState([])
  const [search,   setSearch]   = useState('')
  const [filtro,   setFiltro]   = useState('todos')

  const load = () => setNotas(getNotasFiscais())
  useEffect(() => { load() }, [])

  const filtered = notas.filter(n => {
    const matchSearch = n.numero.includes(search) ||
      n.cliente?.toLowerCase().includes(search.toLowerCase())
    const matchFiltro = filtro === 'todos' || n.status === filtro
    return matchSearch && matchFiltro
  })

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <Header title="Entregas" subtitle="Gerencie suas notas fiscais" />

      <div className="px-4 py-4 space-y-3 sticky top-0 bg-gray-50 z-10">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar nota ou cliente..."
            className="input-field pl-11"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['todos', 'pendente', 'entregue'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                filtro === f
                  ? 'bg-brand-700 text-white shadow'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}>
              {f === 'todos' ? 'Todos' : f === 'pendente' ? 'Pendentes' : 'Entregues'}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 pb-safe overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Total',     count: notas.length,                        color: 'bg-gray-100 text-gray-700' },
            { label: 'Pendentes', count: notas.filter(n=>n.status==='pendente').length, color: 'bg-amber-100 text-amber-700' },
            { label: 'Entregues', count: notas.filter(n=>n.status==='entregue').length, color: 'bg-brand-100 text-brand-700' },
          ].map(s => (
            <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center`}>
              <p className="font-bold text-xl">{s.count}</p>
              <p className="text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {filtered.length === 0 ? (
            <EmptyState icon={FiTruck} title="Nenhuma nota encontrada"
              description="Tente ajustar os filtros ou busca"
              action={
                <button onClick={load}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-700 text-white text-sm font-semibold">
                  <FiRefreshCw /> Recarregar
                </button>
              }
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((nota, i) => (
                <motion.div key={nota.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => nota.status === 'pendente' && navigate('/')}
                  className="card flex items-center gap-3 active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    nota.status === 'entregue' ? 'bg-brand-100' : 'bg-amber-100'
                  }`}>
                    <FiTruck className={nota.status === 'entregue' ? 'text-brand-600' : 'text-amber-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">NF {nota.numero}</p>
                    <p className="text-gray-500 text-xs truncate">{nota.cliente}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={STATUS_LABELS[nota.status]?.cls}>
                      {STATUS_LABELS[nota.status]?.label}
                    </span>
                    {nota.status === 'pendente' && <FiChevronRight className="text-gray-300" />}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  )
}
