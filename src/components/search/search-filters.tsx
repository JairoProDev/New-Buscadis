import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface SearchFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  categorias: Array<{
    id: string
    nombre: string
    slug: string
  }>
}

export function SearchFilters({ categorias, className, ...props }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false)

  // Estado local para los filtros
  const [filters, setFilters] = React.useState({
    categoria: searchParams.get("categoria") || "",
    precioMin: searchParams.get("precioMin") || "",
    precioMax: searchParams.get("precioMax") || "",
    condicion: searchParams.get("condicion") || "",
    ubicacion: searchParams.get("ubicacion") || "",
    soloEnvio: searchParams.get("soloEnvio") === "true",
    ordenar: searchParams.get("ordenar") || "reciente",
  })

  // Contador de filtros activos
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "ordenar") return false
    if (key === "soloEnvio") return value
    return value !== ""
  }).length

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams)

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    router.push(`?${params.toString()}`)
    setOpen(false)
  }

  const handleResetFilters = () => {
    setFilters({
      categoria: "",
      precioMin: "",
      precioMax: "",
      condicion: "",
      ubicacion: "",
      soloEnvio: false,
      ordenar: "reciente",
    })
  }

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="relative h-8 px-2 lg:h-9 lg:px-3"
          >
            <Filter className="h-4 w-4" />
            <span className="ml-2 hidden lg:inline-block">Filtros</span>
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-4 rounded-sm px-1 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Filtros de búsqueda</SheetTitle>
          </SheetHeader>
          <Separator className="my-4" />
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="categoria">Categoría</Label>
              <Select
                value={filters.categoria}
                onValueChange={(value) => handleFilterChange("categoria", value)}
              >
                <SelectTrigger id="categoria">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Precio</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.precioMin}
                  onChange={(e) =>
                    handleFilterChange("precioMin", e.target.value)
                  }
                  className="w-full"
                />
                <span>-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.precioMax}
                  onChange={(e) =>
                    handleFilterChange("precioMax", e.target.value)
                  }
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="condicion">Condición</Label>
              <Select
                value={filters.condicion}
                onValueChange={(value) => handleFilterChange("condicion", value)}
              >
                <SelectTrigger id="condicion">
                  <SelectValue placeholder="Cualquier condición" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NUEVO">Nuevo</SelectItem>
                  <SelectItem value="COMO_NUEVO">Como nuevo</SelectItem>
                  <SelectItem value="BUEN_ESTADO">Buen estado</SelectItem>
                  <SelectItem value="USADO">Usado</SelectItem>
                  <SelectItem value="PARA_PIEZAS">Para piezas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input
                id="ubicacion"
                placeholder="Cualquier ubicación"
                value={filters.ubicacion}
                onChange={(e) =>
                  handleFilterChange("ubicacion", e.target.value)
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="soloEnvio"
                checked={filters.soloEnvio}
                onCheckedChange={(checked) =>
                  handleFilterChange("soloEnvio", checked)
                }
              />
              <Label htmlFor="soloEnvio">Solo con envío</Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ordenar">Ordenar por</Label>
              <Select
                value={filters.ordenar}
                onValueChange={(value) => handleFilterChange("ordenar", value)}
              >
                <SelectTrigger id="ordenar">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reciente">Más recientes</SelectItem>
                  <SelectItem value="precio_asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="precio_desc">Precio: mayor a menor</SelectItem>
                  <SelectItem value="relevancia">Más relevantes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResetFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
              <Button className="w-full" onClick={handleApplyFilters}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Filtros activos */}
      <div className="flex flex-wrap items-center gap-2">
        {filters.categoria && (
          <Badge variant="secondary" className="h-8 gap-1 px-3">
            {categorias.find((c) => c.id === filters.categoria)?.nombre}
            <button
              onClick={() => handleFilterChange("categoria", "")}
              className="ml-1 rounded-full hover:bg-secondary"
              aria-label="Eliminar filtro de categoría"
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        )}
        {(filters.precioMin || filters.precioMax) && (
          <Badge variant="secondary" className="h-8 gap-1 px-3">
            {filters.precioMin && `€${filters.precioMin}`}
            {filters.precioMin && filters.precioMax && " - "}
            {filters.precioMax && `€${filters.precioMax}`}
            <button
              onClick={() => {
                handleFilterChange("precioMin", "")
                handleFilterChange("precioMax", "")
              }}
              className="ml-1 rounded-full hover:bg-secondary"
              aria-label="Eliminar filtro de precio"
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        )}
        {filters.condicion && (
          <Badge variant="secondary" className="h-8 gap-1 px-3">
            {filters.condicion.replace("_", " ")}
            <button
              onClick={() => handleFilterChange("condicion", "")}
              className="ml-1 rounded-full hover:bg-secondary"
              aria-label="Eliminar filtro de condición"
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        )}
        {filters.ubicacion && (
          <Badge variant="secondary" className="h-8 gap-1 px-3">
            {filters.ubicacion}
            <button
              onClick={() => handleFilterChange("ubicacion", "")}
              className="ml-1 rounded-full hover:bg-secondary"
              aria-label="Eliminar filtro de ubicación"
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        )}
        {filters.soloEnvio && (
          <Badge variant="secondary" className="h-8 gap-1 px-3">
            Con envío
            <button
              onClick={() => handleFilterChange("soloEnvio", false)}
              className="ml-1 rounded-full hover:bg-secondary"
              aria-label="Eliminar filtro de envío"
            >
              <X className="h-4 w-4" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  )
} 