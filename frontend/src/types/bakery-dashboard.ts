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