"use client"

import { CreditCard, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartSummaryProps } from "@/types/shopping-cart"

export default function CartSummary({
  summary,
  onProceedToCheckout,
  isCheckoutDisabled = false,
  isLoading = false,
  className = "",
}: CartSummaryProps) {
  const formatCurrency = (amount: number) => `${amount.toFixed(2)}${summary.currency}`

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Resumen del Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Desglose de precios */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({summary.itemCount} productos)</span>
            <span>{formatCurrency(summary.subtotal)}</span>
          </div>

          {summary.deliveryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span>Gastos de envío</span>
              <span>{formatCurrency(summary.deliveryFee)}</span>
            </div>
          )}

          {summary.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Descuento aplicado</span>
              <span>-{formatCurrency(summary.discount)}</span>
            </div>
          )}

          {summary.tax > 0 && (
            <div className="flex justify-between text-sm">
              <span>IVA ({(summary.taxRate * 100).toFixed(0)}%)</span>
              <span>{formatCurrency(summary.tax)}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-xl font-bold text-primary">{formatCurrency(summary.total)}</span>
        </div>

        {/* Información adicional */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>• Los precios incluyen todos los impuestos</p>
          <p>• Tiempo estimado de preparación: 15-30 min</p>
          {summary.deliveryFee === 0 && <p>• Envío gratuito en pedidos superiores a 20€</p>}
        </div>

        {/* Botón de checkout */}
        <Button
          onClick={onProceedToCheckout}
          disabled={isCheckoutDisabled || isLoading || summary.itemCount === 0}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              Procesando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              Proceder al Pago
            </>
          )}
        </Button>

        {/* Métodos de pago aceptados */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">Métodos de pago aceptados:</p>
          <div className="flex justify-center gap-2">
            {["VISA", "MASTERCARD", "PayPal"].map((method) => (
              <div key={method} className="px-2 py-1 bg-muted rounded text-xs font-medium">
                {method}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
