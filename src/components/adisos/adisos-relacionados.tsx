import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PremiumCard } from "@/components/ui/premium-card"
import { PremiumImage } from "@/components/ui/premium-image"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"

interface AdisosRelacionadosProps {
  categoriaId: string
  adisoId: string
}

async function getAdisosRelacionados(categoriaId: string, adisoId: string) {
  const adisos = await db.anuncio.findMany({
    where: {
      categoriaId,
      id: { not: adisoId },
      estado: "ACTIVO",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  })

  return adisos
}

export async function AdisosRelacionados({
  categoriaId,
  adisoId,
}: AdisosRelacionadosProps) {
  const adisos = await getAdisosRelacionados(categoriaId, adisoId)

  if (adisos.length === 0) return null

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Adisos relacionados
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {adisos.map((adiso, index) => (
          <motion.div
            key={adiso.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/adisos/${adiso.id}`}>
              <PremiumCard className="group h-full transition-all hover:shadow-lg">
                <PremiumCard.Header>
                  <PremiumImage
                    src={JSON.parse(adiso.imagenes)[0]}
                    alt={adiso.titulo}
                    width={400}
                    height={300}
                    className="aspect-[4/3] rounded-t-xl object-cover"
                  />
                </PremiumCard.Header>
                <PremiumCard.Content>
                  <PremiumCard.Title className="line-clamp-2">
                    {adiso.titulo}
                  </PremiumCard.Title>
                  <PremiumCard.Description>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(adiso.precio)}
                      </span>
                      {adiso.precioNegociable && (
                        <Badge variant="secondary">Negociable</Badge>
                      )}
                    </div>
                  </PremiumCard.Description>
                </PremiumCard.Content>
                <PremiumCard.Footer>
                  <div className="flex items-center gap-2">
                    <div className="relative h-6 w-6 overflow-hidden rounded-full">
                      <PremiumImage
                        src={adiso.user.image || "/placeholder.png"}
                        alt={adiso.user.name || "Avatar"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {adiso.user.name}
                    </span>
                  </div>
                </PremiumCard.Footer>
              </PremiumCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 