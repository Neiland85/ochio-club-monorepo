"use client";

// src/hooks/useCreateOrder.ts
import { useState } from "react";
<<<<<<< HEAD
import { createOrder } from "@/services/orders";
=======
import { createOrder } from "@/services/orders"; // Ruta corregida
>>>>>>> dev

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