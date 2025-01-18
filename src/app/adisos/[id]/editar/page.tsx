import * as React from "react"
import { redirect, notFound } from "next/navigation"
import { Metadata } from "next"
import { getServerSession } from "next-auth"

import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { AdisoForm } from "@/components/adisos/adiso-form"
import { routes } from "@/config/routes"

interface EditarAdisoPageProps {
  params: {
    id: string
  }
}

export const metadata: Metadata = {
  title: "Editar adiso - BuscaDis",
  description: "Edita los detalles de tu adiso en BuscaDis.",
}

export default async function EditarAdisoPage({ params }: EditarAdisoPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect(routes.auth.login)
  }

  const [adiso, categorias] = await Promise.all([
    db.adiso.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        titulo: true,
        descripcion: true,
        precio: true,
        categoriaId: true,
        ubicacion: true,
        condicion: true,
        envio: true,
        precioNegociable: true,
        imagenes: true,
        usuarioId: true,
      },
    }),
    db.categoria.findMany({
      orderBy: { nombre: "asc" },
    }),
  ])

  if (!adiso) {
    notFound()
  }

  if (adiso.usuarioId !== session.user.id) {
    redirect(routes.adisos.show(params.id))
  }

  return (
    <div className="container max-w-2xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold">Editar adiso</h1>
        <p className="mt-2 text-muted-foreground">
          Actualiza los detalles de tu adiso.
        </p>
      </div>
      <AdisoForm
        categorias={categorias}
        defaultValues={adiso}
        isEditing
      />
    </div>
  )
} 