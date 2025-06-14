"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Eye, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { DashboardOrder, OrderStatus } from "@/types/bakery-dashboard"

interface OrdersTableProps {
  orders: DashboardOrder[]
  onUpdateStatus: (orderId: string, status: OrderStatus) => void
  onViewDetails: (order: DashboardOrder) => void
  className?: string
}

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

export default function OrdersTable({ orders, onUpdateStatus, onViewDetails, className = "" }: OrdersTableProps) {
  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
        <CardDescription>Últimos pedidos recibidos en tu panadería</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No hay pedidos recientes
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customerName}</div>
                        {order.customerEmail && (
                          <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{order.items.length - 2} más</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[order.status].className}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(order.createdAt, "dd/MM/yyyy", { locale: es })}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(order.createdAt, "HH:mm", { locale: es })}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onViewDetails(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                          {Object.entries(statusConfig).map(([status, config]) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => onUpdateStatus(order.id, status as OrderStatus)}
                              disabled={order.status === status}
                            >
                              {config.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}