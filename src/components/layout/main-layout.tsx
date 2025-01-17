import * as React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { signOut } from "next-auth/react"

import { cn } from "@/lib/utils"
import { routes } from "@/lib/routes"
import { PremiumNav } from "@/components/ui/premium-nav"
import { PremiumSearch } from "@/components/ui/premium-search"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"

interface MainLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    href: routes.home,
    label: "Inicio",
  },
  {
    href: routes.anuncios.index,
    label: "Anuncios",
  },
  {
    href: routes.categorias,
    label: "Categorías",
  },
  {
    href: routes.premium,
    label: "Premium",
  },
]

export function MainLayout({ children }: MainLayoutProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const { user, isAuthenticated, isLoading } = useAuth()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-background">
      {/* Header */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-lg transition-all",
          isScrolled && "border-b shadow-sm"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={routes.home}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold"
            >
              BuscaDis
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <PremiumNav items={navigationItems} />
          </div>

          {/* Search */}
          <div className="hidden flex-1 px-8 md:block">
            <PremiumSearch
              results={[]}
              onSearch={() => {}}
              onSelect={() => {}}
              placeholder="Buscar anuncios..."
            />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href={routes.anuncios.nuevo}>Publicar Anuncio</Link>
                </Button>
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
                    <AvatarFallback>
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="absolute right-0 top-full mt-2 whitespace-nowrap"
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={routes.auth.login}>Iniciar sesión</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={routes.auth.register}>Crear cuenta</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="ml-4 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-16 z-40 border-b bg-background p-4 shadow-lg md:hidden"
          >
            <div className="space-y-4">
              <PremiumSearch
                results={[]}
                onSearch={() => {}}
                onSelect={() => {}}
                placeholder="Buscar anuncios..."
              />
              <PremiumNav
                items={navigationItems}
                direction="vertical"
                className="flex flex-col space-y-2"
              />
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="w-full"
                >
                  Cerrar sesión
                </Button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={routes.auth.login}>Iniciar sesión</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={routes.auth.register}>Crear cuenta</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-lg">
        <div className="container py-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold">BuscaDis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                La plataforma de anuncios clasificados más accesible.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Enlaces</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href={routes.info.sobreNosotros}>Sobre nosotros</Link>
                </li>
                <li>
                  <Link href={routes.info.blog}>Blog</Link>
                </li>
                <li>
                  <Link href={routes.info.contacto}>Contacto</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Legal</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href={routes.legal.terminos}>Términos y condiciones</Link>
                </li>
                <li>
                  <Link href={routes.legal.privacidad}>
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href={routes.legal.cookies}>Cookies</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Social</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href={routes.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href={routes.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={routes.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BuscaDis. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
} 