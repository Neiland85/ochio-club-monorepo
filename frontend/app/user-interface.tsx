"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ShoppingCartExample from "./shopping-cart-example"
import OrderHistoryExample from "./order-history-example"
import AppLayout from "@/components/layout/app-layout"
import { useRouter } from "next/navigation"
import type { NavigationItem } from "@/types/layout"

export default function UserInterface() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("shopping-cart")

  // Si no hay usuario, redirigir al login
  if (!user) {
    router.push("/login")
    return null
  }

  // Elementos de navegación para usuarios logueados
  const userNavItems: NavigationItem[] = [
    { label: "Inicio", href: "/", isActive: false },
    { label: "Productos", href: "/productos", isActive: false },
    { label: "Mi Carrito", href: "/carrito", isActive: activeTab === "shopping-cart" },
    { label: "Mis Pedidos", href: "/pedidos", isActive: activeTab === "order-history" },
    { label: "Salir", href: "#", isActive: false, onClick: () => logout() },
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <AppLayout user={user} navigationItems={userNavItems} onLogout={logout}>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="shopping-cart" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shopping-cart">Mi Carrito</TabsTrigger>
            <TabsTrigger value="order-history">Historial de Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="shopping-cart">
            <ShoppingCartExample />
          </TabsContent>

          <TabsContent value="order-history">
            <OrderHistoryExample />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
