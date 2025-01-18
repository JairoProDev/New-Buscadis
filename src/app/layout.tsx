import React from "react"
import { Inter as FontSans } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/react"

import "@/styles/globals.css"
import { cn } from "@/lib/utils"
import { MainLayout } from "@/components/layout/main-layout"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/auth-provider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "BuscaDis - Adisos Clasificados",
  description:
    "La plataforma de adisos clasificados más accesible. Encuentra lo que buscas o publica tu adiso.",
  keywords: [
    "adisos",
    "clasificados",
    "compra",
    "venta",
    "servicios",
    "productos",
    "accesible",
    "empleos",
    "trabajos",
    "inmuebles",
    "alquiler",
    "buscadis",
    "buscadis.com",
    "vehiculos",

  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es" suppressHydrationWarning className={GeistSans.className}>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <AuthProvider>
          <MainLayout>
            {children}
            <Toaster />
          </MainLayout>
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
