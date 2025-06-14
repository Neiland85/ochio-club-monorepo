"use client"

import { useState } from "react"
import UserProfile from "@/components/user-profile"
import type { UserProfileData, UserProfileFormData, ChangePasswordData, UserPreferences } from "@/types/user-profile"

// Datos de ejemplo del usuario
const mockUser: UserProfileData = {
  id: "user-123",
  name: "María García López",
  email: "maria.garcia@email.com",
  phone: "+34 666 123 456",
  address: {
    street: "Calle Real, 25, 2º A",
    city: "Úbeda",
    postalCode: "23400",
    province: "Jaén",
    country: "España",
    isDefault: true,
  },
  preferences: {
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
    language: "es",
    theme: "system",
  },
  avatar: "/placeholder.svg?height=80&width=80&query=user+avatar",
  createdAt: "2023-01-15T10:30:00Z",
  lastLogin: "2024-01-20T14:45:00Z",
}

export default function UserProfileExample() {
  const [user, setUser] = useState<UserProfileData>(mockUser)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateProfile = async (data: UserProfileFormData) => {
    setIsLoading(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setUser((prev) => ({
      ...prev,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    }))

    setIsLoading(false)
    console.log("Perfil actualizado:", data)
  }

  const handleChangePassword = async (data: ChangePasswordData) => {
    setIsLoading(true)

    // Simular validación de contraseña actual
    if (data.currentPassword !== "password123") {
      setIsLoading(false)
      throw new Error("La contraseña actual no es correcta")
    }

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    console.log("Contraseña cambiada correctamente")
  }

  const handleUpdatePreferences = async (preferences: UserPreferences) => {
    setIsLoading(true)

    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUser((prev) => ({
      ...prev,
      preferences,
    }))

    setIsLoading(false)
    console.log("Preferencias actualizadas:", preferences)
  }

  const handleUploadAvatar = async (file: File): Promise<string> => {
    // Simular subida de archivo
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // En una aplicación real, aquí subirías el archivo a tu servidor/CDN
    const newAvatarUrl = `/placeholder.svg?height=80&width=80&query=new+avatar+${Date.now()}`

    setUser((prev) => ({
      ...prev,
      avatar: newAvatarUrl,
    }))

    return newAvatarUrl
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfile
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onChangePassword={handleChangePassword}
        onUpdatePreferences={handleUpdatePreferences}
        onUploadAvatar={handleUploadAvatar}
        isLoading={isLoading}
      />
    </div>
  )
}
