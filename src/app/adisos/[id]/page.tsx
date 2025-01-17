import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { ImageGallery } from "@/components/ui/image-gallery"
import { AdisoHeader } from "@/components/adisos/adiso-header"
import { AdisoContent } from "@/components/adisos/adiso-content"
import { AdisoSidebar } from "@/components/adisos/adiso-sidebar"
import { AdisoActions } from "@/components/adisos/adiso-actions"
import { AdisosRelacionados } from "@/components/adisos/adisos-relacionados"

interface AdisoPageProps {
  params: {
    id: string
  }
}

async function getAdiso(id: string) {
  const adiso = await db.anuncio.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
          anuncios: {
            select: { id: true },
          },
        },
      },
      categoria: true,
    },
  })

  if (!adiso) {
    return null
  }

  return adiso
}

export async function generateMetadata({
  params,
}: AdisoPageProps): Promise<Metadata> {
  const adiso = await getAdiso(params.id)

  if (!adiso) {
    return {
      title: "Adiso no encontrado",
    }
  }

  return {
    title: `${adiso.titulo} - ${formatPrice(adiso.precio)} - BuscaDis`,
    description: adiso.descripcion.slice(0, 160),
    openGraph: {
      title: adiso.titulo,
      description: adiso.descripcion.slice(0, 160),
      images: JSON.parse(adiso.imagenes)[0],
      type: "article",
      authors: adiso.user.name,
      publishedTime: adiso.createdAt.toISOString(),
      modifiedTime: adiso.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: adiso.titulo,
      description: adiso.descripcion.slice(0, 160),
      images: JSON.parse(adiso.imagenes)[0],
    },
  }
}

export default async function AdisoPage({ params }: AdisoPageProps) {
  const session = await getServerSession(authOptions)
  const adiso = await getAdiso(params.id)

  if (!adiso) {
    notFound()
  }

  const imagenes = JSON.parse(adiso.imagenes)
  const isOwner = session?.user?.id === adiso.userId

  return (
    <div className="container relative mx-auto space-y-8 px-4 py-6 lg:space-y-12 lg:py-8">
      {/* Breadcrumbs y acciones */}
      <div className="flex items-center justify-between">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <a href="/" className="hover:text-foreground">
                Inicio
              </a>
            </li>
            <li>/</li>
            <li>
              <a href={`/categorias/${adiso.categoria.slug}`} className="hover:text-foreground">
                {adiso.categoria.nombre}
              </a>
            </li>
            <li>/</li>
            <li className="truncate">{adiso.titulo}</li>
          </ol>
        </nav>
        <AdisoActions adiso={adiso} isOwner={isOwner} />
      </div>

      {/* Contenido principal */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImageGallery images={imagenes} />
          <AdisoHeader adiso={adiso} />
          <AdisoContent adiso={adiso} />
        </div>
        <div className="lg:col-span-1">
          <AdisoSidebar adiso={adiso} session={session} />
        </div>
      </div>

      {/* Adisos relacionados */}
      <AdisosRelacionados
        categoriaId={adiso.categoriaId}
        adisoId={adiso.id}
      />
    </div>
  )
} 