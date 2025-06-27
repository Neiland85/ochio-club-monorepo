'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Download,
  Search,
  Shield,
  AlertTriangle,
  Lock,
  Eye,
  Cookie,
  Activity,
} from 'lucide-react';
import type { SecurityLog } from '../../types/security-dashboard';
import { Badge } from '/Users/estudio/Projects/GitHub/NODE/ochio-club-monorepo/frontend/components/ui/badge';

interface SecurityLogsTableProps {
  logs: SecurityLog[];
  onExportLogs?: () => void;
}

export function SecurityLogsTable({
  logs: initialLogs,
  onExportLogs,
}: SecurityLogsTableProps) {
  const [logs, setLogs] = useState<SecurityLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('/api/security-logs');
        if (!response.ok) {
          throw new Error('Error al cargar los logs de seguridad');
        }
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error(error);
        alert('No se pudieron cargar los logs de seguridad.');
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.ip.includes(searchTerm) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesSeverity =
      severityFilter === 'all' || log.severity === severityFilter;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'access':
        return <Eye className="h-4 w-4" />;
      case 'attack':
        return <AlertTriangle className="h-4 w-4" />;
      case 'login':
        return <Lock className="h-4 w-4" />;
      case 'csrf':
        return <Shield className="h-4 w-4" />;
      case 'cookie':
        return <Cookie className="h-4 w-4" />;
      case 'suspicious':
        return <Activity className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return <Badge variant="secondary">Bajo</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medio</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Alto</Badge>;
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'access':
        return <Badge variant="outline">Acceso</Badge>;
      case 'attack':
        return <Badge variant="destructive">Ataque</Badge>;
      case 'login':
        return <Badge className="bg-blue-100 text-blue-800">Login</Badge>;
      case 'csrf':
        return <Badge className="bg-purple-100 text-purple-800">CSRF</Badge>;
      case 'cookie':
        return <Badge className="bg-green-100 text-green-800">Cookie</Badge>;
      case 'suspicious':
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Sospechoso</Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Logs de Seguridad
          </CardTitle>
          <Button onClick={onExportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por IP, acción o detalles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              <SelectItem value="access">Acceso</SelectItem>
              <SelectItem value="attack">Ataque</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="csrf">CSRF</SelectItem>
              <SelectItem value="cookie">Cookie</SelectItem>
              <SelectItem value="suspicious">Sospechoso</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Severidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las severidades</SelectItem>
              <SelectItem value="low">Bajo</SelectItem>
              <SelectItem value="medium">Medio</SelectItem>
              <SelectItem value="high">Alto</SelectItem>
              <SelectItem value="critical">Crítico</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Detalles</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.slice(0, 10).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(log.type)}
                      {getTypeBadge(log.type)}
                    </div>
                  </TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  <TableCell className="font-mono">
                    {log.ip}
                    {log.location && (
                      <div className="text-xs text-muted-foreground">
                        {log.location}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>
                    {log.blocked ? (
                      <Badge variant="destructive">Bloqueado</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">
                        Permitido
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={log.details}>
                    {log.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Mostrando 10 de {filteredLogs.length} logs. Usa los filtros para
              refinar la búsqueda.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
