"use client"

import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import BakeryDashboard from "@/components/bakery-dashboard"
import type { DashboardStats, DashboardOrder, DashboardProduct, OrderStatus } from "@/types/bakery-dashboard"

// Datos de ejemplo
const mockStats: DashboardStats = {
  sales: {
    total: 15750.25,
    today: 425.5,
    thisWeek: 2850.75,
    thisMonth: 12450.0,
    percentageChange: 15.3,
    currency: "€",
  },
  orders: {
    total: 234,
    pending: 12,
    completed: 210,
    cancelled: 12,
    percentageChange: 8.7,
  },
  products: {
    total: 28,
    active: 24,
    outOfStock: 3,
    featured: 6,
  },
}

const mockOrders: DashboardOrder[] = [
  {
    id: "OCH-2024-001",
    customerName: "María García López",
    customerEmail: "maria.garcia@email.com",
    customerPhone: "666123456",
    items: [
      { id: "1", name: "Ochío Tradicional", quantity: 6, unitPrice: 1.2, total: 7.2 },
      { id: "2", name: "Ochío de Chocolate", quantity: 4, unitPrice: 1.5, total: 6.0 },
    ],
    total: 13.2,
    status: "confirmed",
    createdAt: new Date(2024, 4, 15, 10, 30),
    deliveryAddress: "Calle Mayor 12, 23400 Úbeda, Jaén",
  },
  {
    id: "OCH-2024-002",
    customerName: "Antonio Martínez Ruiz",
    customerEmail: "antonio.martinez@email.com",
    customerPhone: "666789012",
    items: [
      { id: "3", name: "Ochío de Almendra", quantity: 8, unitPrice: 1.4, total: 11.2 },
      { id: "4", name: "Ochío Relleno de Crema", quantity: 4, unitPrice: 1.6, total: 6.4 },
    ],
    total: 17.6,
    status: "preparing",
    createdAt: new Date(2024, 4, 15, 11, 15),
    deliveryAddress: "Avenida de Andalucía 5, 23400 Úbeda, Jaén",
    notes: "Entregar en la puerta trasera del edificio",
  },
  {
    id: "OCH-2024-003",
    customerName: "Laura Sánchez Moreno",
    customerEmail: "laura.sanchez@email.com",
    customerPhone: "666345678",
    items: [
      { id: "1", name: "Ochío Tradicional", quantity: 12, unitPrice: 1.2, total: 14.4 },
      { id: "5", name: "Ochío de Canela", quantity: 6, unitPrice: 1.4, total: 8.4 },
    ],
    total: 22.8,
    status: "delivered",
    createdAt: new Date(2024, 4, 14, 16, 45),
    deliveryAddress: "Plaza del Ayuntamiento 3, 23400 Úbeda, Jaén",
  },
  {
    id: "OCH-2024-004",
    customerName: "Carlos Rodríguez Jiménez",
    customerEmail: "carlos.rodriguez@email.com",
    customerPhone: "666901234",
    items: [{ id: "2", name: "Ochío de Chocolate", quantity: 10, unitPrice: 1.5, total: 15.0 }],
    total: 15.0,
    status: "on_the_way",
    createdAt: new Date(2024, 4, 15, 9, 20),
    deliveryAddress: "Calle San Francisco 8, 23400 Úbeda, Jaén",
  },
  {
    id: "OCH-2024-005",
    customerName: "Isabel López Fernández",
    customerEmail: "isabel.lopez@email.com",
    customerPhone: "666567890",
    items: [
      { id: "6", name: "Ochío Integral", quantity: 8, unitPrice: 1.3, total: 10.4 },
      { id: "7", name: "Ochío Sin Gluten", quantity: 4, unitPrice: 1.8, total: 7.2 },
    ],
    total: 17.6,
    status: "pending",
    createdAt: new Date(2024, 4, 15, 12, 10),
    deliveryAddress: "Calle Rastro 15, 23400 Úbeda, Jaén",
  },
]

const mockProducts: DashboardProduct[] = [
  {
    id: "1",
    name: "Ochío Tradicional",
    description: "El clásico ochío de Úbeda, elaborado con masa de pan y aceite de oliva virgen extra",
    price: 1.2,
    imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+tradicional",
    category: "Tradicionales",
    isActive: true,
    isOutOfStock: false,
    isFeatured: true,
    stock: 45,
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 4, 10),
  },
  {
    id: "2",
    name: "Ochío de Chocolate",
    description: "Delicioso ochío con pepitas de chocolate belga en su interior",
    price: 1.5,
    imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+chocolate",
    category: "Especiales",
    isActive: true,
    isOutOfStock: false,
    isFeatured: true,
    stock: 32,
    createdAt: new Date(2024, 0, 20),
    updatedAt: new Date(2024, 4, 12),
  },
  {
    id: "3",
    name: "Ochío de Almendra",
    description: "Ochío con almendras marcona troceadas, perfecto para el desayuno",
    price: 1.4,
    imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+almendra",
    category: "Especiales",
    isActive: true,
    isOutOfStock: false,
    isFeatured: false,
    stock: 28,
    createdAt: new Date(2024, 1, 5),
    updatedAt: new Date(2024, 4, 8),
  },
  {
    id: "4",
    name: "Ochío Relleno de Crema",
    description: "Ochío relleno de crema pastelera artesanal, una delicia para los más golosos",
    price: 1.6,
    imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+crema",
    category: "Rellenos",
    isActive: true,
    isOutOfStock: false,
    isFeatured: true,
    stock: 18,
    createdAt: new Date(2024, 1, 10),
    updatedAt: new Date(2024, 4, 14),
  },
  {
    id: "5",
    name: "Ochío de Canela",
    description: "Ochío con un toque de canela de Ceilán, ideal para los amantes de los sabores especiados",
    price: 1.4,
    imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+canela",
    category: "Especiales",
    isActive: true,
    isOutOfStock: false,
    isFeatured: false,
    stock: 22,
    createdAt: new Date(2024, 1, 15),
    updatedAt: new Date(2024, 4, 9),
  },
  {
    id: "6",
    name: "Ochío Integral",
    description: "Versión saludable elaborada con harina integral y semillas de girasol",
    price: 1.3,
    imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+integral",
    category: "Saludables",
    isActive: true,
    isOutOfStock: false,
    isFeatured: false,
    stock: 15,
    createdAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 4, 11),
  },
  {
    id: "7",
    name: "Ochío Sin Gluten",
    description: "Especial para celíacos, elaborado con harinas sin gluten certificadas",
    price: 1.8,
    imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+sin+gluten",
    category: "Saludables",
    isActive: true,
    isOutOfStock: true,
    isFeatured: false,
    stock: 0,
    createdAt: new Date(2024, 2, 10),
    updatedAt: new Date(2024, 4, 13),
  },
  {
    id: "8",
    name: "Ochío de Aceitunas",
    description: "Con trozos de aceituna picual de Úbeda, un sabor muy mediterráneo",
    price: 1.45,
    imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+aceitunas",
    category: "Especiales",
    isActive: false,
    isOutOfStock: false,
    isFeatured: false,
    stock: 8,
    createdAt: new Date(2024, 2, 20),
    updatedAt: new Date(2024, 4, 5),
  },
]

export default function BakeryDashboardExample() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orders, setOrders] = useState<DashboardOrder[]>([])
  const [products, setProducts] = useState<DashboardProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Simular carga de datos
  useEffect(() => {
    const loadData = async () => {
      // Simular una carga de datos con un pequeño retraso
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats(mockStats)
      setOrders(mockOrders)
      setProducts(mockProducts)
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Manejadores de eventos
  const handleAddProduct = () => {
    toast({
      title: "Añadir Producto",
      description: "Abriendo formulario para añadir un nuevo ochío al catálogo",
    })
  }

  const handleEditProduct = (product: DashboardProduct) => {
    toast({
      title: "Editar Producto",
      description: `Editando: ${product.name}`,
    })
  }

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    toast({
      title: "Eliminar Producto",
      description: `¿Estás seguro de que deseas eliminar "${product?.name}"?`,
      variant: "destructive",
    })
  }

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? { ...order, status } : order)))

    toast({
      title: "Estado Actualizado",
      description: `Pedido ${orderId} actualizado a: ${status}`,
    })
  }

  const handleViewOrderDetails = (order: DashboardOrder) => {
    toast({
      title: "Detalles del Pedido",
      description: `Viendo detalles del pedido ${order.id} de ${order.customerName}`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BakeryDashboard
        stats={stats}
        recentOrders={orders}
        products={products}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onViewOrderDetails={handleViewOrderDetails}
        isLoading={isLoading}
      />
    </div>
  )
}
