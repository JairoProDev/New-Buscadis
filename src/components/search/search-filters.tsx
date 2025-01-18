"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FilterOption {
  id: string
  label: string
  value: string | number | boolean
}

interface FilterGroup {
  id: string
  label: string
  type: "single" | "multiple" | "range"
  options?: FilterOption[]
  range?: {
    min: number
    max: number
    step: number
    unit?: string
  }
}

interface FilterState {
  categoria?: string
  precioMin?: number
  precioMax?: number
  condicion?: string
  ubicacion?: string
  envio?: boolean
  ordenar?: string
}

interface FilterChangeHandler {
  (name: keyof FilterState, value: string | number | boolean | undefined): void
}

interface PremiumFiltersProps {
  groups: FilterGroup[]
  selectedFilters: Record<string, string | number | boolean | Array<string | number | boolean>>
  onFilterChange: FilterChangeHandler
  onClearFilters: () => void
  className?: string
}

export function PremiumFilters({
  groups,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  className,
}: PremiumFiltersProps) {
  // ... rest of the code ...
} 