"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function CreateLeagueForm() {
  const [leagueName, setLeagueName] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous implémenteriez la logique de création de ligue
    console.log({ leagueName, description, isPrivate })
    alert("Ligue créée avec succès!")
    setLeagueName("")
    setDescription("")
    setIsPrivate(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="league-name">Nom de la ligue</Label>
        <Input
          id="league-name"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
          placeholder="Ex: Ligue des Champions F1"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre ligue..."
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
        <Label htmlFor="private">Ligue privée</Label>
      </div>

      <Button type="submit" className="w-full">
        Créer la ligue
      </Button>
    </form>
  )
}

