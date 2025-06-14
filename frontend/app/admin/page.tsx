"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/use-auth" // Ruta corregida
import AdminDashboardPanel from "../../components/admin/admin-dashboard-panel" // Ruta corregida
import { Shield, Lock, LogOut, Home } from "lucide-react"
import { Button } from "../../components/ui/button" // Ruta corregida

export default function AdminPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showAccessDenied, setShowAccessDenied] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else if (user && user.role !== "admin") {
        setShowAccessDenied(true)
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  // Pantalla de carga
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500">Verificando permisos...</p>
      </div>
    )
  }

  // Pantalla de acceso denegado
  if (showAccessDenied) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4">
            <Shield className="h-10 w-10 text-red-500" />
            <Lock className="h-6 w-6 text-red-500 absolute" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h1>
          <p className="text-gray-600 mb-6">Solo los administradores pueden acceder a esta sección.</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-1">Usuario actual:</p>
            <p className="font-medium mb-2">
              {user?.name || "Usuario"} ({user?.email})
            </p>
            <div className="flex items-center justify-between text-sm">
              <span>
                <span className="text-gray-500">Rol actual: </span>
                <span className="font-medium">{user?.role || "usuario"}</span>
              </span>
              <span>
                <span className="text-gray-500">Rol requerido: </span>
                <span className="font-medium text-red-500">admin</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1 gap-2" onClick={() => router.push("/")}>
              <Home size={16} />
              Volver al Inicio
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => {
                // Cerrar sesión
                router.push("/login")
              }}
            >
              <LogOut size={16} />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Si está autenticado y es admin, mostrar el panel
  return <AdminDashboardPanel />
}
