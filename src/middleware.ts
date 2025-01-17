import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { withAuth } from "next-auth/middleware"
import { routes } from "@/lib/routes"

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/auth/login") ||
      req.nextUrl.pathname.startsWith("/auth/register")
    const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = 
      req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname.startsWith("/anuncios") ||
      req.nextUrl.pathname.startsWith("/categorias") ||
      req.nextUrl.pathname.startsWith("/blog") ||
      req.nextUrl.pathname.startsWith("/sobre-nosotros") ||
      req.nextUrl.pathname.startsWith("/contacto")

    // Permitir rutas públicas y API de autenticación
    if (isPublicRoute || isApiAuthRoute) {
      return NextResponse.next()
    }

    // Redirigir usuarios autenticados fuera de páginas de auth
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL(routes.home, req.url))
    }

    // Redirigir usuarios no autenticados a login
    if (!isAuth && !isAuthPage) {
      let callbackUrl = req.nextUrl.pathname
      if (req.nextUrl.search) {
        callbackUrl += req.nextUrl.search
      }

      const encodedCallbackUrl = encodeURIComponent(callbackUrl)
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, req.url)
      )
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => true, // La autorización se maneja en el middleware
    },
  }
)

// Configurar las rutas que requieren el middleware
export const config = {
  matcher: [
    "/perfil/:path*",
    "/anuncios/nuevo",
    "/anuncios/:path*/editar",
    "/mensajes/:path*",
    "/favoritos/:path*",
    "/auth/:path*",
  ],
} 