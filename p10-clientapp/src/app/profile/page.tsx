"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Footer from "@/components/footer"
import { MdLock, MdPublic, MdGroup, MdLink, MdLogout, MdEdit, MdDelete, MdSportsMotorsports, MdTrendingUp } from "react-icons/md"
import Image from "next/image"

type League = {
  id_league: number
  name: string
  private: boolean
  shared_link: string
  active: boolean
}

type UserBet = {
  id: number
  id_pilote_p10: number
  id_gp: number
  point_p10: number | null
}

type GP = {
  id_api_races: number
  season: string
  date: string
  time: string
  id_api_track: number
}

type Track = {
  id_api_races: number
  country_name: string
  track_name: string
  picture_country: string
}

type Pilote = {
  id_api_pilotes: string
  name: string
  name_acronym: string
  picture?: string
}

type BetWithDetails = UserBet & {
  pilote: Pilote | null
  gp: GP | null
  track: Track | null
  isPast: boolean
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [leagues, setLeagues] = useState<League[]>([])
  const [userBets, setUserBets] = useState<BetWithDetails[]>([])
  const [error, setError] = useState("")
  const [loadingLeagues, setLoadingLeagues] = useState(false)
  const [loadingBets, setLoadingBets] = useState(false)
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
        
        // Récupérer les ligues et les paris
        fetchUserLeagues(token)
        fetchUserBets(token)
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

    const fetchUserBets = async (token: string) => {
      try {
        setLoadingBets(true)

        // Récupérer tous les paris utilisateur, pilotes, GPs et tracks
        const [betsResponse, pilotesResponse, gpsResponse, tracksResponse] = await Promise.all([
          fetch("http://localhost:3000/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: ` ${token}`,
            },
            body: JSON.stringify({
              query: `
                query  {
                  getAllResultsOfUser {
                    id
                    id_pilote_p10
                    id_gp
                    point_p10
                  }
                }
              `,
            }),
          }),
          fetch("http://localhost:3000/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: ` ${token}`,
            },
            body: JSON.stringify({
              query: `
                query GetPilotes {
                  pilotes {
                    id_api_pilotes
                    name
                    name_acronym
                    picture
                  }
                }
              `,
            }),
          }),
          fetch("http://localhost:3000/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: ` ${token}`,
            },
            body: JSON.stringify({
              query: `
                query GetAllGPs {
                  getAllGPs {
                    id_api_races
                    season
                    date
                    time
                    id_api_track
                  }
                }
              `,
            }),
          }),
          fetch("http://localhost:3000/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: ` ${token}`,
            },
            body: JSON.stringify({
              query: `
                query GetAllTracks {
                  getAllTracks {
                    id_api_races
                    country_name
                    track_name
                    picture_country
                  }
                }
              `,
            }),
          })
        ])

        const [betsResult, pilotesResult, gpsResult, tracksResult] = await Promise.all([
          betsResponse.json(),
          pilotesResponse.json(),
          gpsResponse.json(),
          tracksResponse.json()
        ])

        const allBets = betsResult.data?.getAllResultsOfUser || []
        const pilotes = pilotesResult.data?.pilotes || []
        const allGPs = gpsResult.data?.getAllGPs || []
        const allTracks = tracksResult.data?.getAllTracks || []

        // Enrichir les paris avec les détails
        const now = new Date()
        const enrichedBets: BetWithDetails[] = allBets.map((bet: UserBet) => {
          const pilote = pilotes.find((p: Pilote) => 
            parseInt(p.id_api_pilotes) === bet.id_pilote_p10
          )
          const gp = allGPs.find((g: GP) => g.id_api_races === bet.id_gp)
          const track = gp ? allTracks.find((t: Track) => 
            t.id_api_races === gp.id_api_track
          ) : null
          const isPast = gp ? new Date(gp.date) < now : false

          return {
            ...bet,
            pilote: pilote || null,
            gp: gp || null,
            track: track || null,
            isPast
          }
        }).sort((a: any, b: any) => {
          // Trier par date (plus récent en premier)
          if (!a.gp || !b.gp) return 0
          return new Date(b.gp.date).getTime() - new Date(a.gp.date).getTime()
        })

        setUserBets(enrichedBets)

      } catch (err: any) {
        console.error("Erreur lors de la récupération des paris:", err)
        setUserBets([])
      } finally {
        setLoadingBets(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      setLoggingOut(true)
      
      localStorage.removeItem("token")
      
      setTimeout(() => {
        router.push("/login")
      }, 500)
    }
  }

  const copySharedLink = (sharedLink: string) => {
    navigator.clipboard.writeText(sharedLink)
    alert(`Code copié: ${sharedLink}`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getPointsColor = (points: number | null) => {
    if (points === null) return 'text-gray-400'
    if (points > 0) return 'text-green-600'
    return 'text-red-500'
  }

  const getPointsText = (points: number | null) => {
    if (points === null) return 'En attente'
    if (points > 0) return `+${points} pts`
    return `${points} pts`
  }

  // Statistiques des paris
  const pastBets = userBets.filter(bet => bet.isPast)
  const upcomingBets = userBets.filter(bet => !bet.isPast)
  const totalPoints = pastBets.reduce((sum, bet) => sum + (bet.point_p10 || 0), 0)
  const winningBets = pastBets.filter(bet => (bet.point_p10 || 0) > 0).length

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="bets">Mes Paris ({userBets.length})</TabsTrigger>
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

                  {/* Stats globales */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-4">Statistiques générales</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{userBets.length}</div>
                        <div className="text-sm text-blue-600">Paris placés</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className={`text-2xl font-bold ${getPointsColor(totalPoints)}`}>
                          {totalPoints > 0 ? `+${totalPoints}` : totalPoints}
                        </div>
                        <div className="text-sm text-green-600">Points totaux</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{winningBets}</div>
                        <div className="text-sm text-purple-600">Paris gagnants</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{leagues.length}</div>
                        <div className="text-sm text-orange-600">Ligues</div>
                      </div>
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bets">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MdSportsMotorsports size={24} />
                    Mes Paris F1
                  </CardTitle>
                  <CardDescription>
                    Historique complet de vos paris P10 ({userBets.length} au total)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingBets ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                      <p>Chargement des paris...</p>
                    </div>
                  ) : userBets.length === 0 ? (
                    <div className="text-center py-8">
                      <MdSportsMotorsports className="mx-auto mb-4 text-gray-400" size={48} />
                      <p className="text-gray-500 mb-4">Vous n&apos;avez placé aucun pari pour le moment.</p>
                      <Button 
                        onClick={() => router.push("/races")}
                        className="flex items-center gap-2"
                      >
                        <MdSportsMotorsports size={16} />
                        Voir les courses
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Statistiques des paris */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-blue-600">{userBets.length}</div>
                          <div className="text-xs text-blue-600">Total paris</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-orange-600">{upcomingBets.length}</div>
                          <div className="text-xs text-orange-600">En attente</div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-green-600">{winningBets}</div>
                          <div className="text-xs text-green-600">Gagnants</div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4 text-center">
                          <div className={`text-xl font-bold ${getPointsColor(totalPoints)}`}>
                            {totalPoints > 0 ? `+${totalPoints}` : totalPoints}
                          </div>
                          <div className="text-xs text-purple-600">Points</div>
                        </div>
                      </div>

                      {/* Paris à venir */}
                      {upcomingBets.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MdTrendingUp className="text-orange-500" />
                            Paris en cours ({upcomingBets.length})
                          </h3>
                          <div className="space-y-2">
                            {upcomingBets.map((bet) => (
                              <div key={bet.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {bet.pilote?.picture && (
                                      <Image 
                                        src={bet.pilote.picture} 
                                        alt={bet.pilote.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover border-2 border-orange-200"
                                      />
                                    )}
                                    <div>
                                      <div className="font-semibold text-orange-800">
                                        {bet.pilote?.name || 'Pilote inconnu'}
                                      </div>
                                      <div className="text-sm text-orange-600">
                                        {bet.track?.country_name} • {bet.gp ? formatDate(bet.gp.date) : 'Date inconnue'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-orange-800">P10</div>
                                    <div className="text-sm text-orange-600">En attente</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Historique des paris */}
                      {pastBets.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MdSportsMotorsports className="text-gray-600" />
                            Historique des résultats ({pastBets.length})
                          </h3>
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {pastBets.map((bet) => (
                              <div key={bet.id} className={`border rounded-lg p-4 ${
                                (bet.point_p10 || 0) > 0 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-red-50 border-red-200'
                              }`}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {bet.pilote?.picture && (
                                      <Image 
                                        src={bet.pilote.picture} 
                                        alt={bet.pilote.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full object-cover border-2 border-gray-200"
                                      />
                                    )}
                                    <div>
                                      <div className="font-semibold text-gray-800">
                                        {bet.pilote?.name || 'Pilote inconnu'}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {bet.track?.country_name} • {bet.gp ? formatDate(bet.gp.date) : 'Date inconnue'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-gray-800">P10</div>
                                    <div className={`text-sm font-semibold ${getPointsColor(bet.point_p10)}`}>
                                      {getPointsText(bet.point_p10)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="pt-4 border-t">
                        <Button 
                          onClick={() => router.push("/races")}
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <MdSportsMotorsports size={16} />
                          Placer de nouveaux paris
                        </Button>
                      </div>
                    </div>
                  )}
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
