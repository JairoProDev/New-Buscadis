import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  image: z.string().optional(),
  telefono: z
    .string()
    .regex(/^\+?[\d\s-]+$/, {
      message: "Por favor, ingresa un número de teléfono válido",
    })
    .optional()
    .nullable(),
  ubicacion: z.string().optional().nullable(),
  bio: z.string().max(500, {
    message: "La biografía no puede exceder los 500 caracteres",
  }).optional().nullable(),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("No autorizado", { status: 401 })
    }

    const formData = await req.formData()
    const data = Object.fromEntries(formData)
    
    const validatedData = profileSchema.parse(data)

    const user = await db.user.update({
      where: { email: session.user.email },
      data: validatedData,
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse(
      "Hubo un error al actualizar el perfil. Por favor, intenta de nuevo.",
      { status: 500 }
    )
  }
} 