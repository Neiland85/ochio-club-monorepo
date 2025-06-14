import useSWR from "swr";
import { fetchOrders } from "@/src/services/orders";

export function useOrders() {
  const { data, error, mutate, isLoading } = useSWR("/orders", fetchOrders);
  return { orders: data, error, mutate, isLoading };
}
