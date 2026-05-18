// src/pages/ComprovanteDetail.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiCalendar, FiCheckCircle, FiShare2, FiDownload } from 'react-icons/fi'
import { FaFileInvoice } from 'react-icons/fa'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import { useEntregas } from '../hooks/useEntregas'
import toast from 'react-hot-toast'

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="text-brand-600 text-sm" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-gray-800 font-semibold text-sm mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function ComprovanteDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { entregas, loading } = useEntregas()

  const entrega = useMemo(() => entregas.find(e => e.id === id), [entregas, id])

  const formatDate = (iso) => {
    try { return format(parseISO(iso), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR }) }
    catch { return iso }
  }

  const handleShare = async () => {
    const text = `🚚 Comprovante de Entrega\n\nNF: ${entrega?.notaFiscal?.numero}\nMotorista: ${entrega?.motorista}\nCliente: ${entrega?.notaFiscal?.cliente}\nData: ${formatDate(entrega?.dataHora)}\nStatus: ✅ Entregue`
    if (navigator.share) {
      await navigator.share({ title: 'Comprovante de Entrega', text })
    } else {
      await navigator.clipboard.writeText(text)
      toast.success('Copiado para a área de transferência!')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-dvh bg-gray-50">
        <Header title="Comprovante" showBack />
        <div className="flex-1 flex items-center justify-center">
          <motion.div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </div>
      </div>
    )
  }

  if (!entrega) {
    return (
      <div className="flex flex-col min-h-dvh bg-gray-50">
        <Header title="Comprovante" showBack />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center">
            <FaFileInvoice className="text-red-400 text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-gray-700">Comprovante não encontrado</h3>
            <p className="text-gray-400 text-sm mt-1">Ele pode ter sido removido do cache.</p>
          </div>
          <button onClick={() => navigate('/historico')}
            className="btn-primary max-w-xs">Ver histórico</button>
        </div>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <Header title="Comprovante" subtitle="Detalhes da entrega" showBack showDoc onDocPress={handleShare} />

      <main className="flex-1 px-4 py-4 pb-safe overflow-y-auto space-y-4">
        {/* Status banner */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="bg-brand-700 rounded-3xl p-5 flex items-center gap-4 shadow-lg shadow-brand-900/20">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <FiCheckCircle className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-white/70 text-xs font-medium">Status</p>
            <p className="text-white font-bold text-lg">Entregue</p>
            <p className="text-white/60 text-xs mt-0.5">{formatDate(entrega.dataHora)}</p>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Informações</p>
          <InfoRow icon={FaFileInvoice} label="Nota Fiscal" value={`NF ${entrega.notaFiscal?.numero}`} />
          <InfoRow icon={FiUser} label="Motorista" value={entrega.motorista} />
          <InfoRow icon={FiUser} label="Cliente" value={entrega.notaFiscal?.cliente || '—'} />
          <InfoRow icon={FiCalendar} label="Data e Hora" value={formatDate(entrega.dataHora)} />
        </motion.div>

        {/* Photo */}
        {entrega.fotoUrl && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="card">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Foto do canhoto</p>
            <img src={entrega.fotoUrl} alt="Canhoto"
              className="w-full rounded-2xl object-cover border border-gray-100"
              style={{ maxHeight: 280 }} />
          </motion.div>
        )}

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 pb-2">
          <button onClick={handleShare}
            className="btn-primary">
            <FiShare2 /> Compartilhar
          </button>
          <button onClick={() => navigate('/historico')}
            className="btn-primary">
            <FiDownload /> Ver histórico
          </button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}
