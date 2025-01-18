"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { PremiumImage } from "@/components/ui/premium-image"

interface PerfilFormProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User
}

export function PerfilForm({ user, className, ...props }: PerfilFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [previewImage, setPreviewImage] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      
      // Si hay una nueva imagen, primero la subimos
      const imageFile = formData.get("image") as File
      if (imageFile && imageFile.size > 0) {
        const imageFormData = new FormData()
        imageFormData.append("file", imageFile)
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        })
        
        if (!uploadRes.ok) throw new Error("Error al subir la imagen")
        
        const { url } = await uploadRes.json()
        formData.set("image", url)
      } else {
        formData.set("image", user.image || "")
      }

      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        body: formData,
      })

      if (!res.ok) throw new Error("Error al actualizar el perfil")

      toast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios han sido guardados correctamente.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleImageClick() {
    fileInputRef.current?.click()
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div
            onClick={handleImageClick}
            className="relative cursor-pointer group"
          >
            <PremiumImage
              src={previewImage || user.image || "/placeholder-user.png"}
              alt={user.name || "Avatar"}
              width={128}
              height={128}
              className="rounded-full object-cover transition-transform group-hover:scale-105"
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <span className="text-sm text-white">Cambiar foto</span>
            </motion.div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Input
              id="name"
              name="name"
              placeholder="Tu nombre"
              type="text"
              defaultValue={user.name || ""}
              disabled={isLoading}
              required
              aria-label="Nombre"
            />
          </div>

          <div className="grid gap-2">
            <Input
              id="telefono"
              name="telefono"
              placeholder="Teléfono de contacto"
              type="tel"
              defaultValue={user.telefono || ""}
              disabled={isLoading}
              aria-label="Teléfono"
            />
          </div>

          <div className="grid gap-2">
            <Input
              id="ubicacion"
              name="ubicacion"
              placeholder="Tu ubicación"
              type="text"
              defaultValue={user.ubicacion || ""}
              disabled={isLoading}
              aria-label="Ubicación"
            />
          </div>

          <div className="grid gap-2">
            <Textarea
              id="bio"
              name="bio"
              placeholder="Cuéntanos sobre ti..."
              defaultValue={user.bio || ""}
              disabled={isLoading}
              className="min-h-[100px]"
              aria-label="Biografía"
            />
          </div>

          <Button disabled={isLoading} className="w-full">
            {isLoading && (
              <motion.div
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
} 