import { Inter as FontSans } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/react"

import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { MainLayout } from "@/components/layout/main-layout"
import { Toaster } from "@/components/ui/toaster"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "BuscaDis - Anuncios Clasificados",
  description:
    "La plataforma de anuncios clasificados más accesible. Encuentra lo que buscas o publica tu anuncio.",
  keywords: [
    "anuncios",
    "clasificados",
    "compra",
    "venta",
    "servicios",
    "accesible",
    "discapacidad",
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <MainLayout>
          {children}
          <Toaster />
        </MainLayout>
        <Analytics />
      </body>
    </html>
  )
}
