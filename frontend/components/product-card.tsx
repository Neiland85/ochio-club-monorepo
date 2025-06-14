"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Lock, Star } from "lucide-react"
import Image from "next/image"
import type { ProductCardProps } from "@/types/product-card"

export default function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
  isLoggedIn = false,
  showRating = true,
  className = "",
}: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      onAddToCart?.(product.id)
      return
    }

    setIsLoading(true)
    try {
      await onAddToCart?.(product.id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleFavorite = () => {
    onToggleFavorite?.(product.id)
  }

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded-t-lg"
          />

          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
              <Badge variant="secondary" className="bg-red-500 text-white">
                No disponible
              </Badge>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </Button>

          <Badge className="absolute top-2 left-2 bg-blue-500">{product.category}</Badge>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <span className="text-lg font-bold text-green-600">€{product.price.toFixed(2)}</span>
          </div>

          {showRating && (
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-1">(4.0)</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>

          <div className="text-xs text-muted-foreground">
            <p className="font-medium">{product.bakeryName}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={!product.isAvailable || isLoading}
          className="w-full"
          variant={isLoggedIn ? "default" : "outline"}
        >
          {isLoading ? (
            "Añadiendo..."
          ) : !product.isAvailable ? (
            "No disponible"
          ) : !isLoggedIn ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Inicia sesión para pedir
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Añadir al carrito
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
