import * as React from "react"
import Link from "next/link"
import { Metadata } from "next"

import { db } from "@/lib/db"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PremiumCard } from "@/components/ui/premium-card"
import { PremiumImage } from "@/components/ui/premium-image"
import { routes } from "@/config/routes"

export const metadata: Metadata = {
  title: "BuscaDis - Adisos clasificados accesibles para todos",
  description: "Encuentra lo que buscas o publica tus adisos de forma fácil y accesible.",
}

export default async function HomePage() {
  const [categorias, adisosDestacados] = await Promise.all([
    db.categoria.findMany({
      orderBy: { nombre: "asc" },
    }),
    db.adiso.findMany({
      where: { estado: "ACTIVO" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        user: true,
        categoria: true,
        _count: {
          select: {
            favoritos: true,
          },
        },
      },
    }),
  ])

  return (
    <div className="container space-y-12 py-8">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="flex max-w-[980px] flex-col items-start gap-4">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
            Compra y vende de forma
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              {" "}
              accesible
            </span>
          </h1>
          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            BuscaDis es la plataforma de adisos clasificados diseñada pensando en la
            accesibilidad. Encuentra lo que buscas o publica tus adisos de forma fácil.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href={routes.adisos.new}>Publicar adiso</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={routes.adisos.index}>Ver adisos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Categorías</h2>
          <Button variant="ghost" asChild>
            <Link href={routes.adisos.index}>Ver todas</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              href={routes.categorias.show(categoria.slug)}
              className={cn(
                "group relative aspect-video overflow-hidden rounded-lg border bg-muted",
                "hover:border-primary hover:bg-muted/80"
              )}
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-black/0" />
              <div className="absolute inset-x-0 bottom-0 z-20 p-4">
                <h3 className="font-medium text-white">{categoria.nombre}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Adisos destacados</h2>
          <Button variant="ghost" asChild>
            <Link href={routes.adisos.index}>Ver todos</Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adisosDestacados.map((adiso) => (
            <Link key={adiso.id} href={routes.adisos.show(adiso.id)}>
              <PremiumCard>
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <PremiumImage
                    src={adiso.imagenes[0] || "/placeholder.png"}
                    alt={adiso.titulo}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 text-lg font-semibold">
                    {adiso.titulo}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {adiso.descripcion}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-medium">€{adiso.precio}</span>
                    <span className="text-sm text-muted-foreground">
                      {adiso.categoria.nombre}
                    </span>
                  </div>
                </div>
              </PremiumCard>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg bg-muted px-6 py-16 text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight">
          ¿Tienes algo para vender?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Publica tu adiso gratis y llega a miles de compradores potenciales.
        </p>
        <Button size="lg" className="mt-8" asChild>
          <Link href={routes.adisos.new}>Publicar adiso</Link>
        </Button>
      </section>
    </div>
  )
}
