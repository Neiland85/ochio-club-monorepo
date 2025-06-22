<<<<<<< HEAD
import React from "react";

export function useToast() {
  const showToast = (message: string) => {
    alert(message); // Simple implementación de ejemplo
  };

  return { showToast };
}

export default useToast;
=======
// Ajuste de tipos para el estado de toasts
import { useState } from "react";

interface Toast {
  id: string;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Toast) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
}

export default useToast;
>>>>>>> dev
