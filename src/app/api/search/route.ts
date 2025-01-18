import { NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

const searchParamsSchema = z.object({
  query: z.string().optional(),
  categoria: z.string().optional(),
  precioMin: z.string().optional(),
  precioMax: z.string().optional(),
  condicion: z.string().optional(),
  ubicacion: z.string().optional(),
  soloEnvio: z.string().optional(),
  ordenar: z.string().optional(),
  page: z.string().optional(),
  perPage: z.string().optional(),
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    const validatedParams = searchParamsSchema.parse(params)

    const page = Number(validatedParams.page) || 1
    const perPage = Number(validatedParams.perPage) || 10

    const where: Prisma.AdisoWhereInput = {
      estado: "ACTIVO",
      ...(validatedParams.query && {
        OR: [
          { titulo: { contains: validatedParams.query, mode: "insensitive" } },
          { descripcion: { contains: validatedParams.query, mode: "insensitive" } },
        ],
      }),
      ...(validatedParams.categoria && {
        categoriaId: validatedParams.categoria,
      }),
      ...(validatedParams.precioMin && {
        precio: { gte: Number(validatedParams.precioMin) },
      }),
      ...(validatedParams.precioMax && {
        precio: { lte: Number(validatedParams.precioMax) },
      }),
      ...(validatedParams.condicion && {
        condicion: validatedParams.condicion,
      }),
      ...(validatedParams.ubicacion && {
        ubicacion: { contains: validatedParams.ubicacion, mode: "insensitive" },
      }),
      ...(validatedParams.soloEnvio === "true" && {
        envio: true,
      }),
    }

    const orderBy: Prisma.AdisoOrderByWithRelationInput = {
      ...(validatedParams.ordenar === "precio_asc" && { precio: "asc" }),
      ...(validatedParams.ordenar === "precio_desc" && { precio: "desc" }),
      ...(validatedParams.ordenar === "relevancia" && {
        _relevance: {
          fields: ["titulo", "descripcion"],
          search: validatedParams.query || "",
          sort: "desc",
        },
      }),
      createdAt: validatedParams.ordenar === "reciente" ? "desc" : undefined,
    }

    const [adisos, total] = await Promise.all([
      db.adiso.findMany({
        where,
        orderBy,
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          usuario: {
            select: {
              name: true,
              image: true,
              isPremium: true,
            },
          },
          categoria: {
            select: {
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
      db.adiso.count({ where }),
    ])

    return NextResponse.json({
      adisos,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Error al buscar adisos" },
      { status: 500 }
    )
  }
} 