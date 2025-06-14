"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { CartItemProps } from "@/types/shopping-cart"

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  isLoading = false,
  className = "",
}: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return
    if (item.product.maxQuantity && newQuantity > item.product.maxQuantity) return

    setQuantity(newQuantity)
    onUpdateQuantity(newQuantity)
  }

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1
    handleQuantityChange(value)
  }

  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Imagen del producto */}
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={item.product.imageUrl || "/placeholder.svg"}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
            {!item.product.isAvailable && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="destructive" className="text-xs">
                  No disponible
                </Badge>
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base truncate">{item.product.name}</h3>
                {item.product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.product.description}</p>
                )}
                {item.product.bakeryName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium">Panadería:</span> {item.product.bakeryName}
                  </p>
                )}
                {item.product.category && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {item.product.category}
                  </Badge>
                )}
              </div>

              {/* Botón de favoritos y eliminar */}
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsFavorite(!isFavorite)}
                  disabled={isLoading}
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  <span className="sr-only">Añadir a favoritos</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={onRemove}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar del carrito</span>
                </Button>
              </div>
            </div>

            {/* Precio y controles de cantidad */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary">{formatCurrency(item.product.price)}</span>
                <span className="text-sm text-muted-foreground">por unidad</span>
              </div>

              {/* Controles de cantidad */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isLoading || !item.product.isAvailable}
                >
                  <Minus className="h-3 w-3" />
                  <span className="sr-only">Disminuir cantidad</span>
                </Button>

                <Input
                  type="number"
                  min="1"
                  max={item.product.maxQuantity || 99}
                  value={quantity}
                  onChange={handleQuantityInputChange}
                  className="w-16 h-8 text-center"
                  disabled={isLoading || !item.product.isAvailable}
                />

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={
                    (item.product.maxQuantity && quantity >= item.product.maxQuantity) ||
                    isLoading ||
                    !item.product.isAvailable
                  }
                >
                  <Plus className="h-3 w-3" />
                  <span className="sr-only">Aumentar cantidad</span>
                </Button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t">
              <span className="text-sm text-muted-foreground">Subtotal:</span>
              <span className="font-semibold text-lg">{formatCurrency(item.subtotal)}</span>
            </div>

            {/* Notas adicionales */}
            {item.notes && (
              <div className="mt-2 p-2 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Nota:</span> {item.notes}
                </p>
              </div>
            )}

            {/* Información adicional */}
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>Añadido: {item.addedAt.toLocaleDateString()}</span>
              {item.product.maxQuantity && <span>Máximo: {item.product.maxQuantity} unidades</span>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
