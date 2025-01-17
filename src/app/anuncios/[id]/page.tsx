import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { formatPrice } from "@/lib/utils"
import { ImageGallery } from "@/components/ui/image-gallery"
import { AnuncioHeader } from "@/components/anuncios/anuncio-header"
import { AnuncioContent } from "@/components/anuncios/anuncio-content"
import { AnuncioSidebar } from "@/components/anuncios/anuncio-sidebar"
import { AnuncioActions } from "@/components/anuncios/anuncio-actions"
import { AnunciosRelacionados } from "@/components/anuncios/anuncios-relacionados"

interface AnuncioPageProps {
  params: {
    id: string
  }
}

async function getAnuncio(id: string) {
  const anuncio = await db.anuncio.findUnique({
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

  if (!anuncio) {
    return null
  }

  return anuncio
}

export async function generateMetadata({
  params,
}: AnuncioPageProps): Promise<Metadata> {
  const anuncio = await getAnuncio(params.id)

  if (!anuncio) {
    return {
      title: "Anuncio no encontrado",
    }
  }

  return {
    title: `${anuncio.titulo} - ${formatPrice(anuncio.precio)} - BuscaDis`,
    description: anuncio.descripcion.slice(0, 160),
    openGraph: {
      title: anuncio.titulo,
      description: anuncio.descripcion.slice(0, 160),
      images: JSON.parse(anuncio.imagenes)[0],
      type: "article",
      authors: anuncio.user.name,
      publishedTime: anuncio.createdAt.toISOString(),
      modifiedTime: anuncio.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: anuncio.titulo,
      description: anuncio.descripcion.slice(0, 160),
      images: JSON.parse(anuncio.imagenes)[0],
    },
  }
}

export default async function AnuncioPage({ params }: AnuncioPageProps) {
  const session = await getServerSession(authOptions)
  const anuncio = await getAnuncio(params.id)

  if (!anuncio) {
    notFound()
  }

  const imagenes = JSON.parse(anuncio.imagenes)
  const isOwner = session?.user?.id === anuncio.userId

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
              <a href={`/categorias/${anuncio.categoria.slug}`} className="hover:text-foreground">
                {anuncio.categoria.nombre}
              </a>
            </li>
            <li>/</li>
            <li className="truncate">{anuncio.titulo}</li>
          </ol>
        </nav>
        <AnuncioActions anuncio={anuncio} isOwner={isOwner} />
      </div>

      {/* Contenido principal */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImageGallery images={imagenes} />
          <AnuncioHeader anuncio={anuncio} />
          <AnuncioContent anuncio={anuncio} />
        </div>
        <div className="lg:col-span-1">
          <AnuncioSidebar anuncio={anuncio} session={session} />
        </div>
      </div>

      {/* Anuncios relacionados */}
      <AnunciosRelacionados
        categoriaId={anuncio.categoriaId}
        anuncioId={anuncio.id}
      />
    </div>
  )
} 