"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import ShoppingCart from "@/components/shopping-cart"
import type { CartItem, CartSummary } from "@/types/shopping-cart"

// Datos de ejemplo
const mockCartItems: CartItem[] = [
  {
    id: "cart-1",
    product: {
      id: "p1",
      name: "Ochío Tradicional",
      description: "El clásico ochío de Úbeda, elaborado con masa de pan y aceite de oliva virgen extra",
      price: 1.2,
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+tradicional",
      category: "Tradicionales",
      bakeryId: "b1",
      bakeryName: "Horno Tradicional San Isidro",
      maxQuantity: 50,
      isAvailable: true,
    },
    quantity: 6,
    subtotal: 7.2,
    addedAt: new Date(2024, 4, 15, 10, 30),
  },
  {
    id: "cart-2",
    product: {
      id: "p2",
      name: "Ochío de Chocolate",
      description: "Delicioso ochío con pepitas de chocolate belga en su interior",
      price: 1.5,
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+chocolate",
      category: "Especiales",
      bakeryId: "b1",
      bakeryName: "Horno Tradicional San Isidro",
      maxQuantity: 30,
      isAvailable: true,
    },
    quantity: 4,
    subtotal: 6.0,
    addedAt: new Date(2024, 4, 15, 11, 15),
    notes: "Sin azúcar añadido, por favor",
  },
  {
    id: "cart-3",
    product: {
      id: "p3",
      name: "Ochío de Almendra",
      description: "Ochío con almendras marcona troceadas, perfecto para el desayuno",
      price: 1.4,
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+almendra",
      category: "Especiales",
      bakeryId: "b2",
      bakeryName: "Panadería La Ubetense",
      maxQuantity: 25,
      isAvailable: true,
    },
    quantity: 3,
    subtotal: 4.2,
    addedAt: new Date(2024, 4, 15, 9, 45),
  },
  {
    id: "cart-4",
    product: {
      id: "p4",
      name: "Ochío Sin Gluten",
      description: "Especial para celíacos, elaborado con harinas sin gluten certificadas",
      price: 1.8,
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+sin+gluten",
      category: "Saludables",
      bakeryId: "b3",
      bakeryName: "Obrador Artesanal El Portillo",
      maxQuantity: 15,
      isAvailable: false, // Producto no disponible
    },
    quantity: 2,
    subtotal: 3.6,
    addedAt: new Date(2024, 4, 14, 16, 20),
  },
]

export default function ShoppingCartExample() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)
  const [isLoading, setIsLoading] = useState(false)

  // Calcular resumen del carrito
  const calculateSummary = (): CartSummary => {
    const availableItems = cartItems.filter((item) => item.product.isAvailable)
    const subtotal = availableItems.reduce((sum, item) => sum + item.subtotal, 0)
    const itemCount = availableItems.reduce((sum, item) => sum + item.quantity, 0)
    const taxRate = 0.1 // 10% IVA
    const tax = subtotal * taxRate
    const deliveryFee = subtotal >= 20 ? 0 : 2.5 // Envío gratis por encima de 20€
    const discount = 0 // Se aplicaría con código promocional
    const total = subtotal + tax + deliveryFee - discount

    return {
      subtotal,
      tax,
      taxRate,
      deliveryFee,
      discount,
      total,
      itemCount,
      currency: "€",
    }
  }

  const summary = calculateSummary()

  // Manejadores de eventos
  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                subtotal: item.product.price * quantity,
              }
            : item,
        ),
      )

      toast({
        title: "Cantidad actualizada",
        description: `Cantidad actualizada a ${quantity} unidades`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    setIsLoading(true)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 300))

      const removedItem = cartItems.find((item) => item.id === itemId)
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))

      toast({
        title: "Producto eliminado",
        description: `${removedItem?.product.name} ha sido eliminado del carrito`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCart = async () => {
    setIsLoading(true)

    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 500))

      setCartItems([])

      toast({
        title: "Carrito vaciado",
        description: "Todos los productos han sido eliminados del carrito",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProceedToCheckout = () => {
    const availableItems = cartItems.filter((item) => item.product.isAvailable)

    if (availableItems.length === 0) {
      toast({
        title: "No hay productos disponibles",
        description: "Todos los productos en tu carrito no están disponibles",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Procediendo al pago",
      description: `Procesando ${availableItems.length} productos por un total de ${summary.total.toFixed(2)}€`,
    })

    // Aquí redirigirías a la página de checkout
    console.log("Proceeding to checkout with:", {
      items: availableItems,
      summary,
    })
  }

  const handleContinueShopping = () => {
    toast({
      title: "Continuando compras",
      description: "Redirigiendo al catálogo de productos",
    })

    // Aquí redirigirías al catálogo
    console.log("Continue shopping")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Carrito de Compras - Ochío Club</h1>
        <p className="text-muted-foreground">Revisa tus productos antes de proceder al pago</p>
      </div>

      <ShoppingCart
        items={cartItems}
        summary={summary}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        onContinueShopping={handleContinueShopping}
        isLoading={isLoading}
        isCheckoutDisabled={false}
        showDeliveryOptions={true}
        showPromoCode={true}
      />
    </div>
  )
}
