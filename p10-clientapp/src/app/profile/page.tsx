"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from "@/components/footer"
import { MdLock, MdPublic, MdGroup, MdLink, MdLogout, MdEdit, MdDelete } from "react-icons/md"

type League = {
  id_league: number
  name: string
  private: boolean
  shared_link: string
  active: boolean
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [leagues, setLeagues] = useState<League[]>([])
  const [error, setError] = useState("")
  const [loadingLeagues, setLoadingLeagues] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const response = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
          },
          body: JSON.stringify({
            query: `
              query {
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
        if (result.errors) throw new Error(result.errors[0].message)

        setUser(result.data.user)
        
        // Après avoir récupéré l'utilisateur, récupérer ses ligues
        fetchUserLeagues(token)
      } catch (err: any) {
        setError(err.message)
        console.error("Erreur lors de la récupération du profil:", err)
      }
    }

    const fetchUserLeagues = async (token: string) => {
      try {
        setLoadingLeagues(true)
        
        const response = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
          },
          body: JSON.stringify({
            query: `
              query GetAllLeaguesOfUser {
                getAllLeaguesOfUser {
                  id_league
                  name
                  private
                  shared_link
                  active
                }
              }
            `,
          }),
        })

        const result = await response.json()
        
        if (result.errors) {
          console.log("Erreur ligues:", result.errors[0].message)
          // Ne pas bloquer si erreur sur les ligues
          setLeagues([])
        } else {
          setLeagues(result.data.getAllLeaguesOfUser || [])
        }
      } catch (err: any) {
        console.error("Erreur lors de la récupération des ligues:", err)
        setLeagues([])
      } finally {
        setLoadingLeagues(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      setLoggingOut(true)
      
      // Supprimer le token
      localStorage.removeItem("token")
      
      // Rediriger vers la page de connexion après un petit délai
      setTimeout(() => {
        router.push("/login")
      }, 500)
    }
  }

  const copySharedLink = (sharedLink: string) => {
    navigator.clipboard.writeText(sharedLink)
    alert(`Code copié: ${sharedLink}`)
  }

  if (error) {
    return <p className="text-red-600 text-center mt-10">{error}</p>
  }

  if (!user) {
    return <p className="text-center mt-10">Chargement du profil...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header avec déconnexion */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Profil de {user.firstname} {user.lastname}</h1>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <MdLogout size={16} />
              {loggingOut ? "Déconnexion..." : "Se déconnecter"}
            </Button>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="leagues">Mes Ligues ({leagues.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du profil</CardTitle>
                  <CardDescription>Consultez et modifiez vos informations personnelles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informations utilisateur */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Prénom</p>
                      <p className="text-lg font-semibold">{user.firstname}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Nom</p>
                      <p className="text-lg font-semibold">{user.lastname}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rôle</p>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </div>

                  {/* Actions du profil */}
                  <div className="border-t pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        className="flex items-center justify-center gap-2"
                      >
                        <MdEdit size={16} />
                        Modifier le profil
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex items-center justify-center gap-2"
                      >
                        <MdDelete size={16} />
                        Supprimer le compte
                      </Button>
                    </div>
                  </div>

                  {/* Section déconnexion */}
                  <div className="border-t pt-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-medium text-red-800 mb-2">Session</h3>
                      <p className="text-sm text-red-600 mb-3">
                        Vous êtes actuellement connecté. Vous pouvez vous déconnecter à tout moment.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300"
                      >
                        <MdLogout size={16} className="mr-2" />
                        {loggingOut ? "Déconnexion en cours..." : "Se déconnecter"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leagues">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MdGroup size={24} />
                    Mes Ligues
                  </CardTitle>
                  <CardDescription>
                    Ligues auxquelles vous participez ({leagues.length} au total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingLeagues ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                      <p>Chargement des ligues...</p>
                    </div>
                  ) : leagues.length === 0 ? (
                    <div className="text-center py-8">
                      <MdGroup className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-500 mb-4">Vous ne participez à aucune ligue pour le moment.</p>
                      <Button 
                        variant="outline" 
                        onClick={() => router.push("/teams")}
                        className="flex items-center gap-2"
                      >
                        <MdGroup size={16} />
                        Gérer mes ligues
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Stats des ligues */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-blue-600">{leagues.length}</div>
                          <div className="text-sm text-blue-600">Total</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {leagues.filter(l => l.active).length}
                          </div>
                          <div className="text-sm text-green-600">Actives</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {leagues.filter(l => l.private).length}
                          </div>
                          <div className="text-sm text-purple-600">Privées</div>
                        </div>
                      </div>

                      {/* Liste des ligues */}
                      <div className="space-y-3">
                        {leagues.map((league) => (
                          <div 
                            key={league.id_league}
                            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                              league.active 
                                ? 'border-green-200 bg-green-50' 
                                : 'border-gray-200 bg-gray-50 opacity-75'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                  league.private ? 'bg-purple-500' : 'bg-blue-500'
                                }`}>
                                  {league.private ? <MdLock size={20} /> : <MdPublic size={20} />}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{league.name}</h3>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      league.active 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {league.active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      league.private 
                                        ? 'bg-purple-100 text-purple-700' 
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      {league.private ? 'PRIVÉE' : 'PUBLIQUE'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => copySharedLink(league.shared_link)}
                                  className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                  title="Copier le code de partage"
                                >
                                  <MdLink size={14} />
                                  {league.shared_link}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t">
                        <Button 
                          onClick={() => router.push("/teams")}
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <MdGroup size={16} />
                          Gérer mes ligues
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
