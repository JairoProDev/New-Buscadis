import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

interface Category {
  id: string
  name: string
  description?: string
  icon?: React.ReactNode
  color?: string
  count?: number
}

interface PremiumCategoriesProps {
  categories: Category[]
  selectedCategory?: string
  onSelectCategory: (categoryId: string) => void
  layout?: "grid" | "list"
  showCount?: boolean
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function PremiumCategories({
  categories,
  selectedCategory,
  onSelectCategory,
  layout = "grid",
  showCount = true,
  className,
}: PremiumCategoriesProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={cn(
        layout === "grid"
          ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          : "space-y-2",
        className
      )}
    >
      {categories.map((category) => (
        <HoverCard key={category.id} openDelay={200} closeDelay={100}>
          <HoverCardTrigger asChild>
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "group relative overflow-hidden rounded-xl p-4 text-left transition-colors",
                "border bg-card hover:bg-accent",
                selectedCategory === category.id &&
                  "border-primary bg-accent/50",
                layout === "list" && "flex items-center space-x-4"
              )}
              style={{
                "--category-color": category.color || "hsl(var(--primary))",
              } as React.CSSProperties}
            >
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
                  "bg-gradient-to-br from-[var(--category-color)/10] via-transparent to-transparent"
                )}
              />

              <div className="relative flex items-center gap-3">
                {category.icon && (
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      "bg-[var(--category-color)/10 group-hover:bg-[var(--category-color)/20]",
                      "transition-colors"
                    )}
                  >
                    {category.icon}
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  {showCount && category.count !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      {category.count} items
                    </p>
                  )}
                </div>
              </div>

              {layout === "grid" && category.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}

              <motion.div
                className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--category-color)]"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: selectedCategory === category.id ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </HoverCardTrigger>
          <HoverCardContent
            side="right"
            align="start"
            className="w-80"
          >
            <div className="flex justify-between space-x-4">
              <div>
                <h4 className="font-semibold">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </motion.div>
  )
} 