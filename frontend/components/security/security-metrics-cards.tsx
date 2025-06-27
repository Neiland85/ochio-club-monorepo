'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Lock, RefreshCw } from 'lucide-react';
import type { SecurityMetrics } from '@/types/security-dashboard';

interface SecurityMetricsCardsProps {
  metrics: SecurityMetrics;
}

export function SecurityMetricsCards({ metrics }: SecurityMetricsCardsProps) {
  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Puntuación de Seguridad
          </CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            <span className={getSecurityScoreColor(metrics.securityScore)}>
              {metrics.securityScore}%
            </span>
          </div>
          <Progress value={metrics.securityScore} className="mb-2" />
          <Badge className={getSecurityScoreBadge(metrics.securityScore)}>
            {metrics.securityScore >= 90
              ? 'Excelente'
              : metrics.securityScore >= 70
                ? 'Bueno'
                : 'Necesita Atención'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ataques Bloqueados
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 mb-2">
            {metrics.blockedAttacks.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            De {metrics.totalRequests.toLocaleString()} solicitudes totales
          </p>
          <div className="mt-2">
            <Badge variant="destructive">
              {((metrics.blockedAttacks / metrics.totalRequests) * 100).toFixed(
                2
              )}
              % bloqueados
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Autenticación</CardTitle>
          <Lock className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 mb-2">
            {metrics.successfulLogins.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mb-2">Logins exitosos</p>
          <div className="flex gap-2">
            <Badge variant="outline">{metrics.failedLogins} fallos</Badge>
            <Badge variant="secondary">
              {(
                (metrics.successfulLogins /
                  (metrics.successfulLogins + metrics.failedLogins)) *
                100
              ).toFixed(1)}
              % éxito
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Protección CSRF</CardTitle>
          <RefreshCw className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 mb-2">
            {metrics.csrfTokensGenerated.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mb-2">Tokens generados</p>
          <Badge className="bg-blue-100 text-blue-800">Activo</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
