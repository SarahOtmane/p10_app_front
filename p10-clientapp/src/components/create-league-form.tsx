"use client"

import { useState } from "react"

export default function CreateLeagueForm() {
  const [leagueType, setLeagueType] = useState("classic")
  const [leagueName, setLeagueName] = useState("")
  const [unlimited, setUnlimited] = useState(false)
  const [maxTeams, setMaxTeams] = useState(10)
  const [teamsPerUser, setTeamsPerUser] = useState(3)

  return (
    <form className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-center">Create a League</h2>
        <p className="text-center text-gray-500 mb-4">Create a league and invite your friends.</p>
      </div>

      <div>
        <label className="font-semibold">Choose a type of league:</label>
        <div className="space-y-2 mt-2">
          <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${leagueType === "classic" ? "bg-purple-50 border-purple-400" : "bg-gray-50"}`}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <input type="radio" name="leagueType" value="classic" checked={leagueType === "classic"} onChange={() => setLeagueType("classic")} className="accent-purple-600" />
                <span className="font-semibold">Classic Private League</span>
              </div>
              <span className="text-xs text-gray-500 ml-6">Can join only with an invite</span>
            </div>
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">Classic</span>
          </label>
          <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${leagueType === "h2h" ? "bg-indigo-50 border-indigo-400" : "bg-gray-50"}`}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <input type="radio" name="leagueType" value="h2h" checked={leagueType === "h2h"} onChange={() => setLeagueType("h2h")} className="accent-indigo-600" />
                <span className="font-semibold">Head 2 Head Private League</span>
              </div>
              <span className="text-xs text-gray-500 ml-6">Battle against your opponent race by race</span>
            </div>
            <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded">H2H</span>
          </label>
          <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${leagueType === "public" ? "bg-blue-50 border-blue-400" : "bg-gray-50"}`}>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <input type="radio" name="leagueType" value="public" checked={leagueType === "public"} onChange={() => setLeagueType("public")} className="accent-blue-600" />
                <span className="font-semibold">Public League</span>
              </div>
              <span className="text-xs text-gray-500 ml-6">Anyone can join -- no limits</span>
            </div>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Public</span>
          </label>
        </div>
      </div>

      <div>
        <label className="font-semibold flex justify-between">
          League Name
          <span className="text-xs text-gray-400">Max. 50 characters</span>
        </label>
        <input
          type="text"
          maxLength={50}
          value={leagueName}
          onChange={e => setLeagueName(e.target.value)}
          placeholder="Enter a League Name"
          className="w-full mt-1 border rounded px-3 py-2 bg-gray-50"
        />
      </div>

      <div className="flex items-center justify-between bg-gray-100 rounded px-3 py-2">
        <span className="font-semibold">Unlimited Participants</span>
        <button
          type="button"
          onClick={() => setUnlimited(!unlimited)}
          className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${unlimited ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${unlimited ? "translate-x-4" : ""}`}></span>
        </button>
      </div>

      {!unlimited && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="font-semibold">Maximum teams</label>
            <input
              type="number"
              min={1}
              value={maxTeams}
              onChange={e => setMaxTeams(Number(e.target.value))}
              className="w-full mt-1 border rounded px-3 py-2 bg-gray-50"
            />
          </div>
          <div className="flex-1">
            <label className="font-semibold">No. of teams per user</label>
            <input
              type="number"
              min={1}
              value={teamsPerUser}
              onChange={e => setTeamsPerUser(Number(e.target.value))}
              className="w-full mt-1 border rounded px-3 py-2 bg-gray-50"
            />
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <button type="button" className="flex-1 border border-gray-400 rounded py-2 font-bold">CANCEL</button>
        <button type="submit" className="flex-1 bg-red-400 text-white rounded py-2 font-bold">SELECT TEAMS</button>
      </div>
    </form>
  )
}

