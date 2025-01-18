import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AdisoForm } from "@/components/adisos/adiso-form"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Publicar adiso - BuscaDis",
  description: "Publica tu adiso en BuscaDis",
}

export default async function NuevoAdisoPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  const categorias = await db.categoria.findMany({
    orderBy: { orden: "asc" },
    select: {
      id: true,
      nombre: true,
      slug: true,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Publicar adiso</h1>
        <p className="text-muted-foreground">
          Completa el formulario para publicar tu adiso
        </p>
      </div>
      <Separator />
      <div className="mx-auto max-w-2xl">
        <AdisoForm categorias={categorias} />
      </div>
    </div>
  )
} 