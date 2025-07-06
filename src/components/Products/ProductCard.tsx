import React from 'react'
import { Heart, MapPin, MessageCircle } from 'lucide-react'
import { Database } from '../../lib/supabase'

type Product = Database['public']['Tables']['products']['Row']

interface ProductCardProps {
  product: Product
  onLike?: () => void
  onMessage?: () => void
}

export function ProductCard({ product, onLike, onMessage }: ProductCardProps) {
  const mainImage = product.images[0] || 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400'

  return (
    <div className="bg-gradient-card rounded-xl border border-dark-600 overflow-hidden hover:shadow-neon transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img
          src={mainImage}
          alt={product.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={onLike}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:text-neon-pink transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 bg-neon-purple/20 backdrop-blur-sm text-neon-purple text-xs font-semibold rounded-full">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-white font-semibold mb-2 line-clamp-2">
          {product.title}
        </h3>
        
        <p className="text-dark-300 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center text-dark-400 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{product.city}, {product.country}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-neon-green">
            ${product.price}
            <span className="text-sm text-dark-400 font-normal ml-1">
              {product.currency}
            </span>
          </div>
          
          <button
            onClick={onMessage}
            className="flex items-center px-3 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue rounded-lg transition-colors text-sm"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Discuter
          </button>
        </div>
      </div>
    </div>
  )
}