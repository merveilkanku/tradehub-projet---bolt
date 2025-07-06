import React from 'react'
import { Search, Bell } from 'lucide-react'

interface HeaderProps {
  onSearchClick: () => void
}

export function Header({ onSearchClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-gradient-card border-b border-dark-600 backdrop-blur-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">TH</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            TradeHub
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onSearchClick}
            className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-neon-blue transition-all duration-300"
          >
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-neon-green transition-all duration-300 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-neon-pink rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}