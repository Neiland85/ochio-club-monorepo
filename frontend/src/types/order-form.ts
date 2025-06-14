import { z } from "zod";

export const orderFormSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  address: z.string().min(5, "La dirección es obligatoria"),
  productId: z.string().min(1, "Seleccione un producto"),
  quantity: z.number().min(1).max(100),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cash", "card"], { required_error: "Seleccione un método de pago" }),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export interface OrderFormProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    inStock?: boolean;
  }>;
  onSubmit: (data: OrderFormValues) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<OrderFormValues>;
  className?: string;
}
