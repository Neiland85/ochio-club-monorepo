<<<<<<< HEAD
export interface AdminUser {
=======
// Refactorización para asegurar consistencia con las dependencias
export type AdminUser = {
>>>>>>> dev
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  createdAt: Date;
<<<<<<< HEAD
  lastLogin: Date;
  avatar?: string;
  bakeryId?: string;
}

export interface AdminBakery {
  id: string;
  name: string;
  description: string; // Agregar esta línea
=======
  lastLogin?: Date;
  avatar?: string;
  bakeryId?: string;
};

export type AdminBakery = {
  id: string;
  name: string;
  description: string;
>>>>>>> dev
  address: string;
  city: string;
  phone: string;
  email: string;
<<<<<<< HEAD
  status: BakeryStatus;
=======
  status: string;
>>>>>>> dev
  ownerId: string;
  ownerName: string;
  createdAt: Date;
  totalProducts: number;
  totalOrders: number;
  rating: number;
  imageUrl?: string;
<<<<<<< HEAD
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
=======
};

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  bakeryId: string;
  bakeryName: string;
  status: string;
  stock: number;
  isOutOfStock: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  totalSales: number;
};

export type AdminOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bakeryId: string;
  bakeryName: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  total: number;
  status: string;
  createdAt: Date;
  deliveryAddress: string;
  notes?: string;
};

export type UserStatus = "active" | "inactive";
export type BakeryStatus = "active" | "pending" | "inactive";
export type ProductStatus = "active" | "discontinued";
export type AdminOrderStatus = "confirmed" | "preparing" | "delivered" | "cancelled";
>>>>>>> dev
