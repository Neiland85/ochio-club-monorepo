"use client"

import { Truck, MapPin, Zap } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { DeliveryOptionsProps, DeliveryOption } from "@/types/shopping-cart"

const deliveryConfig = {
  pickup: {
    label: "Recoger en tienda",
    description: "Recoge tu pedido en la panadería",
    icon: MapPin,
    time: "15-30 min",
    fee: 0,
  },
  delivery: {
    label: "Entrega a domicilio",
    description: "Entrega en tu dirección",
    icon: Truck,
    time: "30-45 min",
    fee: 2.5,
  },
  express: {
    label: "Entrega express",
    description: "Entrega rápida en 15-20 min",
    icon: Zap,
    time: "15-20 min",
    fee: 4.5,
  },
}

export default function DeliveryOptions({
  selectedOption,
  onOptionChange,
  deliveryFee,
  className = "",
}: DeliveryOptionsProps) {
  const formatCurrency = (amount: number) => (amount === 0 ? "Gratis" : `${amount.toFixed(2)}€`)

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Opciones de Entrega</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={(value) => onOptionChange(value as DeliveryOption)}>
          {Object.entries(deliveryConfig).map(([key, config]) => {
            const IconComponent = config.icon
            const isSelected = selectedOption === key

            return (
              <div key={key} className="flex items-center space-x-3">
                <RadioGroupItem value={key} id={key} />
                <Label
                  htmlFor={key}
                  className={`flex-1 cursor-pointer p-3 rounded-md border transition-colors ${
                    isSelected ? "bg-primary/5 border-primary" : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <div>
                        <div className="font-medium">{config.label}</div>
                        <div className="text-sm text-muted-foreground">{config.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">Tiempo: {config.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${isSelected ? "text-primary" : ""}`}>
                        {formatCurrency(config.fee)}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
