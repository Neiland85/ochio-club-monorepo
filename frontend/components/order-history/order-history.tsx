"use client"

import { useState } from "react"
import { Search, Filter, Calendar, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import OrderHistoryItem from "./order-history-item"
import type { OrderHistoryProps, OrderFilterOptions } from "@/types/order-history"
import type { OrderStatus } from "@/types/order-status"

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

export default function OrderHistory({
  orders,
  isLoading = false,
  onViewOrderDetails,
  onReorder,
  onCancelOrder,
  onTrackOrder,
  className = "",
}: OrderHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOptions, setFilterOptions] = useState<OrderFilterOptions>({
    status: "all",
    sortBy: "date",
    sortOrder: "desc",
  })
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  // Filtrar y ordenar pedidos
  const filteredOrders = orders
    .filter((order) => {
      // Filtrar por término de búsqueda
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.bakeryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

      // Filtrar por estado
      const matchesStatus = filterOptions.status === "all" || order.status === filterOptions.status

      // Filtrar por rango de fechas
      let matchesDateRange = true
      if (filterOptions.dateRange) {
        if (filterOptions.dateRange.from && order.date < filterOptions.dateRange.from) {
          matchesDateRange = false
        }
        if (filterOptions.dateRange.to) {
          const toDate = new Date(filterOptions.dateRange.to)
          toDate.setHours(23, 59, 59, 999) // Final del día
          if (order.date > toDate) {
            matchesDateRange = false
          }
        }
      }

      return matchesSearch && matchesStatus && matchesDateRange
    })
    .sort((a, b) => {
      // Ordenar por el campo seleccionado
      const sortBy = filterOptions.sortBy || "date"
      const sortOrder = filterOptions.sortOrder === "asc" ? 1 : -1

      if (sortBy === "date") {
        return sortOrder * (a.date.getTime() - b.date.getTime())
      } else if (sortBy === "total") {
        return sortOrder * (a.total - b.total)
      } else if (sortBy === "status") {
        return sortOrder * a.status.localeCompare(b.status)
      }
      return 0
    })

  const handleStatusFilterChange = (status: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      status: status as OrderStatus | "all",
    }))
  }

  const handleSortChange = (sortBy: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      sortBy: sortBy as "date" | "status" | "total",
    }))
  }

  const handleSortOrderChange = () => {
    setFilterOptions((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }))
  }

  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Historial de Pedidos</CardTitle>
        <CardDescription>Consulta y gestiona tus pedidos anteriores</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros y búsqueda */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedidos..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterOptions.status} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[130px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {Object.entries(statusConfig).map(([status, config]) => (
                  <SelectItem key={status} value={status}>
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterOptions.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[130px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Fecha</SelectItem>
                <SelectItem value="total">Total</SelectItem>
                <SelectItem value="status">Estado</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleSortOrderChange}
              className="h-10 w-10"
              title={filterOptions.sortOrder === "asc" ? "Orden ascendente" : "Orden descendente"}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Lista de pedidos */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron pedidos</p>
            {searchTerm || filterOptions.status !== "all" ? (
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("")
                  setFilterOptions({ status: "all", sortBy: "date", sortOrder: "desc" })
                }}
              >
                Limpiar filtros
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderHistoryItem
                key={order.id}
                order={order}
                isExpanded={expandedOrder === order.id}
                onToggleExpand={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                onViewDetails={() => onViewOrderDetails(order.id)}
                onReorder={onReorder ? () => onReorder(order.id) : undefined}
                onCancelOrder={
                  onCancelOrder && ["pending", "confirmed"].includes(order.status)
                    ? () => onCancelOrder(order.id)
                    : undefined
                }
                onTrackOrder={
                  onTrackOrder && ["on_the_way", "picked_up"].includes(order.status)
                    ? () => onTrackOrder(order.id, order.trackingCode)
                    : undefined
                }
              />
            ))}
          </div>
        )}

        {/* Resumen */}
        <Separator />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Total de pedidos: {orders.length}</span>
          <span>Pedidos mostrados: {filteredOrders.length}</span>
        </div>
      </CardContent>
    </Card>
  )
}
