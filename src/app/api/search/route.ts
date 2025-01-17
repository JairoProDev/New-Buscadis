import { NextResponse } from "next/server"
import { z } from "zod"
import { Prisma } from "@prisma/client"

import { db } from "@/lib/db"

const searchParamsSchema = z.object({
  query: z.string().optional(),
  categoria: z.string().optional(),
  precioMin: z.number().optional(),
  precioMax: z.number().optional(),
  condicion: z.string().optional(),
  ubicacion: z.string().optional(),
  ordenar: z.enum(["reciente", "precio_asc", "precio_desc", "relevancia"]).optional(),
  soloEnvio: z.boolean().optional(),
  page: z.number().default(1),
  perPage: z.number().default(12),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const params = Object.fromEntries(searchParams.entries())
    
    // Convertir tipos
    const validatedParams = searchParamsSchema.parse({
      ...params,
      precioMin: params.precioMin ? Number(params.precioMin) : undefined,
      precioMax: params.precioMax ? Number(params.precioMax) : undefined,
      soloEnvio: params.soloEnvio === "true",
      page: Number(params.page || 1),
      perPage: Number(params.perPage || 12),
    })

    // Construir la consulta base
    const where: Prisma.AnuncioWhereInput = {
      estado: "ACTIVO",
    }

    // Búsqueda por texto
    if (validatedParams.query) {
      where.OR = [
        { titulo: { contains: validatedParams.query, mode: "insensitive" } },
        { descripcion: { contains: validatedParams.query, mode: "insensitive" } },
      ]
    }

    // Filtros
    if (validatedParams.categoria) {
      where.categoriaId = validatedParams.categoria
    }

    if (validatedParams.precioMin || validatedParams.precioMax) {
      where.precio = {
        ...(validatedParams.precioMin && { gte: validatedParams.precioMin }),
        ...(validatedParams.precioMax && { lte: validatedParams.precioMax }),
      }
    }

    if (validatedParams.condicion) {
      where.condicion = validatedParams.condicion as any
    }

    if (validatedParams.ubicacion) {
      where.ubicacion = {
        contains: validatedParams.ubicacion,
        mode: "insensitive",
      }
    }

    if (validatedParams.soloEnvio) {
      where.envio = true
    }

    // Ordenamiento
    let orderBy: Prisma.AnuncioOrderByWithRelationInput = { createdAt: "desc" }
    
    switch (validatedParams.ordenar) {
      case "precio_asc":
        orderBy = { precio: "asc" }
        break
      case "precio_desc":
        orderBy = { precio: "desc" }
        break
      case "relevancia":
        orderBy = [
          { isPremium: "desc" },
          { vistas: "desc" },
          { createdAt: "desc" },
        ]
        break
      default:
        orderBy = { createdAt: "desc" }
    }

    // Ejecutar consulta con paginación
    const skip = (validatedParams.page - 1) * validatedParams.perPage
    
    const [anuncios, total] = await Promise.all([
      db.anuncio.findMany({
        where,
        orderBy,
        skip,
        take: validatedParams.perPage,
        include: {
          usuario: {
            select: {
              id: true,
              name: true,
              image: true,
              isPremium: true,
            },
          },
          categoria: {
            select: {
              id: true,
              nombre: true,
              slug: true,
            },
          },
          _count: {
            select: {
              favoritos: true,
              reviews: true,
            },
          },
        },
      }),
      db.anuncio.count({ where }),
    ])

    // Calcular metadata de paginación
    const totalPages = Math.ceil(total / validatedParams.perPage)
    const hasMore = validatedParams.page < totalPages

    return NextResponse.json({
      anuncios,
      metadata: {
        total,
        page: validatedParams.page,
        perPage: validatedParams.perPage,
        totalPages,
        hasMore,
      },
    })
  } catch (error) {
    console.error("Error en la búsqueda:", error)
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }
    return new NextResponse(
      "Error al procesar la búsqueda",
      { status: 500 }
    )
  }
} 