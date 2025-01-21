"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Categoria } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const adisoFormSchema = z.object({
  titulo: z.string().min(10, {
    message: "El título debe tener al menos 10 caracteres.",
  }),
  descripcion: z.string().min(50, {
    message: "La descripción debe tener al menos 50 caracteres.",
  }),
  precio: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "El precio debe ser un número positivo.",
  }),
  negociable: z.boolean().default(false),
  categoriaId: z.string({
    required_error: "Por favor selecciona una categoría.",
  }),
  condicion: z.enum(["NUEVO", "COMO_NUEVO", "BUEN_ESTADO", "USADO", "PARA_PIEZAS"], {
    required_error: "Por favor selecciona una condición.",
  }),
  imagenes: z.array(z.string()).min(1, {
    message: "Debes subir al menos una imagen.",
  }),
})

type AdisoFormValues = z.infer<typeof adisoFormSchema>

interface AdisoFormProps extends React.HTMLAttributes<HTMLDivElement> {
  categorias: Categoria[]
  adiso?: {
    id: string
    titulo: string
    descripcion: string
    precio: number
    negociable: boolean
    categoriaId: string
    condicion: "NUEVO" | "COMO_NUEVO" | "BUEN_ESTADO" | "USADO" | "PARA_PIEZAS"
    imagenes: string[]
  }
}

export function AdisoForm({
  categorias,
  adiso,
  className,
  ...props
}: AdisoFormProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadedImages, setUploadedImages] = React.useState<string[]>(
    adiso?.imagenes || []
  )

  const form = useForm<AdisoFormValues>({
    resolver: zodResolver(adisoFormSchema),
    defaultValues: {
      titulo: adiso?.titulo || "",
      descripcion: adiso?.descripcion || "",
      precio: adiso?.precio.toString() || "",
      negociable: adiso?.negociable || false,
      categoriaId: adiso?.categoriaId || "",
      condicion: adiso?.condicion || "NUEVO",
      imagenes: adiso?.imagenes || [],
    },
  })

  async function onSubmit(data: AdisoFormValues) {
    try {
      const response = await fetch(
        adiso ? `/api/adisos/${adiso.id}` : "/api/adisos",
        {
          method: adiso ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error("Error al guardar el adiso")
      }

      const { id } = await response.json()

      toast({
        title: adiso ? "Adiso actualizado" : "Adiso publicado",
        description: adiso
          ? "Los cambios se han guardado correctamente."
          : "Tu adiso se ha publicado correctamente.",
      })

      router.push(`/adisos/${id}`)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el adiso. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  async function onImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files?.length) return

    setIsUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Error al subir la imagen")
        }

        const { url } = await response.json()
        return url
      })

      const urls = await Promise.all(uploadPromises)
      const newImages = [...uploadedImages, ...urls]
      setUploadedImages(newImages)
      form.setValue("imagenes", newImages)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron subir las imágenes. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  function removeImage(index: number) {
    const newImages = uploadedImages.filter((_, i) => i !== index)
    setUploadedImages(newImages)
    form.setValue("imagenes", newImages)
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  Un buen título ayuda a que tu adiso sea más visible.
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
                    className="min-h-[200px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Cuanta más información proporciones, más fácil será vender tu artículo.
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="negociable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Precio negociable</FormLabel>
                    <FormDescription>
                      Indica si estás dispuesto a negociar el precio.
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
          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>
          <div className="space-y-4">
            <FormLabel>Imágenes</FormLabel>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeImage(index)}
                  >
                    <span className="sr-only">Eliminar imagen</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </Button>
                </div>
              ))}
              <div className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed">
                <label
                  htmlFor="images"
                  className="flex cursor-pointer flex-col items-center justify-center p-4 text-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mb-2 h-8 w-8 text-muted-foreground"
                  >
                    <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                  </svg>
                  <div className="text-sm text-muted-foreground">
                    {isUploading ? (
                      "Subiendo..."
                    ) : (
                      <>
                        <span className="font-semibold">Sube imágenes</span> o
                        arrastra y suelta
                      </>
                    )}
                  </div>
                </label>
                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onImageUpload}
                  disabled={isUploading}
                />
              </div>
            </div>
            <FormMessage>{form.formState.errors.imagenes?.message}</FormMessage>
          </div>
          <Button type="submit" disabled={isUploading}>
            {adiso ? "Guardar cambios" : "Publicar adiso"}
          </Button>
        </form>
      </Form>
    </div>
  )
} 