import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const updateAdisoSchema = z.object({
  titulo: z.string().min(10).max(100).optional(),
  descripcion: z.string().min(50).max(2000).optional(),
  precio: z.number().min(0).optional(),
  categoriaId: z.string().optional(),
  ubicacion: z.string().min(3).max(100).optional(),
  condicion: z.enum(["NUEVO", "COMO_NUEVO", "BUEN_ESTADO", "USADO", "PARA_PIEZAS"]).optional(),
  envio: z.boolean().optional(),
  precioNegociable: z.boolean().optional(),
  imagenes: z.array(z.string()).min(1).max(10).optional(),
  estado: z.enum(["ACTIVO", "PAUSADO", "VENDIDO", "ELIMINADO"]).optional(),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const adiso = await db.adiso.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!adiso) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (adiso.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    const json = await req.json()
    const body = updateAdisoSchema.parse(json)

    const updatedAdiso = await db.adiso.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(updatedAdiso)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }

    return new NextResponse(null, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const adiso = await db.adiso.findUnique({
      where: { id: params.id },
      select: { userId: true },
    })

    if (!adiso) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (adiso.userId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 })
    }

    await db.adiso.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adiso = await db.adiso.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
            adisos: {
              select: { id: true },
            },
          },
        },
        categoria: true,
      },
    })

    if (!adiso) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(adiso)
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
} 