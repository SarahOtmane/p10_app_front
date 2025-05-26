"use client"
import Link from "next/link"
import Image from "next/image"
import { IoFlagOutline, IoPlayCircleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { MdHome, MdPlayCircleOutline, MdFlag, MdLeaderboard, MdEmojiEvents } from "react-icons/md";
import Footer from "@/components/footer"

type User = {
  id: string
  email: string
  firstname: string
  lastname: string
  role: string
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch("/api/users/me", { credentials: "include" }) 
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error("Not authenticated")
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-16">
      {/* Header */}
     

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="w-full max-w-md relative">
          {/* Banner F1 avec effet glassmorphism */}
          <div className="w-full bg-gradient-to-br from-red-600 via-red-500 to-pink-600 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            {/* Effet de particules/texture */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 text-center">
              <h1 className="text-white text-3xl font-black mb-2 tracking-wide">
                F1 <span className="text-yellow-300">FANTASY</span>
              </h1>
              <p className="text-white/90 text-sm font-medium mb-6">
                The Official Formula 1 Fantasy Game
              </p>
              
              {/* Image avec overlay stylé */}
              <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 border-2 border-white/20">
                <Image 
                  src="/images/illu.png"
                  alt="F1 Racing"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Grand Prix Card avec animation */}
          <div className="w-full bg-white rounded-2xl shadow-2xl p-6 -mt-8 z-10 relative border border-gray-100 transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
            {/* Header du GP */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="relative">
                <Image
                  src="/assets/images/img/flags/australia.png"
                  alt="Australia Flag"
                  width={48}
                  height={32}
                  className="object-contain rounded border border-gray-200 shadow-sm"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">AUSTRALIA</h3>
                <p className="text-xs text-gray-500 leading-tight">
                  FORMULA 1 ROLEX AUSTRALIAN GRAND PRIX 2024
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/assets/images/img/track-monaco.png"
                  alt="Circuit"
                  width={56}
                  height={32}
                  className="object-contain opacity-80"
                />
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="relative mb-6">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Temps restant</span>
                  </div>
                  <div className="font-mono font-bold text-xl tracking-wider text-yellow-400">
                    02 : 18 : 23
                  </div>
                </div>
                <div className="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* CTA Button avec animation */}
            <Button asChild className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
              <Link href="/teams" className="flex items-center justify-center gap-2">
                <MdEmojiEvents size={24} />
                CHOISISSEZ VOTRE ÉCURIE
              </Link>
            </Button>

            {/* Stats rapides (optionnel) */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">24</div>
                <div className="text-xs text-gray-500">RACES</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">20</div>
                <div className="text-xs text-gray-500">DRIVERS</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">10</div>
                <div className="text-xs text-gray-500">TEAMS</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer fixe en bas */}
      <Footer />
    </div>
  )
}