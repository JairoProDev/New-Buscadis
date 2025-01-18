import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { PremiumImage } from "@/components/ui/premium-image"
import { Badge } from "@/components/ui/badge"
import { routes } from "@/config/routes"

interface AdisoRelacionado {
  id: string
  titulo: string
  descripcion: string
  precio: number
  imagenes: string[]
  isPremium: boolean
  usuario: {
    name: string
    image: string | null
    isPremium: boolean
  }
  categoria: {
    nombre: string
    slug: string
  }
}

interface AdisosRelacionadosProps {
  adisos: AdisoRelacionado[]
  className?: string
}

export function AdisosRelacionados({ adisos, className }: AdisosRelacionadosProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {adisos.map((adiso, index) => (
        <motion.div
          key={adiso.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={routes.adisos.show(adiso.id)}
            className="group relative block overflow-hidden rounded-lg border bg-background p-4 transition-colors hover:bg-muted/50"
          >
            <div className="relative aspect-video overflow-hidden rounded-md">
              <PremiumImage
                src={adiso.imagenes[0] || "/placeholder.png"}
                alt={adiso.titulo}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {adiso.isPremium && (
                <Badge
                  variant="premium"
                  className="absolute left-2 top-2 h-5 px-1.5"
                >
                  PREMIUM
                </Badge>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="line-clamp-2 font-medium">{adiso.titulo}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {adiso.descripcion}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-medium">€{adiso.precio}</span>
                <span className="text-sm text-muted-foreground">
                  {adiso.categoria.nombre}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
} 