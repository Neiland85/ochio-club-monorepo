"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminPanelExample from "./admin-panel-example"
import BakeryDashboardExample from "./bakery-dashboard-example"
import GlovoOrderStatusExample from "./example-usage"
import AppLayout from "@/components/layout/app-layout"
import { useRouter } from "next/navigation"
import type { NavigationItem } from "@/types/layout"

export default function AdminInterface() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("admin-panel")

  // Si no hay usuario o no es admin/baker, redirigir
  if (!user || (user.role !== "admin" && user.role !== "baker")) {
    router.push("/login")
    return null
  }

  // Elementos de navegación para administradores
  const adminNavItems: NavigationItem[] = [
    { label: "Panel Principal", href: "/admin", isActive: activeTab === "admin-panel" },
    { label: "Control de Stock", href: "/admin/stock", isActive: activeTab === "control-stock" },
    { label: "Estados de Pedidos", href: "/admin/pedidos", isActive: activeTab === "orders" },
    { label: "Salir", href: "#", isActive: false, onClick: () => logout() },
  ]

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <AppLayout user={user} navigationItems={adminNavItems} onLogout={logout}>
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="admin-panel" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="admin-panel">Panel de Administración</TabsTrigger>
            <TabsTrigger value="control-stock">Control de Stock</TabsTrigger>
            <TabsTrigger value="orders">Estados de Pedidos</TabsTrigger>
          </TabsList>

          <TabsContent value="admin-panel">
            <AdminPanelExample />
          </TabsContent>

          <TabsContent value="control-stock">
            <BakeryDashboardExample />
          </TabsContent>

          <TabsContent value="orders">
            <GlovoOrderStatusExample />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
