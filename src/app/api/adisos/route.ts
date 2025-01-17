import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const adisoSchema = z.object({
  titulo: z.string().min(10).max(100),
  descripcion: z.string().min(50).max(2000),
  precio: z.number().min(0),
  categoriaId: z.string(),
  ubicacion: z.string().min(3).max(100),
  condicion: z.enum(["NUEVO", "COMO_NUEVO", "BUEN_ESTADO", "USADO", "PARA_PIEZAS"]),
  envio: z.boolean(),
  precioNegociable: z.boolean(),
  imagenes: z.array(z.string()).min(1).max(10),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = adisoSchema.parse(json)

    const adiso = await db.adiso.create({
      data: {
        ...body,
        userId: session.user.id,
        estado: "ACTIVO",
      },
    })

    return NextResponse.json(adiso)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse(null, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    const categoria = searchParams.get("categoria")
    const precioMin = searchParams.get("precioMin")
    const precioMax = searchParams.get("precioMax")
    const condicion = searchParams.get("condicion")
    const ubicacion = searchParams.get("ubicacion")
    const ordenar = searchParams.get("ordenar")
    const soloEnvio = searchParams.get("soloEnvio")
    const page = parseInt(searchParams.get("page") || "1")
    const perPage = parseInt(searchParams.get("perPage") || "12")

    const where = {
      estado: "ACTIVO",
      ...(query && {
        OR: [
          { titulo: { contains: query, mode: "insensitive" } },
          { descripcion: { contains: query, mode: "insensitive" } },
        ],
      }),
      ...(categoria && { categoriaId: categoria }),
      ...(precioMin && { precio: { gte: parseFloat(precioMin) } }),
      ...(precioMax && { precio: { lte: parseFloat(precioMax) } }),
      ...(condicion && { condicion }),
      ...(ubicacion && { ubicacion: { contains: ubicacion, mode: "insensitive" } }),
      ...(soloEnvio === "true" && { envio: true }),
    }

    const orderBy = {
      ...(ordenar === "precio_asc" && { precio: "asc" }),
      ...(ordenar === "precio_desc" && { precio: "desc" }),
      ...(ordenar === "recientes" && { createdAt: "desc" }),
      ...(ordenar === "antiguos" && { createdAt: "asc" }),
    }

    const [adisos, total] = await Promise.all([
      db.adiso.findMany({
        where,
        orderBy: Object.keys(orderBy).length ? orderBy : { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          categoria: {
            select: {
              nombre: true,
              slug: true,
            },
          },
        },
      }),
      db.adiso.count({ where }),
    ])

    return NextResponse.json({
      adisos,
      total,
      pages: Math.ceil(total / perPage),
    })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
} 