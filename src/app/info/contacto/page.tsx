import * as React from "react"
import { Metadata } from "next"
import Link from "next/link"
import { Mail, MessageCircle, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { routes } from "@/config/routes"

export const metadata: Metadata = {
  title: "Contacto - BuscaDis",
  description: "Contacta con el equipo de BuscaDis. Estamos aquí para ayudarte.",
}

export default function ContactoPage() {
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold">Contacto</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
        </p>
      </section>

      {/* Contact Options */}
      <section className="mx-auto mt-16 max-w-5xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col items-center p-6 text-center">
            <Mail className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Escríbenos a nuestro correo electrónico
            </p>
            <a
              href="mailto:soporte@buscadis.com"
              className="mt-4 text-primary hover:underline"
            >
              soporte@buscadis.com
            </a>
          </Card>

          <Card className="flex flex-col items-center p-6 text-center">
            <Phone className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Teléfono</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Llámanos de lunes a viernes de 9:00 a 18:00
            </p>
            <a
              href="tel:+34900000000"
              className="mt-4 text-primary hover:underline"
            >
              900 000 000
            </a>
          </Card>

          <Card className="flex flex-col items-center p-6 text-center sm:col-span-2 lg:col-span-1">
            <MessageCircle className="h-12 w-12 text-primary" />
            <h2 className="mt-4 text-xl font-semibold">Chat</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Chatea con nuestro equipo de soporte
            </p>
            <Button className="mt-4" asChild>
              <Link href={routes.info.help}>Iniciar chat</Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Contact Form */}
      <section className="mx-auto mt-16 max-w-3xl">
        <Card>
          <form className="space-y-8 p-6">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Tu nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asunto">Asunto</Label>
              <Input
                id="asunto"
                name="asunto"
                placeholder="¿En qué podemos ayudarte?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensaje">Mensaje</Label>
              <Textarea
                id="mensaje"
                name="mensaje"
                placeholder="Escribe tu mensaje aquí..."
                rows={6}
                required
              />
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              Enviar mensaje
            </Button>
          </form>
        </Card>
      </section>

      {/* FAQ Link */}
      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="text-2xl font-bold">¿Tienes más preguntas?</h2>
        <p className="mt-4 text-muted-foreground">
          Consulta nuestra sección de preguntas frecuentes para encontrar respuestas rápidas.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href={routes.info.help}>Ver preguntas frecuentes</Link>
        </Button>
      </section>
    </div>
  )
} 