"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-red-700 text-white px-4 py-3">
      {/* Top bar with logo centered */}
      <div className="flex items-center justify-between">
        {/* Spacer for mobile */}
        <div className="w-8 sm:w-0"></div>
        
        {/* Logo centered */}
        <div className="flex items-center justify-center flex-1">
          <Image 
            src="/images/f1_logo.png"
            alt="F1 Logo"
            width={100}
            height={30}
            className="object-contain"
          />
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 w-8 flex justify-center"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation - only language button */}
        <div className="hidden sm:flex items-center gap-4 w-8 justify-end">
          <button className="bg-white text-red-700 px-2 py-1 rounded text-xs font-bold">FR</button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden mt-4 space-y-4">
          <nav className="flex flex-col gap-2">
            <Link href="/" className="font-semibold border-b-2 border-white py-2">Accueil</Link>
            <Link href="/teams" className="py-2">Ligues</Link>
            <Link href="#" className="py-2">Statistiques</Link>
            <Link href="#" className="py-2">Prix</Link>
            <Link href="#" className="py-2">Quoi de neuf</Link>
          </nav>
          <div className="flex justify-center py-2">
            <button className="bg-white text-red-700 px-2 py-1 rounded text-xs font-bold">FR</button>
          </div>
        </div>
      )}
    </header>
  )
}

