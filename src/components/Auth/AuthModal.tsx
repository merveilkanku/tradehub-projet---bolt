import React, { useState } from 'react'
import { X, Mail, Lock, Phone, User, MapPin } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { AFRICAN_LOCATIONS } from '../../constants/locations'
import toast from 'react-hot-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [userType, setUserType] = useState<'simple' | 'supplier'>('simple')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    fullName: '',
    country: '',
    city: '',
    address: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Connexion réussie!')
        onSuccess()
        onClose()
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        toast.error(authError.message)
        return
      }

      if (authData.user) {
        // Then create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            user_type: userType,
            full_name: formData.fullName,
            phone: formData.phone,
            country: formData.country,
            city: formData.city,
            address: formData.address,
            avatar_url: `https://images.pexels.com/photos/3532544/pexels-photo-3532544.jpeg?auto=compress&cs=tinysrgb&w=400`
          })

        if (profileError) {
          toast.error('Erreur lors de la création du profil')
          return
        }

        if (userType === 'supplier') {
          toast.success('Compte fournisseur créé! Veuillez effectuer le paiement de 5USD au +234979401982 ou +243842578529')
        } else {
          toast.success('Compte créé avec succès!')
        }
        
        onSuccess()
        onClose()
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="absolute inset-x-4 top-10 bg-gradient-card rounded-2xl border border-dark-600 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Connexion' : 'Inscription'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-dark-600 text-dark-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-dark-300 mb-3">
                Type de compte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('simple')}
                  className={`p-3 rounded-lg border transition-all ${
                    userType === 'simple'
                      ? 'border-neon-blue bg-neon-blue/10 text-neon-blue'
                      : 'border-dark-600 text-dark-300 hover:border-dark-500'
                  }`}
                >
                  Utilisateur Simple
                  <span className="block text-xs opacity-75">Gratuit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('supplier')}
                  className={`p-3 rounded-lg border transition-all ${
                    userType === 'supplier'
                      ? 'border-neon-purple bg-neon-purple/10 text-neon-purple'
                      : 'border-dark-600 text-dark-300 hover:border-dark-500'
                  }`}
                >
                  Fournisseur
                  <span className="block text-xs opacity-75">5 USD</span>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {mode === 'register' && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Nom complet"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/20"
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
                  <input
                    type="tel"
                    placeholder="Numéro de téléphone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-neon-green focus:ring-1 focus:ring-neon-green/20"
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/20"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
              <input
                type="password"
                placeholder="Mot de passe"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple/20"
              />
            </div>

            {mode === 'register' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value, city: '' })}
                    className="p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green/20"
                  >
                    <option value="">Pays</option>
                    {Object.keys(AFRICAN_LOCATIONS).map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={!formData.country}
                    className="p-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:border-neon-green focus:ring-1 focus:ring-neon-green/20 disabled:opacity-50"
                  >
                    <option value="">Ville</option>
                    {formData.country &&
                      AFRICAN_LOCATIONS[formData.country as keyof typeof AFRICAN_LOCATIONS]?.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Adresse complète"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:border-neon-green focus:ring-1 focus:ring-neon-green/20"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-neon text-white font-semibold rounded-lg hover:shadow-neon transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-neon-blue hover:text-neon-purple transition-colors"
            >
              {mode === 'login'
                ? 'Pas de compte? S\'inscrire'
                : 'Déjà un compte? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}