import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const anuncioSchema = z.object({
  titulo: z.string().min(10).max(100),
  descripcion: z.string().min(50).max(2000),
  precio: z.number().min(0),
  categoriaId: z.string(),
  ubicacion: z.string().min(3).max(100),
  condicion: z.enum(["NUEVO", "USADO", "REACONDICIONADO"]),
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
    const body = anuncioSchema.parse(json)

    const anuncio = await db.anuncio.create({
      data: {
        ...body,
        userId: session.user.id,
        estado: "ACTIVO",
      },
    })

    return NextResponse.json(anuncio)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse(null, { status: 500 })
  }
} 