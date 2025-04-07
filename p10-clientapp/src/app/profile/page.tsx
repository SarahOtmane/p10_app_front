"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateLeagueForm from "@/components/create-league-form"

export default function ProfilePage() {
  const [user] = useState({
    name: "Utilisateur",
    email: "utilisateur@example.com",
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Profil de {user.name}</h1>

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
                    <p className="text-sm font-medium">Nom d'utilisateur</p>
                    <p className="text-lg">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <Button>Modifier le profil</Button>
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

