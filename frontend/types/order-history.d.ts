export interface OrderHistoryItem {
  id: string;
  date: Date;
  status: 'pending' | 'confirmed' | 'on_the_way' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    imageUrl: string;
  }>;
  bakeryName: string;
  bakeryId: string;
  deliveryAddress: string;
  deliveryOption: 'pickup' | 'delivery' | 'express';
  paymentMethod: string;
  notes?: string;
  trackingCode?: string;
  estimatedDelivery?: Date;
}
