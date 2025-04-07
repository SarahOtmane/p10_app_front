import Link from "next/link"
import AuthForm from "@/components/auth-form"

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
      <AuthForm type="register" />
      <p className="mt-4 text-center text-sm text-gray-600">
        Vous avez déjà un compte?{" "}
        <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
