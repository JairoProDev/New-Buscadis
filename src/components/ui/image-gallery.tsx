import * as React from "react"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

  const showPrevious = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const showNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const toggleFullscreen = React.useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        showPrevious()
      } else if (e.key === "ArrowRight") {
        showNext()
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showPrevious, showNext, isFullscreen])

  return (
    <>
      <div className={cn("relative overflow-hidden rounded-xl", className)}>
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <PremiumImage
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                fill
                className="object-cover"
                hoverEffect={false}
              />
            </motion.div>
          </AnimatePresence>
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

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={toggleFullscreen}
          aria-label="Ver en pantalla completa"
        >
          <Expand className="h-4 w-4" />
        </Button>

        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-background/80 backdrop-blur-sm transition-all",
                currentIndex === index && "w-4 bg-primary"
              )}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ver imagen ${index + 1} de ${images.length}`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg"
          >
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <PremiumImage
                    src={images[currentIndex].src}
                    alt={images[currentIndex].alt}
                    fill
                    className="object-contain"
                    hoverEffect={false}
                  />
                </motion.div>
              </AnimatePresence>

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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 