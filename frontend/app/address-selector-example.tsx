"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, MapPin, CheckCircle } from "lucide-react"
import AddressSelector from "@/components/address-selector"
import type { Address } from "@/types/address-selector"

// Direcciones de ejemplo
const sampleAddresses: Address[] = [
  {
    id: "1",
    name: "Casa",
    street: "Calle Real, 123, 2º A",
    city: "Úbeda",
    postalCode: "23400",
    province: "Jaén",
    country: "España",
    isDefault: true,
    recipientName: "María García López",
    recipientPhone: "+34 666 777 888",
    instructions: "Timbre 2A. Si no hay nadie, dejar con el portero.",
  },
  {
    id: "2",
    name: "Trabajo",
    street: "Avenida de Andalucía, 45, Oficina 3",
    city: "Úbeda",
    postalCode: "23400",
    province: "Jaén",
    country: "España",
    isDefault: false,
    recipientName: "María García López",
    recipientPhone: "+34 953 123 456",
    instructions: "Horario de oficina: 9:00 - 18:00. Preguntar por María en recepción.",
  },
  {
    id: "3",
    name: "Casa de mis padres",
    street: "Plaza de Santa María, 8",
    city: "Baeza",
    postalCode: "23440",
    province: "Jaén",
    country: "España",
    isDefault: false,
    recipientName: "Carmen López Ruiz",
    recipientPhone: "+34 666 555 444",
    instructions: "Casa con puerta verde. Llamar al timbre dos veces.",
  },
]

export default function AddressSelectorExample() {
  const [addresses, setAddresses] = useState<Address[]>(sampleAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses.find((addr) => addr.isDefault)?.id || "")
  const [isLoading, setIsLoading] = useState(false)
  const [orderStep, setOrderStep] = useState<"address" | "confirmation">("address")

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)

  // Simular añadir dirección
  const handleAddAddress = async (newAddress: Omit<Address, "id">) => {
    setIsLoading(true)
    // Simular llamada a API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const address: Address = {
      ...newAddress,
      id: Date.now().toString(),
    }

    // Si es la dirección por defecto, quitar el flag de las demás
    if (address.isDefault) {
      setAddresses((prev) => prev.map((addr) => ({ ...addr, isDefault: false })))
    }

    setAddresses((prev) => [...prev, address])
    setSelectedAddressId(address.id)
    setIsLoading(false)
  }

  // Simular editar dirección
  const handleEditAddress = async (addressId: string, updates: Partial<Address>) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === addressId) {
          const updatedAddress = { ...addr, ...updates }

          // Si se marca como por defecto, quitar el flag de las demás
          if (updatedAddress.isDefault) {
            return updatedAddress
          }
          return updatedAddress
        }
        // Si la dirección editada se marca como por defecto, quitar el flag de las demás
        if (updates.isDefault) {
          return { ...addr, isDefault: false }
        }
        return addr
      }),
    )
    setIsLoading(false)
  }

  // Simular eliminar dirección
  const handleDeleteAddress = async (addressId: string) => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))

    // Si se eliminó la dirección seleccionada, seleccionar otra
    if (selectedAddressId === addressId) {
      const remainingAddresses = addresses.filter((addr) => addr.id !== addressId)
      const defaultAddress = remainingAddresses.find((addr) => addr.isDefault)
      setSelectedAddressId(defaultAddress?.id || remainingAddresses[0]?.id || "")
    }

    setIsLoading(false)
  }

  const handleContinueOrder = () => {
    if (selectedAddress) {
      setOrderStep("confirmation")
    }
  }

  const handleBackToAddress = () => {
    setOrderStep("address")
  }

  if (orderStep === "confirmation") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Confirmación de Pedido
            </CardTitle>
            <CardDescription>Revisa los detalles de tu pedido antes de confirmar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dirección seleccionada */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Dirección de Entrega
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{selectedAddress?.name}</span>
                  {selectedAddress?.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Por defecto
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{selectedAddress?.street}</p>
                  <p>
                    {selectedAddress?.city}, {selectedAddress?.province} {selectedAddress?.postalCode}
                  </p>
                  <p>{selectedAddress?.country}</p>
                  <div className="flex items-center gap-4 mt-2 pt-2 border-t border-gray-200">
                    <span className="font-medium">{selectedAddress?.recipientName}</span>
                    <span className="text-xs">{selectedAddress?.recipientPhone}</span>
                  </div>
                  {selectedAddress?.instructions && (
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Instrucciones:</strong> {selectedAddress.instructions}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div>
              <h3 className="font-medium mb-3">Resumen del Pedido</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>2x Ochío Tradicional</span>
                  <span>€5.00</span>
                </div>
                <div className="flex justify-between">
                  <span>1x Ochío con Aceitunas</span>
                  <span>€3.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Gastos de envío</span>
                  <span>€2.50</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>€10.50</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleBackToAddress} className="flex-1">
                Cambiar Dirección
              </Button>
              <Button className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Confirmar Pedido
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Selector de Dirección</h1>
        <p className="text-muted-foreground">
          Ejemplo del componente AddressSelector para gestionar direcciones de entrega
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector de direcciones */}
        <div className="lg:col-span-2">
          <AddressSelector
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelectAddress={setSelectedAddressId}
            onAddAddress={handleAddAddress}
            onEditAddress={handleEditAddress}
            onDeleteAddress={handleDeleteAddress}
            isLoading={isLoading}
          />
        </div>

        {/* Panel lateral con resumen */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>2x Ochío Tradicional</span>
                  <span>€5.00</span>
                </div>
                <div className="flex justify-between">
                  <span>1x Ochío con Aceitunas</span>
                  <span>€3.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Gastos de envío</span>
                  <span>€2.50</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>€10.50</span>
                </div>
              </div>

              <Button className="w-full" disabled={!selectedAddressId} onClick={handleContinueOrder}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Continuar Pedido
              </Button>

              {!selectedAddressId && (
                <p className="text-xs text-red-500 text-center">Selecciona una dirección para continuar</p>
              )}
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Entrega en 24-48 horas</p>
              <p>• Envío gratuito en pedidos superiores a €15</p>
              <p>• Horario de entrega: 9:00 - 20:00</p>
              <p>• Seguimiento en tiempo real</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
