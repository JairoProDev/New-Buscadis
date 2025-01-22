"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Search, Plus } from "lucide-react"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserNav } from "@/components/layout/user-nav"
import { MobileNav } from "@/components/layout/mobile-nav"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MobileNav className="mr-2 md:hidden" />
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">BuscaDis</span>
          </Link>
          <nav className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/anuncios"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Explorar
            </Link>
            <Link
              href="/categorias"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Categorías
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <form className="hidden w-full max-w-sm lg:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar anuncios..."
                className="w-full pl-9"
              />
            </div>
          </form>
          <Button asChild variant="ghost" size="icon" className="lg:hidden">
            <Link href="/search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Link>
          </Button>
          {session ? (
            <>
              <Button asChild variant="ghost" size="icon">
                <Link href="/anuncios/nuevo">
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">Publicar anuncio</span>
                </Link>
              </Button>
              <UserNav user={session.user} />
            </>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/auth/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
} 