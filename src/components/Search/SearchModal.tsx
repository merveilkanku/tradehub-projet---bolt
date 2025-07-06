import React, { useState } from 'react'
import { X, Search, MapPin, Filter } from 'lucide-react'
import { AFRICAN_LOCATIONS, PRODUCT_CATEGORIES } from '../../constants/locations'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string, filters: SearchFilters) => void
}

export interface SearchFilters {
  category: string
  country: string
  city: string
  priceMin?: number
  priceMax?: number
}

export function SearchModal({ isOpen, onClose, onSearch }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    country: '',
    city: '',
  })

  const handleSearch = () => {
    onSearch(query, filters)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-20 bg-gradient-card rounded-2xl border border-dark-600 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recherche avancée</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-600 text-dark-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/20"
            />
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            <h3 className="flex items-center text-lg font-semibold text-white">
              <Filter className="w-5 h-5 mr-2" />
              Filtres
            </h3>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20"
              >
                <option value="">Toutes les catégories</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Pays
                </label>
                <select
                  value={filters.country}
                  onChange={(e) => {
                    setFilters({ ...filters, country: e.target.value, city: '' })
                  }}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green/20"
                >
                  <option value="">Tous les pays</option>
                  {Object.keys(AFRICAN_LOCATIONS).map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Ville
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  disabled={!filters.country}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green/20 disabled:opacity-50"
                >
                  <option value="">Toutes les villes</option>
                  {filters.country &&
                    AFRICAN_LOCATIONS[filters.country as keyof typeof AFRICAN_LOCATIONS]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Prix min ($)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin || ''}
                  onChange={(e) => setFilters({ ...filters, priceMin: Number(e.target.value) || undefined })}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-neon-orange focus:ring-1 focus:ring-neon-orange/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Prix max ($)
                </label>
                <input
                  type="number"
                  placeholder="999999"
                  value={filters.priceMax || ''}
                  onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) || undefined })}
                  className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-neon-orange focus:ring-1 focus:ring-neon-orange/20"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full py-3 bg-gradient-neon text-white font-semibold rounded-lg hover:shadow-neon transition-all duration-300"
          >
            Rechercher
          </button>
        </div>
      </div>
    </div>
  )
}