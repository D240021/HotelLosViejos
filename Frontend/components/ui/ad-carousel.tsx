"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Advertisement } from "@/types/Publicidad"
import { usePublicidad } from "@/hooks/use-publicity"
import { Spinner } from "@/components/ui/spinner"

interface AdCarouselProps {
  ads?: Advertisement[]
  autoplayInterval?: number
}

export function AdCarousel({ ads, autoplayInterval = 4000 }: AdCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const { publicidades } = usePublicidad()

  const advertisements = ads ?? publicidades

  const isLoading = advertisements.length === 0

  useEffect(() => {
    if (isHovering || isLoading) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [isHovering, advertisements.length, autoplayInterval, isLoading])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + advertisements.length) % advertisements.length)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <Spinner size={32} />
      </div>
    )
  }

  return (
    <div
      className="relative w-full h-[300px]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute inset-0 overflow-hidden">
        {advertisements.map((ad, index) => (
          <div
            key={ad.id}
            className={cn(
              "absolute inset-0 transition-all duration-500 ease-in-out",
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
          >
            <div className="relative w-full h-full">
              <Link
                href={ad.enlace || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <Image
                  src={ad.imagen || "/placeholder.svg?height=300&width=400"}
                  alt={ad.nombre}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h4 className="font-bold text-lg">{ad.titulo}</h4>
                  <p className="text-sm">{ad.descripcion}</p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-center gap-1 p-2">
        {advertisements.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-white w-4" : "bg-white/50",
            )}
            aria-label={`Ir a la diapositiva ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
