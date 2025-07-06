import React from 'react'
import { X, User, Settings, LogOut, Package, Heart, ShoppingBag, CreditCard } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

interface MenuModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthClick: () => void
}

export function MenuModal({ isOpen, onClose, onAuthClick }: MenuModalProps) {
  const { user, profile, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    onClose()
  }

  const handleAuthClick = () => {
    onAuthClick()
    onClose()
  }

  if (!isOpen) return null

  const menuSections = user ? [
    {
      title: 'Profil',
      items: [
        { icon: User, label: 'Mon profil', action: () => console.log('Profile') },
        { icon: Heart, label: 'Mes favoris', action: () => console.log('Favorites') },
        { icon: ShoppingBag, label: 'Mes commandes', action: () => console.log('Orders') },
      ]
    },
    ...(profile?.user_type === 'supplier' ? [{
      title: 'Fournisseur',
      items: [
        { icon: Package, label: 'Mes produits', action: () => console.log('My Products') },
        { icon: CreditCard, label: 'Ventes', action: () => console.log('Sales') },
      ]
    }] : []),
    {
      title: 'Paramètres',
      items: [
        { icon: Settings, label: 'Paramètres', action: () => console.log('Settings') },
        { icon: LogOut, label: 'Se déconnecter', action: handleSignOut },
      ]
    }
  ] : []

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-20 bg-gradient-card rounded-2xl border border-dark-600 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-600 text-dark-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {user ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4 p-4 bg-dark-700/50 rounded-xl">
                <img
                  src={profile?.avatar_url || 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={profile?.full_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-neon-blue/50"
                />
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {profile?.full_name}
                  </h3>
                  <p className="text-neon-blue text-sm capitalize">
                    {profile?.user_type === 'supplier' ? 'Fournisseur' : 'Utilisateur'}
                  </p>
                  <p className="text-dark-400 text-sm">
                    {profile?.city}, {profile?.country}
                  </p>
                </div>
              </div>

              {/* Menu Sections */}
              {menuSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-white font-semibold mb-3">{section.title}</h3>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center p-3 rounded-lg bg-dark-700/50 hover:bg-dark-600 text-dark-300 hover:text-white transition-all duration-300"
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-neon rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Connectez-vous
              </h3>
              <p className="text-dark-400 mb-6">
                Accédez à toutes les fonctionnalités de TradeHub
              </p>
              <button
                onClick={handleAuthClick}
                className="px-6 py-3 bg-gradient-neon text-white font-semibold rounded-lg hover:shadow-neon transition-all duration-300"
              >
                Se connecter / S'inscrire
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}