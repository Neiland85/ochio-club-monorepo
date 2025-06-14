"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  discount?: number
  inStock?: boolean
}

export default function ProductImageGallery({
  images,
  productName,
  discount,
  inStock = true,
}: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Asegurarse de que siempre haya al menos una imagen
  const imageList = images && images.length > 0 ? images : ["/placeholder.svg"]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={imageList[currentImageIndex] || "/placeholder.svg"}
          alt={`${productName} - Imagen ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Descuento */}
        {discount && discount > 0 && (
          <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600">-{discount}%</Badge>
        )}

        {/* Agotado */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg px-4 py-2">
              Agotado
            </Badge>
          </div>
        )}

        {/* Controles de navegación (solo si hay más de una imagen) */}
        {imageList.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={prevImage}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={nextImage}
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Indicador de imagen actual */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {imageList.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas (solo si hay más de una imagen) */}
      {imageList.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                index === currentImageIndex ? "border-primary" : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${productName} - Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
