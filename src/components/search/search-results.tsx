"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { PremiumCard } from "@/components/ui/premium-card"
import { PremiumImage } from "@/components/ui/premium-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useInView } from "react-intersection-observer"
import { useInfiniteQuery } from "@tanstack/react-query"

interface SearchResultsProps extends React.HTMLAttributes<HTMLDivElement> {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function SearchResults({
  searchParams,
  className,
  ...props
}: SearchResultsProps) {
  const { ref, inView } = useInView()

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["adisos", searchParams],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        ...searchParams,
        page: pageParam.toString(),
      } as Record<string, string>)

      const res = await fetch(`/api/search?${params.toString()}`)
      if (!res.ok) throw new Error("Error al cargar los adisos")
      return res.json()
    },
    getNextPageParam: (lastPage) =>
      lastPage.metadata.hasMore ? lastPage.metadata.page + 1 : undefined,
    initialPageSize: 12,
  })

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  const adisos = data?.pages.flatMap((page) => page.adisos) ?? []

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Error al cargar los adisos. Por favor, intenta de nuevo.
      </div>
    )
  }

  if (adisos.length === 0 && !isFetching) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        No se encontraron adisos que coincidan con tu búsqueda.
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)} {...props}>
      {adisos.map((adiso, index) => (
        <motion.div
          key={adiso.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link href={`/adisos/${adiso.id}`}>
            <PremiumCard className="h-full transition-all hover:scale-[1.02]">
              <PremiumCard.Header>
                <div className="relative aspect-square w-full overflow-hidden rounded-t-xl">
                  <PremiumImage
                    src={JSON.parse(adiso.imagenes)[0] || "/placeholder.png"}
                    alt={adiso.titulo}
                    fill
                    className="object-cover"
                  />
                  {adiso.isPremium && (
                    <Badge
                      variant="premium"
                      className="absolute left-2 top-2"
                    >
                      PREMIUM
                    </Badge>
                  )}
                </div>
              </PremiumCard.Header>
              <PremiumCard.Content>
                <PremiumCard.Title>{adiso.titulo}</PremiumCard.Title>
                <PremiumCard.Description>
                  {adiso.descripcion}
                </PremiumCard.Description>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold">€{adiso.precio}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Me gusta"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="ml-1 text-xs">
                        {adiso._count.favoritos}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Mensajes"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span className="ml-1 text-xs">
                        {adiso._count.mensajes}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label="Reviews"
                    >
                      <Star className="h-4 w-4" />
                      <span className="ml-1 text-xs">
                        {adiso._count.reviews}
                      </span>
                    </Button>
                  </div>
                </div>
              </PremiumCard.Content>
              <PremiumCard.Footer>
                <div className="flex items-center gap-2">
                  <PremiumImage
                    src={adiso.usuario.image || "/placeholder-user.png"}
                    alt={adiso.usuario.name || ""}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <span className="text-sm text-muted-foreground">
                    {adiso.usuario.name}
                  </span>
                  {adiso.usuario.isPremium && (
                    <Badge variant="premium" className="h-4 px-1 text-[10px]">
                      PRO
                    </Badge>
                  )}
                </div>
              </PremiumCard.Footer>
            </PremiumCard>
          </Link>
        </motion.div>
      ))}
      
      {/* Elemento observador para infinite scroll */}
      <div ref={ref} className="col-span-full">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  )
} 