"use client"

import * as React from "react"
import Link from "next/link"
import { Adiso, Categoria, User } from "@prisma/client"

import { cn } from "@/lib/utils"
import {
  PremiumCard,
  PremiumCardContent,
  PremiumCardDescription,
  PremiumCardFooter,
  PremiumCardHeader,
  PremiumCardTitle,
} from "@/components/ui/premium-card"
import { PremiumImage } from "@/components/ui/premium-image"
import { Badge } from "@/components/ui/badge"

interface AdisosRelacionadosProps extends React.HTMLAttributes<HTMLDivElement> {
  adisos: Array<
    Adiso & {
      usuario: User
      categoria: Categoria
    }
  >
}

export function AdisosRelacionados({
  adisos,
  className,
  ...props
}: AdisosRelacionadosProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      <h2 className="text-2xl font-semibold tracking-tight">
        Adisos relacionados
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {adisos.map((adiso) => (
          <Link key={adiso.id} href={`/adisos/${adiso.id}`}>
            <PremiumCard>
              <PremiumCardHeader>
                <PremiumImage
                  src={adiso.imagenes[0]}
                  alt={adiso.titulo}
                  aspectRatio="wide"
                />
              </PremiumCardHeader>
              <PremiumCardContent>
                <PremiumCardTitle>{adiso.titulo}</PremiumCardTitle>
                <PremiumCardDescription>
                  {adiso.descripcion}
                </PremiumCardDescription>
              </PremiumCardContent>
              <PremiumCardFooter>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-lg font-semibold">
                    {adiso.precio}€
                  </Badge>
                  {adiso.negociable && (
                    <Badge variant="secondary">Negociable</Badge>
                  )}
                </div>
              </PremiumCardFooter>
            </PremiumCard>
          </Link>
        ))}
      </div>
    </div>
  )
} 