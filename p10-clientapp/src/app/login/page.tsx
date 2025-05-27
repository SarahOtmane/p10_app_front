"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation LoginAUser($email: String!, $password: String!) {
            loginAUser(email: $email, password: $password)
          }
        `,
          variables: {
            email: formData.email,
            password: formData.password,
          },
        }),
      })
      
      const result = await response.json()
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }
      
      // Stocker le token et rediriger
      localStorage.setItem("token", result.data.loginAUser)
      console.log("Token stocké:", result.data.loginAUser)
      router.push("/teams")
      
    } catch (err: any) {
      setError(err.message || "Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 border border-gray-300 rounded-lg p-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      
      <p className="mt-4 text-center text-sm text-gray-600">
        Vous n'avez pas de compte?{" "}
        <Link href="/register" className="font-medium text-red-600 hover:text-red-500">
          S'inscrire
        </Link>
      </p>
    </div>
  )
}
