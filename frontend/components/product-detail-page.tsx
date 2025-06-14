"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Minus, Plus, Heart, Share2, Star, ShoppingCart, CreditCard } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductImageGallery from "./product-image-gallery"
import type { ProductDetailPageProps } from "@/types/product-detail"

export default function ProductDetailPage({
  showBreadcrumbs = true,
  breadcrumbs = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
  ],
  product,
  onAddToCart,
  onBuyNow,
  isLoading = false,
}: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const hasDiscount = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= (product.stockQuantity || 99)) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity)
  }

  const handleBuyNow = () => {
    onBuyNow(product.id, quantity)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center">
                {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
                <Link href={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              </li>
            ))}
            <ChevronRight className="h-4 w-4 mx-2" />
            <li className="text-foreground font-medium">{product.name}</li>
          </ol>
        </nav>
      )}

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de imágenes */}
        <div>
          <ProductImageGallery images={product.images} productName={product.name} />
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.category}</Badge>
              {!product.inStock && <Badge variant="destructive">Agotado</Badge>}
            </div>

            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reseñas)
                </span>
              </div>
            )}

            {/* Precio */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice!.toFixed(2)}
                  </span>
                  <Badge className="bg-red-500 hover:bg-red-600">-{discountPercentage}%</Badge>
                </>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <Separator />

          {/* Selector de cantidad */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Cantidad:</span>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="h-10 w-10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stockQuantity || 99)}
                  className="h-10 w-10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.stockQuantity && (
                <span className="text-sm text-muted-foreground">{product.stockQuantity} disponibles</span>
              )}
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <Button onClick={handleBuyNow} disabled={!product.inStock || isLoading} className="w-full" size="lg">
                <CreditCard className="h-4 w-4 mr-2" />
                {isLoading ? "Procesando..." : "Comprar ahora"}
              </Button>

              <Button
                variant="outline"
                onClick={handleAddToCart}
                disabled={!product.inStock || isLoading}
                className="w-full"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Añadir al carrito
              </Button>
            </div>

            {/* Acciones secundarias */}
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)} className="flex-1">
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={handleShare} className="flex-1">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-12">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
            <TabsTrigger value="nutrition">Información nutricional</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detalles del producto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.weight && (
                  <div>
                    <span className="font-medium">Peso:</span> {product.weight}
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <span className="font-medium">Dimensiones:</span> {product.dimensions}
                  </div>
                )}
                <div>
                  <span className="font-medium">Categoría:</span> {product.category}
                </div>
                <div>
                  <span className="font-medium">Disponibilidad:</span> {product.inStock ? "En stock" : "Agotado"}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ingredients" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ingredientes</h3>
              {product.ingredients ? (
                <ul className="list-disc list-inside space-y-1">
                  {product.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No hay información de ingredientes disponible.</p>
              )}

              {product.allergens && product.allergens.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Alérgenos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map((allergen, index) => (
                      <Badge key={index} variant="outline">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Información nutricional</h3>
              {product.nutritionalInfo ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{product.nutritionalInfo.calories}</div>
                    <div className="text-sm text-muted-foreground">Calorías</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{product.nutritionalInfo.protein}g</div>
                    <div className="text-sm text-muted-foreground">Proteína</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{product.nutritionalInfo.carbs}g</div>
                    <div className="text-sm text-muted-foreground">Carbohidratos</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{product.nutritionalInfo.fat}g</div>
                    <div className="text-sm text-muted-foreground">Grasas</div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No hay información nutricional disponible.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
