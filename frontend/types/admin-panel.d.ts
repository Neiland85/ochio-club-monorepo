export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLogin: Date;
  avatar?: string;
  bakeryId?: string;
}

export interface AdminBakery {
  id: string;
  name: string;
  description: string; // Agregar esta línea
  address: string;
  city: string;
  phone: string;
  email: string;
  status: BakeryStatus;
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  totalProducts: number;
  totalOrders: number;
  rating: number;
  imageUrl?: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  status: string;
  description?: string;
  category?: string; // Agregar esta línea
  bakeryId?: string; // Agregar esta línea
  bakeryName?: string; // Agregar esta línea
  stock?: number; // Agregar esta línea
  isOutOfStock?: boolean; // Agregar esta línea
}

export interface AdminOrder {
  id: string;
  userId: string;
  bakeryId: string;
  productId: string;
  status: string;
}

export type UserStatus = "active" | "inactive";
export type BakeryStatus = "open" | "closed";
export type ProductStatus = "available" | "unavailable";
export type AdminOrderStatus = "pending" | "completed" | "cancelled";
