"use client"
import Link from "next/link"
import Image from "next/image"
import { IoFlagOutline, IoPlayCircleOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { MdHome, MdPlayCircleOutline, MdFlag, MdLeaderboard, MdEmojiEvents } from "react-icons/md";

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
     

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-start p-4">
        {/* Banner Pilotes */}
        <div className="w-full max-w-md bg-gradient-to-r from-red-600 to-pink-500 rounded-lg p-4 mt-4 flex flex-col items-center relative z-0">
          <h2 className="text-white text-2xl font-bold mb-1">F1 </h2>
          <p className="text-white text-sm mb-4">The Official Formula 1 Fantasy Game</p>
          <div className="h-32 w-full relative rounded mb-2 overflow-hidden">
            <Image 
              src="/images/illu.png"
              alt="F1 Pilotes"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Grand Prix Card */}
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4 -mt-12 z-10 relative">
          <div className="flex items-center gap-2 mb-2">
          <Image
                src="/assets/images/img/flags/australia.png"
                alt="AU"
                width={68}
                height={24}
                className="object-contain"
              />
            <div>
              <div className="font-bold">AUSTRALIA</div>
              <div className="text-xs text-gray-500">FORMULA 1 ROLEX AUSTRALIAN GRAND PRIX 2024</div>
            </div>
            <div className="ml-auto">
              <Image
                src="/assets/images/img/track-monaco.png"
                alt="Circuit Monaco"
                width={68}
                height={24}
                className="object-contain"
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 mb-2 bg-gray-700 text-white rounded-lg p-2">
            <span className="text-xs ">Durée limite pour finaliser votre équipe...</span>
            <span className="font-mono font-bold text-lg">02 : 18 : 23</span>
          </div>
          <Button asChild className="w-full bg-red-600 text-white py-2 rounded font-bold mt-2 hover:bg-red-700 transition">
  <Link href="/teams">CHOISISSEZ VOTRE ÉCURIE</Link>
</Button>        </div>

     
      </main>

      {/* Footer navigation */}
      <footer className="bg-white border-t shadow-inner py-2 px-4 flex justify-between items-center text-xs text-gray-700">
        <a href="#" className="flex flex-col items-center text-red-600 font-bold"><MdHome size={24} />Latest</a>
        <a href="#" className="flex flex-col items-center"><MdPlayCircleOutline size={24} />Video</a>
        <a href="#" className="flex flex-col items-center"><MdFlag size={24} />Racing</a>
        <a href="#" className="flex flex-col items-center"><MdLeaderboard size={24} />Standings</a>
        <a href="#" className="flex flex-col items-center"><MdEmojiEvents size={24} />Fantasy</a>
      </footer>
    </div>
  )
}