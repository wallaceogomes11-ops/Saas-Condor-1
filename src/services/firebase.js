// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

// Fallback para modo demo (sem Firebase configurado)
let app, auth, db, storage

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'sua_api_key_aqui') {
    app     = initializeApp(firebaseConfig)
    auth    = getAuth(app)
    db      = getFirestore(app)
    storage = getStorage(app)
  }
} catch (e) {
  console.warn('Firebase não configurado. Rodando em modo offline/demo.')
}

export { auth, db, storage }
export const isFirebaseConfigured = !!app
