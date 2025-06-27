'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Download, Shield } from 'lucide-react';
import type { SecurityDashboardProps } from '@/types/security-dashboard';
import { SecurityMetricsCards } from '@/components/security/security-metrics-cards';
import { SecurityLogsTable } from '@/components/security/security-logs-table';
import { AttackAttemptsPanel } from '@/components/security/attack-attempts-panel';
import { CookieCsrfStatus } from '@/components/security/cookie-csrf-status';
import { SecurityRecommendations } from '@/components/security/security-recommendations';

export default function SecurityDashboard({
  metrics,
  logs,
  attacks,
  cookieStatus,
  csrfProtection,
  recommendations,
  onRefreshData,
  onExportLogs,
  onBlockIP,
  onImplementRecommendation,
}: SecurityDashboardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshData?.();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Panel de Seguridad
          </h1>
          <p className="text-muted-foreground">
            Monitoreo y gestión de la seguridad del sistema
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onExportLogs}
            disabled={isRefreshing}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Logs
          </Button>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <SecurityMetricsCards metrics={metrics} />

      {/* Tabs de Contenido */}
      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="logs">Logs de Seguridad</TabsTrigger>
          <TabsTrigger value="attacks">Ataques</TabsTrigger>
          <TabsTrigger value="protection">Protección</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          <SecurityLogsTable logs={logs} onExportLogs={onExportLogs} />
        </TabsContent>

        <TabsContent value="attacks" className="space-y-6">
          <AttackAttemptsPanel attacks={attacks} onBlockIP={onBlockIP} />
        </TabsContent>

        <TabsContent value="protection" className="space-y-6">
          <CookieCsrfStatus
            cookieStatus={cookieStatus}
            csrfProtection={csrfProtection}
          />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <SecurityRecommendations
            recommendations={recommendations}
            onImplementRecommendation={onImplementRecommendation}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
