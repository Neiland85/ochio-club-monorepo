import React from "react";
import { useProducts } from "../src/hooks/useProducts";
import OrderForm from "../components/order-form";
import AppLayout from "../components/layout/app-layout";
import { OrderFormValues } from "../src/types/order-form";
import { useCreateOrder } from "../src/hooks/useCreateOrder";
import { CreateOrderPayload } from "../src/services/orders";

const publicNavItems = [
  { label: "Productos", href: "/productos", isActive: true },
  { label: "Sobre Nosotros", href: "/nosotros", isActive: false },
  { label: "Contacto", href: "/contacto", isActive: false },
];

export default function Page() {
  const { products, isLoading } = useProducts();
  const { trigger, isMutating, error, reset } = useCreateOrder();
  const [success, setSuccess] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  // Maneja el envío del formulario de pedido
  const handleOrderSubmit = async (data: OrderFormValues) => {
    try {
      const payload: CreateOrderPayload = {
        userId: "demo-user", // Aquí deberías usar el ID real del usuario autenticado
        items: [{ productId: data.productId, quantity: data.quantity }],
        address: data.address,
        paymentMethod: data.paymentMethod,
      };
      await trigger(payload);
      setSuccess(true);
      // Resetea el formulario y enfoca el primer campo tras éxito
      if (formRef.current) {
        formRef.current.reset();
        const firstInput = formRef.current.querySelector("input, select, textarea") as HTMLElement;
        if (firstInput) firstInput.focus();
      }
      setTimeout(() => {
        setSuccess(false);
        reset();
      }, 4000);
      // Scroll al mensaje de éxito
      setTimeout(() => {
        const msg = document.getElementById("order-success-msg");
        if (msg) msg.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } catch {
      setSuccess(false);
      setTimeout(() => {
        const msg = document.getElementById("order-error-msg");
        if (msg) msg.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  };

  return (
    <AppLayout navigationItems={publicNavItems}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Haz tu pedido de ochíos</h1>
        {success && (
          <div id="order-success-msg" className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center font-medium animate-pulse shadow">
            ¡Pedido realizado con éxito!
          </div>
        )}
        {error && (
          <div id="order-error-msg" className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center font-medium animate-pulse shadow">
            Error al enviar el pedido. Inténtalo de nuevo.
          </div>
        )}
        <OrderForm
          products={products || []}
          onSubmit={handleOrderSubmit}
          isSubmitting={isLoading || isMutating}
          // @ts-expect-error OrderForm acepta formRef aunque no esté tipado en sus props
          formRef={formRef}
        />
      </div>
    </AppLayout>
  );
}
