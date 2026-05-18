// src/pages/LoginPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiArrowRight } from 'react-icons/fi'
import { FaTruck } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!nome.trim()) { toast.error('Informe o nome do motorista'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    login(nome.trim())
    toast.success(`Bem-vindo, ${nome.trim()}!`)
    navigate('/', { replace: true })
    setLoading(false)
  }

  return (
    <div className="min-h-dvh flex flex-col bg-brand-700 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
      <div className="absolute top-20 -left-10 w-40 h-40 bg-white/5 rounded-full" />

      {/* Top hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
          className="flex flex-col items-center gap-4 mb-8"
        >
          <div className="w-24 h-24 bg-white/15 rounded-3xl flex items-center justify-center shadow-xl">
            <FaTruck className="text-white text-5xl" />
          </div>
          <div className="text-center">
            <h1 className="text-white font-bold text-2xl">Canhoto de Entrega</h1>
            <p className="text-white/70 text-sm mt-1">Sistema de comprovante digital</p>
          </div>
        </motion.div>
      </div>

      {/* Login card */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'backOut' }}
        className="bg-white rounded-t-[2rem] px-6 pt-8 pb-12 shadow-2xl"
      >
        <h2 className="font-bold text-gray-800 text-xl mb-1">Entrar</h2>
        <p className="text-gray-500 text-sm mb-6">Informe seu nome para acessar o sistema</p>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Nome do motorista
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Ex: João Silva"
                className="input-field pl-11"
                autoFocus
              />
            </div>
          </div>

          <motion.button
            onClick={handleLogin}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl bg-brand-700 text-white font-bold text-base
                       flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20
                       disabled:opacity-60 active:bg-brand-800 transition-colors"
          >
            {loading ? (
              <motion.div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            ) : (
              <> Entrar <FiArrowRight className="text-lg" /> </>
            )}
          </motion.button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Versão 1.0.0 • Sistema PWA Offline
        </p>
      </motion.div>
    </div>
  )
}
