// src/components/ui/FotoUpload.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { FiCamera, FiImage, FiX, FiLoader } from 'react-icons/fi'

export default function FotoUpload({ preview, loading, inputRef, cameraRef, onFileChange, openGallery, openCamera, onClear }) {
  return (
    <div>
      {/* Hidden inputs */}
      <input ref={cameraRef}  type="file" accept="image/*" capture="environment" onChange={onFileChange} className="hidden" />
      <input ref={inputRef}   type="file" accept="image/*"                        onChange={onFileChange} className="hidden" />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden border-2 border-brand-300"
          >
            <img src={preview} alt="Canhoto" className="w-full h-52 object-cover" />
            <button onClick={onClear}
              className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full
                         flex items-center justify-center text-white active:scale-90 transition-transform">
              <FiX className="text-sm" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent
                            flex gap-2 px-3 py-3">
              <button onClick={openCamera}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-white/25 backdrop-blur-sm text-white text-xs font-medium active:scale-95 transition-transform">
                <FiCamera /> Nova foto
              </button>
              <button onClick={openGallery}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl
                           bg-white/25 backdrop-blur-sm text-white text-xs font-medium active:scale-95 transition-transform">
                <FiImage /> Galeria
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {loading ? (
              <div className="h-44 rounded-2xl border-2 border-dashed border-brand-300 bg-brand-50
                              flex flex-col items-center justify-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                  <FiLoader className="text-brand-600 text-2xl" />
                </motion.div>
                <p className="text-brand-600 text-sm font-medium">Processando imagem...</p>
              </div>
            ) : (
              <button type="button" onClick={openCamera}
                className="w-full h-44 rounded-2xl border-2 border-dashed border-brand-400 bg-brand-50/60
                           flex flex-col items-center justify-center gap-2
                           active:bg-brand-100 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-brand-100 flex items-center justify-center">
                  <FiCamera className="text-brand-600 text-2xl" />
                </div>
                <div className="text-center">
                  <p className="text-brand-700 font-semibold text-sm">Toque para tirar a foto</p>
                  <p className="text-gray-500 text-xs mt-0.5">A imagem será anexada ao comprovante</p>
                </div>
              </button>
            )}

            {!loading && (
              <button type="button" onClick={openGallery}
                className="w-full mt-2 py-2.5 rounded-xl text-brand-600 text-xs font-semibold
                           flex items-center justify-center gap-1.5 bg-brand-50 active:bg-brand-100 transition-colors">
                <FiImage /> Escolher da galeria
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
