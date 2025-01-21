"use client"

import * as React from "react"
import Image, { ImageProps } from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PremiumImageProps extends Omit<ImageProps, "alt"> {
  alt: string
  aspectRatio?: "square" | "video" | "portrait" | "wide"
  width?: number
  height?: number
  loading?: boolean
  hoverEffect?: boolean
  hoverScale?: boolean
  hoverRotate?: boolean
  className?: string
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[2/1]",
}

export function PremiumImage({
  alt,
  aspectRatio = "square",
  width,
  height,
  className,
  loading = false,
  hoverEffect = true,
  hoverScale = true,
  hoverRotate = false,
  ...props
}: PremiumImageProps) {
  const [isLoading, setIsLoading] = React.useState(true)

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {loading || isLoading ? (
        <Skeleton
          className={cn(
            "h-full w-full",
            aspectRatioClasses[aspectRatio]
          )}
        />
      ) : null}
      <Image
        {...props}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "h-full w-full object-cover transition-all",
          isLoading ? "scale-110 blur-lg" : "scale-100 blur-0",
          hoverEffect && "hover:scale-105 transition-transform duration-300"
        )}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  )
} 