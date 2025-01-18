import * as React from "react"
import { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { routes } from "@/config/routes"

export const metadata: Metadata = {
  title: "Ayuda - BuscaDis",
  description: "Centro de ayuda de BuscaDis. Encuentra respuestas a las preguntas más frecuentes.",
}

export default function AyudaPage() {
  return (
    <div className="container py-8">
      {/* Hero Section */}
      <section className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold">Centro de Ayuda</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          ¿Necesitas ayuda? Encuentra respuestas a las preguntas más frecuentes.
        </p>
      </section>

      {/* FAQ Sections */}
      <div className="mx-auto mt-16 max-w-3xl space-y-16">
        {/* General Questions */}
        <section>
          <h2 className="text-2xl font-bold">Preguntas Generales</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">¿Qué es BuscaDis?</h3>
              <p className="mt-2 text-muted-foreground">
                BuscaDis es una plataforma de adisos clasificados diseñada con un enfoque
                en la accesibilidad, permitiendo a todos comprar y vender de manera fácil y segura.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">¿Es gratis usar BuscaDis?</h3>
              <p className="mt-2 text-muted-foreground">
                Sí, publicar y buscar adisos es completamente gratuito. Ofrecemos servicios
                premium opcionales para destacar tus adisos.
              </p>
            </div>
          </div>
        </section>

        {/* Account Management */}
        <section>
          <h2 className="text-2xl font-bold">Gestión de Cuenta</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">¿Cómo creo una cuenta?</h3>
              <p className="mt-2 text-muted-foreground">
                Puedes crear una cuenta fácilmente usando tu correo electrónico o tu cuenta
                de Google. Solo necesitas hacer clic en "Iniciar sesión" y seguir los pasos.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">¿Cómo recupero mi contraseña?</h3>
              <p className="mt-2 text-muted-foreground">
                En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?"
                y sigue las instrucciones que te enviaremos por correo electrónico.
              </p>
            </div>
          </div>
        </section>

        {/* Buying */}
        <section>
          <h2 className="text-2xl font-bold">Comprar</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">¿Cómo contacto a un vendedor?</h3>
              <p className="mt-2 text-muted-foreground">
                En cada adiso encontrarás un botón de "Contactar" que te permitirá
                enviar un mensaje al vendedor directamente.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">¿Cómo me protejo al comprar?</h3>
              <p className="mt-2 text-muted-foreground">
                Recomendamos verificar los artículos en persona, reunirse en lugares
                públicos y seguir nuestras guías de seguridad al realizar transacciones.
              </p>
            </div>
          </div>
        </section>

        {/* Selling */}
        <section>
          <h2 className="text-2xl font-bold">Vender</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">¿Cómo publico un adiso?</h3>
              <p className="mt-2 text-muted-foreground">
                Haz clic en "Publicar adiso", selecciona una categoría y completa
                el formulario con los detalles de tu artículo. Es rápido y fácil.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">¿Cómo destaco mi adiso?</h3>
              <p className="mt-2 text-muted-foreground">
                Ofrecemos varias opciones para destacar tu adiso. Puedes elegir
                entre diferentes paquetes premium al publicar o editar tu adiso.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="rounded-lg border p-8 text-center">
          <h2 className="text-2xl font-bold">¿No encuentras lo que buscas?</h2>
          <p className="mt-4 text-muted-foreground">
            Nuestro equipo de soporte está aquí para ayudarte.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href={routes.info.contact}>Contactar soporte</Link>
          </Button>
        </section>
      </div>
    </div>
  )
} 