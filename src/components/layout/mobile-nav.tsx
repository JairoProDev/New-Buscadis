import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { routes } from "@/config/routes"

export function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="mb-4">
          <SheetTitle>BuscaDis</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-3">
          <Link
            href={routes.home}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === routes.home
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Inicio
          </Link>
          <Link
            href={routes.adisos.index}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === routes.adisos.index
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Explorar
          </Link>
          <Link
            href={routes.premium.index}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === routes.premium.index
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Premium
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
} 