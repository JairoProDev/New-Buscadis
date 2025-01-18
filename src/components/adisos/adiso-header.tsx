import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate } from "@/lib/utils"
import { Adiso as Adiso, User, Categoria } from "@prisma/client"
import { Package, MapPin, Clock, Tag } from "lucide-react"

interface AdisoHeaderProps {
  adiso: Adiso & {
    user: Pick<User, "id" | "name" | "image" | "createdAt"> & {
      adisos: { id: string }[]
    }
    categoria: Categoria
  }
}

export function AdisoHeader({ adiso }: AdisoHeaderProps) {
  return (
    <div className="space-y-4 rounded-xl bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {adiso.titulo}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Publicado {formatDate(adiso.createdAt)}</span>
            <span>·</span>
            <span>Ref: {adiso.id.slice(0, 8)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
            {formatPrice(adiso.precio)}
          </div>
          {adiso.precioNegociable && (
            <Badge variant="secondary">Precio negociable</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{adiso.ubicacion}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          <a
            href={`/categorias/${adiso.categoria.slug}`}
            className="hover:text-foreground"
          >
            {adiso.categoria.nombre}
          </a>
        </div>
        {adiso.envio && (
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Envío disponible</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={
            adiso.condicion === "NUEVO"
              ? "default"
              : adiso.condicion === "COMO_NUEVO"
              ? "secondary"
              : "outline"
          }
        >
          {adiso.condicion === "NUEVO"
            ? "Nuevo"
            : adiso.condicion === "COMO_NUEVO"
            ? "Como nuevo"
            : adiso.condicion === "BUEN_ESTADO"
            ? "Buen estado"
            : adiso.condicion === "USADO"
            ? "Usado"
            : "Para piezas"}
        </Badge>
        {adiso.estado !== "ACTIVO" && (
          <Badge variant="destructive">
            {adiso.estado === "PAUSADO"
              ? "Pausado"
              : adiso.estado === "VENDIDO"
              ? "Vendido"
              : "Eliminado"}
          </Badge>
        )}
      </div>
    </div>
  )
} 