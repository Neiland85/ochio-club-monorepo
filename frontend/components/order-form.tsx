"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { orderFormSchema, OrderFormValues, OrderFormProps } from "../src/types/order-form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Button } from "./ui/button"

 /**
 * Formulario de pedido de ochíos.
 * Permite al usuario introducir sus datos y detalles del pedido.
 */
export default function OrderForm({
  products,
  onSubmit,
  isSubmitting = false,
  defaultValues,
  className = "",
}: OrderFormProps) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      quantity: 1,
      productId: "",
      notes: "",
      paymentMethod: "cash",
      ...defaultValues,
    },
  })

  const selectedProductId = form.watch("productId")
  const selectedProduct = products.find((p) => p.id === selectedProductId)
  const quantity = form.watch("quantity") || 0
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0

  return (
    <Card className={`w-full max-w-lg mx-auto shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle>Formulario de Pedido</CardTitle>
        <CardDescription>Complete los datos para realizar su pedido de ochíos</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {/* Información personal */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Información Personal</h3>
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input {...form.register("name")} placeholder="Ingrese su nombre" />
                </FormControl>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...form.register("email")} type="email" placeholder="su.email@ejemplo.com" />
                </FormControl>
                <FormMessage>{form.formState.errors.email?.message}</FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Dirección de entrega</FormLabel>
                <FormControl>
                  <Textarea {...form.register("address")} placeholder="Ingrese su dirección completa" className="resize-none" />
                </FormControl>
                <FormMessage>{form.formState.errors.address?.message}</FormMessage>
              </FormItem>
            </div>
            {/* Información del pedido */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Detalles del Pedido</h3>
              <FormItem>
                <FormLabel>Producto</FormLabel>
                <FormControl>
                  <select {...form.register("productId")} className="input">
                    <option value="">Seleccione un producto</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id} disabled={product.inStock === false}>
                        {product.name} - ${product.price.toFixed(2)}
                        {product.inStock === false ? " (Agotado)" : ""}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage>{form.formState.errors.productId?.message}</FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input
                    {...form.register("quantity", { valueAsNumber: true })}
                    type="number"
                    min={1}
                    max={100}
                  />
                </FormControl>
                <FormDescription>Cantidad de unidades a ordenar (máximo 100)</FormDescription>
                <FormMessage>{form.formState.errors.quantity?.message}</FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Método de pago</FormLabel>
                <FormControl>
                  <select {...form.register("paymentMethod")} className="input">
                    <option value="cash">Efectivo</option>
                    <option value="card">Tarjeta</option>
                  </select>
                </FormControl>
                <FormMessage>{form.formState.errors.paymentMethod?.message}</FormMessage>
              </FormItem>
              <FormItem>
                <FormLabel>Notas adicionales (opcional)</FormLabel>
                <FormControl>
                  <Textarea {...form.register("notes")} placeholder="Instrucciones especiales para su pedido" className="resize-none" />
                </FormControl>
                <FormMessage>{form.formState.errors.notes?.message}</FormMessage>
              </FormItem>
            </div>
            {/* Resumen del pedido */}
            {selectedProduct && (
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium mb-2">Resumen del Pedido</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Producto:</span>
                    <span>{selectedProduct.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio unitario:</span>
                    <span>${selectedProduct.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span>{quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Método de pago:</span>
                    <span>{form.watch("paymentMethod") === "cash" ? "Efectivo" : "Tarjeta"}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" onClick={() => form.reset()}>
              Limpiar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Realizar Pedido"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
