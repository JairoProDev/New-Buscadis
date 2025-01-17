import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { PerfilForm } from "@/components/perfil/perfil-form"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Mi Perfil - BuscaDis",
  description: "Gestiona tu perfil y preferencias en BuscaDis",
}

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/auth/login")
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      anuncios: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      favoritos: {
        include: { anuncio: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mi Perfil</h2>
        <p className="text-muted-foreground">
          Gestiona tu información personal y preferencias
        </p>
      </div>
      <Separator />
      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="anuncios">Mis Anuncios</TabsTrigger>
          <TabsTrigger value="favoritos">Favoritos</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="perfil" className="space-y-4">
          <div className="grid gap-6">
            <PerfilForm user={user} />
          </div>
        </TabsContent>
        <TabsContent value="anuncios" className="space-y-4">
          {user.anuncios.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {user.anuncios.map((anuncio) => (
                <div
                  key={anuncio.id}
                  className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                >
                  <h3 className="font-semibold">{anuncio.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    {anuncio.descripcion}
                  </p>
                  <p className="mt-2 font-medium">€{anuncio.precio}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Aún no has publicado ningún anuncio
            </p>
          )}
        </TabsContent>
        <TabsContent value="favoritos" className="space-y-4">
          {user.favoritos.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {user.favoritos.map(({ anuncio }) => (
                <div
                  key={anuncio.id}
                  className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                >
                  <h3 className="font-semibold">{anuncio.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    {anuncio.descripcion}
                  </p>
                  <p className="mt-2 font-medium">€{anuncio.precio}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No tienes anuncios guardados en favoritos
            </p>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="space-y-4">
          {user.reviews.length > 0 ? (
            <div className="grid gap-6">
              {user.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {review.rating} ⭐️
                      </span>
                    </div>
                    <time className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </time>
                  </div>
                  {review.comentario && (
                    <p className="mt-2 text-sm">{review.comentario}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Aún no has recibido ninguna review
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 