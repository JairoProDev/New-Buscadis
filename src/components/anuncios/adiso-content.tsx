"use client"

import * as React from "react"
import { Adiso, Categoria, User } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ImageGallery } from "@/components/ui/image-gallery"

interface AdisoContentProps extends React.HTMLAttributes<HTMLDivElement> {
  adiso: Adiso & {
    usuario: User
    categoria: Categoria
  }
}

export function AdisoContent({
  adiso,
  className,
  ...props
}: AdisoContentProps) {
  const images = adiso.imagenes.map((src) => ({ src, alt: adiso.titulo }))

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">{adiso.titulo}</h1>
          <Badge variant="outline" className="text-lg font-semibold">
            {adiso.precio}€
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">{adiso.categoria.nombre}</Badge>
          <Badge variant="secondary">{adiso.condicion}</Badge>
          {adiso.negociable && (
            <Badge variant="secondary">Precio negociable</Badge>
          )}
        </div>
      </div>

      <ImageGallery images={images} />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Descripción</h2>
        <p className="whitespace-pre-wrap text-muted-foreground">
          {adiso.descripcion}
        </p>
      </div>
    </div>
  )
} 