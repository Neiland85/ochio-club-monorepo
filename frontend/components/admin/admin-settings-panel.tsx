"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Key, Database } from "lucide-react"
import GlovoConfigForm from "./admin/glovo-config-form"
import DatabaseMonitor from "./admin/database-monitor"
import type { AdminSettingsPanelProps } from "@/types/admin-settings"

export default function AdminSettingsPanel({
  glovoConfig,
  databaseMetrics,
  onUpdateGlovoConfig,
  onTestGlovoConnection,
  onRefreshMetrics,
  isLoading,
  className,
}: AdminSettingsPanelProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configuración del Sistema</h1>
      </div>

      <Tabs defaultValue="glovo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="glovo" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Glovo
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Base de Datos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="glovo">
          <GlovoConfigForm
            config={glovoConfig}
            onUpdate={onUpdateGlovoConfig}
            onTest={onTestGlovoConnection}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseMonitor metrics={databaseMetrics} onRefresh={onRefreshMetrics} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
