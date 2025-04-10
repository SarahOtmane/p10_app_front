"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

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
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">F1 Pronostic</h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Créez ou rejoignez une ligue, faites vos pronostics et suivez vos résultats en temps réel.
      </p>
      {user ? (
        <div className="mt-6">
          <p className="text-lg font-medium">Bienvenue, {user.firstname} {user.lastname}!</p>
          <p className="text-sm text-gray-500">Rôle: {user.role}</p>
        </div>
      ) : (
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/register">S'inscrire</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      )}
    </div>
  )
}