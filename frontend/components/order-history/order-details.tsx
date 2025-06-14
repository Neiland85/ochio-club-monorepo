"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import { X, RefreshCw, MapPin, ArrowLeft, Printer, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import GlovoOrderStatus from "@/components/glovo-order-status"
import type { OrderDetailsProps } from "@/types/order-history"

const statusConfig = {
  pending: { label: "Pendiente", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  confirmed: { label: "Confirmado", className: "bg-blue-100 text-blue-800 border-blue-200" },
  preparing: { label: "Preparando", className: "bg-orange-100 text-orange-800 border-orange-200" },
  ready: { label: "Listo", className: "bg-purple-100 text-purple-800 border-purple-200" },
  picked_up: { label: "Recogido", className: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  on_the_way: { label: "En camino", className: "bg-blue-100 text-blue-800 border-blue-200" },
  delivered: { label: "Entregado", className: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-200" },
}

export default function OrderDetails({
  order,
  isLoading = false,
  onClose,
  onReorder,
  onCancelOrder,
  onTrackOrder,
  className = "",
}: OrderDetailsProps) {
  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`

  const getDeliveryOptionLabel = (option: string) => {
    switch (option) {
      case "pickup":
        return "Recoger en tienda"
      case "delivery":
        return "Entrega a domicilio"
      case "express":
        return "Entrega express"
      default:
        return option
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    // En una implementación real, esto descargaría un PDF o generaría una factura
    console.log("Downloading invoice for order:", order.id)
  }

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className={`sm:max-w-[600px] ${className}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalles del Pedido #{order.id}</span>
            <Badge variant="outline" className={statusConfig[order.status].className}>
              {statusConfig[order.status].label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Realizado el {format(order.date, "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estado del pedido */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Estado del pedido</h4>
            <GlovoOrderStatus
              status={order.status}
              orderId={order.id}
              estimatedTime={
                ["pending", "confirmed", "preparing", "ready", "on_the_way"].includes(order.status)
                  ? "15-30 min"
                  : undefined
              }
              showProgress={true}
              size="sm"
            />
          </div>

          {/* Información del pedido */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Información del pedido</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div>
                  <span className="text-muted-foreground">Panadería:</span> {order.bakeryName}
                </div>
                <div>
                  <span className="text-muted-foreground">Método de entrega:</span>{" "}
                  {getDeliveryOptionLabel(order.deliveryOption)}
                </div>
                <div>
                  <span className="text-muted-foreground">Método de pago:</span> {order.paymentMethod}
                </div>
              </div>
              <div className="space-y-1">
                {order.deliveryAddress && (
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span>{order.deliveryAddress}</span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div>
                    <span className="text-muted-foreground">Entrega estimada:</span>{" "}
                    {format(order.estimatedDelivery, "d 'de' MMMM, HH:mm", { locale: es })}
                  </div>
                )}
                {order.trackingCode && (
                  <div>
                    <span className="text-muted-foreground">Código de seguimiento:</span> {order.trackingCode}
                  </div>
                )}
              </div>
            </div>
            {order.notes && (
              <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                <span className="text-muted-foreground">Notas:</span> {order.notes}
              </div>
            )}
          </div>

          <Separator />

          {/* Productos */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Productos</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} x {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="text-right font-medium">{formatCurrency(item.quantity * item.price)}</div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Resumen de precios */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Resumen</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(order.total * 0.9)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IVA (10%):</span>
                <span>{formatCurrency(order.total * 0.1)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-0">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Descargar factura
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            {onReorder && (
              <Button variant="outline" size="sm" onClick={onReorder}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Repetir pedido
              </Button>
            )}
            {onTrackOrder && (
              <Button variant="outline" size="sm" onClick={() => onTrackOrder(order.trackingCode)}>
                <MapPin className="h-4 w-4 mr-2" />
                Seguir pedido
              </Button>
            )}
            {onCancelOrder && ["pending", "confirmed"].includes(order.status) && (
              <Button variant="outline" size="sm" onClick={onCancelOrder} className="text-red-600">
                <X className="h-4 w-4 mr-2" />
                Cancelar pedido
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
