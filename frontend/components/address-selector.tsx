"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MapPin,
  Plus,
  Check,
  MoreVertical,
  Edit,
  Trash2,
  Phone,
  AlertCircle,
  Home,
  Building,
  Loader2,
} from "lucide-react"
import AddressForm from "./address-form"
import type { AddressSelectorProps, Address, AddressFormData } from "@/types/address-selector"

export default function AddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  isLoading = false,
  className = "",
}: AddressSelectorProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)

  // Manejar añadir nueva dirección
  const handleAddAddress = async (data: AddressFormData) => {
    setIsSubmitting(true)
    try {
      await onAddAddress({
        name: data.name,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        province: data.province,
        country: data.country,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        instructions: data.instructions,
        isDefault: data.isDefault,
      })
      setShowAddForm(false)
    } catch (error) {
      console.error("Error adding address:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejar editar dirección
  const handleEditAddress = async (data: AddressFormData) => {
    if (!editingAddress) return

    setIsSubmitting(true)
    try {
      await onEditAddress(editingAddress.id, {
        name: data.name,
        street: data.street,
        city: data.city,
        postalCode: data.postalCode,
        province: data.province,
        country: data.country,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        instructions: data.instructions,
        isDefault: data.isDefault,
      })
      setEditingAddress(null)
    } catch (error) {
      console.error("Error editing address:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Manejar eliminar dirección
  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta dirección?")) {
      try {
        await onDeleteAddress(addressId)
      } catch (error) {
        console.error("Error deleting address:", error)
      }
    }
  }

  // Obtener icono según el nombre de la dirección
  const getAddressIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes("casa") || lowerName.includes("hogar")) {
      return <Home className="h-4 w-4" />
    }
    if (lowerName.includes("trabajo") || lowerName.includes("oficina")) {
      return <Building className="h-4 w-4" />
    }
    return <MapPin className="h-4 w-4" />
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Cargando direcciones...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Dirección de Entrega
          </CardTitle>
          <CardDescription>Selecciona una dirección existente o añade una nueva para tu pedido</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No tienes direcciones guardadas. Añade una dirección para continuar con tu pedido.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedAddressId === address.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onSelectAddress(address.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getAddressIcon(address.name)}
                        <span className="font-medium">{address.name}</span>
                        {address.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Por defecto
                          </Badge>
                        )}
                        {selectedAddressId === address.id && (
                          <Badge className="text-xs bg-blue-500">
                            <Check className="h-3 w-3 mr-1" />
                            Seleccionada
                          </Badge>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.province} {address.postalCode}
                        </p>
                        <p>{address.country}</p>

                        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-100">
                          <span className="font-medium">{address.recipientName}</span>
                          <span className="flex items-center gap-1 text-xs">
                            <Phone className="h-3 w-3" />
                            {address.recipientPhone}
                          </span>
                        </div>

                        {address.instructions && (
                          <p className="text-xs text-gray-500 mt-1">
                            <strong>Instrucciones:</strong> {address.instructions}
                          </p>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingAddress(address)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteAddress(address.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Button variant="outline" className="w-full" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir Nueva Dirección
          </Button>
        </CardContent>
      </Card>

      {/* Modal para añadir dirección */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Añadir Nueva Dirección</DialogTitle>
          </DialogHeader>
          <AddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddForm(false)} isLoading={isSubmitting} />
        </DialogContent>
      </Dialog>

      {/* Modal para editar dirección */}
      <Dialog open={!!editingAddress} onOpenChange={() => setEditingAddress(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Dirección</DialogTitle>
          </DialogHeader>
          {editingAddress && (
            <AddressForm
              address={editingAddress}
              onSubmit={handleEditAddress}
              onCancel={() => setEditingAddress(null)}
              isLoading={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
