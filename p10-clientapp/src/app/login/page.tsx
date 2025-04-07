import Link from "next/link"
import AuthForm from "@/components/auth-form"

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
      <AuthForm type="login" />
      <p className="mt-4 text-center text-sm text-gray-600">
        Vous n'avez pas de compte?{" "}
        <Link href="/register" className="font-medium text-red-600 hover:text-red-500">
          S'inscrire
        </Link>
      </p>
    </div>
  )
}
