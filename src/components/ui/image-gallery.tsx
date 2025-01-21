"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PremiumImage } from "@/components/ui/premium-image"

interface ImageGalleryProps {
  images: {
    src: string
    alt: string
  }[]
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const showPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className={cn("relative", className)}>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-4 aspect-[3/2] lg:col-span-3">
            <PremiumImage
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              aspectRatio="wide"
              className="cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            />
          </div>
          <div className="col-span-4 grid grid-cols-4 gap-4 lg:col-span-1 lg:flex lg:flex-col">
            {images.slice(0, 3).map((image, index) => (
              <div key={index} className="relative aspect-square">
                <PremiumImage
                  src={image.src}
                  alt={image.alt}
                  className="cursor-pointer"
                  onClick={() => setCurrentIndex(index)}
                />
              </div>
            ))}
            {images.length > 3 && (
              <div className="relative aspect-square">
                <PremiumImage
                  src={images[3].src}
                  alt={images[3].alt}
                  className="cursor-pointer"
                  onClick={() => setCurrentIndex(3)}
                />
                {images.length > 4 && (
                  <div
                    className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-white"
                    onClick={() => setIsFullscreen(true)}
                  >
                    +{images.length - 4}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full"
            onClick={() => setIsFullscreen(false)}
            aria-label="Cerrar pantalla completa"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="relative aspect-[3/2] w-full max-w-7xl">
            <div className="absolute inset-0">
              <PremiumImage
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                hoverEffect={false}
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-between p-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={showPrevious}
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={showNext}
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 