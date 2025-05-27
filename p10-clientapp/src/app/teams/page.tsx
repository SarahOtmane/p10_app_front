"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MdAdd, MdGroup, MdLock, MdPublic, MdClose, MdStar, MdEmail, MdLink, MdEdit, MdDelete } from "react-icons/md"
import Footer from "@/components/footer"

type League = {
  id_league: number
  name: string
  private: boolean
  shared_link: string
  active: boolean
}

export default function LeaguesPage() {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // États pour les modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  
  // États pour les formulaires
  const [leagueName, setLeagueName] = useState("")
  const [leagueType, setLeagueType] = useState("private")
  const [joinCode, setJoinCode] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [selectedLeagueForInvite, setSelectedLeagueForInvite] = useState<League | null>(null)
  
  // États pour les actions
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)
  const [inviting, setInviting] = useState(false)
  
  const router = useRouter()

  useEffect(() => {
    fetchLeagues()
  }, [])

  const fetchLeagues = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": ` ${token}`
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
        if (result.errors[0].message.includes("authentifié")) {
          localStorage.removeItem("token")
          router.push("/login")
          return
        }
        throw new Error(result.errors[0].message)
      }

      setLeagues(result.data.getAllLeaguesOfUser || [])
    } catch (err: any) {
      console.error("Erreur:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leagueName.trim()) return

    try {
      setCreating(true)
      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": ` ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation CreateLeague($name: String!, $isPrivate: Boolean!) {
              createLeague(name: $name, isPrivate: $isPrivate)
            }
          `,
          variables: {
            name: leagueName,
            isPrivate: leagueType === "private"
          }
        }),
      })

      const result = await response.json()
      
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      // Succès - afficher le code de partage
      const sharedLink = result.data.createLeague
      alert(`Ligue créée avec succès !\n\nCode de partage: ${sharedLink}\n\nPartagez ce code avec vos amis pour qu'ils puissent rejoindre votre ligue !`)
      
      // Réinitialiser et fermer
      setShowCreateModal(false)
      setLeagueName("")
      setLeagueType("private")
      
      // Recharger les ligues
      fetchLeagues()
    } catch (err: any) {
      alert(`Erreur lors de la création: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim()) return

    try {
      setJoining(true)
      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": ` ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation AcceptInvitationToLeague($shared_link: String!) {
              acceptInvitationToLeague(shared_link: $shared_link)
            }
          `,
          variables: {
            shared_link: joinCode
          }
        }),
      })

      const result = await response.json()
      
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      alert(result.data.acceptInvitationToLeague)
      
      // Réinitialiser et fermer
      setShowJoinModal(false)
      setJoinCode("")
      
      // Recharger les ligues
      fetchLeagues()
    } catch (err: any) {
      alert(`Erreur lors de la connexion: ${err.message}`)
    } finally {
      setJoining(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim() || !selectedLeagueForInvite) return

    try {
      setInviting(true)
      const token = localStorage.getItem("token")

      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": ` ${token}`
        },
        body: JSON.stringify({
          query: `
            mutation InviteUserToLeague($id_league: Int!, $email: String!) {
              inviteUserToLeague(id_league: $id_league, email: $email)
            }
          `,
          variables: {
            id_league: selectedLeagueForInvite.id_league,
            email: inviteEmail
          }
        }),
      })

      const result = await response.json()
      
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }

      alert(result.data.inviteUserToLeague)
      
      // Réinitialiser et fermer
      setShowInviteModal(false)
      setInviteEmail("")
      setSelectedLeagueForInvite(null)
    } catch (err: any) {
      alert(`Erreur lors de l'invitation: ${err.message}`)
    } finally {
      setInviting(false)
    }
  }

  const copySharedLink = (sharedLink: string) => {
    navigator.clipboard.writeText(sharedLink)
    alert(`Code copié dans le presse-papiers !\n\nCode: ${sharedLink}\n\nPartagez ce code avec vos amis !`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Chargement des ligues...</p>
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
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-red-700 shadow-xl">
          <div className="max-w-md mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-white text-3xl font-black tracking-wide mb-2">
                F1 <span className="text-yellow-300">LEAGUES</span>
              </h1>
              <p className="text-white/80 text-sm">Gérez vos ligues et défis</p>
            </div>
          </div>
          
          {/* Decorative wave */}
          <div className="h-6 bg-red-700">
            <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="#f9fafb" />
            </svg>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 bg-gray-900">
          <div className="max-w-md mx-auto px-6 py-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-yellow-400">{leagues.length}</div>
                <div className="text-xs text-gray-300">Ligues</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-green-400">
                  {leagues.filter(l => l.active).length}
                </div>
                <div className="text-xs text-gray-300">Actives</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-red-400">
                  {leagues.filter(l => l.private).length}
                </div>
                <div className="text-xs text-gray-300">Privées</div>
              </div>
            </div>

            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <MdStar className="text-yellow-400" />
              Vos Ligues
            </h2>
            
            {/* Leagues List */}
            <div className="space-y-4 mb-8">
              {leagues.length === 0 ? (
                <div className="text-center py-8">
                  <MdGroup className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-400 mb-4">Aucune ligue trouvée</p>
                  <p className="text-gray-500 text-sm mb-6">Créez une ligue ou rejoignez-en une !</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Créer une ligue
                    </button>
                    <button
                      onClick={() => setShowJoinModal(true)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Rejoindre
                    </button>
                  </div>
                </div>
              ) : (
                leagues.map((league) => (
                  <div 
                    key={league.id_league} 
                    className={`bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                      league.active 
                        ? 'border-green-400 bg-gradient-to-r from-green-50 to-white' 
                        : 'border-gray-400 bg-gradient-to-r from-gray-50 to-white opacity-75'
                    }`}
                  >
                    <div className="flex items-center">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-2xl mr-4 shadow-lg">
                        {league.private ? "🔒" : "🌍"}
                      </div>
                      
                      {/* League Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-800 truncate">{league.name}</h3>
                          {league.private ? (
                            <MdLock className="text-gray-500 flex-shrink-0" size={16} />
                          ) : (
                            <MdPublic className="text-green-500 flex-shrink-0" size={16} />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            league.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {league.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                          <button
                            onClick={() => copySharedLink(league.shared_link)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            <MdLink size={14} />
                            Code: {league.shared_link}
                          </button>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            setSelectedLeagueForInvite(league)
                            setShowInviteModal(true)
                          }}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                          title="Inviter un utilisateur"
                        >
                          <MdEmail size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-2xl px-6 py-4 font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                onClick={() => setShowCreateModal(true)}
              >
                <MdAdd size={24} />
                Créer
              </button>
              <button
                className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white rounded-2xl px-6 py-4 font-bold text-lg shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                onClick={() => setShowJoinModal(true)}
              >
                <MdGroup size={24} />
                Rejoindre
              </button>
            </div>
            
            {/* Ferrari Image */}
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/ferrari.png"
                  alt="Ferrari"
                  width={280}
                  height={70}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  priority
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Créer */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 transform animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Créer une ligue</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={creating}
              >
                <MdClose size={24} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la ligue
                </label>
                <input
                  type="text"
                  placeholder="Ma Super Ligue F1"
                  value={leagueName}
                  onChange={e => setLeagueName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                  disabled={creating}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type de ligue
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    leagueType === "private" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  } ${creating ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <input
                      type="radio"
                      name="type"
                      value="private"
                      checked={leagueType === "private"}
                      onChange={() => setLeagueType("private")}
                      className="text-red-500 focus:ring-red-500"
                      disabled={creating}
                    />
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <MdLock size={16} />
                        Privée
                      </div>
                      <div className="text-xs text-gray-500">Sur invitation</div>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    leagueType === "public" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  } ${creating ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <input
                      type="radio"
                      name="type"
                      value="public"
                      checked={leagueType === "public"}
                      onChange={() => setLeagueType("public")}
                      className="text-red-500 focus:ring-red-500"
                      disabled={creating}
                    />
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        <MdPublic size={16} />
                        Publique
                      </div>
                      <div className="text-xs text-gray-500">Ouverte à tous</div>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl py-3 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl py-3 font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={creating}
                >
                  {creating ? "Création..." : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Rejoindre */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 transform animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Rejoindre une ligue</h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={joining}
              >
                <MdClose size={24} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleJoin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code de la ligue
                </label>
                <input
                  type="text"
                  placeholder="ABC123Z"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-center font-mono text-lg tracking-wider"
                  required
                  disabled={joining}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Entrez le code à 7 caractères fourni par l'administrateur
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl py-3 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowJoinModal(false)}
                  disabled={joining}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl py-3 font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={joining}
                >
                  {joining ? "Connexion..." : "Rejoindre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Inviter */}
      {showInviteModal && selectedLeagueForInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-200 transform animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Inviter un utilisateur</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={inviting}
              >
                <MdClose size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-700">
                <strong>Ligue:</strong> {selectedLeagueForInvite.name}
              </p>
            </div>
            
            <form onSubmit={handleInvite} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de l'utilisateur
                </label>
                <input
                  type="email"
                  placeholder="utilisateur@example.com"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                  disabled={inviting}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Un email d'invitation sera envoyé à cette adresse
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl py-3 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowInviteModal(false)}
                  disabled={inviting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl py-3 font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={inviting}
                >
                  {inviting ? "Envoi..." : "Inviter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
