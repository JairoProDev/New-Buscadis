import * as React from "react"
import { Metadata } from "next"

import { db } from "@/lib/db"
import { SearchCommand } from "@/components/search/search-command"
import { PremiumFilters } from "@/components/search/premium-filters"
import { SearchResults } from "@/components/search/search-results"

export const metadata: Metadata = {
  title: "Adisos - BuscaDis",
  description: "Explora todos los adisos disponibles en BuscaDis.",
}

const filterGroups = [
  {
    id: "categoria",
    label: "Categoría",
    type: "single" as const,
  },
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

interface SearchPageProps {
  searchParams: {
    query?: string
    categoria?: string
    precioMin?: string
    precioMax?: string
    condicion?: string
    ubicacion?: string
    soloEnvio?: string
    page?: string
    perPage?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const categorias = await db.categoria.findMany({
    orderBy: { nombre: "asc" },
  })

  // Añadir las categorías al grupo de filtros
  const filterGroupsWithCategories = filterGroups.map((group) => {
    if (group.id === "categoria") {
      return {
        ...group,
        options: categorias.map((cat) => ({
          id: cat.id,
          label: cat.nombre,
          value: cat.id,
        })),
      }
    }
    return group
  })

  return (
    <div className="container grid gap-6 py-8 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr]">
      <aside className="hidden md:block">
        <PremiumFilters
          groups={filterGroupsWithCategories}
          selectedFilters={{}}
          onFilterChange={() => {}}
          onClearFilters={() => {}}
        />
      </aside>
      <main className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Adisos</h1>
          <SearchCommand className="w-full max-w-sm" />
        </div>
        <SearchResults searchParams={searchParams} />
      </main>
    </div>
  )
} 