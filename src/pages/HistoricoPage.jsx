// src/pages/HistoricoPage.jsx
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiList, FiChevronRight, FiCalendar } from 'react-icons/fi'
import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import SkeletonCard from '../components/ui/SkeletonCard'
import EmptyState from '../components/ui/EmptyState'
import { useEntregas } from '../hooks/useEntregas'

function dateLabel(iso) {
  try {
    const d = parseISO(iso)
    if (isToday(d))     return 'Hoje'
    if (isYesterday(d)) return 'Ontem'
    return format(d, "dd 'de' MMMM", { locale: ptBR })
  } catch { return iso }
}

function timeLabel(iso) {
  try { return format(parseISO(iso), 'HH:mm') } catch { return '' }
}

export default function HistoricoPage() {
  const navigate = useNavigate()
  const { entregas, loading } = useEntregas()
  const [search,   setSearch]   = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')
  const [showFilter, setShowFilter] = useState(false)

  const filtered = useMemo(() => {
    return entregas.filter(e => {
      const matchSearch = !search ||
        e.motorista?.toLowerCase().includes(search.toLowerCase()) ||
        e.notaFiscal?.numero?.includes(search)
      const d = e.dataHora ? new Date(e.dataHora) : null
      const matchFrom = !dateFrom || (d && d >= new Date(dateFrom))
      const matchTo   = !dateTo   || (d && d <= new Date(dateTo + 'T23:59:59'))
      return matchSearch && matchFrom && matchTo
    })
  }, [entregas, search, dateFrom, dateTo])

  // Group by date
  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(e => {
      const key = e.dataHora ? e.dataHora.slice(0, 10) : 'sem-data'
      if (!map[key]) map[key] = []
      map[key].push(e)
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <Header title="Histórico" subtitle="Registro de entregas realizadas" />

      <div className="px-4 py-4 space-y-2 sticky top-0 bg-gray-50 z-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar motorista ou NF..." className="input-field pl-10 py-3 text-sm" />
          </div>
          <button onClick={() => setShowFilter(f => !f)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-colors ${
              showFilter ? 'border-brand-600 bg-brand-50' : 'border-gray-200 bg-white'
            }`}>
            <FiCalendar className={showFilter ? 'text-brand-600' : 'text-gray-500'} />
          </button>
        </div>

        <AnimatePresence>
          {showFilter && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-2 pb-1">
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">De</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                    className="input-field py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Até</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                    className="input-field py-2.5 text-sm" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="flex-1 px-4 pb-safe overflow-y-auto">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <SkeletonCard key={i} rows={2} />)}
          </div>
        ) : grouped.length === 0 ? (
          <EmptyState icon={FiList} title="Nenhuma entrega encontrada"
            description="As entregas registradas aparecerão aqui" />
        ) : (
          <div className="space-y-4">
            {grouped.map(([dateKey, items]) => (
              <div key={dateKey}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                  {dateLabel(dateKey + 'T00:00:00')}
                </p>
                <div className="space-y-2">
                  {items.map((e, i) => (
                    <motion.div key={e.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/comprovante/${e.id}`)}
                      className="card flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
                    >
                      {e.fotoUrl ? (
                        <img src={e.fotoUrl} alt="canhoto"
                          className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0">
                          <FiList className="text-brand-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-800 text-sm">NF {e.notaFiscal?.numero}</p>
                          <span className="badge-entregue">Entregue</span>
                        </div>
                        <p className="text-gray-500 text-xs truncate">{e.motorista}</p>
                        <p className="text-gray-400 text-xs">{timeLabel(e.dataHora)}</p>
                      </div>
                      <FiChevronRight className="text-gray-300 shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
