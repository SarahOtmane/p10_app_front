"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateLeagueForm from "@/components/create-league-form"

type User = {
  id: string
  email: string
  firstname: string
  lastname: string
  role: string
  id_avatar?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query GetUser {
                user {
                  id
                  email
                  firstname
                  lastname
                  role
                  id_avatar
                }
              }
            `,
          }),
        })

        const result = await response.json()
        if (result.errors) {
          throw new Error(result.errors[0].message)
        }

        setUser(result.data.user)
      } catch (err: any) {
        setError(err.message)
        // Si erreur d'auth, rediriger vers login
        if (err.message.includes("authentifié")) {
          localStorage.removeItem("token")
          router.push("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <Button onClick={() => router.push("/login")}>
            Retourner à la connexion
          </Button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Utilisateur non trouvé</p>
          <Button onClick={() => router.push("/login")}>
            Se connecter
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profil de {user.firstname} {user.lastname}</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="leagues">Mes Ligues</TabsTrigger>
              <TabsTrigger value="create">Créer une Ligue</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                  <CardDescription>Consultez et modifiez vos informations personnelles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Prénom</p>
                    <p className="text-lg">{user.firstname}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nom</p>
                    <p className="text-lg">{user.lastname}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Rôle</p>
                    <p className="text-lg capitalize">{user.role}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button className="py-1 px-2 text-sm">Modifier le profil</Button>
                    <Button variant="destructive" className="py-1 px-2 text-sm">Supprimer le profil</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leagues">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Ligues</CardTitle>
                  <CardDescription>Consultez les ligues auxquelles vous participez.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Vous ne participez à aucune ligue pour le moment.</p>
                    <Button variant="outline" onClick={() => {
                      const element = document.querySelector('[data-value="create"]');
                      if (element instanceof HTMLElement) {
                        element.click();
                      }
                    }}>
                      Créer une ligue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Créer une nouvelle ligue</CardTitle>
                  <CardDescription>Créez votre propre ligue et invitez vos amis à participer.</CardDescription>
                </CardHeader>
                <CardContent>
                  <CreateLeagueForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

