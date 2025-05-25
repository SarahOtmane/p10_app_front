"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-red-700 text-white px-4 py-3">
      {/* Top bar with logo and hamburger */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
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
          className="sm:hidden p-2"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center gap-4">
          <nav className="flex gap-4">
            <Link href="/" className="font-semibold border-b-2 border-white">Accueil</Link>
            <Link href="#" className="hover:underline">Statistiques</Link>
            <Link href="#" className="hover:underline">Prix</Link>
            <Link href="#" className="hover:underline">Quoi de neuf</Link>
          </nav>
          <button className="bg-white text-red-700 px-2 py-1 rounded text-xs font-bold">FR</button>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="bg-white text-black hover:bg-gray-100">
              <Link href="/register">S'inscrire</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden mt-4 space-y-4">
          <nav className="flex flex-col gap-2">
            <Link href="/" className="font-semibold border-b-2 border-white py-2">Accueil</Link>
            <Link href="#" className="py-2">Statistiques</Link>
            <Link href="#" className="py-2">Prix</Link>
            <Link href="#" className="py-2">Quoi de neuf</Link>
          </nav>
          <div className="flex items-center justify-between py-2">
            <button className="bg-white text-red-700 px-2 py-1 rounded text-xs font-bold">FR</button>
            <div className="flex gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Se connecter</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="bg-white text-black hover:bg-gray-100">
                <Link href="/register">S'inscrire</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

