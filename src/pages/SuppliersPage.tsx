import React, { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { SupplierCard } from '../components/Suppliers/SupplierCard'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

type Profile = Database['public']['Tables']['profiles']['Row']

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()

  useEffect(() => {
    fetchSuppliers()
  }, [profile])

  const fetchSuppliers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'supplier')

      // Filter by user's country if available
      if (profile?.country) {
        query = query.eq('country', profile.country)
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching suppliers:', error)
      } else {
        setSuppliers(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMessage = (supplier: Profile) => {
    if (!user) {
      toast.error('Connectez-vous pour discuter avec les fournisseurs')
      return
    }
    toast.success('Fonctionnalité en cours de développement')
  }

  const handleViewProducts = (supplier: Profile) => {
    toast.success('Fonctionnalité en cours de développement')
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Fournisseurs
          {profile?.country && (
            <span className="text-neon-green text-lg font-normal ml-2">
              en {profile.country}
            </span>
          )}
        </h1>
        <div className="flex items-center text-dark-400">
          <Users className="w-5 h-5 mr-2" />
          <span className="text-sm">{suppliers.length} fournisseurs</span>
        </div>
      </div>

      {/* Suppliers List */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gradient-card rounded-xl h-40 animate-pulse border border-dark-600"></div>
          ))}
        </div>
      ) : suppliers.length > 0 ? (
        <div className="space-y-6">
          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              productsCount={Math.floor(Math.random() * 50) + 1} // Mock data
              rating={4 + Math.random()} // Mock data
              onMessage={() => handleMessage(supplier)}
              onViewProducts={() => handleViewProducts(supplier)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-dark-400 mb-4">
            Aucun fournisseur disponible
          </div>
          <p className="text-sm text-dark-500">
            {profile?.country 
              ? `Il n'y a pas encore de fournisseurs en ${profile.country}.`
              : 'Connectez-vous pour voir les fournisseurs de votre région.'
            }
          </p>
        </div>
      )}
    </div>
  )
}