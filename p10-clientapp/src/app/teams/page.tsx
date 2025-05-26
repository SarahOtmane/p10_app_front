"use client"
import Image from "next/image"
import { useState } from "react"
import { MdAdd, MdGroup, MdLock, MdPublic, MdClose, MdStar } from "react-icons/md"
import Footer from "@/components/footer"
const leagues = [
  { 
    name: "Legends Racing", 
    members: 12, 
    selected: true, 
    avatar: "🏆",
    type: "private",
    rank: 1
  },
  { 
    name: "Speed Demons", 
    members: 8, 
    selected: false, 
    avatar: "🔥",
    type: "public",
    rank: 3
  },
  { 
    name: "F1 Masters", 
    members: 15, 
    selected: false, 
    avatar: "⚡",
    type: "private",
    rank: 7
  },
];

export default function LeaguesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [leagueName, setLeagueName] = useState("");
  const [leagueType, setLeagueType] = useState("private");
  const [joinCode, setJoinCode] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`League créée: ${leagueName} (${leagueType})`);
    setShowCreateModal(false);
    setLeagueName("");
    setLeagueType("private");
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Code entré: ${joinCode}`);
    setShowJoinModal(false);
    setJoinCode("");
  };

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
                  {leagues.reduce((acc, league) => acc + league.members, 0)}
                </div>
                <div className="text-xs text-gray-300">Membres</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-red-400">
                  {leagues.find(l => l.selected)?.rank || "-"}
                </div>
                <div className="text-xs text-gray-300">Rang</div>
              </div>
            </div>

            <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
              <MdStar className="text-yellow-400" />
              Vos Ligues
            </h2>
            
            {/* Leagues List */}
            <div className="space-y-4 mb-8">
              {leagues.map((league, idx) => (
                <div 
                  key={idx} 
                  className={`bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
                    league.selected 
                      ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-white ring-2 ring-yellow-400/50' 
                      : 'border-white/20 hover:border-red-400/50'
                  }`}
                >
                  <div className="flex items-center">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-2xl mr-4 shadow-lg">
                      {league.avatar}
                    </div>
                    
                    {/* League Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-800 truncate">{league.name}</h3>
                        {league.type === 'private' ? (
                          <MdLock className="text-gray-500 flex-shrink-0" size={16} />
                        ) : (
                          <MdPublic className="text-green-500 flex-shrink-0" size={16} />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MdGroup size={16} />
                          {league.members} membres
                        </span>
                        <span className="text-red-600 font-medium">
                          Rang #{league.rank}
                        </span>
                      </div>
                    </div>
                    
                    {/* Selected Indicator */}
                    {league.selected && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                          ACTIVE
                        </span>
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-yellow-900 text-sm">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Type de ligue
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    leagueType === "private" ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="private"
                      checked={leagueType === "private"}
                      onChange={() => setLeagueType("private")}
                      className="text-red-500 focus:ring-red-500"
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
                  }`}>
                    <input
                      type="radio"
                      name="type"
                      value="public"
                      checked={leagueType === "public"}
                      onChange={() => setLeagueType("public")}
                      className="text-red-500 focus:ring-red-500"
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
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl py-3 font-bold transition-all"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl py-3 font-bold transition-all transform hover:scale-105"
                >
                  Créer
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
                  placeholder="ABC123"
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-center font-mono text-lg tracking-wider"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  Entrez le code à 6 caractères fourni par l'administrateur
                </p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl py-3 font-bold transition-all"
                  onClick={() => setShowJoinModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl py-3 font-bold transition-all transform hover:scale-105"
                >
                  Rejoindre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
