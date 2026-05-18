// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage        from './pages/LoginPage'
import HomePage         from './pages/HomePage'
import EntregasPage     from './pages/EntregasPage'
import HistoricoPage    from './pages/HistoricoPage'
import ConfigPage       from './pages/ConfigPage'
import ComprovanteDetail from './pages/ComprovanteDetail'
import Splash           from './components/ui/Splash'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Splash />
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/"           element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/entregas"   element={<PrivateRoute><EntregasPage /></PrivateRoute>} />
      <Route path="/historico"  element={<PrivateRoute><HistoricoPage /></PrivateRoute>} />
      <Route path="/config"     element={<PrivateRoute><ConfigPage /></PrivateRoute>} />
      <Route path="/comprovante/:id" element={<PrivateRoute><ComprovanteDetail /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
