import Link from "next/link"
import { Metadata } from "next"

import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Crear cuenta - BuscaDis",
  description: "Crea una cuenta en BuscaDis",
}

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Crear una cuenta
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tus datos para crear una cuenta
          </p>
        </div>
        <AuthForm type="register" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="hover:text-brand underline underline-offset-4"
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
} 