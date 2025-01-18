import * as React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones - BuscaDis",
  description: "Términos y condiciones de uso de BuscaDis. Lea atentamente nuestras políticas y normas.",
}

export default function TerminosPage() {
  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Aceptación de los términos</h2>
          <p className="mt-2">
            Al acceder y utilizar BuscaDis, usted acepta estar sujeto a estos términos y condiciones de uso.
            Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Descripción del servicio</h2>
          <p className="mt-2">
            BuscaDis es una plataforma de anuncios clasificados diseñada con un enfoque en la accesibilidad.
            Facilitamos la conexión entre compradores y vendedores, pero no somos parte de las transacciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Registro y cuentas de usuario</h2>
          <p className="mt-2">
            Para publicar anuncios, debe crear una cuenta. Usted es responsable de mantener la confidencialidad
            de su cuenta y contraseña, así como de restringir el acceso a su computadora.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Publicación de anuncios</h2>
          <p className="mt-2">
            Los usuarios son responsables del contenido que publican. Los anuncios deben ser precisos,
            legales y no violar derechos de terceros. Nos reservamos el derecho de eliminar contenido
            que incumpla nuestras políticas.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Propiedad intelectual</h2>
          <p className="mt-2">
            El contenido del sitio, incluyendo textos, gráficos, logotipos, imágenes y software,
            está protegido por derechos de autor y otras leyes de propiedad intelectual.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Limitación de responsabilidad</h2>
          <p className="mt-2">
            BuscaDis no se hace responsable de las transacciones entre usuarios. Recomendamos
            verificar la autenticidad de los artículos y tomar precauciones al realizar transacciones.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Modificaciones</h2>
          <p className="mt-2">
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Ley aplicable</h2>
          <p className="mt-2">
            Estos términos se rigen por las leyes españolas. Cualquier disputa será resuelta
            en los tribunales competentes de España.
          </p>
        </section>

        <p className="mt-8 text-sm">
          Última actualización: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
} 