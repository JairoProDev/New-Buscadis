import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { useDebounce } from "use-debounce"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { PremiumImage } from "@/components/ui/premium-image"
import { routes } from "@/config/routes"

interface SearchResult {
  id: string
  titulo: string
  descripcion: string
  precio: number
  imagenes: string[]
  isPremium: boolean
  usuario: {
    name: string
    image: string | null
    isPremium: boolean
  }
  categoria: {
    nombre: string
    slug: string
  }
  _count: {
    favoritos: number
    reviews: number
  }
}

interface SearchCommandProps extends React.HTMLAttributes<HTMLDivElement> {
  filters?: {
    categoria?: string
    precioMin?: number
    precioMax?: number
    condicion?: string
    ubicacion?: string
    soloEnvio?: boolean
  }
}

export function SearchCommand({ filters, className, ...props }: SearchCommandProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [debouncedQuery] = useDebounce(query, 300)
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<SearchResult[]>([])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  React.useEffect(() => {
    if (debouncedQuery.length === 0) {
      setResults([])
      return
    }

    async function fetchResults() {
      setIsLoading(true)
      try {
        const searchParams = new URLSearchParams({
          query: debouncedQuery,
          ...(filters?.categoria && { categoria: filters.categoria }),
          ...(filters?.precioMin && { precioMin: filters.precioMin.toString() }),
          ...(filters?.precioMax && { precioMax: filters.precioMax.toString() }),
          ...(filters?.condicion && { condicion: filters.condicion }),
          ...(filters?.ubicacion && { ubicacion: filters.ubicacion }),
          ...(filters?.soloEnvio && { soloEnvio: "true" }),
        })

        const res = await fetch(`/api/search?${searchParams.toString()}`)
        if (!res.ok) throw new Error("Error en la búsqueda")
        
        const data = await res.json()
        setResults(data.adisos)
      } catch (error) {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [debouncedQuery, filters])

  const handleSelect = React.useCallback((result: SearchResult) => {
    setOpen(false)
    router.push(routes.adisos.show(result.id))
  }, [router])

  return (
    <div className={cn("relative", className)} {...props}>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">
          Buscar adisos...
        </span>
        <span className="inline-flex lg:hidden">Buscar...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar adisos..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 text-center"
              >
                <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
              </motion.div>
            )}

            {!isLoading && query && results.length === 0 && (
              <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            )}

            {!isLoading && results.length > 0 && (
              <CommandGroup heading="Resultados">
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleSelect(result)}
                    className="px-4 py-2"
                  >
                    <div className="flex items-start gap-4">
                      <PremiumImage
                        src={result.imagenes[0] || "/placeholder.png"}
                        alt={result.titulo}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {result.isPremium && (
                            <Badge variant="premium" className="h-5 px-1.5">
                              PREMIUM
                            </Badge>
                          )}
                          <span className="font-medium">{result.titulo}</span>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {result.descripcion}
                        </p>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">€{result.precio}</span>
                          <span className="text-sm text-muted-foreground">
                            {result.categoria.nombre}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </AnimatePresence>
        </CommandList>
      </CommandDialog>
    </div>
  )
} 