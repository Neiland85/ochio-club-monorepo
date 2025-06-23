"use client";

import { useState } from "react";
import { createOrder } from "@/services/orders";

export function useCreateOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (orderData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await createOrder(orderData);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}