"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Clock, Shield, Lock, Eye, Settings, FileCheck } from "lucide-react"
import type { SecurityRecommendation } from "@/types/security-dashboard"

interface SecurityRecommendationsProps {
  recommendations: SecurityRecommendation[]
  onImplementRecommendation?: (id: string) => void
}

export function SecurityRecommendations({ recommendations, onImplementRecommendation }: SecurityRecommendationsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "authentication":
        return <Lock className="h-4 w-4" />
      case "encryption":
        return <Shield className="h-4 w-4" />
      case "access_control":
        return <Eye className="h-4 w-4" />
      case "monitoring":
        return <Settings className="h-4 w-4" />
      case "compliance":
        return <FileCheck className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "info":
        return <Badge variant="secondary">Info</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>
      case "error":
        return <Badge className="bg-orange-100 text-orange-800">Error</Badge>
      case "critical":
        return <Badge variant="destructive">Crítico</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "authentication":
        return "Autenticación"
      case "encryption":
        return "Encriptación"
      case "access_control":
        return "Control de Acceso"
      case "monitoring":
        return "Monitoreo"
      case "compliance":
        return "Cumplimiento"
      default:
        return category
    }
  }

  const pendingRecommendations = recommendations.filter((r) => !r.implemented)
  const implementedRecommendations = recommendations.filter((r) => r.implemented)

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingRecommendations.length}</div>
            <p className="text-xs text-muted-foreground">Recomendaciones por implementar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implementadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{implementedRecommendations.length}</div>
            <p className="text-xs text-muted-foreground">Mejoras completadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((implementedRecommendations.length / recommendations.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Completado</p>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones Pendientes */}
      {pendingRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Recomendaciones Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRecommendations
                .sort((a, b) => b.priority - a.priority)
                .map((recommendation) => (
                  <div key={recommendation.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(recommendation.category)}
                          <h4 className="font-medium">{recommendation.title}</h4>
                          {getSeverityBadge(recommendation.severity)}
                          <Badge variant="outline">{getCategoryLabel(recommendation.category)}</Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Tiempo estimado: {recommendation.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Prioridad: {recommendation.priority}/10</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        {onImplementRecommendation && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onImplementRecommendation(recommendation.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Implementar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones Implementadas */}
      {implementedRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Mejoras Implementadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {implementedRecommendations.slice(0, 5).map((recommendation) => (
                <div key={recommendation.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(recommendation.category)}
                      <span className="font-medium text-sm">{recommendation.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(recommendation.category)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}

              {implementedRecommendations.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  Y {implementedRecommendations.length - 5} mejoras más implementadas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
