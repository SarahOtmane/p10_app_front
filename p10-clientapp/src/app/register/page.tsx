"use client"

import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          mutation RegisterAUser($email: String!, $firstname: String!, $lastname: String!, $password: String!) {
            registerAUser(email: $email, firstname: $firstname, lastname: $lastname, password: $password) {
              id
              email
              firstname
              lastname
              role
              id_avatar
            }
          }
        `,
          variables: {
            email: formData.email,
            firstname: formData.firstname,
            lastname: formData.lastname,
            password: formData.password,
          },
        }),
      })
      const result = await response.json()
      if (result.errors) {
        throw new Error(result.errors[0].message)
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
      {success ? (
        <p className="text-center text-green-600">Inscription réussie! Vous pouvez maintenant <Link href="/login" className="font-medium text-red-600 hover:text-red-500">vous connecter</Link>.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 border border-gray-300 rounded-lg p-4">
          <input
            type="text"
            name="firstname"
            placeholder="Prénom"
            value={formData.firstname}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Nom"
            value={formData.lastname}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
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
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded">
            S'inscrire
          </button>
        </form>
      )}
      <p className="mt-4 text-center text-sm text-gray-600">
        Vous avez déjà un compte?{" "}
        <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
          Se connecter
        </Link>
      </p>
    </div>
  )
}