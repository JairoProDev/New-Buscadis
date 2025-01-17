import Link from "next/link"
import { Metadata } from "next"

import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Iniciar sesión - BuscaDis",
  description: "Inicia sesión en tu cuenta de BuscaDis",
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenido de nuevo
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>
        <AuthForm type="login" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/register"
            className="hover:text-brand underline underline-offset-4"
          >
            ¿No tienes una cuenta? Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
} 