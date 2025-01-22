"use client"

import * as React from "react"
import Link from "next/link"
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

interface MobileNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn("md:hidden", className)}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="border-b pb-4">
            <SheetTitle>BuscaDis</SheetTitle>
          </SheetHeader>
          <nav className="mt-4 flex flex-col space-y-2">
            <Link
              href="/anuncios"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setOpen(false)}
            >
              Explorar
            </Link>
            <Link
              href="/categorias"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setOpen(false)}
            >
              Categorías
            </Link>
            <Link
              href="/premium"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setOpen(false)}
            >
              Premium
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
} 