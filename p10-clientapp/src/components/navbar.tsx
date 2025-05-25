import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export default function Navbar() {
  return (
    <header className="bg-red-700 text-white px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="font-bold text-xl tracking-widest">F1 FANTASY</span>
    </div>
    <div className="flex gap-4 items-center">
      <nav className="hidden sm:flex gap-4">
        <a href="/" className="font-semibold border-b-2 border-white">Accueil</a>
        <a href="#" className="hover:underline">Statistiques</a>
        <a href="#" className="hover:underline">Prix</a>
        <a href="#" className="hover:underline">Quoi de neuf</a>
      </nav>
      <button className="ml-4 bg-white text-red-700 px-2 py-1 rounded text-xs font-bold">FR</button>
    </div>
    <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/register">S'inscrire</Link>
            </Button>
          </div>
        

  </header>
   
  )
}

