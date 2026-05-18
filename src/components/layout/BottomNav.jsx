// src/components/layout/BottomNav.jsx
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiTruck, FiList, FiSettings } from 'react-icons/fi'

const TABS = [
  { to: '/',          icon: FiHome,     label: 'Início'         },
  { to: '/entregas',  icon: FiTruck,    label: 'Entregas'       },
  { to: '/historico', icon: FiList,     label: 'Histórico'      },
  { to: '/config',    icon: FiSettings, label: 'Configurações'  },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px]
                    bg-white border-t border-gray-100 shadow-nav
                    flex items-stretch z-40"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {TABS.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} end={to === '/'}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 relative">
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div layoutId="nav-pill"
                  className="absolute top-1 w-8 h-1 rounded-full bg-brand-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <Icon className={`text-xl transition-colors ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-brand-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
