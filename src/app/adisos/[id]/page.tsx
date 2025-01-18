import * as React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getServerSession } from "next-auth"

import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { ImageGallery } from "@/components/ui/image-gallery"
import { Badge } from "@/components/ui/badge"
import { AdisosRelacionados } from "@/components/adisos/adisos-relacionados"
import { AdisoActions } from "@/components/adisos/adiso-actions"
import { routes } from "@/config/routes"

interface AdisoPageProps {
  params: {
    id: string
  }
}

async function getAdiso(id: string) {
  const adiso = await db.adiso.findUnique({
    where: { id },
    include: {
      usuario: {
        select: {
          id: true,
          name: true,
          image: true,
          isPremium: true,
        },
      },
      categoria: {
        select: {
          nombre: true,
          slug: true,
        },
      },
      _count: {
        select: {
          favoritos: true,
          reviews: true,
        },
      },
    },
  })

  if (!adiso) return null

  const relacionados = await db.adiso.findMany({
    where: {
      OR: [
        { categoriaId: adiso.categoriaId },
        { usuarioId: adiso.usuarioId },
      ],
      NOT: { id: adiso.id },
      estado: "ACTIVO",
    },
    take: 3,
    include: {
      usuario: {
        select: {
          name: true,
          image: true,
          isPremium: true,
        },
      },
      categoria: {
        select: {
          nombre: true,
          slug: true,
        },
      },
    },
  })

  return { adiso, relacionados }
}

export async function generateMetadata({ params }: AdisoPageProps): Promise<Metadata> {
  const data = await getAdiso(params.id)
  if (!data) return {}

  const { adiso } = data
  return {
    title: `${adiso.titulo} - BuscaDis`,
    description: adiso.descripcion,
    openGraph: {
      title: adiso.titulo,
      description: adiso.descripcion,
      images: adiso.imagenes,
    },
    twitter: {
      card: "summary_large_image",
      title: adiso.titulo,
      description: adiso.descripcion,
      images: adiso.imagenes,
    },
  }
}

export default async function AdisoPage({ params }: AdisoPageProps) {
  const session = await getServerSession(authOptions)
  const data = await getAdiso(params.id)

  if (!data) {
    notFound()
  }

  const { adiso, relacionados } = data
  const isOwner = session?.user?.id === adiso.usuarioId

  return (
    <div className="container space-y-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href={routes.home} className="hover:text-foreground">
          Inicio
        </Link>
        <span>/</span>
        <Link href={routes.adisos.index} className="hover:text-foreground">
          Anuncios
        </Link>
        <span>/</span>
        <Link
          href={routes.categorias.show(adiso.categoria.slug)}
          className="hover:text-foreground"
        >
          {adiso.categoria.nombre}
        </Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Image Gallery */}
          <ImageGallery
            images={adiso.imagenes.map((src) => ({
              src,
              alt: adiso.titulo,
            }))}
          />

          {/* Title and Description */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">{adiso.titulo}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">€{adiso.precio}</span>
                  {adiso.precioNegociable && (
                    <Badge variant="outline">Negociable</Badge>
                  )}
                </div>
              </div>
              {isOwner && <AdisoActions adiso={adiso} />}
            </div>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {adiso.descripcion}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Detalles</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Condición
                </dt>
                <dd className="mt-1">{adiso.condicion.replace("_", " ")}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Ubicación
                </dt>
                <dd className="mt-1">{adiso.ubicacion}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Categoría
                </dt>
                <dd className="mt-1">{adiso.categoria.nombre}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Envío
                </dt>
                <dd className="mt-1">{adiso.envio ? "Disponible" : "No disponible"}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-4">
              {adiso.usuario.image ? (
                <img
                  src={adiso.usuario.image}
                  alt={adiso.usuario.name || ""}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <span className="text-lg font-semibold">
                    {adiso.usuario.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{adiso.usuario.name}</span>
                  {adiso.usuario.isPremium && (
                    <Badge variant="premium">PREMIUM</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {adiso._count.reviews} valoraciones
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Button className="w-full" size="lg">
                Contactar
              </Button>
              {!isOwner && (
                <Button variant="outline" className="w-full" size="lg">
                  Añadir a favoritos
                </Button>
              )}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold">Consejos de seguridad</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>• Revisa el artículo antes de comprarlo</li>
              <li>• Reúnete en un lugar público y seguro</li>
              <li>• No hagas pagos por adelantado</li>
              <li>• Reporta cualquier conducta sospechosa</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Related Listings */}
      {relacionados.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Anuncios relacionados
          </h2>
          <AdisosRelacionados adisos={relacionados} />
        </section>
      )}
    </div>
  )
} 