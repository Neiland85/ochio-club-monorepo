"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  MapPin,
  Lock,
  Settings,
  Camera,
  Save,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"

// Definir la estructura de datos del usuario
export interface UserProfileData {
  id?: string
  name: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    postalCode?: string
    province?: string
    state?: string
    country?: string
  }
  preferences?: {
    notifications?: {
      email?: boolean
      sms?: boolean
      push?: boolean
    }
    language?: string
    theme?: string
  }
  avatar?: string
  accountInfo?: {
    createdAt?: string
    lastLogin?: string
  }
}

export interface UserProfileProps {
  initialUserData: UserProfileData
  onUpdateProfile?: (data: UserProfileData) => Promise<void>
  onChangePassword?: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => Promise<void>
  onUpdatePreferences?: (preferences: any) => Promise<void>
  onUploadAvatar?: (file: File) => Promise<string>
}

export default function UserProfile({
  initialUserData,
  onUpdateProfile = async () => {},
  onChangePassword = async () => {},
  onUpdatePreferences = async () => {},
  onUploadAvatar = async () => "",
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState<UserProfileData>(initialUserData)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Validación del formulario de perfil
  const validateProfile = (): boolean => {
    const errors: Record<string, string> = {}

    if (!userData.name?.trim()) {
      errors.name = "El nombre es obligatorio"
    } else if (userData.name.length < 2) {
      errors.name = "El nombre debe tener al menos 2 caracteres"
    }

    if (!userData.email?.trim()) {
      errors.email = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = "Ingresa un email válido"
    }

    if (userData.phone && !/^[+]?[\d\s-()]{9,}$/.test(userData.phone)) {
      errors.phone = "Ingresa un número de teléfono válido"
    }

    if (userData.address?.postalCode && !/^\d{5}$/.test(userData.address.postalCode)) {
      errors.postalCode = "El código postal debe tener 5 dígitos"
    }

    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Validación del formulario de contraseña
  const validatePassword = (): boolean => {
    const errors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      errors.currentPassword = "La contraseña actual es obligatoria"
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "La nueva contraseña es obligatoria"
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "La contraseña debe tener al menos 8 caracteres"
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Confirma la nueva contraseña"
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden"
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Manejar actualización de perfil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateProfile()) return

    setIsSubmitting(true)
    try {
      await onUpdateProfile(userData)
      setSuccessMessage("Perfil actualizado correctamente")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejar cambio de contraseña
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePassword()) return

    setIsSubmitting(true)
    try {
      await onChangePassword(passwordData)
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setSuccessMessage("Contraseña cambiada correctamente")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error changing password:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejar subida de avatar
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB")
      return
    }

    try {
      const avatarUrl = await onUploadAvatar(file)
      setUserData((prev) => ({ ...prev, avatar: avatarUrl }))
      setSuccessMessage("Avatar actualizado correctamente")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Error uploading avatar:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-muted-foreground">Gestiona tu información personal y preferencias</p>
      </div>

      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Información Personal</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="preferences">Preferencias</TabsTrigger>
        </TabsList>

        {/* Información Personal */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
              <CardDescription>Actualiza tu información personal y datos de contacto</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={userData.avatar || "/placeholder.svg?height=80&width=80&query=user"}
                      alt={userData.name}
                    />
                    <AvatarFallback className="text-lg">
                      {userData.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="avatar" className="cursor-pointer">
                      <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                        <Camera className="h-4 w-4" />
                        Cambiar foto
                      </div>
                    </Label>
                    <Input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG o GIF. Máximo 5MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nombre */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={userData.name || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                      className={profileErrors.name ? "border-red-500" : ""}
                    />
                    {profileErrors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {profileErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                      className={profileErrors.email ? "border-red-500" : ""}
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {profileErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={userData.phone || ""}
                      onChange={(e) => setUserData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+34 600 000 000"
                      className={profileErrors.phone ? "border-red-500" : ""}
                    />
                    {profileErrors.phone && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {profileErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Dirección */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Dirección
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="street">Dirección</Label>
                      <Input
                        id="street"
                        value={userData.address?.street || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...(prev.address || {}), street: e.target.value },
                          }))
                        }
                        placeholder="Calle, número, piso..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={userData.address?.city || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...(prev.address || {}), city: e.target.value },
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        value={userData.address?.postalCode || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...(prev.address || {}), postalCode: e.target.value },
                          }))
                        }
                        placeholder="23400"
                        className={profileErrors.postalCode ? "border-red-500" : ""}
                      />
                      {profileErrors.postalCode && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {profileErrors.postalCode}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Provincia</Label>
                      <Input
                        id="province"
                        value={userData.address?.province || userData.address?.state || ""}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            address: { ...(prev.address || {}), province: e.target.value },
                          }))
                        }
                        placeholder="Jaén"
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Seguridad */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>Cambia tu contraseña y gestiona la seguridad de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Contraseña actual */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      className={passwordErrors.currentPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                {/* Nueva contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      className={passwordErrors.newPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    "Cambiar Contraseña"
                  )}
                </Button>
              </form>

              {/* Información adicional de seguridad */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Información de la cuenta</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    <strong>Cuenta creada:</strong>{" "}
                    {userData.accountInfo?.createdAt
                      ? new Date(userData.accountInfo.createdAt).toLocaleDateString("es-ES")
                      : "N/A"}
                  </p>
                  {userData.accountInfo?.lastLogin && (
                    <p>
                      <strong>Último acceso:</strong>{" "}
                      {new Date(userData.accountInfo.lastLogin).toLocaleDateString("es-ES")}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferencias */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Preferencias
              </CardTitle>
              <CardDescription>Personaliza tu experiencia en Ochío Club</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notificaciones */}
              <div>
                <h3 className="text-lg font-medium mb-4">Notificaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Notificaciones por email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe actualizaciones sobre tus pedidos por email
                      </p>
                    </div>
                    <Switch id="email-notifications" checked={userData.preferences?.notifications?.email ?? true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">Notificaciones por SMS</Label>
                      <p className="text-sm text-muted-foreground">Recibe alertas importantes por mensaje de texto</p>
                    </div>
                    <Switch id="sms-notifications" checked={userData.preferences?.notifications?.sms ?? false} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Notificaciones push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones en tiempo real en tu navegador
                      </p>
                    </div>
                    <Switch id="push-notifications" checked={userData.preferences?.notifications?.push ?? true} />
                  </div>
                </div>
              </div>

              {/* Idioma */}
              <div>
                <h3 className="text-lg font-medium mb-4">Idioma</h3>
                <Select defaultValue={userData.preferences?.language ?? "es"}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ca">Català</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tema */}
              <div>
                <h3 className="text-lg font-medium mb-4">Tema</h3>
                <Select defaultValue={userData.preferences?.theme ?? "system"}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="Seleccionar tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="dark">Oscuro</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>
                <Save className="mr-2 h-4 w-4" />
                Guardar Preferencias
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
