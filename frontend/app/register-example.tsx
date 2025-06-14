"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import UserRegisterForm from "@/components/user-register-form"
import type { UserRegisterData } from "@/types/user-register"

export default function RegisterExample() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRegisterSubmit = async (data: UserRegisterData) => {
    setIsSubmitting(true)

    try {
      // Simular registro de usuario
      console.log("Registrando usuario con datos:", {
        ...data,
        // Ocultar contraseña en logs por seguridad
        password: "***",
      })

      // Simular llamada a API de registro
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular verificación de email único
      if (data.email === "test@test.com") {
        throw new Error("Este email ya está registrado")
      }

      // Mostrar confirmación
      toast({
        title: "¡Cuenta creada exitosamente!",
        description: `Bienvenido ${data.name} a Ochío Club. Hemos enviado un email de confirmación a ${data.email}`,
      })
    } catch (error) {
      toast({
        title: "Error al crear la cuenta",
        description: error instanceof Error ? error.message : "No se pudo crear la cuenta. Inténtelo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRedirectToLogin = () => {
    console.log("Redirigiendo al login...")
    // Aquí implementarías la navegación al login
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Registro en Ochío Club</h1>
        <p className="text-muted-foreground">Crea tu cuenta para pedir los mejores ochíos de Úbeda</p>
      </div>

      {/* Formulario principal */}
      <div className="max-w-md mx-auto">
        <UserRegisterForm
          onSubmit={handleRegisterSubmit}
          isSubmitting={isSubmitting}
          showPasswordStrength={true}
          redirectToLogin={handleRedirectToLogin}
        />
      </div>

      <Separator />

      {/* Información adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Beneficios de Ochío Club</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Pedidos rápidos de ochíos artesanales</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Descuentos exclusivos para miembros</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Seguimiento en tiempo real de tus pedidos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Acceso a variedades exclusivas de ochíos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Programa de fidelización con puntos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Notificaciones de nuevos sabores</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Obradores Artesanales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Horno Tradicional San Isidro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Panadería La Ubetense</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Obrador Artesanal El Portillo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Horno de Leña Santa Clara</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>Panadería Artesana La Plaza</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ejemplo con valores por defecto */}
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-lg">Ejemplo con Valores por Defecto</CardTitle>
          <CardDescription>Formulario pre-rellenado para pruebas</CardDescription>
        </CardHeader>
        <CardContent>
          <UserRegisterForm
            onSubmit={handleRegisterSubmit}
            isSubmitting={isSubmitting}
            showPasswordStrength={false}
            defaultValues={{
              name: "Antonio Martínez",
              email: "antonio.martinez@ejemplo.com",
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
