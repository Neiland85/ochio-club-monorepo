'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MoreHorizontal, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { BakeryOrder, OrderStatus } from '@/types/bakery-dashboard';

interface RecentOrdersTableProps {
  orders: BakeryOrder[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onViewDetails: (orderId: string) => void;
  className?: string;
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800',
  },
  confirmed: {
    label: 'Confirmado',
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800',
  },
  preparing: {
    label: 'Preparando',
    variant: 'default' as const,
    className: 'bg-orange-100 text-orange-800',
  },
  ready: {
    label: 'Listo',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800',
  },
  picked_up: {
    label: 'Recogido',
    variant: 'default' as const,
    className: 'bg-indigo-100 text-indigo-800',
  },
  on_the_way: {
    label: 'En camino',
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800',
  },
  delivered: {
    label: 'Entregado',
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Cancelado',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800',
  },
};

export default function RecentOrdersTable({
  orders,
  onUpdateStatus,
  onViewDetails,
  className = '',
}: RecentOrdersTableProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
        <CardDescription>
          Lista de los últimos pedidos recibidos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
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
                  <TableCell
                    colSpan={7}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No hay pedidos recientes
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">
                      #{order.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customerName}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {order.products
                          .map((p) => `${p.quantity}x ${p.name}`)
                          .join(', ')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.total.toFixed(2)}€
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[order.status].className}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div>
                          {format(order.date, 'dd/MM/yyyy', { locale: es })}
                        </div>
                        <div className="text-muted-foreground">
                          {format(order.date, 'HH:mm', { locale: es })}
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
                          <DropdownMenuItem
                            onClick={() => onViewDetails(order.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                          {Object.entries(statusConfig).map(
                            ([status, config]) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() =>
                                  onUpdateStatus(
                                    order.id,
                                    status as OrderStatus
                                  )
                                }
                                disabled={order.status === status}
                              >
                                {config.label}
                              </DropdownMenuItem>
                            )
                          )}
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
  );
}
