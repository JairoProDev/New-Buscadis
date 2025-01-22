import * as React from "react"
import Link from "next/link"
import { ArrowRight, Search, Tag, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container px-4">
          <div className="mx-auto max-w-[64rem] text-center">
            <h1 className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl xl:text-6xl/none">
              BuscaDis
            </h1>
            <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">
              La plataforma de anuncios clasificados más accesible.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/anuncios/nuevo">
                  Publicar anuncio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/anuncios">
                  Explorar anuncios
                  <Search className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-white py-20">
        <div className="container px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col items-center p-6 text-center">
              <Search className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Búsqueda Inteligente</h3>
              <p className="mt-2 text-muted-foreground">
                Encuentra exactamente lo que buscas con nuestro sistema de búsqueda avanzado.
              </p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center">
              <Tag className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Precios Competitivos</h3>
              <p className="mt-2 text-muted-foreground">
                Compara precios y encuentra las mejores ofertas del mercado.
              </p>
            </Card>
            <Card className="flex flex-col items-center p-6 text-center sm:col-span-2 lg:col-span-1">
              <Package className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Envíos Seguros</h3>
              <p className="mt-2 text-muted-foreground">
                Gestiona tus envíos de forma segura y confiable.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
