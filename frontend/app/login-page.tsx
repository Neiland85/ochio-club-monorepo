"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import AppLayout from "@/components/layout/app-layout"
import type { NavigationItem } from "@/types/layout"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  // Elementos de navegación para usuarios no logueados
  const publicNavItems: NavigationItem[] = [
    { label: "Inicio", href: "/", isActive: false },
    { label: "Productos", href: "/productos", isActive: false },
    { label: "Sobre Nosotros", href: "/nosotros", isActive: false },
    { label: "Contacto", href: "/contacto", isActive: false },
    { label: "Iniciar Sesión", href: "/login", isActive: true },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simular autenticación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Datos de ejemplo para diferentes roles
      let userData

      if (email.includes("admin")) {
        userData = {
          id: "u1",
          name: "Ana García Martínez",
          email: email,
          role: "admin",
          avatar: "/placeholder.svg?height=40&width=40&query=ana+garcia",
        }
      } else if (email.includes("baker")) {
        userData = {
          id: "u2",
          name: "Carlos Rodríguez López",
          email: email,
          role: "baker",
          bakeryId: "b1",
        }
      } else {
        userData = {
          id: "u3",
          name: "María Sánchez Moreno",
          email: email,
          role: "customer",
        }
      }

      await login(userData)

      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido/a, ${userData.name}`,
      })

      // Redirigir según el rol
      if (userData.role === "admin" || userData.role === "baker") {
        router.push("/admin")
      } else {
        router.push("/user")
      }
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout navigationItems={publicNavItems}>
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">Ingresa tus credenciales para acceder a tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <p className="text-muted-foreground">Para probar diferentes roles, usa:</p>
              <p className="text-xs text-muted-foreground mt-1">
                admin@example.com, baker@example.com, o user@example.com
              </p>
              <p className="text-xs text-muted-foreground">(cualquier contraseña funcionará)</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  )
}
