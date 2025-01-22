"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  precio: z.number().min(0, "El precio no puede ser negativo"),
  ubicacion: z.string().min(3, "La ubicación debe tener al menos 3 caracteres"),
  categoriaId: z.string().min(1, "Debes seleccionar una categoría"),
  condicion: z.enum(["NUEVO", "COMO_NUEVO", "BUEN_ESTADO", "USADO", "PARA_PIEZAS"]),
  envio: z.boolean().default(false),
  precioNegociable: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

interface AdisoFormProps {
  categorias: {
    id: string
    nombre: string
    slug: string
  }[]
}

export function AdisoForm({ categorias }: AdisoFormProps) {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      precio: 0,
      ubicacion: "",
      categoriaId: "",
      condicion: "NUEVO",
      envio: false,
      precioNegociable: false,
    },
  })

  async function onSubmit(data: FormValues) {
    try {
      const response = await fetch("/api/adisos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al crear el adiso")
      }

      const adiso = await response.json()
      toast({
        title: "¡Adiso creado!",
        description: "Tu adiso ha sido publicado correctamente.",
      })
      router.push(`/adisos/${adiso.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el adiso.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            placeholder="Ej: iPhone 12 Pro Max 256GB"
            {...form.register("titulo")}
          />
          {form.formState.errors.titulo && (
            <p className="text-sm text-red-500">{form.formState.errors.titulo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            placeholder="Describe tu producto o servicio..."
            {...form.register("descripcion")}
          />
          {form.formState.errors.descripcion && (
            <p className="text-sm text-red-500">{form.formState.errors.descripcion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="precio">Precio</Label>
          <Input
            id="precio"
            type="number"
            placeholder="0.00"
            {...form.register("precio", { valueAsNumber: true })}
          />
          {form.formState.errors.precio && (
            <p className="text-sm text-red-500">{form.formState.errors.precio.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Input
            id="ubicacion"
            placeholder="Ej: Madrid, España"
            {...form.register("ubicacion")}
          />
          {form.formState.errors.ubicacion && (
            <p className="text-sm text-red-500">{form.formState.errors.ubicacion.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoria">Categoría</Label>
          <Select onValueChange={(value) => form.setValue("categoriaId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((categoria) => (
                <SelectItem key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.categoriaId && (
            <p className="text-sm text-red-500">{form.formState.errors.categoriaId.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="condicion">Condición</Label>
          <Select onValueChange={(value) => form.setValue("condicion", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona la condición" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NUEVO">Nuevo</SelectItem>
              <SelectItem value="COMO_NUEVO">Como nuevo</SelectItem>
              <SelectItem value="BUEN_ESTADO">Buen estado</SelectItem>
              <SelectItem value="USADO">Usado</SelectItem>
              <SelectItem value="PARA_PIEZAS">Para piezas</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.condicion && (
            <p className="text-sm text-red-500">{form.formState.errors.condicion.message}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="envio"
            checked={form.watch("envio")}
            onCheckedChange={(checked) => form.setValue("envio", checked)}
          />
          <Label htmlFor="envio">Ofrece envío</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="precioNegociable"
            checked={form.watch("precioNegociable")}
            onCheckedChange={(checked) => form.setValue("precioNegociable", checked)}
          />
          <Label htmlFor="precioNegociable">Precio negociable</Label>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Publicar adiso
      </Button>
    </form>
  )
} 