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

interface PremiumFiltersProps {
  groups: FilterGroup[]
  selectedFilters: Record<string, any>
  onFilterChange: (groupId: string, value: any) => void
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
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>({})

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const hasActiveFilters = Object.keys(selectedFilters).length > 0

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 px-2 text-muted-foreground"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {groups.map((group) => (
          <div key={group.id} className="rounded-lg border">
            <button
              onClick={() => toggleGroup(group.id)}
              className={cn(
                "flex w-full items-center justify-between p-4",
                "text-sm font-medium",
                "hover:bg-muted/50",
                "transition-colors duration-200"
              )}
            >
              <span>{group.label}</span>
              <motion.div
                animate={{ rotate: openGroups[group.id] ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openGroups[group.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 p-4 pt-0">
                    {group.type === "range" && group.range ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {selectedFilters[group.id]?.[0] ?? group.range.min}
                            {group.range.unit}
                          </span>
                          <span>
                            {selectedFilters[group.id]?.[1] ?? group.range.max}
                            {group.range.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={group.range.min}
                          max={group.range.max}
                          step={group.range.step}
                          value={
                            selectedFilters[group.id]?.[0] ?? group.range.min
                          }
                          onChange={(e) =>
                            onFilterChange(group.id, [
                              parseFloat(e.target.value),
                              selectedFilters[group.id]?.[1] ?? group.range.max,
                            ])
                          }
                          className="w-full"
                        />
                        <input
                          type="range"
                          min={group.range.min}
                          max={group.range.max}
                          step={group.range.step}
                          value={
                            selectedFilters[group.id]?.[1] ?? group.range.max
                          }
                          onChange={(e) =>
                            onFilterChange(group.id, [
                              selectedFilters[group.id]?.[0] ?? group.range.min,
                              parseFloat(e.target.value),
                            ])
                          }
                          className="w-full"
                        />
                      </div>
                    ) : group.type === "single" ? (
                      <div className="space-y-2">
                        {group.options?.map((option) => (
                          <label
                            key={option.id}
                            className="flex cursor-pointer items-center space-x-2"
                          >
                            <input
                              type="radio"
                              name={group.id}
                              checked={selectedFilters[group.id] === option.value}
                              onChange={() =>
                                onFilterChange(group.id, option.value)
                              }
                              className="peer h-4 w-4 rounded-full border-primary text-primary focus:ring-primary"
                            />
                            <span className="text-sm peer-checked:font-medium">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {group.options?.map((option) => (
                          <label
                            key={option.id}
                            className="flex cursor-pointer items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={selectedFilters[group.id]?.includes(
                                option.value
                              )}
                              onChange={(e) => {
                                const currentValues =
                                  selectedFilters[group.id] || []
                                const newValues = e.target.checked
                                  ? [...currentValues, option.value]
                                  : currentValues.filter(
                                      (v: any) => v !== option.value
                                    )
                                onFilterChange(
                                  group.id,
                                  newValues.length ? newValues : undefined
                                )
                              }}
                              className="peer h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                            />
                            <span className="text-sm peer-checked:font-medium">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="flex flex-wrap gap-2 pt-4"
        >
          {Object.entries(selectedFilters).map(([groupId, value]) => {
            const group = groups.find((g) => g.id === groupId)
            if (!group) return null

            const renderValue = () => {
              if (group.type === "range" && Array.isArray(value)) {
                return `${value[0]}${group.range?.unit} - ${value[1]}${
                  group.range?.unit
                }`
              }
              if (Array.isArray(value)) {
                return value
                  .map(
                    (v) =>
                      group.options?.find((opt) => opt.value === v)?.label ?? v
                  )
                  .join(", ")
              }
              return (
                group.options?.find((opt) => opt.value === value)?.label ?? value
              )
            }

            return (
              <motion.div
                key={groupId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm"
              >
                <span className="font-medium">{group.label}:</span>
                <span>{renderValue()}</span>
                <button
                  onClick={() => onFilterChange(groupId, undefined)}
                  className="ml-1 rounded-full p-1 hover:bg-primary/20"
                  aria-label={`Eliminar filtro ${group.label}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
} 