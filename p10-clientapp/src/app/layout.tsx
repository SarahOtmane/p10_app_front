import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "F1 Pronostic - Prédictions de courses de Formule 1",
  description: "Créez ou rejoignez une ligue, faites vos pronostics et suivez vos résultats en temps réel.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Navbar />
        <main className="container mx-auto px-4 py-12">
          {children}
        </main>
      </body>
    </html>
  )
}
