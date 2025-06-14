import React from "react";

export function useToast() {
  const showToast = (message: string) => {
    alert(message); // Simple implementación de ejemplo
  };

  return { showToast };
}

export default useToast;
