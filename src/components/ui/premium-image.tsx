"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface PremiumImageProps {
  src: string
  alt: string
  aspectRatio?: "square" | "video" | "portrait" | "wide"
  width?: number
  height?: number
  fill?: boolean
  className?: string
  onClick?: () => void
  hoverEffect?: boolean
  onLoadingComplete?: () => void
}

const aspectRatioClasses = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[2/1]",
}

export function PremiumImage({
  src,
  alt,
  aspectRatio = "square",
  width,
  height,
  fill,
  className,
  onClick,
  hoverEffect = true,
  onLoadingComplete,
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
      onClick={onClick}
    >
      {isLoading && (
        <Skeleton
          className={cn(
            "h-full w-full",
            aspectRatioClasses[aspectRatio]
          )}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={cn(
          "h-full w-full object-cover transition-all",
          isLoading ? "scale-110 blur-lg" : "scale-100 blur-0",
          hoverEffect && "hover:scale-105 transition-transform duration-300"
        )}
        onLoadingComplete={() => {
          setIsLoading(false)
          onLoadingComplete?.()
        }}
        {...props}
      />
    </div>
  )
} 