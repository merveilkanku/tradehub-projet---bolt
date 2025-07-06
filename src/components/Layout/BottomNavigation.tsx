import React from 'react'
import { Home, Package, Users, MessageCircle, Menu } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'

interface BottomNavigationProps {
  onMenuClick: () => void
}

export function BottomNavigation({ onMenuClick }: BottomNavigationProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Package, label: 'Produits', path: '/products' },
    { icon: Users, label: 'Fournisseurs', path: '/suppliers' },
    { icon: MessageCircle, label: 'Discussions', path: '/conversations' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gradient-card border-t border-dark-600 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={clsx(
                'flex flex-col items-center p-2 rounded-lg transition-all duration-300',
                isActive
                  ? 'text-neon-blue shadow-neon-blue'
                  : 'text-dark-400 hover:text-neon-purple'
              )}
            >
              <Icon className={clsx('w-6 h-6 mb-1', isActive && 'drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]')} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          )
        })}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center p-2 rounded-lg text-dark-400 hover:text-neon-purple transition-all duration-300"
        >
          <Menu className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Menu</span>
        </button>
      </div>
    </nav>
  )
}