import * as React from "react"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { getServerSession } from "next-auth"

import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { AdisoForm } from "@/components/adisos/adiso-form"
import { routes } from "@/config/routes"

export const metadata: Metadata = {
  title: "Publicar adiso - BuscaDis",
  description: "Publica tu adiso en BuscaDis de forma fácil y rápida.",
}

export default async function NuevoAdisoPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(routes.auth.login)
  }

  const categorias = await db.categoria.findMany({
    orderBy: { nombre: "asc" },
  })

  return (
    <div className="container max-w-2xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold">Publicar adiso</h1>
        <p className="mt-2 text-muted-foreground">
          Completa el formulario con los detalles de tu adiso.
        </p>
      </div>
      <AdisoForm categorias={categorias} />
    </div>
  )
} 