"use client"

import * as React from "react"
import { Search as SearchIcon, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface SearchResult {
  id: string
  title: string
  description?: string
  category?: string
  icon?: React.ReactNode
}

interface PremiumSearchProps {
  results: SearchResult[]
  onSearch: (query: string) => void
  onSelect: (result: SearchResult) => void
  placeholder?: string
  loading?: boolean
  className?: string
}

export function PremiumSearch({
  results,
  onSearch,
  onSelect,
  placeholder = "Buscar...",
  loading = false,
  className,
}: PremiumSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  // Group results by category
  const groupedResults = React.useMemo(() => {
    return results.reduce((acc, result) => {
      const category = result.category || "General"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(result)
      return acc
    }, {} as Record<string, SearchResult[]>)
  }, [results])

  const handleSearch = React.useCallback(
    (value: string) => {
      setQuery(value)
      onSearch(value)
    },
    [onSearch]
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group flex h-10 w-full items-center gap-2 rounded-xl px-4 text-sm",
          "bg-muted/50 text-muted-foreground",
          "hover:bg-muted/80",
          "focus:outline-none focus:ring-2 focus:ring-ring",
          className
        )}
      >
        <SearchIcon className="h-4 w-4" />
        <span className="flex-1 text-left">{placeholder}</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0">
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <div className="flex items-center border-b px-3">
              <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder={placeholder}
                value={query}
                onValueChange={handleSearch}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              {query && (
                <button
                  onClick={() => handleSearch("")}
                  className="rounded-full p-1 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <CommandList>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-6 text-center text-sm"
                  >
                    Buscando...
                  </motion.div>
                ) : results.length === 0 ? (
                  <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                ) : (
                  Object.entries(groupedResults).map(([category, items]) => (
                    <CommandGroup key={category} heading={category}>
                      <AnimatePresence>
                        {items.map((result) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CommandItem
                              value={result.title}
                              onSelect={() => {
                                onSelect(result)
                                setOpen(false)
                              }}
                              className="flex items-center gap-2"
                            >
                              {result.icon}
                              <div>
                                <p>{result.title}</p>
                                {result.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {result.description}
                                  </p>
                                )}
                              </div>
                            </CommandItem>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </CommandGroup>
                  ))
                )}
              </AnimatePresence>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
} 