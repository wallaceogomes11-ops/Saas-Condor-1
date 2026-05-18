// src/pages/HomePage.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiCheck } from 'react-icons/fi'
import { FaFileInvoice } from 'react-icons/fa'
import toast from 'react-hot-toast'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import SelectNota from '../components/ui/SelectNota'
import FotoUpload from '../components/ui/FotoUpload'
import { useAuth } from '../context/AuthContext'
import { useImageCapture } from '../hooks/useImageCapture'
import { getNotasFiscais, salvarEntrega, uploadFoto } from '../services/storageService'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notas, setNotas] = useState([])
  const [notaSelecionada, setNotaSelecionada] = useState(null)
  const [saving, setSaving] = useState(false)
  const { preview, file, loading: imgLoading, inputRef, cameraRef,
          openGallery, openCamera, onFileChange, clearImage } = useImageCapture()

  useEffect(() => {
    setNotas(getNotasFiscais().filter(n => n.status === 'pendente'))
  }, [])

  const handleValidar = async () => {
    if (!notaSelecionada) { toast.error('Selecione uma nota fiscal'); return }
    if (!file && !preview) { toast.error('Tire ou envie a foto do canhoto'); return }

    setSaving(true)
    try {
      const id = crypto.randomUUID()
      let fotoUrl = null
      if (file) fotoUrl = await uploadFoto(file, id)

      const entrega = await salvarEntrega({
        motorista:  user.nome,
        notaFiscal: notaSelecionada,
        fotoUrl,
      })

      toast.success('Entrega registrada com sucesso!')
      // Reset form
      setNotaSelecionada(null)
      clearImage()
      setNotas(getNotasFiscais().filter(n => n.status === 'pendente'))
      navigate(`/comprovante/${entrega.id}`)
    } catch (e) {
      toast.error('Erro ao salvar. Tente novamente.')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleCancelar = () => {
    setNotaSelecionada(null)
    clearImage()
    toast('Formulário limpo', { icon: '🗑️' })
  }

  return (
    <div className="flex flex-col min-h-dvh bg-gray-50">
      <Header
        title="Comprovante de entrega"
        subtitle="Registre o canhoto da entrega"
        showDoc
        onDocPress={() => navigate('/historico')}
      />

      <main className="flex-1 px-4 py-4 pb-safe space-y-4 overflow-y-auto">
        {/* Motorista */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card"
        >
          <div className="section-label">
            <FiUser className="text-brand-600 text-xl" />
            <span>Motorista</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={user?.nome || ''}
              readOnly
              className="input-field flex-1 bg-gray-50 text-gray-600 cursor-not-allowed"
            />
            <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center shrink-0 shadow">
              <span className="text-white font-bold text-lg">
                {user?.nome?.[0]?.toUpperCase() || 'M'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Nota Fiscal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="section-label">
            <FaFileInvoice className="text-brand-600 text-xl" />
            <span>Nota fiscal</span>
          </div>
          <SelectNota
            notas={notas}
            value={notaSelecionada}
            onChange={setNotaSelecionada}
          />
          {notas.length === 0 && (
            <p className="text-amber-600 text-xs mt-2 font-medium">
              ⚠️ Todas as notas já foram entregues
            </p>
          )}
        </motion.div>

        {/* Foto */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card"
        >
          <div className="section-label">
            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Foto do canhoto da entrega</span>
          </div>
          <FotoUpload
            preview={preview}
            loading={imgLoading}
            inputRef={inputRef}
            cameraRef={cameraRef}
            onFileChange={onFileChange}
            openGallery={openGallery}
            openCamera={openCamera}
            onClear={clearImage}
          />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 pb-2"
        >
          <motion.button
            onClick={handleValidar}
            disabled={saving}
            whileTap={{ scale: 0.96 }}
            className="btn-primary"
          >
            {saving ? (
              <motion.div className="w-4 h-4 border-2 border-brand-400 border-t-brand-700 rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            ) : (
              <FiCheck className="text-brand-600 text-lg" />
            )}
            <span>{saving ? 'Salvando...' : 'Validar'}</span>
          </motion.button>

          <motion.button
            onClick={handleCancelar}
            disabled={saving}
            whileTap={{ scale: 0.96 }}
            className="btn-danger"
          >
            <svg className="text-red-500 text-lg w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancelar</span>
          </motion.button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}
