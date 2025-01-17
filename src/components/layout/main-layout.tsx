import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { PremiumNav } from "@/components/ui/premium-nav"
import { PremiumSearch } from "@/components/ui/premium-search"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MainLayoutProps {
  children: React.ReactNode
}

const navigationItems = [
  {
    href: "/",
    label: "Inicio",
  },
  {
    href: "/anuncios",
    label: "Anuncios",
  },
  {
    href: "/categorias",
    label: "Categorías",
  },
  {
    href: "/premium",
    label: "Premium",
  },
]

export function MainLayout({ children }: MainLayoutProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold"
          >
            BuscaDis
          </motion.div>

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
            <Button variant="outline" size="sm">
              Publicar Anuncio
            </Button>
            <Avatar>
              <AvatarImage src="" alt="@usuario" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
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
                <li>Sobre nosotros</li>
                <li>Blog</li>
                <li>Contacto</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Legal</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>Términos y condiciones</li>
                <li>Política de privacidad</li>
                <li>Cookies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Social</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                <li>Twitter</li>
                <li>Instagram</li>
                <li>Facebook</li>
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