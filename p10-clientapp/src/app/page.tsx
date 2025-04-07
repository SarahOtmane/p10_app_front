import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">F1 Pronostic</h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Créez ou rejoignez une ligue, faites vos pronostics et suivez vos résultats en temps réel.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Button asChild size="lg">
          <Link href="/register">S'inscrire</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Se connecter</Link>
        </Button>
      </div>
    </div>
  )
}
