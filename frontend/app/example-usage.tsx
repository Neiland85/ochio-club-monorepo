"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import GlovoOrderStatus from "@/components/glovo-order-status"
import OrderStatusList from "@/components/order-status-list"
import type { OrderStatus } from "@/types/order-status"
import PaymentForm from "@/components/payment-form"
import type { PaymentFormValues } from "@/types/payment-form"
import { toast } from "@/hooks/use-toast"

export default function PaymentFormExample() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>("confirmed")
  const [showTimeline, setShowTimeline] = useState(false)

  const allStatuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "picked_up",
    "on_the_way",
    "delivered",
    "cancelled",
  ]

  const sampleOrders = [
    {
      id: "GLV-001",
      status: "on_the_way" as OrderStatus,
      estimatedTime: "15-20 min",
      courierName: "Carlos M.",
      restaurantName: "Horno Tradicional San Isidro",
      items: ["Ochío de Chocolate", "Ochío de Canela"],
    },
    {
      id: "GLV-002",
      status: "preparing" as OrderStatus,
      estimatedTime: "25-30 min",
      restaurantName: "Panadería La Ubetense",
      items: ["Ochío de Almendra", "Ochío Tradicional"],
    },
    {
      id: "GLV-003",
      status: "delivered" as OrderStatus,
      restaurantName: "Obrador Artesanal El Portillo",
      items: ["Ochío Relleno de Crema"],
    },
  ]

  const handlePaymentSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true)

    try {
      // Simular procesamiento de pago
      console.log("Procesando pago con datos:", {
        ...data,
        // Ocultar número completo de tarjeta en logs por seguridad
        cardNumber: `**** **** **** ${data.cardNumber.slice(-4)}`,
        cvc: "***",
      })

      // Simular llamada a API de pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mostrar confirmación
      toast({
        title: "¡Pago realizado con éxito!",
        description: "Su pedido de ochíos ha sido procesado correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error en el pago",
        description: "No se pudo procesar el pago. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Estado de Pedidos Ochío Club</h1>
        <p className="text-muted-foreground">
          Componente para seguir el estado de tus pedidos de ochíos en tiempo real
        </p>
      </div>

      {/* Ejemplo interactivo */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo Interactivo</CardTitle>
          <CardDescription>Cambia el estado del pedido para ver diferentes visualizaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controles */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Estado del pedido:</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "pending", label: "Pendiente" },
                  { value: "confirmed", label: "Confirmado" },
                  { value: "preparing", label: "Preparando" },
                  { value: "ready", label: "Listo" },
                  { value: "picked_up", label: "Recogido" },
                  { value: "on_the_way", label: "En camino" },
                  { value: "delivered", label: "Entregado" },
                  { value: "cancelled", label: "Cancelado" },
                ].map((statusOption) => (
                  <Button
                    key={statusOption.value}
                    variant={currentStatus === statusOption.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentStatus(statusOption.value as OrderStatus)}
                  >
                    {statusOption.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant={showTimeline ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTimeline(!showTimeline)}
              >
                {showTimeline ? "Vista Simple" : "Vista Timeline"}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Componente de estado */}
          <GlovoOrderStatus
            status={currentStatus}
            orderId="OCH-12345"
            estimatedTime={currentStatus !== "delivered" && currentStatus !== "cancelled" ? "15-20 min" : undefined}
            courierName={currentStatus === "picked_up" || currentStatus === "on_the_way" ? "María García" : undefined}
            showProgress={!showTimeline}
            showTimeline={showTimeline}
          />
        </CardContent>
      </Card>

      {/* Diferentes tamaños */}
      <Card>
        <CardHeader>
          <CardTitle>Diferentes Tamaños</CardTitle>
          <CardDescription>El componente se adapta a diferentes tamaños</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Pequeño</h4>
            <GlovoOrderStatus status="preparing" size="sm" orderId="OCH-001" />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Mediano (por defecto)</h4>
            <GlovoOrderStatus status="on_the_way" size="md" orderId="OCH-002" courierName="Juan P." />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Grande</h4>
            <GlovoOrderStatus status="delivered" size="lg" orderId="OCH-003" />
          </div>
        </CardContent>
      </Card>

      {/* Lista de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>Ejemplo de múltiples pedidos con diferentes estados</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderStatusList orders={sampleOrders} />
        </CardContent>
      </Card>

      {/* Todos los estados */}
      <Card>
        <CardHeader>
          <CardTitle>Todos los Estados</CardTitle>
          <CardDescription>Visualización de todos los estados posibles</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allStatuses.map((status) => (
            <GlovoOrderStatus
              key={status}
              status={status}
              orderId={`OCH-${status.toUpperCase()}`}
              estimatedTime={status !== "delivered" && status !== "cancelled" ? "15-20 min" : undefined}
              courierName={status === "picked_up" || status === "on_the_way" ? "Repartidor Demo" : undefined}
              size="sm"
            />
          ))}
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Pago</CardTitle>
          <CardDescription>Componente para realizar pagos de tus ochíos favoritos</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentForm onSubmit={handlePaymentSubmit} amount={12.5} currency="EUR" isSubmitting={isSubmitting} />
        </CardContent>
      </Card>
    </div>
  )
}
