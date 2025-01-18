import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { PremiumImage } from "@/components/ui/premium-image"
import { useToast } from "@/components/ui/use-toast"
import { routes } from "@/config/routes"

const adisoSchema = z.object({
  titulo: z.string().min(10).max(100),
  descripcion: z.string().min(30).max(2000),
  precio: z.number().min(0),
  categoriaId: z.string(),
  ubicacion: z.string().min(3).max(100),
  condicion: z.enum(["NUEVO", "COMO_NUEVO", "BUEN_ESTADO", "USADO", "PARA_PIEZAS"]),
  envio: z.boolean().default(false),
  precioNegociable: z.boolean().default(false),
  imagenes: z.array(z.string()).min(1).max(10),
})

type AdisoFormValues = z.infer<typeof adisoSchema>

interface AdisoFormProps extends React.HTMLAttributes<HTMLDivElement> {
  categorias: Array<{
    id: string
    nombre: string
    slug: string
  }>
  defaultValues?: Partial<AdisoFormValues>
  isEditing?: boolean
}

export function AdisoForm({
  categorias,
  defaultValues,
  isEditing = false,
  className,
  ...props
}: AdisoFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [imagePreviews, setImagePreviews] = React.useState<string[]>(
    defaultValues?.imagenes || []
  )

  const form = useForm<AdisoFormValues>({
    resolver: zodResolver(adisoSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      precio: 0,
      categoriaId: "",
      ubicacion: "",
      condicion: "NUEVO",
      envio: false,
      precioNegociable: false,
      imagenes: [],
      ...defaultValues,
    },
  })

  async function onSubmit(values: AdisoFormValues) {
    try {
      setIsSubmitting(true)
      const endpoint = isEditing
        ? `/api/adisos/${defaultValues?.id}`
        : "/api/adisos"
      const method = isEditing ? "PATCH" : "POST"

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Error al guardar el adiso")

      const data = await response.json()
      toast({
        title: isEditing ? "Adiso actualizado" : "Adiso publicado",
        description: isEditing
          ? "Los cambios se han guardado correctamente"
          : "Tu adiso se ha publicado correctamente",
      })

      router.push(routes.adisos.show(data.id))
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el adiso. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const currentImages = form.getValues("imagenes")
    if (currentImages.length + files.length > 10) {
      toast({
        title: "Error",
        description: "No puedes subir más de 10 imágenes",
        variant: "destructive",
      })
      return
    }

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData()
          formData.append("file", file)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) throw new Error("Error al subir la imagen")

          const data = await response.json()
          return data.url
        })
      )

      const newImages = [...currentImages, ...uploadedUrls]
      form.setValue("imagenes", newImages)
      setImagePreviews(newImages)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron subir las imágenes. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const removeImage = (index: number) => {
    const currentImages = form.getValues("imagenes")
    const newImages = currentImages.filter((_, i) => i !== index)
    form.setValue("imagenes", newImages)
    setImagePreviews(newImages)
  }

  return (
    <div className={cn("space-y-8", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe tu artículo" {...field} />
                  </FormControl>
                  <FormDescription>
                    Un buen título ayuda a que tu adiso sea más visible
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
                      placeholder="Describe el estado, características y detalles importantes"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Una descripción detallada aumenta las posibilidades de venta
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="precio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
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
                    <Input placeholder="Ciudad, Provincia" {...field} />
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

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="envio"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel>Envío disponible</FormLabel>
                      <FormDescription>
                        Indica si ofreces envío del artículo
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precioNegociable"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel>Precio negociable</FormLabel>
                      <FormDescription>
                        Indica si el precio es negociable
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <FormLabel>Imágenes</FormLabel>
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={form.getValues("imagenes").length >= 10}
                />
              </div>
              <FormDescription>
                Puedes subir hasta 10 imágenes. Formatos: JPG, PNG, GIF
              </FormDescription>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {imagePreviews.map((url, index) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative aspect-square overflow-hidden rounded-lg border"
                  >
                    <PremiumImage
                      src={url}
                      alt={`Vista previa ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Eliminar imagen"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Guardando cambios..." : "Publicando adiso..."}
              </>
            ) : (
              <>{isEditing ? "Guardar cambios" : "Publicar adiso"}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
} 