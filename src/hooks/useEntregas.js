// src/hooks/useEntregas.js
import { useState, useEffect, useCallback } from 'react'
import { getEntregas } from '../services/storageService'

export function useEntregas(filtros = {}) {
  const [entregas, setEntregas] = useState([])
  const [loading,  setLoading]  = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getEntregas(filtros)
      setEntregas(data)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filtros)])

  useEffect(() => { load() }, [load])

  return { entregas, loading, reload: load }
}
