"use client"

import { useAuth } from "@/hooks/use-auth"
import RegisterExample from "./register-example"
import AppLayout from "@/components/layout/app-layout"
import { useRouter } from "next/navigation"
import type { NavigationItem } from "@/types/layout"

export default function RegisterInterface() {
  const { user } = useAuth()
  const router = useRouter()

  // Si ya hay un usuario logueado, redirigir a su interfaz correspondiente
  if (user) {
    if (user.role === "admin" || user.role === "baker") {
      router.push("/admin")
    } else {
      router.push("/user")
    }
    return null
  }

  // Elementos de navegación para usuarios no logueados
  const publicNavItems: NavigationItem[] = [
    { label: "Inicio", href: "/", isActive: false },
    { label: "Productos", href: "/productos", isActive: false },
    { label: "Sobre Nosotros", href: "/nosotros", isActive: false },
    { label: "Contacto", href: "/contacto", isActive: false },
    { label: "Iniciar Sesión", href: "/login", isActive: false },
  ]

  return (
    <AppLayout navigationItems={publicNavItems}>
      <div className="container mx-auto px-4 py-8">
        <RegisterExample />
      </div>
    </AppLayout>
  )
}
