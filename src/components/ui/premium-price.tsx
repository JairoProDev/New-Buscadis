"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingTier {
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: PricingFeature[]
  highlighted?: boolean
  badge?: string
  buttonText?: string
  onSelect?: () => void
}

interface PremiumPriceProps {
  tiers: PricingTier[]
  className?: string
}

const MotionButton = motion(Button)

export function PremiumPrice({ tiers, className }: PremiumPriceProps) {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly")
  const [hoveredTier, setHoveredTier] = React.useState<string | null>(null)

  return (
    <div className={cn("my-8", className)}>
      {/* Billing Toggle */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center rounded-full border bg-muted p-1.5">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              billingCycle === "monthly"
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Mensual
            {billingCycle === "monthly" && (
              <motion.div
                layoutId="billing-toggle"
                className="absolute inset-0 rounded-full bg-background"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              billingCycle === "yearly"
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Anual
            {billingCycle === "yearly" && (
              <motion.div
                layoutId="billing-toggle"
                className="absolute inset-0 rounded-full bg-background"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
              "relative rounded-2xl bg-card p-6 shadow-lg",
              tier.highlighted && "border-2 border-primary"
            )}
          >
            {/* Glow Effect */}
            <div
              className={cn(
                "absolute inset-0 rounded-2xl opacity-0 transition-opacity",
                "bg-gradient-to-b from-primary/10 via-primary/5 to-transparent",
                hoveredTier === tier.name && "opacity-100"
              )}
            />

            {/* Badge */}
            {tier.badge && (
              <div className="absolute -top-3 right-8">
                <div className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  {tier.badge}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="relative">
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {tier.description}
              </p>

              {/* Price */}
              <div className="mt-8">
                <motion.div
                  key={billingCycle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-baseline"
                >
                  <span className="text-4xl font-bold">
                    {billingCycle === "monthly"
                      ? tier.price.monthly
                      : tier.price.yearly}
                    €
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    /{billingCycle === "monthly" ? "mes" : "año"}
                  </span>
                </motion.div>
                {billingCycle === "yearly" && (
                  <p className="mt-1 text-sm text-primary">
                    Ahorra{" "}
                    {Math.round(
                      ((tier.price.monthly * 12 - tier.price.yearly) /
                        (tier.price.monthly * 12)) *
                        100
                    )}
                    %
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={false}
                    animate={
                      hoveredTier === tier.name
                        ? { scale: 1.02, x: 4 }
                        : { scale: 1, x: 0 }
                    }
                    className="flex items-center"
                  >
                    <div
                      className={cn(
                        "mr-3 flex h-5 w-5 items-center justify-center rounded-full",
                        feature.included
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        feature.included
                          ? "text-foreground"
                          : "text-muted-foreground line-through"
                      )}
                    >
                      {feature.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Button */}
              <Button
                className="mt-8 w-full"
                size="lg"
                variant={tier.highlighted ? "default" : "outline"}
                onClick={tier.onSelect}
              >
                {tier.buttonText || "Seleccionar plan"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 