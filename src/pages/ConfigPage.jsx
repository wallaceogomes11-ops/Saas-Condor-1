// src/pages/ConfigPage.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiLogOut, FiTrash2, FiInfo, FiUser, FiChevronRight, FiWifi } from 'react-icons/fi'
import { FaTruck } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import { useAuth } from '../context/AuthContext'
import { clearLocalCache } from '../services/storageService'
import { isFirebaseConfigured } from '../services/firebase'

function SettingItem({ icon: Icon, label, description, onClick, danger = false, right }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onClick}
      className="w-full flex items-center gap-3 py-4 px-1 border-b border-gray-100 last:border-0
                 active:bg-gray-50 rounded-xl transition-colors text-left">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
        danger ? 'bg-red-100' : 'bg-brand-100'
      }`}>
        <Icon className={`text-lg ${danger ? 'text-red-500' : 'text-brand-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${danger ? 'text-red-600' : 'text-gray-800'}`}>{label}</p>
        {description && <p className="text-gray-400 text-xs mt-0.5">{description}</p>}
      </div>
      {right ?? <FiChevronRight className="text-gray-300 shrink-0" />}
    </motion.button>
  )
}

export default function ConfigPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [confirm, setConfirm] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
    toast.success('Sessão encerrada!')
  }

  const handleClearCache = () => {
    clearLocalCache()
    toast.success('Cache limpo com sucesso!')
    setConfirm(null)
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <Header title="Configurações" />

      <main className="flex-1 px-4 py-4 pb-safe overflow-y-auto space-y-4">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-brand-700 flex items-center justify-center shadow">
              <span className="text-white font-bold text-2xl">
                {user?.nome?.[0]?.toUpperCase() || 'M'}
              </span>
            </div>
            <div>
              <p className="font-bold text-gray-800 text-base">{user?.nome}</p>
              <p className="text-gray-500 text-sm">Motorista</p>
              <div className={`mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                isFirebaseConfigured ? 'bg-brand-100 text-brand-700' : 'bg-amber-100 text-amber-700'
              }`}>
                <FiWifi className="text-xs" />
                {isFirebaseConfigured ? 'Online (Firebase)' : 'Modo offline'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* App info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="card">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Conta</p>
          <SettingItem icon={FiUser} label="Motorista" description={user?.nome}
            right={<span className="text-gray-400 text-sm">{user?.nome?.[0]?.toUpperCase()}</span>} />
        </motion.div>

        {/* App */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Aplicativo</p>
          <SettingItem icon={FiInfo} label="Versão" description="Sistema de comprovante de entrega"
            right={<span className="text-xs text-gray-400 font-medium">v1.0.0</span>} />
          <SettingItem icon={FaTruck} label="Modo PWA"
            description="Instalável como app nativo no celular"
            right={<span className="text-xs text-brand-600 font-semibold">Ativo</span>} />
        </motion.div>

        {/* Danger zone */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="card">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Dados</p>
          <SettingItem icon={FiTrash2} label="Limpar cache local" danger
            description="Remove dados salvos offline"
            onClick={() => setConfirm('cache')} />
          <SettingItem icon={FiLogOut} label="Sair da conta" danger
            description="Encerrar sessão atual"
            onClick={() => setConfirm('logout')} />
        </motion.div>
      </main>

      {/* Confirm modal */}
      {confirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center px-4 pb-8"
          onClick={() => setConfirm(null)}>
          <motion.div initial={{ y: 60 }} animate={{ y: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-gray-800 text-base mb-1">
              {confirm === 'logout' ? 'Sair da conta?' : 'Limpar cache?'}
            </h3>
            <p className="text-gray-500 text-sm mb-5">
              {confirm === 'logout'
                ? 'Você precisará fazer login novamente.'
                : 'Os dados offline serão apagados. Dados no Firebase são mantidos.'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setConfirm(null)}
                className="py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-semibold text-sm">
                Cancelar
              </button>
              <button onClick={confirm === 'logout' ? handleLogout : handleClearCache}
                className="py-3 rounded-2xl bg-red-500 text-white font-semibold text-sm">
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <BottomNav />
    </div>
  )
}
