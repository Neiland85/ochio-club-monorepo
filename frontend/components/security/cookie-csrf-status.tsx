'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Cookie,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { CookieStatus, CSRFProtection } from '@/types/security-dashboard';

interface CookieCsrfStatusProps {
  cookieStatus: CookieStatus;
  csrfProtection: CSRFProtection;
}

export function CookieCsrfStatus({
  cookieStatus,
  csrfProtection,
}: CookieCsrfStatusProps) {
  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProtectionLevelBadge = (level: string) => {
    switch (level) {
      case 'basic':
        return <Badge className="bg-yellow-100 text-yellow-800">Básico</Badge>;
      case 'standard':
        return <Badge className="bg-blue-100 text-blue-800">Estándar</Badge>;
      case 'strict':
        return <Badge className="bg-green-100 text-green-800">Estricto</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Estado de Cookies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Estado de Cookies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {cookieStatus.totalCookies}
              </div>
              <p className="text-sm text-muted-foreground">Total Cookies</p>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${getComplianceColor(cookieStatus.complianceScore)}`}
              >
                {cookieStatus.complianceScore}%
              </div>
              <p className="text-sm text-muted-foreground">Cumplimiento</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Cookies Seguras</span>
              <div className="flex items-center gap-2">
                <Progress
                  value={
                    (cookieStatus.secureCookies / cookieStatus.totalCookies) *
                    100
                  }
                  className="w-20"
                />
                <span className="text-sm font-medium">
                  {cookieStatus.secureCookies}/{cookieStatus.totalCookies}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">HttpOnly</span>
              <div className="flex items-center gap-2">
                <Progress
                  value={
                    (cookieStatus.httpOnlyCookies / cookieStatus.totalCookies) *
                    100
                  }
                  className="w-20"
                />
                <span className="text-sm font-medium">
                  {cookieStatus.httpOnlyCookies}/{cookieStatus.totalCookies}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">SameSite</span>
              <div className="flex items-center gap-2">
                <Progress
                  value={
                    (cookieStatus.sameSiteCookies / cookieStatus.totalCookies) *
                    100
                  }
                  className="w-20"
                />
                <span className="text-sm font-medium">
                  {cookieStatus.sameSiteCookies}/{cookieStatus.totalCookies}
                </span>
              </div>
            </div>
          </div>

          {cookieStatus.violations > 0 && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-700">
                {cookieStatus.violations} violaciones detectadas
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-700">
              {cookieStatus.expiredCookies} cookies expiradas limpiadas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Protección CSRF */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Protección CSRF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado</span>
            {csrfProtection.enabled ? (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Activo
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Inactivo
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Nivel de Protección</span>
            {getProtectionLevelBadge(csrfProtection.protectionLevel)}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {csrfProtection.tokensGenerated.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Tokens Generados</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {csrfProtection.tokensValidated.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground">Tokens Validados</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Tasa de Validación</span>
              <div className="flex items-center gap-2">
                <Progress
                  value={
                    (csrfProtection.tokensValidated /
                      csrfProtection.tokensGenerated) *
                    100
                  }
                  className="w-20"
                />
                <span className="text-sm font-medium">
                  {(
                    (csrfProtection.tokensValidated /
                      csrfProtection.tokensGenerated) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>

            {csrfProtection.failedValidations > 0 && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-yellow-700">
                  {csrfProtection.failedValidations} validaciones fallidas
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4" />
            <span>
              Último refresh:{' '}
              {new Date(csrfProtection.lastTokenRefresh).toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
