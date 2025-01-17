import * as React from "react"
import { useRouter } from "next/navigation"
import {
  MoreVertical,
  Edit,
  Pause,
  Play,
  CheckCircle2,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Anuncio, User, Categoria } from "@prisma/client"

interface AnuncioActionsProps {
  anuncio: Anuncio & {
    user: Pick<User, "id" | "name" | "image" | "createdAt"> & {
      anuncios: { id: string }[]
    }
    categoria: Categoria
  }
  isOwner: boolean
}

export function AnuncioActions({ anuncio, isOwner }: AnuncioActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  if (!isOwner) return null

  const handlePauseToggle = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/anuncios/${anuncio.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: anuncio.estado === "PAUSADO" ? "ACTIVO" : "PAUSADO",
        }),
      })

      if (!res.ok) throw new Error()

      toast({
        title: anuncio.estado === "PAUSADO" ? "Anuncio activado" : "Anuncio pausado",
        description:
          anuncio.estado === "PAUSADO"
            ? "Tu anuncio ya está visible para todos"
            : "Tu anuncio ha sido pausado temporalmente",
      })

      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del anuncio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsSold = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/anuncios/${anuncio.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: "VENDIDO",
        }),
      })

      if (!res.ok) throw new Error()

      toast({
        title: "¡Vendido!",
        description: "Tu anuncio ha sido marcado como vendido",
      })

      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "No se pudo marcar el anuncio como vendido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/anuncios/${anuncio.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      toast({
        title: "Anuncio eliminado",
        description: "Tu anuncio ha sido eliminado permanentemente",
      })

      router.push("/perfil")
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar el anuncio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isLoading}
          >
            <span className="sr-only">Abrir menú</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={() => router.push(`/anuncios/${anuncio.id}/editar`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar anuncio
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handlePauseToggle}>
            {anuncio.estado === "PAUSADO" ? (
              <>
                <Play className="mr-2 h-4 w-4" />
                Activar anuncio
              </>
            ) : (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pausar anuncio
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleMarkAsSold}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Marcar como vendido
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar anuncio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar anuncio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El anuncio será eliminado
              permanentemente de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 