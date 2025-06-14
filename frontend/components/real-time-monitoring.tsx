"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Activity, Database, Server, Users, Zap, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react"

interface SystemMetrics {
  cpu: number
  ram: number
  disk: number
  network: number
  dbConnections: number
  apiLatency: number
  activeUsers: number
  errorRate: number
}

export default function RealTimeMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 45,
    ram: 68,
    disk: 34,
    network: 23,
    dbConnections: 127,
    apiLatency: 245,
    activeUsers: 1247,
    errorRate: 0.3,
  })

  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Obtener métricas de sistema desde el servidor
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/system-metrics')
        if (!response.ok) {
          throw new Error('Error al cargar las métricas del sistema')
        }
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error(error)
        alert('No se pudieron cargar las métricas del sistema.')
      }
    }

    fetchMetrics()
  }, [])

  // Simular datos en tiempo real (comentar al usar datos reales)
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        ram: Math.max(30, Math.min(95, prev.ram + (Math.random() - 0.5) * 8)),
        disk: Math.max(20, Math.min(80, prev.disk + (Math.random() - 0.5) * 5)),
        network: Math.max(10, Math.min(100, prev.network + (Math.random() - 0.5) * 15)),
        dbConnections: Math.max(50, Math.min(200, prev.dbConnections + Math.floor((Math.random() - 0.5) * 20))),
        apiLatency: Math.max(100, Math.min(500, prev.apiLatency + (Math.random() - 0.5) * 50)),
        activeUsers: Math.max(800, Math.min(2000, prev.activeUsers + Math.floor((Math.random() - 0.5) * 100))),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5)),
      }))
      setLastUpdate(new Date())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0]) return "text-green-600"
    if (value < thresholds[1]) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatusBadge = (value: number, thresholds: [number, number]) => {
    if (value < thresholds[0])
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Normal
        </Badge>
      )
    if (value < thresholds[1])
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Advertencia
        </Badge>
      )
    return <Badge variant="destructive">Crítico</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header con última actualización */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Monitoreo en Tiempo Real</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Última actualización: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Métricas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.toFixed(1)}%</div>
            <Progress value={metrics.cpu} className="mt-2" />
            <div className="flex items-center justify-between mt-2">
              {getStatusBadge(metrics.cpu, [70, 85])}
              <span className={`text-sm ${getStatusColor(metrics.cpu, [70, 85])}`}>
                {metrics.cpu < 70 ? "Óptimo" : metrics.cpu < 85 ? "Alto" : "Crítico"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RAM</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.ram.toFixed(1)}%</div>
            <Progress value={metrics.ram} className="mt-2" />
            <div className="flex items-center justify-between mt-2">
              {getStatusBadge(metrics.ram, [75, 90])}
              <span className={`text-sm ${getStatusColor(metrics.ram, [75, 90])}`}>
                {((metrics.ram * 8) / 100).toFixed(1)}GB / 8GB
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disco</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disk.toFixed(1)}%</div>
            <Progress value={metrics.disk} className="mt-2" />
            <div className="flex items-center justify-between mt-2">
              {getStatusBadge(metrics.disk, [60, 80])}
              <span className={`text-sm ${getStatusColor(metrics.disk, [60, 80])}`}>
                {((metrics.disk * 500) / 100).toFixed(0)}GB / 500GB
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Red</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.network.toFixed(1)}%</div>
            <Progress value={metrics.network} className="mt-2" />
            <div className="flex items-center justify-between mt-2">
              {getStatusBadge(metrics.network, [70, 90])}
              <span className={`text-sm ${getStatusColor(metrics.network, [70, 90])}`}>
                {((metrics.network * 100) / 100).toFixed(0)} Mbps
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Base de Datos y API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conexiones DB</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.dbConnections}</div>
            <p className="text-xs text-muted-foreground">de 200 máximo</p>
            <div className="flex items-center justify-between mt-2">
              {getStatusBadge((metrics.dbConnections / 200) * 100, [70, 90])}
              <span className="text-sm text-green-600">PostgreSQL</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latencia API</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.apiLatency.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">tiempo de respuesta</p>
            <div className="flex items-center justify-between mt-2">
              {getStatusBadge(metrics.apiLatency, [300, 500])}
              <span className={`text-sm ${getStatusColor(metrics.apiLatency, [300, 500])}`}>
                {metrics.apiLatency < 300 ? "Rápido" : metrics.apiLatency < 500 ? "Lento" : "Muy lento"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">conectados ahora</p>
            <div className="flex items-center justify-between mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                En línea
              </Badge>
              <span className="text-sm text-blue-600">+{Math.floor(Math.random() * 50)} nuevos</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Errores</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">última hora</p>
            <div className="flex items-center justify-between mt-2">
              {getStatusBadge(metrics.errorRate, [1, 5])}
              <span className={`text-sm ${getStatusColor(metrics.errorRate, [1, 5])}`}>
                {metrics.errorRate < 1 ? "Excelente" : metrics.errorRate < 5 ? "Aceptable" : "Problemático"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Activas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Alertas del Sistema
          </CardTitle>
          <CardDescription>Estado actual de las alertas y notificaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.cpu > 70 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">CPU Alto</p>
                  <p className="text-sm text-yellow-700">El uso de CPU está en {metrics.cpu.toFixed(1)}%</p>
                </div>
              </div>
            )}

            {metrics.ram > 75 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Memoria Alta</p>
                  <p className="text-sm text-yellow-700">El uso de RAM está en {metrics.ram.toFixed(1)}%</p>
                </div>
              </div>
            )}

            {metrics.apiLatency > 300 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">API Lenta</p>
                  <p className="text-sm text-yellow-700">Latencia de {metrics.apiLatency.toFixed(0)}ms detectada</p>
                </div>
              </div>
            )}

            {metrics.cpu <= 70 && metrics.ram <= 75 && metrics.apiLatency <= 300 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Sistema Saludable</p>
                  <p className="text-sm text-green-700">Todas las métricas están dentro de los rangos normales</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
