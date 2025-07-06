import React from 'react'
import { MessageCircle, Search } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function ConversationsPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96 pb-20">
        <MessageCircle className="w-16 h-16 text-dark-500 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">
          Connectez-vous pour voir vos discussions
        </h2>
        <p className="text-dark-400 text-center">
          Vous devez être connecté pour accéder à vos conversations avec les fournisseurs.
        </p>
      </div>
    )
  }

  // Mock conversations for now
  const conversations = [
    {
      id: '1',
      supplierName: 'Jean Doe Electronics',
      supplierAvatar: 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Bonjour, êtes-vous intéressé par ce produit?',
      lastMessageTime: '15:30',
      unreadCount: 2,
      productTitle: 'iPhone 14 Pro Max'
    },
    {
      id: '2',
      supplierName: 'Marie Fashion Store',
      supplierAvatar: 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400',
      lastMessage: 'Merci pour votre commande!',
      lastMessageTime: '12:45',
      unreadCount: 0,
      productTitle: 'Robe élégante'
    }
  ]

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Discussions</h1>
        <button className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-neon-blue transition-all duration-300">
          <Search className="w-5 h-5" />
        </button>
      </div>

      {conversations.length > 0 ? (
        <div className="space-y-4">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="bg-gradient-card rounded-xl p-4 border border-dark-600 hover:shadow-neon transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={conversation.supplierAvatar}
                    alt={conversation.supplierName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-neon-pink rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold truncate">
                      {conversation.supplierName}
                    </h3>
                    <span className="text-dark-400 text-sm">
                      {conversation.lastMessageTime}
                    </span>
                  </div>
                  
                  <p className="text-neon-blue text-sm mb-1 truncate">
                    À propos de: {conversation.productTitle}
                  </p>
                  
                  <p className="text-dark-300 text-sm truncate">
                    {conversation.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-dark-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Aucune conversation
          </h2>
          <p className="text-dark-400 text-center max-w-md mx-auto">
            Commencez à discuter avec des fournisseurs en cliquant sur "Discuter" 
            sur leurs produits ou profils.
          </p>
        </div>
      )}
    </div>
  )
}