"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import { MdEmojiEvents, MdStar, MdSpeed, MdFlag, MdCalendarToday } from "react-icons/md"
import { IoMdTrophy } from "react-icons/io"

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

type Ecurie = {
  id_api_ecurie: number
  name: string
  short_name: string
  logo: string
  color: string
}

type GPPilote = {
  id: number
  id_gp: number
  id_pilote: number
  id_ecurie: number
}

type GPClassement = {
  id: number
  id_gp_pilote: number
  position: number
}

export default function RankingPage() {
  const [gps, setGps] = useState<GP[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [pilotes, setPilotes] = useState<Pilote[]>([])
  const [ecuries, setEcuries] = useState<Ecurie[]>([])
  const [gpPilotes, setGpPilotes] = useState<GPPilote[]>([])
  const [selectedGP, setSelectedGP] = useState<GP | null>(null)
  const [classements, setClassements] = useState<GPClassement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      // Récupérer toutes les données nécessaires
      const [gpsResponse, tracksResponse, pilotesResponse, ecuriesResponse, gpPilotesResponse, classementsResponse] = await Promise.all([
        // GP - getAllGPs
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
        // Track - getAllTracks
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
                  picture_track
                }
              }
            `,
          }),
        }),
        // Pilote - pilotes
        fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
          },
          body: JSON.stringify({
            query: `
              query  {
                pilotes {
                  id_api_pilotes
                  name
                  picture
                  name_acronym
                }
              }
            `,
          }),
        }),
        // Ecurie - getEcuries
        fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
          },
          body: JSON.stringify({
            query: `
              query GetEcuries {
                getEcuries {
                  id_api_ecurie
                  name
                  short_name
                  logo
                  color
                }
              }
            `,
          }),
        }),
        // GP_Pilotes - getAllGpPilotes (il faut que cette query existe dans ton backend)
        fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
          },
          body: JSON.stringify({
            query: `
              query  {
                getAllGpPilotes {
                    id
                    id_gp
                    id_pilote
                    id_ecurie
                }
              }
            `,
          }),
        }),
        // GPClassement - getAllGpClassements
        fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ` ${token}`,
          },
          body: JSON.stringify({
            query: `
              query GetAllGpClassements {
                getAllGpClassements {
                  id
                  id_gp_pilote
                  position
                }
              }
            `,
          }),
        })
      ])

      const [gpsResult, tracksResult, pilotesResult, ecuriesResult, gpPilotesResult, classementsResult] = await Promise.all([
        gpsResponse.json(),
        tracksResponse.json(),
        pilotesResponse.json(),
        ecuriesResponse.json(),
        gpPilotesResponse.json(),
        classementsResponse.json()
      ])
      
      if (gpsResult.errors) throw new Error(gpsResult.errors[0].message)
      if (tracksResult.errors) throw new Error(tracksResult.errors[0].message)
      if (pilotesResult.errors) throw new Error(pilotesResult.errors[0].message)
      if (ecuriesResult.errors) throw new Error(ecuriesResult.errors[0].message)
      if (gpPilotesResult.errors) throw new Error(gpPilotesResult.errors[0].message)
      if (classementsResult.errors) throw new Error(classementsResult.errors[0].message)

      // Filtrer uniquement les GP passés
      const today = new Date()
      const pastGPs = (gpsResult.data.getAllGPs || [])
        .filter((gp: GP) => new Date(gp.date) < today)
        .sort((a: GP, b: GP) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      setGps(pastGPs)
      setTracks(tracksResult.data.getAllTracks || [])
      setPilotes(pilotesResult.data.pilotes || [])
      setEcuries(ecuriesResult.data.getEcuries || [])
      setGpPilotes(gpPilotesResult.data.getAllGpPilotes || [])
      setClassements(classementsResult.data.getAllGpClassements || [])
      
      // Sélectionner automatiquement le GP le plus récent
      if (pastGPs.length > 0) {
        setSelectedGP(pastGPs[0])
      }
      
    } catch (err: any) {
      console.error("Erreur:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGPSelect = (gp: GP) => {
    setSelectedGP(gp)
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <IoMdTrophy className="text-yellow-500" size={24} />
      case 2: return <IoMdTrophy className="text-gray-400" size={20} />
      case 3: return <IoMdTrophy className="text-orange-600" size={18} />
      default: return <span className="font-bold text-gray-600">{position}</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getTrackForGP = (gp: GP) => {
    return tracks.find(track => track.id_api_races === gp.id_api_track)
  }

  const getGPDisplayName = (gp: GP) => {
    const track = getTrackForGP(gp)
    return `GP ${track?.country_name || 'Unknown'} ${gp.season}`
  }

  // Filtrer les classements pour le GP sélectionné
  const getFilteredClassements = () => {
    if (!selectedGP) return []
    
    // 1. Trouver tous les GP_Pilotes pour ce GP
    const gpPilotesForSelectedGP = gpPilotes.filter(gp => gp.id_gp === selectedGP.id_api_races)
    
    // 2. Récupérer les IDs des GP_Pilotes
    const gpPiloteIds = gpPilotesForSelectedGP.map(gp => gp.id)
    
    // 3. Filtrer les classements qui correspondent à ces GP_Pilotes
    const filteredClassements = classements.filter(classement => 
      gpPiloteIds.includes(classement.id_gp_pilote)
    )
    
    // 4. Trier par position
    return filteredClassements.sort((a, b) => {
      if (a.position === -1) return 1
      if (b.position === -1) return -1
      return a.position - b.position
    })
  }

  // Obtenir le pilote pour un classement
  const getPiloteForClassement = (classement: GPClassement) => {
    const gpPilote = gpPilotes.find(gp => gp.id === classement.id_gp_pilote)
    if (!gpPilote) return null
    return pilotes.find(p => parseInt(p.id_api_pilotes) === gpPilote.id_pilote)
  }

  // Obtenir l'écurie pour un classement
  const getEcurieForClassement = (classement: GPClassement) => {
    const gpPilote = gpPilotes.find(gp => gp.id === classement.id_gp_pilote)
    if (!gpPilote) return null
    return ecuries.find(e => e.id_api_ecurie === gpPilote.id_ecurie)
  }

  const filteredClassements = getFilteredClassements()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Chargement des données F1...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16">
        <div className="text-center">
          <p className="text-red-600 mb-4">Erreur: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <MdEmojiEvents className="text-yellow-500" size={32} />
            Classements F1
          </h1>
          <p className="text-gray-600">
            Résultats des Grands Prix passés ({gps.length} GP • {pilotes.length} pilotes • {ecuries.length} écuries)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des GP passés */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MdFlag className="text-red-600" size={20} />
                  GP Passés ({gps.length})
                </h2>
                <p className="text-gray-600 text-sm mt-1">Cliquez sur un GP pour voir son classement</p>
              </div>
              <div className="p-4">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {gps.map((gp) => {
                    const track = getTrackForGP(gp)
                    // Compter les participants pour ce GP
                    const participantsCount = gpPilotes.filter(gpp => gpp.id_gp === gp.id_api_races).length
                    
                    return (
                      <button
                        key={gp.id_api_races}
                        onClick={() => handleGPSelect(gp)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          selectedGP?.id_api_races === gp.id_api_races
                            ? 'border-red-500 bg-red-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-semibold text-sm">{getGPDisplayName(gp)}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MdCalendarToday size={12} />
                          {formatDate(gp.date)}
                        </div>
                        <div className="text-xs text-gray-500">{track?.track_name || 'Circuit inconnu'}</div>
                        <div className="text-xs text-blue-600 mt-1">
                          👥 {participantsCount} pilotes
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info GP sélectionné */}
            {selectedGP && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <MdSpeed className="text-blue-600" size={20} />
                    {getGPDisplayName(selectedGP)}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                    <MdCalendarToday size={14} />
                    {formatDate(selectedGP.date)} - {getTrackForGP(selectedGP)?.track_name}
                  </p>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">Saison {selectedGP.season}</div>
                      <div className="text-xs text-gray-600">Année</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{selectedGP.time}</div>
                      <div className="text-xs text-gray-600">Heure</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{filteredClassements.length}</div>
                      <div className="text-xs text-gray-600">Pilotes classés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">#{selectedGP.id_api_races}</div>
                      <div className="text-xs text-gray-600">Round</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Classements */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <IoMdTrophy className="text-yellow-500" size={20} />
                  Classement du GP
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedGP ? `${filteredClassements.length} pilotes classés` : 'Sélectionnez un GP'}
                </p>
              </div>
              
              <div className="p-4">
                {!selectedGP ? (
                  <div className="text-center py-8">
                    <MdFlag className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-500">Sélectionnez un Grand Prix pour voir son classement</p>
                  </div>
                ) : filteredClassements.length === 0 ? (
                  <div className="text-center py-8">
                    <IoMdTrophy className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-gray-500">Aucun classement disponible pour ce GP</p>
                    <p className="text-sm text-gray-400 mt-2">
                      GP #{selectedGP.id_api_races} • {gpPilotes.filter(gp => gp.id_gp === selectedGP.id_api_races).length} pilotes inscrits
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Podium */}
                    {filteredClassements.filter(c => c.position <= 3 && c.position > 0).length > 0 && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                          <MdStar className="text-yellow-500" />
                          Podium
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                          {filteredClassements
                            .filter(c => c.position <= 3 && c.position > 0)
                            .slice(0, 3)
                            .map((classement) => {
                              const pilote = getPiloteForClassement(classement)
                              const ecurie = getEcurieForClassement(classement)
                              
                              return (
                                <div key={classement.id} className="text-center bg-white bg-opacity-60 rounded-lg p-3">
                                  <div className="mb-2">
                                    {getPositionIcon(classement.position)}
                                  </div>
                                  {pilote?.picture && (
                                    <img 
                                      src={pilote.picture} 
                                      alt={pilote.name}
                                      className="w-12 h-12 rounded-full mx-auto mb-2 object-cover border-2 border-gray-200"
                                    />
                                  )}
                                  <div className="text-sm font-semibold">{pilote?.name || 'Pilote inconnu'}</div>
                                  <div className="text-xs text-gray-600">{ecurie?.short_name || 'Équipe inconnue'}</div>
                                </div>
                              )
                            })
                          }
                        </div>
                      </div>
                    )}

                    {/* Liste complète */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg mb-3">
                        Classement complet ({filteredClassements.length} pilotes)
                      </h3>
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {filteredClassements.map((classement) => {
                          const pilote = getPiloteForClassement(classement)
                          const ecurie = getEcurieForClassement(classement)
                          
                          return (
                            <div
                              key={classement.id}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                classement.position <= 3 && classement.position > 0
                                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                                  : classement.position <= 10 && classement.position > 0
                                  ? 'bg-blue-50 border-blue-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 flex justify-center">
                                  {classement.position === -1 ? (
                                    <span className="text-sm text-gray-400 font-bold">DNF</span>
                                  ) : (
                                    getPositionIcon(classement.position)
                                  )}
                                </div>
                                {pilote?.picture && (
                                  <img 
                                    src={pilote.picture} 
                                    alt={pilote.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                  />
                                )}
                                <div>
                                  <div className="font-semibold">{pilote?.name || 'Pilote inconnu'}</div>
                                  <div className="text-sm text-gray-600">{ecurie?.name || 'Équipe inconnue'}</div>
                                </div>
                              </div>
                              <div className="text-right flex items-center gap-2">
                                <div 
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{ backgroundColor: ecurie?.color || '#gray' }}
                                  title={ecurie?.name}
                                ></div>
                                <div className="text-sm font-medium">
                                  {classement.position === -1 ? 'DNF' : `P${classement.position}`}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}