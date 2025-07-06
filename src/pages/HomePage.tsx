import React, { useState, useEffect } from 'react'
import { TrendingUp, Zap, Globe } from 'lucide-react'
import { ProductCard } from '../components/Products/ProductCard'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

type Product = Database['public']['Tables']['products']['Row']

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .limit(6)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setFeaturedProducts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProductMessage = (product: Product) => {
    if (!user) {
      toast.error('Connectez-vous pour discuter avec les fournisseurs')
      return
    }
    // Navigate to conversation
    toast.success('Fonctionnalité en cours de développement')
  }

  const handleProductLike = () => {
    if (!user) {
      toast.error('Connectez-vous pour liker les produits')
      return
    }
    toast.success('Produit ajouté aux favoris!')
  }

  const stats = [
    { icon: TrendingUp, label: 'Produits actifs', value: '10K+' },
    { icon: Globe, label: 'Pays couverts', value: '20+' },
    { icon: Zap, label: 'Fournisseurs', value: '2K+' },
  ]

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-neon p-8 text-center">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white mb-4">
            Bienvenue sur TradeHub
          </h1>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            La plateforme de commerce qui connecte l'Afrique francophone. 
            Découvrez des milliers de produits locaux et connectez-vous avec des fournisseurs de confiance.
          </p>
          {user ? (
            <div className="text-white/80">
              <span className="text-neon-green font-semibold">Connecté en tant que:</span> {profile?.full_name}
            </div>
          ) : (
            <div className="text-white/80">
              Connectez-vous pour accéder à toutes les fonctionnalités
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20"></div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-gradient-card rounded-xl p-4 text-center border border-dark-600">
            <Icon className="w-8 h-8 mx-auto mb-2 text-neon-blue" />
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-dark-400 text-sm">{label}</div>
          </div>
        ))}
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Produits en vedette</h2>
          <button className="text-neon-blue hover:text-neon-purple transition-colors">
            Voir tout
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gradient-card rounded-xl h-80 animate-pulse border border-dark-600"></div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onLike={handleProductLike}
                onMessage={() => handleProductMessage(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-dark-400 mb-4">Aucun produit en vedette pour le moment</div>
            <p className="text-sm text-dark-500">
              Les nouveaux produits apparaîtront ici dès qu'ils seront ajoutés par les fournisseurs.
            </p>
          </div>
        )}
      </div>

      {/* Categories Preview */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Catégories populaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Électronique', 'Mode', 'Maison', 'Auto'].map((category) => (
            <div
              key={category}
              className="bg-gradient-card rounded-xl p-6 text-center border border-dark-600 hover:shadow-neon transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-neon rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{category[0]}</span>
              </div>
              <h3 className="text-white font-semibold">{category}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}