'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Globe, Ban } from 'lucide-react';
import type { AttackAttempt } from '@/types/security-dashboard';

interface AttackAttemptsPanelProps {
  attacks: AttackAttempt[];
  onBlockIP?: (ip: string) => void;
}

export function AttackAttemptsPanel({
  attacks,
  onBlockIP,
}: AttackAttemptsPanelProps) {
  const getAttackTypeLabel = (type: string) => {
    switch (type) {
      case 'sql_injection':
        return 'Inyección SQL';
      case 'xss':
        return 'Cross-Site Scripting';
      case 'brute_force':
        return 'Fuerza Bruta';
      case 'ddos':
        return 'DDoS';
      case 'csrf':
        return 'CSRF';
      case 'path_traversal':
        return 'Path Traversal';
      default:
        return type;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const recentAttacks = attacks.slice(0, 5);
  const totalAttempts = attacks.reduce(
    (sum, attack) => sum + attack.attempts,
    0
  );
  const blockedAttacks = attacks.filter((attack) => attack.blocked).length;
  const blockRate =
    attacks.length > 0 ? (blockedAttacks / attacks.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Estadísticas de Ataques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Intentos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalAttempts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              En las últimas 24 horas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ataques Bloqueados
            </CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {blockedAttacks}
            </div>
            <Progress value={blockRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {blockRate.toFixed(1)}% de efectividad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPs Únicas</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(attacks.map((a) => a.ip)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Direcciones diferentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Ataques Recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Ataques Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAttacks.map((attack) => (
              <div
                key={attack.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getSeverityColor(attack.severity)}>
                      {attack.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {getAttackTypeLabel(attack.type)}
                    </Badge>
                    {attack.blocked && (
                      <Badge variant="destructive">Bloqueado</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">IP:</span>
                      <span className="font-mono ml-1">{attack.ip}</span>
                    </div>
                    <div>
                      <span className="font-medium">País:</span>{' '}
                      {attack.country}
                    </div>
                    <div>
                      <span className="font-medium">Intentos:</span>{' '}
                      {attack.attempts}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    {attack.details}
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(attack.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="ml-4">
                  {!attack.blocked && onBlockIP && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onBlockIP(attack.ip)}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Bloquear IP
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
