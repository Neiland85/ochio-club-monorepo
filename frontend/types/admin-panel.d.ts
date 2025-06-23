export interface AdminPanelProps {
  users: AdminUser[];
  bakeries: AdminBakery[];
  products: AdminProduct[];
  orders: AdminOrder[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string; // Propiedad opcional agregada
  role: string;
  status: UserStatus;
  createdAt: Date;
  lastLogin?: Date;
  avatar?: string;
  bakeryId?: string;
}

export interface AdminBakery {
  id: string;
  name: string;
  description?: string; // Propiedad opcional agregada
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
  description?: string; // Propiedad opcional agregada
  price: number;
  category: string;
  bakeryId: string;
  bakeryName: string;
  status: ProductStatus;
  stock: number;
  isOutOfStock: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  totalSales: number;
}

export interface AdminOrder {
  id: string;
  customerName: string;
  customerEmail?: string; // Propiedad opcional agregada
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
  status: AdminOrderStatus;
  createdAt: Date;
  deliveryAddress: string;
  notes?: string;
}

export type UserStatus = "active" | "inactive";
export type BakeryStatus = "active" | "pending" | "inactive";
export type ProductStatus = "active" | "discontinued";
export type AdminOrderStatus = "confirmed" | "preparing" | "delivered" | "cancelled";
