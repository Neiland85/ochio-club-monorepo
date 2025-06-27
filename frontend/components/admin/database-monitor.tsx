'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import {
  RefreshCw,
  Database,
  Activity,
  HardDrive,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
} from 'lucide-react';
import type { DatabaseMonitorProps } from '../../types/admin-settings';

export default function DatabaseMonitor({
  metrics,
  onRefresh,
  isLoading,
}: DatabaseMonitorProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await onRefresh();
      if (!response.ok) {
        throw new Error('Error al refrescar las métricas de la base de datos');
      }
    } catch (error) {
      console.error(error);
      alert('No se pudieron refrescar las métricas de la base de datos.');
    } finally {
      setRefreshing(false);
    }
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Saludable
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Advertencia
          </Badge>
        );
      case 'critical':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Crítico
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Monitoreo de PostgreSQL
            </CardTitle>
            <CardDescription>
              Estado y métricas de rendimiento de la base de datos
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getHealthBadge(metrics.health.status)}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Conexiones
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics.connections.active}/
                    {metrics.connections.maxConnections}
                  </p>
                  <Progress
                    value={
                      (metrics.connections.active /
                        metrics.connections.maxConnections) *
                      100
                    }
                    className="h-2 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Consultas/seg
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics.performance.queriesPerSecond}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Promedio: {metrics.performance.avgQueryTime}ms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Almacenamiento
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics.storage.usagePercentage}%
                  </p>
                  <Progress
                    value={metrics.storage.usagePercentage}
                    className="h-2 mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {metrics.storage.usedSize} / {metrics.storage.totalSize}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cache Hit
                  </p>
                  <p className="text-2xl font-bold">
                    {metrics.performance.cacheHitRatio}%
                  </p>
                  <Progress
                    value={metrics.performance.cacheHitRatio}
                    className="h-2 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalles de rendimiento */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rendimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Consultas lentas</span>
                <Badge
                  variant={
                    metrics.performance.slowQueries > 10
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {metrics.performance.slowQueries}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Tiempo promedio de consulta
                </span>
                <span className="text-sm font-mono">
                  {metrics.performance.avgQueryTime}ms
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Ratio de aciertos de caché
                </span>
                <span className="text-sm font-mono">
                  {metrics.performance.cacheHitRatio}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Consultas por segundo
                </span>
                <span className="text-sm font-mono">
                  {metrics.performance.queriesPerSecond}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado del sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tiempo de actividad</span>
                <span className="text-sm font-mono">
                  {metrics.health.uptime}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Último backup</span>
                <span className="text-sm font-mono">
                  {metrics.health.lastBackup.toLocaleDateString()}
                </span>
              </div>

              {metrics.health.replicationLag !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Lag de replicación
                  </span>
                  <Badge
                    variant={
                      metrics.health.replicationLag > 1000
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {metrics.health.replicationLag}ms
                  </Badge>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Errores recientes</span>
                <Badge
                  variant={
                    metrics.errors.recent > 0 ? 'destructive' : 'secondary'
                  }
                >
                  {metrics.errors.recent}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conexiones detalladas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalles de conexiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.connections.active}
                </div>
                <div className="text-sm text-muted-foreground">Activas</div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.connections.idle}
                </div>
                <div className="text-sm text-muted-foreground">Inactivas</div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold">
                  {metrics.connections.total}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas si hay problemas */}
        {(metrics.health.status !== 'healthy' || metrics.errors.recent > 0) && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertas del sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {metrics.health.status !== 'healthy' && (
                  <p className="text-sm text-yellow-800">
                    • Estado de la base de datos: {metrics.health.status}
                  </p>
                )}
                {metrics.errors.recent > 0 && (
                  <p className="text-sm text-yellow-800">
                    • Se detectaron {metrics.errors.recent} errores recientes
                  </p>
                )}
                {metrics.performance.slowQueries > 10 && (
                  <p className="text-sm text-yellow-800">
                    • Número elevado de consultas lentas:{' '}
                    {metrics.performance.slowQueries}
                  </p>
                )}
                {metrics.storage.usagePercentage > 80 && (
                  <p className="text-sm text-yellow-800">
                    • Uso de almacenamiento alto:{' '}
                    {metrics.storage.usagePercentage}%
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
