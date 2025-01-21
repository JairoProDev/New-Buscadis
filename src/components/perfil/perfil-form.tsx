"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const perfilFormSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  bio: z.string().max(160, {
    message: "La biografía no puede tener más de 160 caracteres.",
  }),
  telefono: z.string().min(9, {
    message: "El teléfono debe tener al menos 9 dígitos.",
  }),
})

type PerfilFormValues = z.infer<typeof perfilFormSchema>

interface PerfilFormProps {
  usuario: {
    nombre: string | null
    bio: string | null
    telefono: string | null
  }
}

export function PerfilForm({ usuario }: PerfilFormProps) {
  const router = useRouter()
  const form = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: {
      nombre: usuario.nombre || "",
      bio: usuario.bio || "",
      telefono: usuario.telefono || "",
    },
  })

  async function onSubmit(data: PerfilFormValues) {
    try {
      const response = await fetch("/api/perfil", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el perfil")
      }

      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biografía</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos un poco sobre ti"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="Tu número de teléfono" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar cambios</Button>
      </form>
    </Form>
  )
} 