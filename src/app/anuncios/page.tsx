import { Metadata } from "next"
import { Suspense } from "react"

import { db } from "@/lib/db"
import { SearchCommand } from "@/components/search/search-command"
import { SearchFilters } from "@/components/search/search-filters"
import { SearchResults } from "@/components/search/search-results"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Adisos - BuscaDis",
  description: "Encuentra lo que buscas entre miles de adisos",
}

export default async function AdisosPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Obtener categorías para los filtros
  const categorias = await db.categoria.findMany({
    orderBy: { orden: "asc" },
    select: {
      id: true,
      nombre: true,
      slug: true,
    },
  })

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-8 pb-8 pt-6">
      <div className="flex flex-col gap-4">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Adisos</h1>
          <p className="text-muted-foreground">
            Encuentra lo que buscas entre miles de adisos
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchCommand className="flex-1" filters={searchParams} />
          <SearchFilters categorias={categorias} />
        </div>
      </div>
      <Separator />
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-[300px] rounded-xl" />
            ))}
          </div>
        }
      >
        <SearchResults searchParams={searchParams} />
      </Suspense>
    </div>
  )
} 