import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">F1 Pronostic</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Se connecter</Link>
            </Button>
            <Button asChild>
              <Link href="/register">S'inscrire</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

