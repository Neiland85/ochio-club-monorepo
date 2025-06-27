'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  RefreshCw,
  Search,
  CalendarIcon,
  Filter,
  AlertTriangle,
  Info,
  XCircle,
  Bug,
  Download,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type {
  SystemLogsProps,
  LogFilters,
  SystemLog,
} from '@/types/admin-settings';

export default function SystemLogsPanel({
  logs,
  onRefresh,
  isLoading,
}: SystemLogsProps) {
  const [filters, setFilters] = useState<LogFilters>({
    level: 'all',
    category: 'all',
    dateRange: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
      to: new Date(),
    },
    search: '',
  });
  const [filteredLogs, setFilteredLogs] = useState<SystemLog[]>(logs);

  useEffect(() => {
    const filtered = logs.filter((log) => {
      const matchesLevel =
        filters.level === 'all' || log.level === filters.level;
      const matchesCategory =
        filters.category === 'all' || log.category === filters.category;
      const matchesDate =
        log.timestamp >= filters.dateRange.from &&
        log.timestamp <= filters.dateRange.to;
      const matchesSearch =
        filters.search === '' ||
        log.message.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.source.toLowerCase().includes(filters.search.toLowerCase());

      return matchesLevel && matchesCategory && matchesDate && matchesSearch;
    });
    setFilteredLogs(filtered);
  }, [logs, filters]);

  const handleRefresh = async () => {
    await onRefresh(filters);
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'debug':
        return <Bug className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      error: 'destructive',
      warning: 'default',
      info: 'secondary',
      debug: 'outline',
    } as const;

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'secondary'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      api: 'bg-blue-100 text-blue-800',
      database: 'bg-green-100 text-green-800',
      auth: 'bg-purple-100 text-purple-800',
      orders: 'bg-orange-100 text-orange-800',
      system: 'bg-gray-100 text-gray-800',
      security: 'bg-red-100 text-red-800',
    };
    return (
      colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Logs del Sistema</CardTitle>
            <CardDescription>
              Monitoreo y análisis de eventos del sistema en tiempo real
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select
              value={filters.level}
              onValueChange={(value: any) =>
                setFilters((prev) => ({ ...prev, level: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="debug">Debug</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={filters.category}
              onValueChange={(value: any) =>
                setFilters((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="database">Base de datos</SelectItem>
                <SelectItem value="auth">Autenticación</SelectItem>
                <SelectItem value="orders">Pedidos</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
                <SelectItem value="security">Seguridad</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, 'LLL dd, y', {
                          locale: es,
                        })}{' '}
                        -{' '}
                        {format(filters.dateRange.to, 'LLL dd, y', {
                          locale: es,
                        })}
                      </>
                    ) : (
                      format(filters.dateRange.from, 'LLL dd, y', {
                        locale: es,
                      })
                    )
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={filters.dateRange.from}
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setFilters((prev) => ({
                        ...prev,
                        dateRange: { from: range.from!, to: range.to! },
                      }));
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en logs..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="pl-8"
              />
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold text-blue-600">
              {filteredLogs.filter((log) => log.level === 'info').length}
            </div>
            <div className="text-sm text-muted-foreground">Info</div>
          </div>
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredLogs.filter((log) => log.level === 'warning').length}
            </div>
            <div className="text-sm text-muted-foreground">Warnings</div>
          </div>
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold text-red-600">
              {filteredLogs.filter((log) => log.level === 'error').length}
            </div>
            <div className="text-sm text-muted-foreground">Errores</div>
          </div>
          <div className="text-center p-3 border rounded">
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </div>
        </div>

        {/* Lista de logs */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {getLogIcon(log.level)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getLevelBadge(log.level)}
                      <Badge className={getCategoryColor(log.category)}>
                        {log.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {log.source}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{log.message}</p>
                    {log.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.details}
                      </p>
                    )}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="text-xs text-muted-foreground mt-2">
                        {Object.entries(log.metadata).map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron logs con los filtros aplicados</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
