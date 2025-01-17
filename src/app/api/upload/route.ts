import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return new NextResponse("No autorizado", { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new NextResponse("No se ha proporcionado ningún archivo", { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear un nombre de archivo único
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${uniqueSuffix}-${file.name}`
    
    // Guardar en la carpeta public/uploads
    const path = join(process.cwd(), "public/uploads", filename)
    await writeFile(path, buffer)
    
    // Devolver la URL relativa
    const url = `/uploads/${filename}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error al subir el archivo:", error)
    return new NextResponse(
      "Error al procesar la subida del archivo",
      { status: 500 }
    )
  }
}

export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
} 