import apiClient from "@/src/api";
import type { OrderStatus, DashboardOrder } from "../types/bakery-dashboard";

export async function fetchOrders(): Promise<DashboardOrder[]> {
  const { data } = await apiClient.get("/orders");
  return data;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const { data } = await apiClient.patch(`/orders/${orderId}/status`, { status });
  return data;
}

export async function createOrder(orderData: any) {
  const { data } = await apiClient.post("/orders", orderData);
  return data;
}