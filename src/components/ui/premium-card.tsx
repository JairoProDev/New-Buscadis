"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean
  glowEffect?: boolean
  hoverScale?: boolean
  borderEffect?: boolean
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ 
    className, 
    gradient = true, 
    glowEffect = true,
    hoverScale = true,
    borderEffect = true,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl bg-background p-6 shadow-xl transition-all",
          gradient && "bg-gradient-to-br from-background via-background/80 to-background/50",
          glowEffect && "after:absolute after:inset-0 after:-z-10 after:rounded-xl after:bg-gradient-to-br after:from-primary/20 after:via-secondary/20 after:to-background/20 after:blur-xl",
          hoverScale && "hover:scale-105",
          borderEffect && "border border-transparent bg-clip-padding",
          borderEffect && "before:absolute before:inset-0 before:-z-10 before:rounded-xl before:bg-gradient-to-br before:from-primary before:to-secondary before:p-0.5",
          className
        )}
        {...props}
      />
    )
  }
)

PremiumCard.displayName = "PremiumCard"

const PremiumCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5", className)}
    {...props}
  />
))
PremiumCardHeader.displayName = "PremiumCardHeader"

const PremiumCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-2xl font-bold tracking-tight text-transparent",
      className
    )}
    {...props}
  />
))
PremiumCardTitle.displayName = "PremiumCardTitle"

const PremiumCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground/80", className)}
    {...props}
  />
))
PremiumCardDescription.displayName = "PremiumCardDescription"

const PremiumCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-6", className)} {...props} />
))
PremiumCardContent.displayName = "PremiumCardContent"

const PremiumCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-6", className)}
    {...props}
  />
))
PremiumCardFooter.displayName = "PremiumCardFooter"

export {
  PremiumCard,
  PremiumCardHeader,
  PremiumCardFooter,
  PremiumCardTitle,
  PremiumCardDescription,
  PremiumCardContent,
} 