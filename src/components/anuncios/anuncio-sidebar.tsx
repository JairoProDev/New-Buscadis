import * as React from "react"
import Link from "next/link"
import { Session } from "next-auth"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Phone, Share2, Store } from "lucide-react"

import { cn, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Anuncio, User, Categoria } from "@prisma/client"
import { useToast } from "@/components/ui/use-toast"

interface AnuncioSidebarProps {
  anuncio: Anuncio & {
    user: Pick<User, "id" | "name" | "image" | "createdAt"> & {
      anuncios: { id: string }[]
    }
    categoria: Categoria
  }
  session: Session | null
}

export function AnuncioSidebar({ anuncio, session }: AnuncioSidebarProps) {
  const { toast } = useToast()
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [showPhone, setShowPhone] = React.useState(false)

  const handleShare = async () => {
    try {
      await navigator.share({
        title: anuncio.titulo,
        text: anuncio.descripcion.slice(0, 100) + "...",
        url: window.location.href,
      })
    } catch {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "¡Enlace copiado!",
        description: "El enlace ha sido copiado al portapapeles",
      })
    }
  }

  const handleFavorite = () => {
    if (!session) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar favoritos",
        variant: "destructive",
      })
      return
    }

    setIsFavorite(!isFavorite)
    toast({
      title: isFavorite ? "Eliminado de favoritos" : "Añadido a favoritos",
      description: isFavorite
        ? "El anuncio ha sido eliminado de tus favoritos"
        : "El anuncio ha sido añadido a tus favoritos",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      {/* Información del vendedor */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href={`/usuarios/${anuncio.user.id}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={anuncio.user.image || undefined} />
                  <AvatarFallback>
                    {anuncio.user.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="font-medium leading-none">{anuncio.user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {anuncio.user.anuncios.length} anuncios
                  </p>
                </div>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Miembro desde {formatDate(anuncio.user.createdAt)}
                </p>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="text-sm">
                    {anuncio.user.anuncios.length} anuncios publicados
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 grid gap-4">
          {!showPhone ? (
            <Button
              size="lg"
              className="w-full"
              onClick={() => setShowPhone(true)}
            >
              <Phone className="mr-2 h-4 w-4" />
              Ver teléfono
            </Button>
          ) : (
            <Button size="lg" className="w-full" variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              +34 666 666 666
            </Button>
          )}
          <Button size="lg" className="w-full" variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" />
            Enviar mensaje
          </Button>
        </div>

        {/* Botones secundarios */}
        <div className="mt-4 flex gap-4">
          <Button
            variant="ghost"
            className={cn(
              "flex-1",
              isFavorite && "text-red-500 hover:text-red-500"
            )}
            onClick={handleFavorite}
          >
            <Heart
              className={cn("mr-2 h-4 w-4", isFavorite && "fill-current")}
            />
            {isFavorite ? "Guardado" : "Guardar"}
          </Button>
          <Button variant="ghost" className="flex-1" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
      </div>

      {/* Consejos de seguridad */}
      <div className="rounded-xl bg-card p-6 shadow-sm">
        <h3 className="font-semibold">Consejos de seguridad</h3>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>• Evita pagar por adelantado</li>
          <li>• Revisa el producto antes de comprarlo</li>
          <li>• Reúnete en un lugar público y seguro</li>
          <li>• Reporta cualquier conducta sospechosa</li>
        </ul>
      </div>
    </motion.div>
  )
} 