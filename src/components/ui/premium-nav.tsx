import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  label: string
  icon?: React.ReactNode
}

interface PremiumNavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[]
  direction?: "horizontal" | "vertical"
  showIndicator?: boolean
  indicatorStyle?: "pill" | "line" | "glow"
  size?: "sm" | "default" | "lg"
}

const sizeClasses = {
  sm: "text-sm",
  default: "text-base",
  lg: "text-lg",
}

const indicatorVariants = {
  pill: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    className: "absolute inset-0 rounded-full bg-primary/10 dark:bg-primary/20",
  },
  line: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    className: "absolute bottom-0 left-0 right-0 h-0.5 bg-primary",
  },
  glow: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 0.5, scale: 1 },
    className: "absolute inset-0 rounded-full bg-primary/20 blur-md",
  },
}

export function PremiumNav({
  items,
  direction = "horizontal",
  showIndicator = true,
  indicatorStyle = "pill",
  size = "default",
  className,
  ...props
}: PremiumNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "relative",
        direction === "horizontal" ? "flex space-x-1" : "flex flex-col space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex items-center justify-center rounded-lg px-4 py-2",
              "transition-colors duration-200",
              "hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground",
              sizeClasses[size]
            )}
          >
            {showIndicator && isActive && (
              <motion.div
                layoutId="nav-indicator"
                initial={indicatorVariants[indicatorStyle].initial}
                animate={indicatorVariants[indicatorStyle].animate}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className={indicatorVariants[indicatorStyle].className}
              />
            )}
            {item.icon && (
              <span className="mr-2">
                {item.icon}
              </span>
            )}
            <span className="relative z-10">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
} 