import useSWR from "swr";
import { getProducts } from "@/src/services/products";

export function useProducts() {
  const { data, error, isLoading } = useSWR("products", getProducts);
  return {
    products: data,
    isLoading,
    isError: error,
  };
}