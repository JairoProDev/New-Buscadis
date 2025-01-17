import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { Anuncio, User, Categoria } from "@prisma/client"
import { Package, MapPin, Clock, Tag } from "lucide-react"

interface AnuncioHeaderProps {
  anuncio: Anuncio & {
    user: Pick<User, "id" | "name" | "image" | "createdAt"> & {
      anuncios: { id: string }[]
    }
    categoria: Categoria
  }
}

export function AnuncioHeader({ anuncio }: AnuncioHeaderProps) {
  return (
    <div className="space-y-4 rounded-xl bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {anuncio.titulo}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Publicado {formatDate(anuncio.createdAt)}</span>
            <span>·</span>
            <span>Ref: {anuncio.id.slice(0, 8)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            {formatPrice(anuncio.precio)}
          </div>
          {anuncio.precioNegociable && (
            <Badge variant="secondary">Precio negociable</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{anuncio.ubicacion}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <a
            href={`/categorias/${anuncio.categoria.slug}`}
            className="hover:text-foreground"
          >
            {anuncio.categoria.nombre}
          </a>
        </div>
        {anuncio.envio && (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Envío disponible</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={
            anuncio.condicion === "NUEVO"
              ? "default"
              : anuncio.condicion === "COMO_NUEVO"
              ? "secondary"
              : "outline"
          }
        >
          {anuncio.condicion === "NUEVO"
            ? "Nuevo"
            : anuncio.condicion === "COMO_NUEVO"
            ? "Como nuevo"
            : anuncio.condicion === "BUEN_ESTADO"
            ? "Buen estado"
            : anuncio.condicion === "USADO"
            ? "Usado"
            : "Para piezas"}
        </Badge>
        {anuncio.estado !== "ACTIVO" && (
          <Badge variant="destructive">
            {anuncio.estado === "PAUSADO"
              ? "Pausado"
              : anuncio.estado === "VENDIDO"
              ? "Vendido"
              : "Eliminado"}
          </Badge>
        )}
      </div>
    </div>
  )
} 