"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/use-auth.js"
import AppLayout from "../components/layout/app-layout.jsx"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs.jsx"
import ShoppingCartExample from "../shopping-cart-example.jsx"
import UserProfile from "../components/user-profile.jsx"
import { Button } from "../components/ui/button.jsx"
import { LogOut } from "lucide-react"
import type { NavigationItem } from "../types/layout.d.ts"

export default function UserPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Elementos de navegación para usuarios logueados
  const userNavItems: NavigationItem[] = [
    { label: "Productos", href: "/productos", isActive: false },
    { label: "Mis Pedidos", href: "/user", isActive: true },
    { label: "Sobre Nosotros", href: "/nosotros", isActive: false },
    { label: "Contacto", href: "/contacto", isActive: false },
  ]

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (la redirección se encargará)
  if (!isAuthenticated || !user) {
    return null
  }

  // Datos de usuario para el perfil
  const userProfileData = {
    name: user.name || "Usuario",
    email: user.email || "usuario@example.com",
    phone: user.phone || "",
    address: {
      street: user.address?.street || "",
      city: user.address?.city || "",
      postalCode: user.address?.postalCode || "",
      province: user.address?.province || "",
      country: "España",
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      language: "es",
      theme: "light",
    },
    avatar: user.avatar || "/placeholder.svg?height=80&width=80&query=user",
    accountInfo: {
      createdAt: "2023-01-15",
      lastLogin: "2024-01-20",
    },
  }

  return (
    <AppLayout
      navigationItems={userNavItems}
      rightContent={
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="block font-medium">Hola, {user?.name?.split(" ")[0] || "Usuario"}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => logout()} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>Salir</span>
          </Button>
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mi Cuenta</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
            <TabsTrigger value="cart">Mi Carrito</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <UserProfile
              initialUserData={userProfileData}
              onUpdateProfile={async (data: Record<string, unknown>) => {
                console.log("Actualizando perfil:", data)
                // Aquí iría la lógica para actualizar el perfil
                await new Promise((resolve) => setTimeout(resolve, 1000))
                return Promise.resolve()
              }}
              onChangePassword={async (data: Record<string, unknown>) => {
                console.log("Cambiando contraseña:", data)
                // Aquí iría la lógica para cambiar la contraseña
                await new Promise((resolve) => setTimeout(resolve, 1000))
                return Promise.resolve()
              }}
            />
          </TabsContent>

          <TabsContent value="orders">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Historial de Pedidos</h2>
              <p className="text-muted-foreground">Aquí podrás ver todos tus pedidos anteriores y su estado actual.</p>
              {/* Aquí iría el componente de historial de pedidos */}
              <div className="mt-4 p-8 border border-dashed border-gray-300 rounded-md text-center">
                <p className="text-muted-foreground">Componente de Historial de Pedidos</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cart">
            <ShoppingCartExample />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
