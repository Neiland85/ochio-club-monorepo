// src/types/bakery-dashboard.ts
export type BakeryStatus = "active" | "inactive" | "pending" | "suspended";

export interface Bakery {
  id: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  status: BakeryStatus;
  rating: number;
  totalOrders: number;
  revenue: number;
  createdAt: string;
}

export interface DashboardStats {
  sales: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    percentageChange: number;
    currency: string;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
    percentageChange: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
    featured: number;
  };
}

export interface DashboardOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  deliveryAddress: string;
  notes?: string; // Propiedad opcional para incluir notas
}

export interface DashboardProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  isOutOfStock: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string; // Propiedad opcional para incluir la URL de la imagen
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "on_the_way"
  | "delivered"
  | "cancelled";