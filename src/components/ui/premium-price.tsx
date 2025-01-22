"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PremiumPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  tiers: Array<{
    name: string
    description: string
    price: {
      monthly: number
      yearly: number
    }
    features: Array<{
      text: string
      included: boolean
    }>
    highlighted?: boolean
    badge?: string
    buttonText?: string
    onSelect?: () => void
  }>
}

export function PremiumPrice({ tiers, className }: PremiumPriceProps) {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly")

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
          </button>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative rounded-2xl bg-card p-6 shadow-lg transition-all hover:scale-105",
              tier.highlighted && "border-2 border-primary"
            )}
          >
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
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">
                    {billingCycle === "monthly"
                      ? tier.price.monthly
                      : tier.price.yearly}
                    €
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    /{billingCycle === "monthly" ? "mes" : "año"}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {Math.round(
                      ((tier.price.monthly * 12 - tier.price.yearly) /
                        (tier.price.monthly * 12)) *
                        100
                    )}
                    % de descuento
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mt-8 space-y-4">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
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
                  </li>
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
          </div>
        ))}
      </div>
    </div>
  )
} 