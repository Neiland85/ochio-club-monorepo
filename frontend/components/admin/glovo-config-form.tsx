'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { GlovoConfigFormProps } from '@/types/admin-settings';

export default function GlovoConfigForm({
  config,
  onUpdate,
  onTest,
  isLoading,
}: GlovoConfigFormProps) {
  const [formData, setFormData] = useState(config);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    setTestResult(null);
  };

  const handleSave = async () => {
    try {
      await onUpdate(formData);
      setHasChanges(false);
      setTestResult({
        success: true,
        message: 'Configuración guardada exitosamente',
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Error al guardar la configuración',
      });
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      const success = await onTest();
      setTestResult({
        success,
        message: success
          ? 'Conexión exitosa con Glovo API'
          : 'Error de conexión con Glovo API',
      });
    } catch (error) {
      setTestResult({ success: false, message: 'Error al probar la conexión' });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusBadge = () => {
    switch (config.validationStatus) {
      case 'valid':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Válida
          </Badge>
        );
      case 'invalid':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Inválida
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Validando
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertTriangle className="w-3 h-3 mr-1" />
            No probada
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Configuración API de Glovo</CardTitle>
            <CardDescription>
              Configura la integración con Glovo para gestión de pedidos y
              entregas
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {testResult && (
          <Alert
            className={
              testResult.success
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }
          >
            <AlertDescription
              className={testResult.success ? 'text-green-800' : 'text-red-800'}
            >
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="apiKey">API Key de Glovo</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  placeholder="Ingresa tu API Key de Glovo"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="environment">Entorno</Label>
              <Select
                value={formData.environment}
                onValueChange={(value: 'sandbox' | 'production') =>
                  handleInputChange('environment', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el entorno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandbox">Sandbox (Pruebas)</SelectItem>
                  <SelectItem value="production">Producción</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="webhookUrl">URL de Webhook (Opcional)</Label>
              <Input
                id="webhookUrl"
                type="url"
                value={formData.webhookUrl || ''}
                onChange={(e) =>
                  handleInputChange('webhookUrl', e.target.value)
                }
                placeholder="https://tu-dominio.com/webhook/glovo"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) =>
                  handleInputChange('isActive', checked)
                }
              />
              <Label htmlFor="isActive">Activar integración con Glovo</Label>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Estado de la configuración
              </h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {config.lastUpdated && (
                  <p>
                    Última actualización: {config.lastUpdated.toLocaleString()}
                  </p>
                )}
                {config.lastValidated && (
                  <p>
                    Última validación: {config.lastValidated.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                onClick={handleTest}
                disabled={isTesting || !formData.apiKey}
                variant="outline"
                className="w-full"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Probando conexión...
                  </>
                ) : (
                  'Probar conexión'
                )}
              </Button>

              <Button
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar configuración'
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
