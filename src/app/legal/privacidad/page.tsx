import * as React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad - BuscaDis",
  description: "Política de privacidad de BuscaDis. Conozca cómo recopilamos y protegemos sus datos personales.",
}

export default function PrivacidadPage() {
  return (
    <div className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold">Política de Privacidad</h1>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground">1. Información que recopilamos</h2>
          <p className="mt-2">
            Recopilamos información que usted nos proporciona directamente al:
          </p>
          <ul className="mt-2 list-disc pl-6">
            <li>Crear una cuenta</li>
            <li>Publicar adisos</li>
            <li>Contactar con otros usuarios</li>
            <li>Comunicarse con nuestro servicio de atención al cliente</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">2. Uso de la información</h2>
          <p className="mt-2">
            Utilizamos la información recopilada para:
          </p>
          <ul className="mt-2 list-disc pl-6">
            <li>Proporcionar y mantener nuestros servicios</li>
            <li>Mejorar la experiencia del usuario</li>
            <li>Enviar notificaciones importantes</li>
            <li>Prevenir actividades fraudulentas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">3. Protección de datos</h2>
          <p className="mt-2">
            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos
            personales contra accesos no autorizados, pérdida o alteración. Sin embargo,
            ningún método de transmisión por Internet es 100% seguro.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">4. Compartir información</h2>
          <p className="mt-2">
            No vendemos ni alquilamos sus datos personales a terceros. Solo compartimos
            información en los siguientes casos:
          </p>
          <ul className="mt-2 list-disc pl-6">
            <li>Con su consentimiento explícito</li>
            <li>Para cumplir con obligaciones legales</li>
            <li>Para proteger nuestros derechos y propiedad</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">5. Cookies y tecnologías similares</h2>
          <p className="mt-2">
            Utilizamos cookies y tecnologías similares para mejorar su experiencia,
            analizar tendencias y administrar el sitio. Puede controlar el uso de
            cookies a través de la configuración de su navegador.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">6. Sus derechos</h2>
          <p className="mt-2">
            Usted tiene derecho a:
          </p>
          <ul className="mt-2 list-disc pl-6">
            <li>Acceder a sus datos personales</li>
            <li>Rectificar datos inexactos</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
            <li>Solicitar la portabilidad de sus datos</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">7. Cambios en esta política</h2>
          <p className="mt-2">
            Podemos actualizar esta política de privacidad periódicamente. Le notificaremos
            cualquier cambio material publicando la nueva política en esta página.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">8. Contacto</h2>
          <p className="mt-2">
            Si tiene preguntas sobre esta política de privacidad, puede contactarnos en:
            privacy@buscadis.com
          </p>
        </section>

        <p className="mt-8 text-sm">
          Última actualización: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
} 