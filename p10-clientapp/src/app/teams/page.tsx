"use client"
import Image from "next/image"
import { useState } from "react"

const leagues = [
  { name: "Team 1", members: 6, selected: true },
  { name: "Team 1", members: 6, selected: true },
  { name: "Team 1", members: 6, selected: true },
  // Ajoute d'autres ligues ici si besoin
];

export default function LeaguesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [leagueName, setLeagueName] = useState("");
  const [leagueType, setLeagueType] = useState("private");
  const [joinCode, setJoinCode] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu peux ajouter la logique pour créer la league
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
    <div className="min-h-screen flex flex-col bg-[#ecf0f3]">
      {/* Header */}
      <header className="bg-red-700 rounded-b-3xl px-0 py-6 flex flex-col items-center">
        <h1 className="text-white text-2xl font-mono tracking-widest font-bold">P10 - Game</h1>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col px-4 pt-6">
        <h2 className="text-2xl font-mono font-bold mb-4">Tes Leagues</h2>
        <div className="space-y-4 mb-6">
          {leagues.map((league, idx) => (
            <div key={idx} className="bg-white rounded-xl flex items-center px-4 py-3 shadow">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-4" />
              <div className="flex-1">
                <div className="font-mono text-lg font-bold">{league.name}</div>
                <div className="text-xs text-gray-500">{league.members} membres</div>
              </div>
              {league.selected && (
                <span className="text-red-500 text-2xl font-bold ml-2">✓</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-4 justify-center mb-8">
          <button
            className="flex-1 bg-red-600 text-white rounded-xl px-8 py-3 font-bold text-lg shadow hover:bg-red-700 transition cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            Créer
          </button>
          <button
            className="flex-1 bg-red-600 text-white rounded-xl px-8 py-3 font-bold text-lg shadow hover:bg-red-700 transition cursor-pointer"
            onClick={() => setShowJoinModal(true)}
          >
            Rejoindre
          </button>
        </div>
        <div className="flex justify-center mt-auto mb-4">
          <Image
            src="/images/ferrari.png"
            alt="Ferrari"
            width={300}
            height={80}
            className="object-contain"
            priority
          />
        </div>
      </main>

      {/* Modal Créer */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-xs shadow-lg flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-2">Créer une league</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nom de la league"
                value={leagueName}
                onChange={e => setLeagueName(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="type"
                    value="private"
                    checked={leagueType === "private"}
                    onChange={() => setLeagueType("private")}
                  />
                  Privée
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="type"
                    value="public"
                    checked={leagueType === "public"}
                    onChange={() => setLeagueType("public")}
                  />
                  Publique
                </label>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="flex-1 border border-gray-400 rounded py-2 font-bold"
                  onClick={() => setShowCreateModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white rounded py-2 font-bold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-11/12 max-w-xs shadow-lg flex flex-col gap-4">
            <h3 className="text-lg font-bold mb-2">Rejoindre une league</h3>
            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Code de la league"
                value={joinCode}
                onChange={e => setJoinCode(e.target.value)}
                className="border rounded px-3 py-2"
                required
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="flex-1 border border-gray-400 rounded py-2 font-bold"
                  onClick={() => setShowJoinModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white rounded py-2 font-bold"
                >
                  Rejoindre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
