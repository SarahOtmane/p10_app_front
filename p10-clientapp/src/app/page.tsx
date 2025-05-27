"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MdEmojiEvents } from "react-icons/md"
import { CalendarDays, Clock, MapPin, Users, TrendingUp } from "lucide-react"
import Footer from "@/components/footer"

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

type UserBet = {
  id: number
  id_pilote_p10: number
  id_gp: number
  point_p10: number | null
}

type Pilote = {
  id_api_pilotes: string
  name: string
  name_acronym: string
}

export default function Home() {
  const [nextGP, setNextGP] = useState<GP | null>(null)
  const [nextTrack, setNextTrack] = useState<Track | null>(null)
  const [userBet, setUserBet] = useState<UserBet | null>(null)
  const [betPilote, setBetPilote] = useState<Pilote | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [racersCount, setRacersCount] = useState<number>(0)
  const [teamsCount, setTeamsCount] = useState<number>(0)

  useEffect(() => {
    const fetchNextGPAndBet = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          return
        }

        // Récupérer les pilotes pour compter les racers
        const pilotesResponse = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query GetPilotes {
                pilotes {
                  id_api_pilotes
                  name
                  name_acronym
                }
              }
            `,
          }),
        })

        const pilotesResult = await pilotesResponse.json()
        if (pilotesResult.data?.pilotes) {
          setRacersCount(pilotesResult.data.pilotes.length)
        }

        // Récupérer les écuries pour compter les teams
        const ecuriesResponse = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query GetAllEcuries {
                getAllEcuries {
                  id_api_ecurie
                  name
                }
              }
            `,
          }),
        })

        const ecuriesResult = await ecuriesResponse.json()
        if (ecuriesResult.data?.getAllEcuries) {
          setTeamsCount(ecuriesResult.data.getAllEcuries.length)
        }

        // Récupérer le prochain GP
        const gpsResponse = await fetch("http://localhost:3000/graphql", {
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
        })

        const gpsResult = await gpsResponse.json()
        if (gpsResult.data?.getAllGPs) {
          const now = new Date()
          const upcomingGPs = gpsResult.data.getAllGPs.filter((gp: GP) => 
            new Date(gp.date) > now
          ).sort((a: GP, b: GP) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          )
          
          if (upcomingGPs.length > 0) {
            setNextGP(upcomingGPs[0])
            
            // Récupérer les tracks
            const tracksResponse = await fetch("http://localhost:3000/graphql", {
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

            const tracksResult = await tracksResponse.json()
            if (tracksResult.data?.getAllTracks) {
              const track = tracksResult.data.getAllTracks.find((t: Track) => 
                t.id_api_races === upcomingGPs[0].id_api_track
              )
              setNextTrack(track)
            }

            // Récupérer le pari de l'utilisateur pour ce GP
            const betsResponse = await fetch("http://localhost:3000/graphql", {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                query: `
                  query GetUserResults {
                    getAllResultsOfUser {
                      id
                      id_pilote_p10
                      id_gp
                      point_p10
                    }
                  }
                `,
              }),
            })

            const betsResult = await betsResponse.json()
            if (betsResult.data?.getAllResultsOfUser) {
              const bet = betsResult.data.getAllResultsOfUser.find((b: UserBet) => 
                b.id_gp === upcomingGPs[0].id_api_races
              )
              setUserBet(bet)

              // Si on a un pari, récupérer les infos du pilote
              if (bet && pilotesResult.data?.pilotes) {
                const pilote = pilotesResult.data.pilotes.find((p: Pilote) => 
                  parseInt(p.id_api_pilotes) === bet.id_pilote_p10
                )
                setBetPilote(pilote)
              }
            }
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNextGPAndBet()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!nextGP) return

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const gpTime = new Date(nextGP.date + 'T' + nextGP.time).getTime()
      const difference = gpTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [nextGP])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const canPlaceBet = () => {
    if (!nextGP) return false
    const now = new Date()
    const gpDate = new Date(nextGP.date)
    const timeDiffMs = gpDate.getTime() - now.getTime()
    const hoursDiff = timeDiffMs / (1000 * 60 * 60)
    return hoursDiff >= 24
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 pb-16">
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Chargement du prochain GP...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-16">
      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Hero Section */}
        <div className="w-full max-w-md relative">
          {/* Banner F1 avec effet glassmorphism */}
          <div className="w-full bg-gradient-to-br from-red-600 via-red-500 to-pink-600 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10 text-center">
              <h1 className="text-white text-3xl font-black mb-2 tracking-wide">
                F1 <span className="text-yellow-300">FANTASY</span>
              </h1>
              <p className="text-white/90 text-sm font-medium mb-6">
                The Official Formula 1 Fantasy Game
              </p>
              
              <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 border-2 border-white/20">
                <Image 
                  src="/images/illu.png"
                  alt="F1 Racing"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Next GP Card avec animation */}
          <div className="w-full bg-white rounded-2xl shadow-2xl p-6 -mt-8 z-10 relative border border-gray-100 transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
            {nextGP && nextTrack ? (
              <>
                {/* Header du GP */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="relative">
                    {nextTrack.picture_country ? (
                      <img
                        src={nextTrack.picture_country}
                        alt={`${nextTrack.country_name} Flag`}
                        className="w-12 h-8 object-contain rounded border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-8 bg-gray-200 rounded border border-gray-200 shadow-sm flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-500">
                          {nextTrack.country_name?.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {nextTrack.country_name?.toUpperCase()}
                    </h3>
                    <p className="text-xs text-gray-500 leading-tight">
                      GP {nextTrack.country_name} {nextGP.season}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600">
                      {formatDate(nextGP.date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {nextGP.time.substring(0, 5)}
                    </div>
                  </div>
                </div>

                {/* Circuit info */}
                <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 text-blue-700">
                    <MapPin size={16} />
                    <span className="text-sm font-medium">{nextTrack.track_name}</span>
                  </div>
                </div>

                {/* Countdown Timer */}
                <div className="relative mb-6">
                  <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">Temps restant</span>
                      </div>
                      <div className="font-mono font-bold text-lg tracking-wider text-yellow-400">
                        {timeLeft.days}j {String(timeLeft.hours).padStart(2, '0')}:
                        {String(timeLeft.minutes).padStart(2, '0')}:
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="mt-2 h-1 bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Pari Section */}
                {userBet && betPilote ? (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <span className="text-sm font-semibold text-green-800">Votre pari P10</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-green-800">{betPilote.name}</div>
                        <div className="text-sm text-green-600">{betPilote.name_acronym}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-green-600">Position prédite</div>
                        <div className="text-lg font-bold text-green-800">P10</div>
                      </div>
                    </div>
                  </div>
                ) : canPlaceBet() ? (
                  <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={16} className="text-orange-600" />
                      <span className="text-sm font-semibold text-orange-800">Pari disponible</span>
                    </div>
                    <p className="text-sm text-orange-700">
                      Vous pouvez encore parier sur qui finira P10 !
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-gray-600" />
                      <span className="text-sm font-semibold text-gray-800">Paris fermés</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Moins de 24h avant le GP
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <Button asChild className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95">
                  <Link href="/races" className="flex items-center justify-center gap-2">
                    <MdEmojiEvents size={24} />
                    {userBet ? "VOIR MES PARIS" : canPlaceBet() ? "PARIER MAINTENANT" : "VOIR LES COURSES"}
                  </Link>
                </Button>

                {/* Stats du GP - MODIFIÉ */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {nextGP.id_api_races}
                    </div>
                    <div className="text-xs text-gray-500">ROUND</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {teamsCount || 10}
                    </div>
                    <div className="text-xs text-gray-500">TEAMS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {racersCount || 20}
                    </div>
                    <div className="text-xs text-gray-500">RACERS</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun prochain GP trouvé</p>
                <Button asChild className="mt-4">
                  <Link href="/races">Voir toutes les courses</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}