import React, { useState, useEffect } from 'react'
import { Filter } from 'lucide-react'
import { ProductCard } from '../components/Products/ProductCard'
import { supabase, Database } from '../lib/supabase'
import { PRODUCT_CATEGORIES } from '../constants/locations'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

type Product = Database['public']['Tables']['products']['Row']

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory, profile])

  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_available', true)

      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }

      // Filter by user's location if available
      if (profile?.country) {
        query = query.eq('country', profile.country)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
      } else {
        setProducts(data || [])
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
    toast.success('Fonctionnalité en cours de développement')
  }

  const handleProductLike = () => {
    if (!user) {
      toast.error('Connectez-vous pour liker les produits')
      return
    }
    toast.success('Produit ajouté aux favoris!')
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Tous les produits
          {profile?.city && (
            <span className="text-neon-blue text-lg font-normal ml-2">
              à {profile.city}
            </span>
          )}
        </h1>
        <div className="flex items-center text-dark-400">
          <Filter className="w-5 h-5 mr-2" />
          <span className="text-sm">{products.length} produits</span>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex overflow-x-auto pb-2 space-x-3">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
            selectedCategory === ''
              ? 'bg-neon-blue text-white shadow-neon-blue'
              : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
          }`}
        >
          Toutes
        </button>
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-neon-purple text-white shadow-neon'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-gradient-card rounded-xl h-80 animate-pulse border border-dark-600"></div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
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
          <div className="text-dark-400 mb-4">
            {selectedCategory 
              ? `Aucun produit dans la catégorie "${selectedCategory}"` 
              : 'Aucun produit disponible'
            }
          </div>
          <p className="text-sm text-dark-500">
            {profile?.city 
              ? `Essayez de changer de catégorie ou élargissez votre recherche à d'autres villes.`
              : 'Connectez-vous pour voir les produits de votre région.'
            }
          </p>
        </div>
      )}
    </div>
  )
}