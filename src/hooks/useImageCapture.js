// src/hooks/useImageCapture.js
import { useState, useRef } from 'react'
import imageCompression from 'browser-image-compression'

export function useImageCapture() {
  const [preview, setPreview]   = useState(null)
  const [file,    setFile]      = useState(null)
  const [loading, setLoading]   = useState(false)
  const inputRef = useRef(null)
  const cameraRef = useRef(null)

  const compressAndSet = async (rawFile) => {
    setLoading(true)
    try {
      const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true }
      const compressed = await imageCompression(rawFile, options)
      setFile(compressed)
      const url = URL.createObjectURL(compressed)
      setPreview(url)
    } catch (e) {
      console.error('Compressão falhou:', e)
      setFile(rawFile)
      setPreview(URL.createObjectURL(rawFile))
    } finally {
      setLoading(false)
    }
  }

  const openGallery = () => inputRef.current?.click()
  const openCamera  = () => cameraRef.current?.click()

  const onFileChange = async (e) => {
    const f = e.target.files?.[0]
    if (f) await compressAndSet(f)
  }

  const clearImage = () => {
    setPreview(null)
    setFile(null)
    if (inputRef.current)  inputRef.current.value  = ''
    if (cameraRef.current) cameraRef.current.value = ''
  }

  return { preview, file, loading, inputRef, cameraRef, openGallery, openCamera, onFileChange, clearImage }
}
