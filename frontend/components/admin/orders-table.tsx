"use client"

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Filter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Pagination from "./pagination"
import type { Order, OrderStatus, OrdersTableProps } from "@/types/orders-table"

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const, className: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmado", variant: "default" as const, className: "bg-blue-100 text-blue-800" },
  preparing: { label: "Preparando", variant: "default" as const, className: "bg-orange-100 text-orange-800" },
  ready: { label: "Listo", variant: "default" as const, className: "bg-green-100 text-green-800" },
  delivered: { label: "Entregado", variant: "default" as const, className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", variant: "destructive" as const, className: "bg-red-100 text-red-800" },
}

export default function OrdersTable({
  orders,
  currentPage,
  totalPages,
  pageSize,
  selectedStatus,
  onPageChange,
  onStatusFilter,
  onOrderClick,
  isLoading = false,
  className = "",
}: OrdersTableProps) {
  const handleRowClick = (order: Order) => {
    if (onOrderClick) {
      onOrderClick(order)
    }
  }

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const LoadingSkeleton = () => (
    <>
      {Array.from({ length: pageSize }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          </TableCell>
          <TableCell>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
          </TableCell>
          <TableCell>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Tabla de Pedidos</CardTitle>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select value={selectedStatus} onValueChange={(value) => onStatusFilter(value as OrderStatus | "all")}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="preparing">Preparando</SelectItem>
                <SelectItem value="ready">Listo</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Tabla */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingSkeleton />
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No se encontraron pedidos
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                      onOrderClick ? "cursor-pointer" : ""
                    }`}
                    onClick={() => handleRowClick(order)}
                  >
                    <TableCell className="font-mono text-sm">#{order.id.slice(-8)}</TableCell>
                    <TableCell className="font-medium">{order.cliente}</TableCell>
                    <TableCell>{order.producto}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{order.cantidad}</Badge>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.estado} />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(order.fecha, "dd/MM/yyyy", { locale: es })}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(order.fecha, "HH:mm", { locale: es })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Información de paginación y controles */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages} ({orders.length} pedidos)
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </CardContent>
    </Card>
  )
}
