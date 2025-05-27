"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDays, Clock, MapPin, Flag, Filter, Search, X, Users, TrendingUp } from "lucide-react"

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
  picture_track: string
}

type Pilote = {
  id_api_pilotes: string
  name: string
  picture: string
  name_acronym: string
}

type FilterType = 'all' | 'upcoming' | 'finished'

export default function RacesPage() {
  const [gps, setGps] = useState<GP[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [pilotes, setPilotes] = useState<Pilote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<FilterType>('all')
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSeason, setSelectedSeason] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState("all")
  const [sortBy, setSortBy] = useState<'date' | 'country' | 'round'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  
  // États pour le popup
  const [selectedGP, setSelectedGP] = useState<GP | null>(null)
  const [showPilotesModal, setShowPilotesModal] = useState(false)
  const [loadingPilotes, setLoadingPilotes] = useState(false)
  
  // États pour le pari
  const [placingBet, setPlacingBet] = useState(false)
  const [betSuccess, setBetSuccess] = useState("")
  const [betError, setBetError] = useState("")
  
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        // Récupérer les GPs et les tracks en parallèle
        const [gpsResponse, tracksResponse] = await Promise.all([
          fetch("http://localhost:3000/graphql", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
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
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              query: `
                query GetAllTracks {
                  getAllTracks {
                    id_api_races
                    country_name
                    track_name
                    picture_country
                    picture_track
                  }
                }
              `,
            }),
          })
        ])

        const [gpsResult, tracksResult] = await Promise.all([
          gpsResponse.json(),
          tracksResponse.json()
        ])

        if (gpsResult.errors) {
          throw new Error(gpsResult.errors[0].message)
        }
        if (tracksResult.errors) {
          throw new Error(tracksResult.errors[0].message)
        }

        setGps(gpsResult.data.getAllGPs)
        setTracks(tracksResult.data.getAllTracks)
      } catch (err: any) {
        console.log("Erreur:", err)
        setError(err.message)
        if (err.message.includes("authentifié")) {
          localStorage.removeItem("token")
          router.push("/login")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  // Fonction pour récupérer les pilotes
  const fetchPilotes = async () => {
    try {
      setLoadingPilotes(true)
      const token = localStorage.getItem("token")
      
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
            query {
              pilotes {
                id_api_pilotes
                name
                picture
                name_acronym
              }
            }
          `,
        }),
      })

      const result = await response.json()
      console.log("Réponse pilotes complète:", result)
      
      if (result.data && result.data.pilotes) {
        console.log("Données pilotes trouvées:", result.data.pilotes.length)
        
        const pilotesCleans = result.data.pilotes.map((pilote: any) => ({
          id_api_pilotes: pilote.id_api_pilotes || "unknown",
          name: pilote.name || "Nom inconnu",
          picture: pilote.picture || "", // Garde la picture même si null
          name_acronym: pilote.name_acronym || "???"
        }))
        
        setPilotes(pilotesCleans)
        console.log("Pilotes définis:", pilotesCleans.length)
        return
      }
      
      if (result.errors) {
        console.log("Erreurs GraphQL:", result.errors)
        throw new Error(result.errors[0].message)
      }

    } catch (err: any) {
      console.log("Erreur pilotes:", err)
      setPilotes([])
    } finally {
      setLoadingPilotes(false)
    }
  }

  // Fonction pour placer un pari
  const placeBet = async (piloteId: string) => {
    try {
      setPlacingBet(true)
      setBetError("")
      setBetSuccess("")
      
      const token = localStorage.getItem("token")
      
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": ` ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation PlaceBet($id_pilote: Int!) {
              placeBet(id_pilote: $id_pilote)
            }
          `,
          variables: {
            id_pilote: parseInt(piloteId)
          }
        }),
      })

      const result = await response.json()
      
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      setBetSuccess(result.data.placeBet)
      
      // Fermer le modal après 2 secondes
      setTimeout(() => {
        closePilotesModal()
      }, 2000)

    } catch (err: any) {
      console.log("Erreur pari:", err)
      setBetError(err.message)
    } finally {
      setPlacingBet(false)
    }
  }

  // Fonction pour ouvrir le modal des pilotes
  const openPilotesModal = async (gp: GP) => {
    setSelectedGP(gp)
    setShowPilotesModal(true)
    setBetSuccess("")
    setBetError("")
    if (pilotes.length === 0) {
      await fetchPilotes()
    }
  }

  // Fonction pour fermer le modal
  const closePilotesModal = () => {
    setShowPilotesModal(false)
    setSelectedGP(null)
    setBetSuccess("")
    setBetError("")
  }

  // Fonction pour vérifier si le GP permet les paris (plus de 24h avant)
  const canPlaceBet = (gp: GP) => {
    const now = new Date()
    const gpDate = new Date(gp.date)
    const timeDiffMs = gpDate.getTime() - now.getTime()
    const hoursDiff = timeDiffMs / (1000 * 60 * 60)
    return hoursDiff >= 24
  }

  // Fonction pour trouver le circuit correspondant à un GP
  const getTrackForGP = (id_api_track: number) => {
    return tracks.find(track => track.id_api_races === id_api_track)
  }

  // Fonction pour filtrer et trier les GPs
  const getFilteredGPs = () => {
    let filteredGPs = [...gps]
    const now = new Date()

    // Filtre par statut (à venir/terminé)
    switch (filter) {
      case 'upcoming':
        filteredGPs = filteredGPs.filter(gp => new Date(gp.date) > now)
        break
      case 'finished':
        filteredGPs = filteredGPs.filter(gp => new Date(gp.date) <= now)
        break
    }

    // Filtre par recherche (nom du pays/circuit)
    if (searchTerm) {
      filteredGPs = filteredGPs.filter(gp => {
        const track = getTrackForGP(gp.id_api_track)
        const searchLower = searchTerm.toLowerCase()
        return (
          track?.country_name?.toLowerCase().includes(searchLower) ||
          track?.track_name?.toLowerCase().includes(searchLower) ||
          `gp ${track?.country_name}`.toLowerCase().includes(searchLower)
        )
      })
    }

    // Filtre par saison
    if (selectedSeason !== "all") {
      filteredGPs = filteredGPs.filter(gp => gp.season === selectedSeason)
    }

    // Filtre par mois
    if (selectedMonth !== "all") {
      filteredGPs = filteredGPs.filter(gp => {
        const month = new Date(gp.date).getMonth()
        return month === parseInt(selectedMonth)
      })
    }

    // Tri
    filteredGPs.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'country':
          const trackA = getTrackForGP(a.id_api_track)
          const trackB = getTrackForGP(b.id_api_track)
          comparison = (trackA?.country_name || '').localeCompare(trackB?.country_name || '')
          break
        case 'round':
          comparison = a.id_api_races - b.id_api_races
          break
      }
      
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filteredGPs
  }

  // Obtenir les saisons uniques
  const getUniqueSeasons = () => {
    return [...new Set(gps.map(gp => gp.season))].sort()
  }

  // Obtenir les mois avec des courses
  const getMonthsWithRaces = () => {
    const months = [...new Set(gps.map(gp => new Date(gp.date).getMonth()))]
    return months.sort((a, b) => a - b)
  }

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    setSearchTerm("")
    setSelectedSeason("all")
    setSelectedMonth("all")
    setFilter('all')
    setSortBy('date')
    setSortOrder('asc')
  }

  // Compter les GPs par statut
  const getGPCounts = () => {
    const now = new Date()
    const upcoming = gps.filter(gp => new Date(gp.date) > now).length
    const finished = gps.filter(gp => new Date(gp.date) <= now).length
    
    return { total: gps.length, upcoming, finished }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5) // HH:MM
  }

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Chargement des courses...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
        </div>
      </div>
    )
  }

  const filteredGPs = getFilteredGPs()
  const counts = getGPCounts()
  const uniqueSeasons = getUniqueSeasons()
  const monthsWithRaces = getMonthsWithRaces()
  const bettingAllowed = selectedGP ? canPlaceBet(selectedGP) : false

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-red-700 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-white text-3xl font-black tracking-wide mb-2">
              <Flag className="inline-block mr-2" size={32} />
              F1 <span className="text-yellow-300">RACES</span>
            </h1>
            <p className="text-white/80 text-sm">Calendrier des Grands Prix</p>
          </div>
        </div>
        
        {/* Decorative wave */}
        <div className="h-6 bg-red-700">
          <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="#f9fafb" />
          </svg>
        </div>
      </header>

      {/* Modal des pilotes avec paris */}
      {showPilotesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            {/* Header du modal */}
            <div className="bg-red-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={24} />
                <h2 className="text-xl font-bold">
                  {bettingAllowed ? "Parier sur un pilote" : "Pilotes"} - {selectedGP && getTrackForGP(selectedGP.id_api_track)?.country_name 
                    ? `GP ${getTrackForGP(selectedGP.id_api_track)?.country_name}` 
                    : `GP #${selectedGP?.id_api_races}`}
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePilotesModal}
                className="text-white hover:bg-red-700"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Info de pari */}
            {selectedGP && (
              <div className={`p-3 text-sm ${bettingAllowed ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                {bettingAllowed ? (
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} />
                    <span>Paris ouverts ! Cliquez sur un pilote pour parier sur sa position P10.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <X size={16} />
                    <span>Paris fermés - Moins de 24h avant le GP</span>
                  </div>
                )}
              </div>
            )}

            {/* Messages de succès/erreur */}
            {betSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-4 mt-4 rounded">
                {betSuccess}
              </div>
            )}
            {betError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
                {betError}
              </div>
            )}

            {/* Contenu du modal */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {loadingPilotes ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p>Chargement des pilotes...</p>
                </div>
              ) : pilotes.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-500">Aucun pilote trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pilotes.map((pilote) => (
                    <div
                      key={pilote.id_api_pilotes}
                      className={`bg-gray-50 rounded-lg p-4 transition-all duration-200 ${
                        bettingAllowed 
                          ? 'hover:shadow-md hover:bg-green-50 cursor-pointer border-2 border-transparent hover:border-green-300' 
                          : 'opacity-75'
                      }`}
                      onClick={() => bettingAllowed && placeBet(pilote.id_api_pilotes)}
                    >
                      <div className="flex items-center gap-3">
                        {pilote.picture ? (
                          <img
                            src={pilote.picture}
                            alt={pilote.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-red-200"
                            onError={(e) => {
                              // Fallback en cas d'erreur de chargement d'image
                              e.currentTarget.style.display = 'none'
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement
                              if (fallback) fallback.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        {/* Fallback toujours présent mais caché si image existe */}
                        <div 
                          className={`w-12 h-12 rounded-full bg-red-200 flex items-center justify-center ${
                            pilote.picture ? 'hidden' : 'flex'
                          }`}
                        >
                          <span className="text-red-600 font-bold text-sm">
                            {pilote.name_acronym || 
                             (pilote.name ? pilote.name.slice(0, 2).toUpperCase() : "??")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{pilote.name}</h3>
                          <p className="text-sm text-gray-500">{pilote.name_acronym}</p>
                          {bettingAllowed && (
                            <p className="text-xs text-green-600 font-medium mt-1">
                              <TrendingUp size={12} className="inline mr-1" />
                              Cliquer pour parier
                            </p>
                          )}
                        </div>
                        {placingBet && (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer du modal */}
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <Button onClick={closePilotesModal} variant="outline">
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content - partie filtres identique */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Filtres avancés */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="text-red-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-800">Filtres et recherche</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="ml-auto text-gray-600 hover:text-gray-800"
            >
              <X size={16} className="mr-1" />
              Réinitialiser
            </Button>
          </div>
          
          {/* Première ligne de filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Rechercher un GP ou pays..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Saison */}
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes les saisons</option>
              {uniqueSeasons.map(season => (
                <option key={season} value={season}>Saison {season}</option>
              ))}
            </select>

            {/* Mois */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous les mois</option>
              {monthsWithRaces.map(month => (
                <option key={month} value={month.toString()}>{monthNames[month]}</option>
              ))}
            </select>

            {/* Tri */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'country' | 'round')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 flex-1"
              >
                <option value="date">Trier par date</option>
                <option value="country">Trier par pays</option>
                <option value="round">Trier par round</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Statut filters */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={`${filter === 'all' ? 'bg-red-600 hover:bg-red-700' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
            >
              Toutes ({counts.total})
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              className={`${filter === 'upcoming' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
            >
              À venir ({counts.upcoming})
            </Button>
            <Button
              variant={filter === 'finished' ? 'default' : 'outline'}
              onClick={() => setFilter('finished')}
              className={`${filter === 'finished' ? 'bg-gray-600 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Terminées ({counts.finished})
            </Button>
          </div>

          {/* Indicateur de résultats */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredGPs.length} course(s) trouvée(s) sur {gps.length} au total
          </div>
        </div>

        {/* Résultats avec bouton cliquable */}
        {filteredGPs.length === 0 ? (
          <div className="text-center py-12">
            <Flag className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-500 text-lg">Aucune course trouvée avec ces critères</p>
            <Button onClick={resetFilters} className="mt-4" variant="outline">
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGPs.map((gp) => {
              const track = getTrackForGP(gp.id_api_track)
              const isUpcoming = new Date(gp.date) > new Date()
              const canBet = canPlaceBet(gp)
              
              return (
                <Card 
                  key={gp.id_api_races} 
                  className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-red-600 cursor-pointer"
                  onClick={() => openPilotesModal(gp)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {track ? `GP ${track.country_name}` : `Grand Prix #${gp.id_api_races}`}
                      </CardTitle>
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {gp.season}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays size={16} className="text-red-600" />
                      <span className="text-sm font-medium">
                        {formatDate(gp.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} className="text-red-600" />
                      <span className="text-sm font-medium">
                        {formatTime(gp.time)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} className="text-red-600" />
                      <span className="text-sm font-medium">
                        {track ? track.track_name : `Circuit #${gp.id_api_track}`}
                      </span>
                    </div>

                    {track && (
                      <div className="bg-gray-50 rounded-lg p-2 mt-2">
                        <p className="text-xs text-gray-500 font-medium">
                          🏁 {track.country_name} - {track.track_name}
                        </p>
                      </div>
                    )}

                    {/* Bouton pour voir les pilotes avec indicateur de pari */}
                    <div className="flex items-center justify-between pt-2">
                      {isUpcoming ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          À venir
                        </span>
                      ) : (
                        <span className="border border-gray-300 text-gray-500 px-2 py-1 rounded-full text-xs font-semibold">
                          Terminé
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1 text-red-600 text-xs font-medium">
                        {canBet ? <TrendingUp size={14} /> : <Users size={14} />}
                        {canBet ? "Parier" : "Voir pilotes"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}