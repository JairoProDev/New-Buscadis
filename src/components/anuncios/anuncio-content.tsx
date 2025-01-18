"use client"

import { Adiso, User, Categoria } from "@prisma/client"
import { motion } from "framer-motion"

interface AdisoContentProps {
  adiso: Adiso & {
    user: Pick<User, "id" | "name" | "image" | "createdAt"> & {
      adisos: { id: string }[]
    }
    categoria: Categoria
  }
}

export function AdisoContent({ adiso }: AdisoContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6 rounded-xl bg-card p-6 shadow-sm"
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Descripción</h2>
        <div className="mt-4 whitespace-pre-wrap text-muted-foreground">
          {adiso.descripcion}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Detalles</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Condición
            </dt>
            <dd>
              {adiso.condicion === "NUEVO"
                ? "Nuevo"
                : adiso.condicion === "COMO_NUEVO"
                ? "Como nuevo"
                : adiso.condicion === "BUEN_ESTADO"
                ? "Buen estado"
                : adiso.condicion === "USADO"
                ? "Usado"
                : "Para piezas"}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Ubicación
            </dt>
            <dd>{adiso.ubicacion}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Categoría
            </dt>
            <dd>
              <a
                href={`/categorias/${adiso.categoria.slug}`}
                className="hover:text-primary"
              >
                {adiso.categoria.nombre}
              </a>
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Referencia
            </dt>
            <dd>{adiso.id}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Envío disponible
            </dt>
            <dd>{adiso.envio ? "Sí" : "No"}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Precio negociable
            </dt>
            <dd>{adiso.precioNegociable ? "Sí" : "No"}</dd>
          </div>
        </dl>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Normas de seguridad
        </h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          <li>Nunca envíes dinero por adelantado</li>
          <li>Revisa el artículo antes de comprarlo</li>
          <li>Reúnete en un lugar público y seguro</li>
          <li>Verifica la identidad del vendedor</li>
          <li>Guarda toda la información del adiso</li>
        </ul>
      </div>
    </motion.div>
  )
} 