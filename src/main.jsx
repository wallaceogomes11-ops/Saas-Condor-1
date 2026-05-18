// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/canhoto-entrega">
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 500,
              borderRadius: '16px',
              fontSize: '14px',
            },
            success: { style: { background: '#1a7a36', color: '#fff' } },
            error:   { style: { background: '#dc2626', color: '#fff' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

// PWA service worker
if ('serviceWorker' in navigator) {
  import('virtual:pwa-register').then(({ registerSW }) => {
    registerSW({ onNeedRefresh() {}, onOfflineReady() {} })
  }).catch(() => {})
}
