import * as React from "react"
import { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { routes } from "@/config/routes"

export const metadata: Metadata = {
  title: "Sobre Nosotros - BuscaDis",
  description: "Conoce más sobre BuscaDis, la plataforma de anuncios clasificados accesible para todos.",
}

export default function SobreNosotrosPage() {
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold">Nuestra Misión</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Hacer el comercio local más accesible, seguro y eficiente para todos.
        </p>
      </section>

      {/* Values Section */}
      <section className="mx-auto mt-16 max-w-5xl">
        <h2 className="text-center text-3xl font-bold">Nuestros Valores</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">Accesibilidad</h3>
            <p className="mt-2 text-muted-foreground">
              Diseñamos cada aspecto de nuestra plataforma pensando en la accesibilidad,
              para que todos puedan usar nuestros servicios sin barreras.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">Seguridad</h3>
            <p className="mt-2 text-muted-foreground">
              Priorizamos la seguridad de nuestros usuarios implementando las mejores
              prácticas y herramientas de protección.
            </p>
          </div>
          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold">Comunidad</h3>
            <p className="mt-2 text-muted-foreground">
              Fomentamos una comunidad inclusiva donde todos pueden participar
              y beneficiarse del comercio local.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-center text-3xl font-bold">Nuestra Historia</h2>
        <div className="mt-8 space-y-6 text-muted-foreground">
          <p>
            BuscaDis nació de la necesidad de crear una plataforma de anuncios clasificados
            verdaderamente accesible para todos. Nos dimos cuenta de que muchas personas
            enfrentaban barreras al intentar comprar y vender en línea.
          </p>
          <p>
            Desde nuestro lanzamiento, hemos trabajado incansablemente para mejorar la
            experiencia de nuestros usuarios, implementando características que hacen
            que el comercio local sea más fácil y seguro para todos.
          </p>
          <p>
            Hoy, BuscaDis es más que una plataforma de anuncios: es una comunidad
            vibrante donde las personas pueden conectarse, comerciar y crecer juntas.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-center text-3xl font-bold">Nuestro Equipo</h2>
        <p className="mt-4 text-center text-muted-foreground">
          Somos un equipo diverso y apasionado, comprometido con hacer del comercio
          local una experiencia accesible y enriquecedora para todos.
        </p>
      </section>

      {/* CTA Section */}
      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="text-3xl font-bold">Únete a Nuestra Comunidad</h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Sé parte de una plataforma que está transformando el comercio local.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href={routes.adisos.new}>Publicar anuncio</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={routes.adisos.index}>Explorar anuncios</Link>
          </Button>
        </div>
      </section>
    </div>
  )
} 