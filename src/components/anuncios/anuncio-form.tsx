import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Plus, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { PremiumImage } from "@/components/ui/premium-image"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const MAX_IMAGES = 10
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const anuncioSchema = z.object({
  titulo: z
    .string()
    .min(10, "El título debe tener al menos 10 caracteres")
    .max(100, "El título no puede exceder los 100 caracteres"),
  descripcion: z
    .string()
    .min(30, "La descripción debe tener al menos 30 caracteres")
    .max(2000, "La descripción no puede exceder los 2000 caracteres"),
  precio: z
    .number()
    .min(0, "El precio no puede ser negativo")
    .max(999999, "El precio no puede exceder los 999.999€"),
  categoriaId: z.string().min(1, "Debes seleccionar una categoría"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  condicion: z.enum(["NUEVO", "COMO_NUEVO", "BUEN_ESTADO", "USADO", "PARA_PIEZAS"]),
  envio: z.boolean().default(false),
  precioNegociable: z.boolean().default(false),
})

type AnuncioFormValues = z.infer<typeof anuncioSchema>

interface AnuncioFormProps extends React.HTMLAttributes<HTMLDivElement> {
  categorias: Array<{
    id: string
    nombre: string
    slug: string
  }>
}

export function AnuncioForm({ categorias, className, ...props }: AnuncioFormProps) {
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<AnuncioFormValues>({
    resolver: zodResolver(anuncioSchema),
    defaultValues: {
      envio: false,
      precioNegociable: false,
    },
  })

  async function onSubmit(values: AnuncioFormValues) {
    if (imagePreviews.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Primero subimos las imágenes
      const uploadPromises = imagePreviews.map(async (preview) => {
        const response = await fetch(preview)
        const blob = await response.blob()
        const formData = new FormData()
        formData.append("file", blob)

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!uploadRes.ok) throw new Error("Error al subir las imágenes")

        const { url } = await uploadRes.json()
        return url
      })

      const imageUrls = await Promise.all(uploadPromises)

      // Luego creamos el anuncio
      const res = await fetch("/api/anuncios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          imagenes: JSON.stringify(imageUrls),
        }),
      })

      if (!res.ok) throw new Error("Error al crear el anuncio")

      const { id } = await res.json()

      toast({
        title: "¡Anuncio publicado!",
        description: "Tu anuncio ha sido publicado correctamente.",
      })

      router.push(`/anuncios/${id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo publicar el anuncio. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const newPreviews: string[] = []
    const validFiles = Array.from(files).slice(0, MAX_IMAGES - imagePreviews.length)

    validFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: `La imagen ${file.name} excede el tamaño máximo de 5MB`,
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Subida de imágenes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FormLabel>Imágenes</FormLabel>
          <span className="text-sm text-muted-foreground">
            {imagePreviews.length}/{MAX_IMAGES}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {imagePreviews.map((preview, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group relative aspect-square"
            >
              <PremiumImage
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="rounded-lg object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Eliminar imagen"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
          {imagePreviews.length < MAX_IMAGES && (
            <motion.button
              layout
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 text-muted-foreground/50 transition-colors hover:border-muted-foreground/50 hover:text-muted-foreground"
              aria-label="Añadir imagen"
            >
              <Plus className="h-8 w-8" />
            </motion.button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageUpload}
          aria-label="Subir imágenes"
        />
        <FormDescription>
          Sube hasta 10 imágenes. Máximo 5MB por imagen.
        </FormDescription>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: iPhone 13 Pro Max 256GB" {...field} />
                </FormControl>
                <FormDescription>
                  Un título claro y descriptivo ayudará a que tu anuncio destaque.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="descripcion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe tu artículo en detalle..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Incluye detalles importantes como características, estado, medidas, etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoriaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria.id} value={categoria.id}>
                          {categoria.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ubicacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Madrid, España" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condicion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condición</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la condición" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NUEVO">Nuevo</SelectItem>
                    <SelectItem value="COMO_NUEVO">Como nuevo</SelectItem>
                    <SelectItem value="BUEN_ESTADO">Buen estado</SelectItem>
                    <SelectItem value="USADO">Usado</SelectItem>
                    <SelectItem value="PARA_PIEZAS">Para piezas</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="envio"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Envío disponible</FormLabel>
                    <FormDescription>
                      Indica si ofreces envío del artículo
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precioNegociable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Precio negociable</FormLabel>
                    <FormDescription>
                      Indica si el precio es negociable
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isUploading}
          >
            {isUploading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Publicar anuncio
          </Button>
        </form>
      </Form>
    </div>
  )
} 