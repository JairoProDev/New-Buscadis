import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { routes } from "@/config/routes"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
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
  )
} 