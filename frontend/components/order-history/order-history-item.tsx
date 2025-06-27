'use client';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Image from 'next/image';
import {
  ChevronDown,
  ChevronRight,
  Eye,
  RefreshCw,
  X,
  MapPin,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { OrderHistoryItem as Order } from '@/types/order-history';

interface OrderHistoryItemProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDetails: () => void;
  onReorder?: () => void;
  onCancelOrder?: () => void;
  onTrackOrder?: () => void;
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  confirmed: {
    label: 'Confirmado',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  preparing: {
    label: 'Preparando',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  ready: {
    label: 'Listo',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  picked_up: {
    label: 'Recogido',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  on_the_way: {
    label: 'En camino',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  delivered: {
    label: 'Entregado',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

export default function OrderHistoryComponent({
  order,
  isExpanded,
  onToggleExpand,
  onViewDetails,
  onReorder,
  onCancelOrder,
  onTrackOrder,
}: OrderHistoryItemProps) {
  const formatCurrency = (amount: number) => `${amount.toFixed(2)}€`;

  const getDeliveryOptionLabel = (option: string) => {
    switch (option) {
      case 'pickup':
        return 'Recoger en tienda';
      case 'delivery':
        return 'Entrega a domicilio';
      case 'express':
        return 'Entrega express';
      default:
        return option;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Cabecera del pedido (siempre visible) */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={onToggleExpand}
        >
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="font-medium">Pedido #{order.id}</span>
                <Badge
                  variant="outline"
                  className={statusConfig[order.status].className}
                >
                  {statusConfig[order.status].label}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(order.date, "d 'de' MMMM 'de' yyyy, HH:mm", {
                  locale: es,
                })}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold">{formatCurrency(order.total)}</div>
            <div className="text-sm text-muted-foreground">
              {order.items.length} productos
            </div>
          </div>
        </div>

        {/* Contenido expandido */}
        {isExpanded && (
          <>
            <Separator />
            <div className="p-4 space-y-4">
              {/* Información del pedido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Detalles del pedido
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Panadería:</span>{' '}
                      {order.bakeryName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Método de entrega:
                      </span>{' '}
                      {getDeliveryOptionLabel(order.deliveryOption)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Método de pago:
                      </span>{' '}
                      {order.paymentMethod}
                    </div>
                    {order.deliveryAddress && (
                      <div className="flex items-start gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                    )}
                    {order.estimatedDelivery && (
                      <div>
                        <span className="text-muted-foreground">
                          Entrega estimada:
                        </span>{' '}
                        {format(order.estimatedDelivery, "d 'de' MMMM, HH:mm", {
                          locale: es,
                        })}
                      </div>
                    )}
                    {order.notes && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <span className="text-muted-foreground">Notas:</span>{' '}
                        {order.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Productos</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={item.imageUrl || '/placeholder.svg'}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.quantity} x {formatCurrency(item.price)}
                          </div>
                        </div>
                        <div className="text-right font-medium">
                          {formatCurrency(item.quantity * item.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2 justify-end mt-4">
                <Button variant="outline" size="sm" onClick={onViewDetails}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalles
                </Button>
                {onReorder && (
                  <Button variant="outline" size="sm" onClick={onReorder}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Repetir pedido
                  </Button>
                )}
                {onTrackOrder && (
                  <Button variant="outline" size="sm" onClick={onTrackOrder}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Seguir pedido
                  </Button>
                )}
                {onCancelOrder && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCancelOrder}
                    className="text-red-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar pedido
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
