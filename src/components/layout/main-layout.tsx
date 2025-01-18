import * as React from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"
import { MainNav } from "@/components/layout/main-nav"
import { MobileNav } from "@/components/layout/mobile-nav"
import { SearchCommand } from "@/components/search/search-command"
import { routes } from "@/config/routes"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="flex min-h-screen flex-col">
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
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center gap-4 md:h-24 md:flex-row md:justify-between md:gap-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a
                href={routes.social.twitter}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium underline underline-offset-4"
              >
                BuscaDis
              </a>
              . The source code is available on{" "}
              <a
                href="https://github.com/buscadis/buscadis"
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={routes.legal.privacy}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Privacidad
            </Link>
            <Link
              href={routes.legal.terms}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 