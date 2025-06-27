'use client';

import { useState } from 'react';
import { toast } from '../hooks/use-toast.js';
import OrderHistory from '../components/order-history/order-history.jsx';
import OrderDetails from '../components/order-history/order-details.jsx';
import type { OrderHistoryItem } from '../types/order-history';

// Datos de ejemplo
const mockOrders: OrderHistoryItem[] = [
  {
    id: 'OCH-2024-001',
    date: new Date(2024, 4, 15, 10, 30),
    status: 'delivered',
    total: 13.2,
    items: [
      {
        id: 'item-1',
        name: 'Ochío Tradicional',
        quantity: 6,
        price: 1.2,
        imageUrl:
          '/placeholder.svg?height=100&width=100&query=ochio+tradicional',
      },
      {
        id: 'item-2',
        name: 'Ochío de Chocolate',
        quantity: 4,
        price: 1.5,
        imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+chocolate',
      },
    ],
    bakeryName: 'Horno Tradicional San Isidro',
    bakeryId: 'b1',
    deliveryAddress: 'Calle Mayor 12, 23400 Úbeda, Jaén',
    deliveryOption: 'delivery',
    paymentMethod: 'VISA',
    estimatedDelivery: new Date(2024, 4, 15, 11, 30),
  },
  {
    id: 'OCH-2024-002',
    date: new Date(2024, 4, 10, 11, 15),
    status: 'cancelled',
    total: 11.2,
    items: [
      {
        id: 'item-3',
        name: 'Ochío de Almendra',
        quantity: 8,
        price: 1.4,
        imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+almendra',
      },
    ],
    bakeryName: 'Panadería La Ubetense',
    bakeryId: 'b2',
    deliveryAddress: 'Avenida de Andalucía 5, 23400 Úbeda, Jaén',
    deliveryOption: 'express',
    paymentMethod: 'MASTERCARD',
    notes: 'Cliente canceló por error en el pedido',
  },
  {
    id: 'OCH-2024-003',
    date: new Date(2024, 4, 5, 16, 45),
    status: 'delivered',
    total: 23.4,
    items: [
      {
        id: 'item-4',
        name: 'Ochío Tradicional',
        quantity: 12,
        price: 1.2,
        imageUrl:
          '/placeholder.svg?height=100&width=100&query=ochio+tradicional',
      },
      {
        id: 'item-5',
        name: 'Ochío de Chocolate',
        quantity: 6,
        price: 1.5,
        imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+chocolate',
      },
    ],
    bakeryName: 'Horno Tradicional San Isidro',
    bakeryId: 'b1',
    deliveryAddress: 'Plaza del Ayuntamiento 3, 23400 Úbeda, Jaén',
    deliveryOption: 'delivery',
    paymentMethod: 'PayPal',
    estimatedDelivery: new Date(2024, 4, 5, 17, 30),
  },
  {
    id: 'OCH-2024-004',
    date: new Date(2024, 4, 1, 9, 20),
    status: 'on_the_way',
    total: 18.0,
    items: [
      {
        id: 'item-6',
        name: 'Ochío Sin Gluten',
        quantity: 10,
        price: 1.8,
        imageUrl:
          '/placeholder.svg?height=100&width=100&query=ochio+sin+gluten',
      },
    ],
    bakeryName: 'Obrador Artesanal El Portillo',
    bakeryId: 'b3',
    deliveryAddress: 'Calle San Francisco 8, 23400 Úbeda, Jaén',
    deliveryOption: 'express',
    paymentMethod: 'VISA',
    trackingCode: 'TRACK-123456',
    estimatedDelivery: new Date(2024, 5, 20, 10, 0),
  },
  {
    id: 'OCH-2024-005',
    date: new Date(2024, 3, 25, 12, 10),
    status: 'pending',
    total: 15.6,
    items: [
      {
        id: 'item-7',
        name: 'Ochío Tradicional',
        quantity: 4,
        price: 1.2,
        imageUrl:
          '/placeholder.svg?height=100&width=100&query=ochio+tradicional',
      },
      {
        id: 'item-8',
        name: 'Ochío de Almendra',
        quantity: 4,
        price: 1.4,
        imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+almendra',
      },
      {
        id: 'item-9',
        name: 'Ochío Integral',
        quantity: 4,
        price: 1.3,
        imageUrl: '/placeholder.svg?height=100&width=100&query=ochio+integral',
      },
    ],
    bakeryName: 'Panadería La Ubetense',
    bakeryId: 'b2',
    deliveryAddress: 'Calle Rastro 15, 23400 Úbeda, Jaén',
    deliveryOption: 'pickup',
    paymentMethod: 'MASTERCARD',
    notes: 'Recoger después de las 17:00',
  },
];

export default function OrderHistoryExample() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>(mockOrders);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryItem | null>(
    null
  );

  const handleViewOrderDetails = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
  };

  const handleReorder = (orderId: string) => {
    setIsLoading(true);

    // Simular proceso de reordenar
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Pedido repetido',
        description: `Se ha añadido el pedido ${orderId} a tu carrito`,
      });
    }, 1000);
  };

  const handleCancelOrder = (orderId: string) => {
    setIsLoading(true);

    // Simular proceso de cancelación
    setTimeout(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: 'cancelled' as const }
            : order
        )
      );
      setIsLoading(false);
      toast({
        title: 'Pedido cancelado',
        description: `El pedido ${orderId} ha sido cancelado correctamente`,
      });
      // Si el pedido cancelado es el que se está viendo en detalle, actualizar
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: 'cancelled' as const } : null
        );
      }
    }, 1000);
  };

  const handleTrackOrder = (orderId: string, trackingCode?: string) => {
    toast({
      title: 'Seguimiento de pedido',
      description: `Siguiendo pedido ${orderId}${trackingCode ? ` con código ${trackingCode}` : ''}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">
          Historial de Pedidos - Ochío Club
        </h1>
        <p className="text-muted-foreground">
          Consulta y gestiona todos tus pedidos anteriores
        </p>
      </div>

      <OrderHistory
        orders={orders}
        isLoading={isLoading}
        onViewOrderDetails={handleViewOrderDetails}
        onReorder={handleReorder}
        onCancelOrder={handleCancelOrder}
        onTrackOrder={handleTrackOrder}
      />

      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onReorder={() => {
            handleReorder(selectedOrder.id);
            setSelectedOrder(null);
          }}
          onCancelOrder={
            ['pending', 'confirmed'].includes(selectedOrder.status)
              ? () => {
                  handleCancelOrder(selectedOrder.id);
                }
              : undefined
          }
          onTrackOrder={
            ['on_the_way', 'picked_up'].includes(selectedOrder.status)
              ? (trackingCode) => {
                  handleTrackOrder(selectedOrder.id, trackingCode);
                  setSelectedOrder(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
