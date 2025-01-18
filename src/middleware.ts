import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Rutas protegidas que requieren autenticación
  if (request.nextUrl.pathname.startsWith("/perfil") && !session) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  // Rutas de autenticación que redirigen si ya está autenticado
  if (request.nextUrl.pathname.startsWith("/auth/") && session) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/perfil/:path*", "/auth/:path*"],
} 