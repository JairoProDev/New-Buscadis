"use client"

import * as React from "react"
import Link from "next/link"
import { Session } from "next-auth"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"
import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SearchCommand } from "@/components/search/search-command"
import { routes } from "@/config/routes"

interface HeaderProps {
  session: Session | null
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <MobileNav />
        <div className="flex items-center gap-6">
          <Link href={routes.home} className="hidden items-center space-x-2 md:flex">
            <span className="hidden font-bold sm:inline-block">BuscaDis</span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchCommand />
          </div>
          {session ? (
            <UserNav user={session.user} />
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href={routes.auth.login}>Iniciar sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
} 