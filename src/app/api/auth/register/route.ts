import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"

import { db } from "@/lib/db"

const registerSchema = z.object({
  email: z.string().email({
    message: "Por favor, ingresa un correo electrónico válido",
  }),
  password: z
    .string()
    .min(8, {
      message: "La contraseña debe tener al menos 8 caracteres",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
      message:
        "La contraseña debe contener al menos una letra minúscula, una mayúscula y un número",
    }),
})

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = registerSchema.parse(json)

    const userExists = await db.user.findUnique({
      where: { email: body.email },
    })

    if (userExists) {
      return new NextResponse("El usuario ya existe", { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await db.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse("Error interno del servidor", { status: 500 })
  }
} 