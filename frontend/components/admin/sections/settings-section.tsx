"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function SettingsSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
          <CardDescription>Ajustes generales y configuración</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <div className="text-center">
              <Settings className="h-12 w-12 mx-auto mb-4" />
              <p>Panel de configuración en desarrollo</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
