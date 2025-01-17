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
import { Anuncio as Adiso, User, Categoria } from "@prisma/client"

interface AdisoActionsProps {
  adiso: Adiso & {
    user: Pick<User, "id" | "name" | "image" | "createdAt"> & {
      anuncios: { id: string }[]
    }
    categoria: Categoria
  }
  isOwner: boolean
}

export function AdisoActions({ adiso, isOwner }: AdisoActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  if (!isOwner) return null

  const handlePauseToggle = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/adisos/${adiso.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estado: adiso.estado === "PAUSADO" ? "ACTIVO" : "PAUSADO",
        }),
      })

      if (!res.ok) throw new Error()

      toast({
        title: adiso.estado === "PAUSADO" ? "Adiso activado" : "Adiso pausado",
        description:
          adiso.estado === "PAUSADO"
            ? "Tu adiso ya está visible para todos"
            : "Tu adiso ha sido pausado temporalmente",
      })

      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del adiso",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsSold = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/adisos/${adiso.id}`, {
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
        description: "Tu adiso ha sido marcado como vendido",
      })

      router.refresh()
    } catch {
      toast({
        title: "Error",
        description: "No se pudo marcar el adiso como vendido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/adisos/${adiso.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error()

      toast({
        title: "Adiso eliminado",
        description: "Tu adiso ha sido eliminado permanentemente",
      })

      router.push("/perfil")
    } catch {
      toast({
        title: "Error",
        description: "No se pudo eliminar el adiso",
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
            onSelect={() => router.push(`/adisos/${adiso.id}/editar`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar adiso
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handlePauseToggle}>
            {adiso.estado === "PAUSADO" ? (
              <>
                <Play className="mr-2 h-4 w-4" />
                Activar adiso
              </>
            ) : (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Pausar adiso
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
            Eliminar adiso
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar adiso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El adiso será eliminado
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