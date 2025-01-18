import * as React from "react"
import { notFound } from "next/navigation"
import { Metadata } from "next"

import { db } from "@/lib/db"
import { SearchCommand } from "@/components/search/search-command"
import { PremiumFilters } from "@/components/search/premium-filters"
import { SearchResults } from "@/components/search/search-results"

interface CategoriaPageProps {
  params: {
    slug: string
  }
  searchParams: {
    query?: string
    precioMin?: string
    precioMax?: string
    condicion?: string
    ubicacion?: string
    soloEnvio?: string
    page?: string
    perPage?: string
  }
}

async function getCategoria(slug: string) {
  const categoria = await db.categoria.findUnique({
    where: { slug },
  })

  if (!categoria) return null

  return categoria
}

export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const categoria = await getCategoria(params.slug)
  if (!categoria) return {}

  return {
    title: `${categoria.nombre} - BuscaDis`,
    description: `Explora anuncios en la categoría ${categoria.nombre} en BuscaDis.`,
  }
}

const filterGroups = [
  {
    id: "precio",
    label: "Precio",
    type: "range" as const,
    range: {
      min: 0,
      max: 10000,
      step: 100,
      unit: "€",
    },
  },
  {
    id: "condicion",
    label: "Condición",
    type: "single" as const,
    options: [
      { id: "nuevo", label: "Nuevo", value: "NUEVO" },
      { id: "como-nuevo", label: "Como nuevo", value: "COMO_NUEVO" },
      { id: "buen-estado", label: "Buen estado", value: "BUEN_ESTADO" },
      { id: "usado", label: "Usado", value: "USADO" },
      { id: "para-piezas", label: "Para piezas", value: "PARA_PIEZAS" },
    ],
  },
  {
    id: "envio",
    label: "Envío",
    type: "single" as const,
    options: [
      { id: "con-envio", label: "Con envío", value: true },
      { id: "sin-envio", label: "Sin envío", value: false },
    ],
  },
]

export default async function CategoriaPage({ params, searchParams }: CategoriaPageProps) {
  const categoria = await getCategoria(params.slug)

  if (!categoria) {
    notFound()
  }

  return (
    <div className="container grid gap-6 py-8 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr]">
      <aside className="hidden md:block">
        <PremiumFilters
          groups={filterGroups}
          selectedFilters={{}}
          onFilterChange={() => {}}
          onClearFilters={() => {}}
        />
      </aside>
      <main className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">{categoria.nombre}</h1>
          <SearchCommand className="w-full max-w-sm" />
        </div>
        <SearchResults
          searchParams={{
            ...searchParams,
            categoria: categoria.id,
          }}
        />
      </main>
    </div>
  )
} 