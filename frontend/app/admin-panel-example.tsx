// Refactorización para garantizar seguridad de tipos y consistencia en las importaciones
"use client";

import { useState, useEffect } from "react";
import { toast } from "../components/ui/use-toast";
import AdminPanel from "../components/admin/admin-panel";
import type {
  AdminUser,
  AdminBakery,
  AdminProduct,
  AdminOrder,
  UserStatus,
  BakeryStatus,
  ProductStatus,
  AdminOrderStatus,
} from "@/types/admin-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import type { AdminPanelProps } from "../types/admin-panel";

// Datos de ejemplo
const mockData: {
  users: AdminUser[];
  bakeries: AdminBakery[];
  products: AdminProduct[];
  orders: AdminOrder[];
} = {
  users: [
    {
      id: "u1",
      name: "Ana García Martínez",
      email: "ana.garcia@ochioclub.com",
      phone: "666123456",
      role: "admin",
      status: "active",
      createdAt: new Date(2024, 0, 15),
      lastLogin: new Date(2024, 4, 15, 10, 30),
      avatar: "/placeholder.svg?height=40&width=40&query=ana+garcia",
    },
    {
      id: "u2",
      name: "Carlos Rodríguez López",
      email: "carlos@panaderiasanisidro.com",
      phone: "666789012",
      role: "baker",
      status: "active",
      createdAt: new Date(2024, 1, 10),
      lastLogin: new Date(2024, 4, 14, 16, 45),
      bakeryId: "b1",
    },
    {
      id: "u3",
      name: "María Sánchez Moreno",
      email: "maria.sanchez@email.com",
      phone: "666345678",
      role: "customer",
      status: "active",
      createdAt: new Date(2024, 2, 5),
      lastLogin: new Date(2024, 4, 15, 9, 20),
    },
    {
      id: "u4",
      name: "Antonio Martínez Ruiz",
      email: "antonio@delivery.com",
      phone: "666901234",
      role: "delivery",
      status: "active",
      createdAt: new Date(2024, 2, 20),
      lastLogin: new Date(2024, 4, 15, 8, 15),
    },
    {
      id: "u5",
      name: "Laura López Fernández",
      email: "laura@panaderiaubetense.com",
      phone: "666567890",
      role: "baker",
      status: "inactive",
      createdAt: new Date(2024, 3, 1),
      lastLogin: new Date(2024, 4, 10, 14, 30),
      bakeryId: "b2",
    },
  ],
  bakeries: [
    {
      id: "b1",
      name: "Horno Tradicional San Isidro",
      description: "Panadería artesanal especializada en ochíos tradicionales de Úbeda",
      address: "Calle Mayor 12",
      city: "Úbeda",
      phone: "953123456",
      email: "info@panaderiasanisidro.com",
      status: "active",
      ownerId: "u2",
      ownerName: "Carlos Rodríguez López",
      createdAt: new Date(2024, 1, 10),
      totalProducts: 8,
      totalOrders: 156,
      rating: 4.8,
      imageUrl: "/placeholder.svg?height=100&width=100&query=panaderia+san+isidro",
    },
    {
      id: "b2",
      name: "Panadería La Ubetense",
      description: "Ochíos y productos de panadería con más de 50 años de tradición",
      address: "Avenida de Andalucía 25",
      city: "Úbeda",
      phone: "953789012",
      email: "contacto@panaderiaubetense.com",
      status: "active",
      ownerId: "u5",
      ownerName: "Laura López Fernández",
      createdAt: new Date(2024, 2, 15),
      totalProducts: 12,
      totalOrders: 89,
      rating: 4.6,
      imageUrl: "/placeholder.svg?height=100&width=100&query=panaderia+ubetense",
    },
    {
      id: "b3",
      name: "Obrador Artesanal El Portillo",
      description: "Especialistas en ochíos rellenos y productos sin gluten",
      address: "Plaza del Ayuntamiento 8",
      city: "Úbeda",
      phone: "953345678",
      email: "info@obradorelportillo.com",
      status: "pending",
      ownerId: "u6",
      ownerName: "José Manuel García",
      createdAt: new Date(2024, 4, 1),
      totalProducts: 6,
      totalOrders: 23,
      rating: 4.2,
    },
  ],
  products: [
    {
      id: "p1",
      name: "Ochío Tradicional",
      description: "El clásico ochío de Úbeda, elaborado con masa de pan y aceite de oliva virgen extra",
      price: 1.2,
      category: "Tradicionales",
      bakeryId: "b1",
      bakeryName: "Horno Tradicional San Isidro",
      status: "active",
      stock: 45,
      isOutOfStock: false,
      isFeatured: true,
      createdAt: new Date(2024, 1, 15),
      updatedAt: new Date(2024, 4, 10),
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+tradicional",
      totalSales: 1250,
    },
    {
      id: "p2",
      name: "Ochío de Chocolate",
      description: "Delicioso ochío con pepitas de chocolate belga en su interior",
      price: 1.5,
      category: "Especiales",
      bakeryId: "b1",
      bakeryName: "Horno Tradicional San Isidro",
      status: "active",
      stock: 32,
      isOutOfStock: false,
      isFeatured: true,
      createdAt: new Date(2024, 1, 20),
      updatedAt: new Date(2024, 4, 12),
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+chocolate",
      totalSales: 890,
    },
    {
      id: "p3",
      name: "Ochío de Almendra",
      description: "Ochío con almendras marcona troceadas, perfecto para el desayuno",
      price: 1.4,
      category: "Especiales",
      bakeryId: "b2",
      bakeryName: "Panadería La Ubetense",
      status: "active",
      stock: 28,
      isOutOfStock: false,
      isFeatured: false,
      createdAt: new Date(2024, 2, 5),
      updatedAt: new Date(2024, 4, 8),
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+almendra",
      totalSales: 567,
    },
    {
      id: "p4",
      name: "Ochío Sin Gluten",
      description: "Especial para celíacos, elaborado con harinas sin gluten certificadas",
      price: 1.8,
      category: "Saludables",
      bakeryId: "b3",
      bakeryName: "Obrador Artesanal El Portillo",
      status: "active",
      stock: 0,
      isOutOfStock: true,
      isFeatured: false,
      createdAt: new Date(2024, 3, 10),
      updatedAt: new Date(2024, 4, 13),
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+sin+gluten",
      totalSales: 234,
    },
    {
      id: "p5",
      name: "Ochío de Aceitunas",
      description: "Con trozos de aceituna picual de Úbeda, un sabor muy mediterráneo",
      price: 1.45,
      category: "Especiales",
      bakeryId: "b2",
      bakeryName: "Panadería La Ubetense",
      status: "discontinued",
      stock: 8,
      isOutOfStock: false,
      isFeatured: false,
      createdAt: new Date(2024, 2, 20),
      updatedAt: new Date(2024, 4, 5),
      imageUrl: "/placeholder.svg?height=100&width=100&query=ochio+aceitunas",
      totalSales: 123,
    },
  ],
  orders: [
    {
      id: "OCH-2024-001",
      customerName: "María García López",
      customerEmail: "maria.garcia@email.com",
      customerPhone: "666123456",
      bakeryId: "b1",
      bakeryName: "Horno Tradicional San Isidro",
      items: [
        { id: "i1", productId: "p1", productName: "Ochío Tradicional", quantity: 6, unitPrice: 1.2, total: 7.2 },
        { id: "i2", productId: "p2", productName: "Ochío de Chocolate", quantity: 4, unitPrice: 1.5, total: 6.0 },
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
      bakeryId: "b2",
      bakeryName: "Panadería La Ubetense",
      items: [{ id: "i3", productId: "p3", productName: "Ochío de Almendra", quantity: 8, unitPrice: 1.4, total: 11.2 }],
      total: 11.2,
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
      bakeryId: "b1",
      bakeryName: "Horno Tradicional San Isidro",
      items: [
        { id: "i4", productId: "p1", productName: "Ochío Tradicional", quantity: 12, unitPrice: 1.2, total: 14.4 },
        { id: "i5", productId: "p2", productName: "Ochío de Chocolate", quantity: 6, unitPrice: 1.5, total: 9.0 },
      ],
      total: 23.4,
      status: "delivered",
      createdAt: new Date(2024, 4, 14, 16, 45),
      deliveryAddress: "Plaza del Ayuntamiento 3, 23400 Úbeda, Jaén",
    },
    {
      id: "OCH-2024-004",
      customerName: "Carlos Rodríguez Jiménez",
      customerEmail: "carlos.rodriguez@email.com",
      customerPhone: "666901234",
      bakeryId: "b3",
      bakeryName: "Obrador Artesanal El Portillo",
      items: [{ id: "i6", productId: "p4", productName: "Ochío Sin Gluten", quantity: 10, unitPrice: 1.8, total: 18.0 }],
      total: 18.0,
      status: "cancelled",
      createdAt: new Date(2024, 4, 15, 9, 20),
      deliveryAddress: "Calle San Francisco 8, 23400 Úbeda, Jaén",
      notes: "Cliente canceló por alergia no declarada",
    },
  ],
};

const AdminPanelExample = () => {
  const [data, setData] = useState(mockData);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUserStatus = async (userId: string, status: UserStatus) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setData((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === userId ? { ...user, status } : user
      ),
    }));
    toast({ title: "Estado actualizado", description: `El estado del usuario ha sido cambiado a ${status}.` });
    setIsLoading(false);
  };

  return (
    <AdminPanel
      data={data}
      isLoading={isLoading}
      onUpdateUserStatus={handleUpdateUserStatus}
    />
  );
};

export default AdminPanelExample;
