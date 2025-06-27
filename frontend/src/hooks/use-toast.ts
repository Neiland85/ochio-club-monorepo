import { useState } from 'react';

interface Toast {
  id: string;
  message: string;
}

const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string) => {
    const id = Date.now().toString();
    setToasts([...toasts, { id, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};

export default useToast;
