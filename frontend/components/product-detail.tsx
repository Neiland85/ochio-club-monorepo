'use client';

import { useState } from 'react';
import {
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  Heart,
  Share2,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProductImageGallery from './product-image-gallery';
import type { ProductDetailProps } from '@/types/product-detail';

export default function ProductDetail({
  product,
  onBuyNow,
  onAddToCart,
  isLoading = false,
  className = '',
}: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyNow = () => {
    onBuyNow(product.id, quantity);
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copiar URL al portapapeles
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Aquí podrías mostrar un toast de confirmación
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  // Preparar imágenes para la galería
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.imageUrl
        ? [product.imageUrl]
        : ['/placeholder.svg'];

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de imágenes */}
        <ProductImageGallery
          images={productImages}
          productName={product.name}
          discount={hasDiscount ? discountPercentage : undefined}
          inStock={product.inStock}
        />

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            {product.category && (
              <Badge variant="secondary" className="text-sm">
                {product.category}
              </Badge>
            )}

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount || 0} reseñas)
                </span>
              </div>
            )}

            {/* Precio */}
            <div className="flex items-center gap-3">
              <span className="text-3xl lg:text-4xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.originalPrice!.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
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
                  disabled={quantity <= 1 || !product.inStock}
                  className="h-10 w-10 rounded-r-none"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="px-4 py-2 min-w-[3rem] text-center border-x">
                  {quantity}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 99 || !product.inStock}
                  className="h-10 w-10 rounded-l-none"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                disabled={!product.inStock || isLoading}
                className="w-full"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isLoading ? 'Procesando...' : 'Comprar ahora'}
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex-1"
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="flex-1"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Información adicional */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Producto:</span>
                  <span className="font-medium">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Precio unitario:
                  </span>
                  <span className="font-medium">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cantidad:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary">
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado de stock */}
          <div className="text-center">
            {product.inStock ? (
              <p className="text-sm text-green-600 font-medium">
                ✓ En stock - Envío inmediato
              </p>
            ) : (
              <p className="text-sm text-red-600 font-medium">
                ✗ Producto agotado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
