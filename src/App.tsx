import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/Layout/Header'
import { BottomNavigation } from './components/Layout/BottomNavigation'
import { SearchModal, SearchFilters } from './components/Search/SearchModal'
import { AuthModal } from './components/Auth/AuthModal'
import { MenuModal } from './components/Menu/MenuModal'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { SuppliersPage } from './pages/SuppliersPage'
import { ConversationsPage } from './pages/ConversationsPage'

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleSearch = (query: string, filters: SearchFilters) => {
    console.log('Search:', { query, filters })
    // TODO: Implement search functionality
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-dark text-white">
          <Header onSearchClick={() => setIsSearchOpen(true)} />
          
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/suppliers" element={<SuppliersPage />} />
              <Route path="/conversations" element={<ConversationsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <BottomNavigation onMenuClick={() => setIsMenuOpen(true)} />

          {/* Modals */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSearch={handleSearch}
          />
          
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={() => setIsAuthOpen(false)}
          />
          
          <MenuModal
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onAuthClick={() => setIsAuthOpen(true)}
          />

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e293b',
                color: '#fff',
                border: '1px solid #475569',
              },
              success: {
                iconTheme: {
                  primary: '#00ff88',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ff006e',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App