import React from 'react'
import { MapPin, Star, Package, MessageCircle } from 'lucide-react'
import { Database } from '../../lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row']

interface SupplierCardProps {
  supplier: Profile
  productsCount?: number
  rating?: number
  onMessage?: () => void
  onViewProducts?: () => void
}

export function SupplierCard({ 
  supplier, 
  productsCount = 0, 
  rating = 4.5, 
  onMessage,
  onViewProducts
}: SupplierCardProps) {
  return (
    <div className="bg-gradient-card rounded-xl border border-dark-600 p-6 hover:shadow-neon transition-all duration-300">
      <div className="flex items-start space-x-4">
        <img
          src={supplier.avatar_url || 'https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={supplier.full_name}
          className="w-16 h-16 rounded-full object-cover border-2 border-neon-blue/50"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-lg">
              {supplier.full_name}
            </h3>
            {supplier.is_supplier_verified && (
              <div className="w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          <div className="flex items-center text-dark-400 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{supplier.city}, {supplier.country}</span>
          </div>

          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center text-neon-orange">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            
            <div className="flex items-center text-neon-purple">
              <Package className="w-4 h-4 mr-1" />
              <span className="text-sm">{productsCount} produits</span>
            </div>
          </div>

          {supplier.bio && (
            <p className="text-dark-300 text-sm mb-4 line-clamp-2">
              {supplier.bio}
            </p>
          )}

          <div className="flex space-x-3">
            <button
              onClick={onMessage}
              className="flex items-center px-4 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue rounded-lg transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </button>
            
            <button
              onClick={onViewProducts}
              className="flex items-center px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 text-neon-purple rounded-lg transition-colors text-sm"
            >
              <Package className="w-4 h-4 mr-2" />
              Produits
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}