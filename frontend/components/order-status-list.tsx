"use client"

import GlovoOrderStatus from "./glovo-order-status"
import type { OrderStatus } from "@/types/order-status"

interface Order {
  id: string
  status: OrderStatus
  estimatedTime?: string
  courierName?: string
  restaurantName: string
  items: string[]
}

interface OrderStatusListProps {
  orders: Order[]
  className?: string
}

export default function OrderStatusList({ orders, className = "" }: OrderStatusListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {orders.map((order) => (
        <div key={order.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{order.restaurantName}</h3>
            <span className="text-sm text-muted-foreground">{order.items.join(", ")}</span>
          </div>
          <GlovoOrderStatus
            status={order.status}
            orderId={order.id}
            estimatedTime={order.estimatedTime}
            courierName={order.courierName}
            showProgress={true}
          />
        </div>
      ))}
    </div>
  )
}
