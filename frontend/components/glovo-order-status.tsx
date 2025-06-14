"use client"

import { Clock, CheckCircle, Package, Truck, MapPin, XCircle, User, Timer } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { GlovoOrderStatusProps, OrderStatus, OrderStatusConfig, OrderTimelineStep } from "@/types/order-status"

const statusConfig: Record<OrderStatus, OrderStatusConfig> = {
  pending: {
    label: "Pendiente",
    description: "Tu pedido está siendo procesado",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    icon: Clock,
    progress: 10,
  },
  confirmed: {
    label: "Confirmado",
    description: "El restaurante ha confirmado tu pedido",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: CheckCircle,
    progress: 25,
  },
  preparing: {
    label: "Preparando",
    description: "Tu comida se está preparando",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    icon: Package,
    progress: 50,
  },
  ready: {
    label: "Listo",
    description: "Tu pedido está listo para recoger",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    icon: CheckCircle,
    progress: 70,
  },
  picked_up: {
    label: "Recogido",
    description: "El repartidor ha recogido tu pedido",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    icon: User,
    progress: 80,
  },
  on_the_way: {
    label: "En camino",
    description: "Tu pedido está en camino",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    icon: Truck,
    progress: 90,
  },
  delivered: {
    label: "Entregado",
    description: "¡Tu pedido ha sido entregado!",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: MapPin,
    progress: 100,
  },
  cancelled: {
    label: "Cancelado",
    description: "Tu pedido ha sido cancelado",
    color: "text-red-600",
    bgColor: "bg-red-100",
    icon: XCircle,
    progress: 0,
  },
}

const sizeConfig = {
  sm: {
    icon: "h-4 w-4",
    text: "text-sm",
    badge: "text-xs",
    card: "p-3",
  },
  md: {
    icon: "h-5 w-5",
    text: "text-base",
    badge: "text-sm",
    card: "p-4",
  },
  lg: {
    icon: "h-6 w-6",
    text: "text-lg",
    badge: "text-base",
    card: "p-6",
  },
}

export default function GlovoOrderStatus({
  status,
  orderId,
  estimatedTime,
  courierName,
  className = "",
  showProgress = true,
  showTimeline = false,
  size = "md",
}: GlovoOrderStatusProps) {
  const config = statusConfig[status]
  const sizeClasses = sizeConfig[size]
  const IconComponent = config.icon

  const getTimelineSteps = (): OrderTimelineStep[] => {
    const allSteps: OrderStatus[] = ["confirmed", "preparing", "ready", "picked_up", "on_the_way", "delivered"]
    const currentIndex = allSteps.indexOf(status)

    return allSteps.map((stepStatus, index) => ({
      status: stepStatus,
      label: statusConfig[stepStatus].label,
      completed: status === "delivered" ? true : index < currentIndex,
      active: index === currentIndex,
    }))
  }

  const StatusBadge = () => (
    <Badge className={`${config.bgColor} ${config.color} border-0 ${sizeClasses.badge}`}>
      <IconComponent className={`${sizeClasses.icon} mr-1`} />
      {config.label}
    </Badge>
  )

  const StatusIndicator = () => (
    <div className={`flex items-center gap-3 ${sizeClasses.card}`}>
      <div className={`p-2 rounded-full ${config.bgColor}`}>
        <IconComponent className={`${sizeClasses.icon} ${config.color}`} />
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold ${sizeClasses.text}`}>{config.label}</h3>
        <p className={`text-muted-foreground ${size === "sm" ? "text-xs" : "text-sm"}`}>{config.description}</p>
        {estimatedTime && status !== "delivered" && status !== "cancelled" && (
          <div className="flex items-center gap-1 mt-1">
            <Timer className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{estimatedTime}</span>
          </div>
        )}
      </div>
    </div>
  )

  const Timeline = () => (
    <div className="space-y-4">
      {getTimelineSteps().map((step, index) => (
        <div key={step.status} className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                step.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : step.active
                    ? `${statusConfig[step.status].bgColor} ${statusConfig[step.status].color} border-current`
                    : "bg-gray-100 border-gray-300 text-gray-400"
              }`}
            >
              {step.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                (() => {
                  const StepIcon = statusConfig[step.status].icon
                  return <StepIcon className="h-4 w-4" />
                })()
              )}
            </div>
            {index < getTimelineSteps().length - 1 && (
              <div
                className={`absolute top-8 left-1/2 w-0.5 h-6 -translate-x-1/2 ${
                  step.completed ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-medium ${step.active ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
            {step.time && <p className="text-xs text-muted-foreground">{step.time}</p>}
          </div>
        </div>
      ))}
    </div>
  )

  if (showTimeline) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Estado del pedido</CardTitle>
            <StatusBadge />
          </div>
          {orderId && <p className="text-sm text-muted-foreground">Pedido #{orderId}</p>}
        </CardHeader>
        <CardContent>
          <Timeline />
          {courierName && (status === "picked_up" || status === "on_the_way") && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Repartidor: {courierName}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <StatusIndicator />
        {showProgress && status !== "cancelled" && (
          <div className="px-4 pb-4">
            <Progress value={config.progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Pedido realizado</span>
              <span>Entregado</span>
            </div>
          </div>
        )}
        {courierName && (status === "picked_up" || status === "on_the_way") && (
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Repartidor: {courierName}</span>
            </div>
          </div>
        )}
        {orderId && (
          <div className="px-4 pb-4">
            <p className="text-xs text-muted-foreground">Pedido #{orderId}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
