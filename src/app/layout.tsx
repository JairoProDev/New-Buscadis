import * as React from "react"
import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/providers/theme-provider"
import { MainLayout } from "@/components/layout/main-layout"
import { AuthProvider } from "@/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "BuscaDis - Anuncios clasificados",
  description:
    "La plataforma de anuncios clasificados más accesible. Encuentra lo que buscas o publica tu anuncio.",
  keywords: [
    "anuncios",
    "clasificados",
    "compra",
    "venta",
    "servicios",
    "productos",
    "accesible",
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-inter antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <MainLayout>
              {children}
              <Toaster />
            </MainLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
