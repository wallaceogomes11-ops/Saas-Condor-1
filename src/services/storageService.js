// src/services/storageService.js
import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, orderBy, where, Timestamp
} from 'firebase/firestore'
import {
  ref, uploadBytes, getDownloadURL
} from 'firebase/storage'
import { db, storage, isFirebaseConfigured } from './firebase'
import { v4 as uuidv4 } from 'uuid'

const LOCAL_KEY = 'canhoto_entregas'
const NF_KEY    = 'canhoto_notas'

// ─── Notas Fiscais ───────────────────────────────────────────────────────────

const DEFAULT_NOTAS = [
  { id: '1', numero: '14587', cliente: 'Distribuidora ABC', status: 'pendente' },
  { id: '2', numero: '14879', cliente: 'Mercado Central',   status: 'pendente' },
  { id: '3', numero: '14980', cliente: 'Supermercado XYZ',  status: 'pendente' },
  { id: '4', numero: '15001', cliente: 'Loja das Flores',   status: 'pendente' },
  { id: '5', numero: '15102', cliente: 'Padaria Bom Pão',   status: 'pendente' },
  { id: '6', numero: '15203', cliente: 'Farmácia Saúde',    status: 'pendente' },
  { id: '7', numero: '15304', cliente: 'Açougue Premium',   status: 'pendente' },
  { id: '8', numero: '15405', cliente: 'Restaurante Sol',   status: 'pendente' },
]

export const getNotasFiscais = () => {
  const saved = localStorage.getItem(NF_KEY)
  if (saved) return JSON.parse(saved)
  localStorage.setItem(NF_KEY, JSON.stringify(DEFAULT_NOTAS))
  return DEFAULT_NOTAS
}

export const updateNotaStatus = (id, status) => {
  const notas = getNotasFiscais()
  const updated = notas.map(n => n.id === id ? { ...n, status } : n)
  localStorage.setItem(NF_KEY, JSON.stringify(updated))
  return updated
}

// ─── Upload de Imagem ─────────────────────────────────────────────────────────

export const uploadFoto = async (file, entregaId) => {
  if (isFirebaseConfigured && storage) {
    const fileRef = ref(storage, `canhotos/${entregaId}/${file.name}`)
    await uploadBytes(fileRef, file)
    return await getDownloadURL(fileRef)
  }
  // Fallback: base64 no localStorage
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// ─── Entregas ─────────────────────────────────────────────────────────────────

const getLocalEntregas = () => {
  const saved = localStorage.getItem(LOCAL_KEY)
  return saved ? JSON.parse(saved) : []
}

const saveLocalEntregas = (entregas) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(entregas))
}

export const salvarEntrega = async (dados) => {
  const entrega = {
    id:          uuidv4(),
    motorista:   dados.motorista,
    notaFiscal:  dados.notaFiscal,
    fotoUrl:     dados.fotoUrl || null,
    dataHora:    new Date().toISOString(),
    status:      'entregue',
  }

  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, 'entregas'), {
        ...entrega,
        dataHora: Timestamp.fromDate(new Date()),
      })
      entrega.firebaseId = docRef.id
    } catch (e) {
      console.warn('Firebase error, salvando local:', e)
    }
  }

  // Sempre salva local como cache
  const entregas = getLocalEntregas()
  entregas.unshift(entrega)
  saveLocalEntregas(entregas)

  // Atualiza status da nota
  updateNotaStatus(dados.notaFiscal.id, 'entregue')

  return entrega
}

export const getEntregas = async (filtros = {}) => {
  if (isFirebaseConfigured && db) {
    try {
      let q = query(collection(db, 'entregas'), orderBy('dataHora', 'desc'))
      if (filtros.motorista) {
        q = query(q, where('motorista', '==', filtros.motorista))
      }
      const snap = await getDocs(q)
      return snap.docs.map(d => ({ id: d.id, ...d.data(), dataHora: d.data().dataHora?.toDate?.()?.toISOString() || d.data().dataHora }))
    } catch (e) {
      console.warn('Firebase error, usando local:', e)
    }
  }
  return getLocalEntregas()
}

export const clearLocalCache = () => {
  localStorage.removeItem(LOCAL_KEY)
  localStorage.removeItem(NF_KEY)
}
