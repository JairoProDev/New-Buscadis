import * as React from "react"
import Link from "next/link"
import { ArrowRight, Search, Tag, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">BuscaDis</h1>
        <p className="text-xl text-center mb-4">
          La plataforma de anuncios clasificados más accesible
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/adisos/nuevo"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Publicar anuncio
          </a>
          <a
            href="/adisos"
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Explorar anuncios
          </a>
        </div>
      </div>
    </main>
  )
}
