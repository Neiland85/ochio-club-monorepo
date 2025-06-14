"use client"

import UserLoginForm from "../../components/user-login-form"; // Ruta corregida
import AppLayout from "../../components/layout/app-layout"; // Ruta corregida
import { useAuth } from "../../hooks/use-auth"; // Ruta corregida
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import type { NavigationItem } from "../../types/layout"; // Ruta corregida

// Elementos de navegación para usuarios no logueados
const publicNavItems: NavigationItem[] = [
  { label: "Productos", href: "/productos", isActive: false },
  { label: "Sobre Nosotros", href: "/nosotros", isActive: false },
  { label: "Contacto", href: "/contacto", isActive: false },
]

export default function LoginPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin")
      } else if (user.role === "baker") {
        router.push("/baker")
      } else {
        router.push("/user")
      }
    }
  }, [isAuthenticated, user, router])

  return (
    <AppLayout navigationItems={publicNavItems}>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <UserLoginForm
          onSuccess={(user) => {
            console.log("Login exitoso:", user)
          }}
          onError={(error) => {
            console.error("Error en login:", error)
          }}
        />
      </div>
    </AppLayout>
  )
}
