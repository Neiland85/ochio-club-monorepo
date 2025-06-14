"use client"

import { useState } from "react"
import { ArrowLeft, Trash2, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CartItem from "./cart/cart-item"
import CartSummary from "./cart/cart-summary"
import PromoCode from "./cart/promo-code"
import DeliveryOptions from "./cart/delivery-options"
import type { ShoppingCartProps, DeliveryOption } from "@/types/shopping-cart"

export default function ShoppingCartComponent({
  items = [],
  summary,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onContinueShopping,
  isLoading = false,
  isCheckoutDisabled = false,
  className = "",
  showDeliveryOptions = true,
  showPromoCode = true,
}: ShoppingCartProps) {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("pickup")
  const [appliedPromoCode, setAppliedPromoCode] = useState<string>("")
  const [promoDiscount, setPromoDiscount] = useState(0)

  const handleApplyPromoCode = (code: string) => {
    // Simular validación de código promocional
    const promoCodes: Record<string, number> = {
      OCHÍO10: 2.5,
      PRIMERA: 5.0,
      ESTUDIANTE: 1.5,
    }

    if (promoCodes[code]) {
      setAppliedPromoCode(code)
      setPromoDiscount(promoCodes[code])
    } else {
      setAppliedPromoCode("")
      setPromoDiscount(0)
    }
  }

  const isEmpty = items.length === 0

  if (isEmpty) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ArrowLeft className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground text-center mb-6">
              Añade algunos deliciosos ochíos a tu carrito para comenzar
            </p>
            <Button onClick={onContinueShopping} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Encabezado */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <ArrowLeft className="h-6 w-6" />
                    Carrito de Compras
                  </CardTitle>
                  <CardDescription>
                    {summary.itemCount} {summary.itemCount === 1 ? "producto" : "productos"} en tu carrito
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onContinueShopping}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Seguir Comprando
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={isLoading}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Productos no disponibles */}
          {items.some((item) => !item.product.isAvailable) && (
            <Alert>
              <AlertDescription>
                Algunos productos en tu carrito ya no están disponibles. Puedes eliminarlos o continuar con los
                productos disponibles.
              </AlertDescription>
            </Alert>
          )}

          {/* Lista de items */}
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
                onRemove={() => onRemoveItem(item.id)}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* Opciones de entrega */}
          {showDeliveryOptions && (
            <DeliveryOptions
              selectedOption={deliveryOption}
              onOptionChange={setDeliveryOption}
              deliveryFee={summary.deliveryFee}
            />
          )}

          {/* Código promocional */}
          {showPromoCode && (
            <PromoCode
              onApplyPromoCode={handleApplyPromoCode}
              appliedCode={appliedPromoCode}
              discount={promoDiscount}
              isLoading={isLoading}
            />
          )}
        </div>

        {/* Resumen y checkout */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <CartSummary
              summary={summary}
              onProceedToCheckout={onProceedToCheckout}
              isCheckoutDisabled={isCheckoutDisabled}
              isLoading={isLoading}
            />
          </div>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Información de Compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>Productos artesanales hechos con amor</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 text-green-500" />
                <span>Ingredientes frescos y locales</span>
              </div>
              <Separator />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>• Devoluciones gratuitas en 24h</p>
                <p>• Soporte al cliente 24/7</p>
                <p>• Garantía de frescura</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Interfaces
interface CartItem {
  id: string
  product: {
    id: string
    name: string
    price: number
    imageUrl?: string
    maxQuantity?: number
    isAvailable: boolean
  }
  quantity: number
  subtotal: number
  notes?: string
}

interface CartSummary {
  subtotal: number
  tax: number
  taxRate: number
  deliveryFee: number
  discount: number
  total: number
  itemCount: number
  currency: string
}

interface ShoppingCartProps {
  items: CartItem[]
  summary: CartSummary
  isLoading?: boolean
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
}

export function ShoppingCart({ 
  items, 
  summary, 
  isLoading = false,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: ShoppingCartProps) {
  return (
    <div className="shopping-cart">
      <div className="cart-items">
        <h2 className="text-xl font-bold mb-4">Tu carrito ({summary.itemCount} productos)</h2>
        {items.length === 0 ? (
          <p className="text-gray-500">Tu carrito está vacío</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="border p-4 rounded">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {summary.currency}{item.product.price} x {item.quantity} = {summary.currency}{item.subtotal}
                    </p>
                    {item.notes && <p className="text-sm italic">Nota: {item.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={isLoading || item.quantity <= 1}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading || (item.product.maxQuantity !== undefined && item.quantity >= item.product.maxQuantity)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      disabled={isLoading}
                      className="ml-4 text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="cart-summary mt-6 border-t pt-4">
        <h3 className="font-bold">Resumen del pedido</h3>
        <div className="space-y-2 my-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{summary.currency}{summary.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>IVA ({summary.taxRate * 100}%)</span>
            <span>{summary.currency}{summary.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Gastos de envío</span>
            <span>{summary.currency}{summary.deliveryFee.toFixed(2)}</span>
          </div>
          {summary.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento</span>
              <span>-{summary.currency}{summary.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total</span>
            <span>{summary.currency}{summary.total.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          onClick={onCheckout}
          disabled={isLoading || items.length === 0}
          className="w-full py-2 bg-blue-600 text-white rounded font-medium disabled:bg-blue-300"
        >
          {isLoading ? "Procesando..." : "Finalizar compra"}
        </button>
      </div>
    </div>
  )