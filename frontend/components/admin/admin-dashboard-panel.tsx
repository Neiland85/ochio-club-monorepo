'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Users,
  Store,
  ScrollText,
  LayoutDashboard,
  ShoppingBag,
} from 'lucide-react';

// Importar componentes de secciones existentes
import UsersSection from './sections/users-section';
import BakeriesSection from './sections/bakeries-section'; // Definir BakeriesSection
import ProductsSection from './sections/products-section';
import OrdersSection from './sections/orders-section';
import StatsSection from './sections/stats-section';
import MonitoringSection from './sections/monitoring-section';
import LogsSection from './sections/logs-section';
import SettingsSection from './sections/settings-section';

type SectionType =
  | 'dashboard'
  | 'users'
  | 'bakeries'
  | 'products'
  | 'orders'
  | 'stats'
  | 'monitoring'
  | 'logs'
  | 'settings'
  | 'moderation'
  | 'realtime-logs'
  | 'demand-supply';

export default function AdminDashboardPanel() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    {
      id: 'dashboard' as SectionType,
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
    {
      id: 'users' as SectionType,
      icon: <Users size={20} />,
      label: 'Usuarios',
    },
    {
      id: 'bakeries' as SectionType,
      icon: <Store size={20} />,
      label: 'Panaderías',
    },
    {
      id: 'products' as SectionType,
      icon: <ShoppingBag size={20} />,
      label: 'Productos',
    },
    {
      id: 'orders' as SectionType,
      icon: <Package size={20} />,
      label: 'Pedidos',
    },
    {
      id: 'stats' as SectionType,
      icon: <BarChart2 size={20} />,
      label: 'Estadísticas',
    },
    {
      id: 'monitoring' as SectionType,
      icon: <Activity size={20} />,
      label: 'Monitoreo',
    },
    {
      id: 'logs' as SectionType,
      icon: <FileText size={20} />,
      label: 'Logs Sistema',
    },
    {
      id: 'settings' as SectionType,
      icon: <Settings size={20} />,
      label: 'Configuración',
    },
  ];

  const getSectionTitle = () => {
    const section = menuItems.find((item) => item.id === activeSection);
    return section?.label || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />;
      case 'users':
        return <UsersSection />;
      case 'bakeries':
        return <BakeriesSection />;
      case 'products':
        return <ProductsSection />;
      case 'orders':
        return <OrdersSection />;
      case 'stats':
        return <StatsSection />;
      case 'monitoring':
        return <MonitoringSection />;
      case 'logs':
        return <LogsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-md transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          {sidebarOpen ? (
            <h2 className="text-xl font-bold">Admin Panel</h2>
          ) : (
            <span className="mx-auto">🍞</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Button
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                  className={`w-full justify-${sidebarOpen ? 'start' : 'center'} ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  {item.icon}
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="ml-3">Cerrar sesión</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{getSectionTitle()}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{user?.name || 'Admin'}</span>
          </div>
        </header>

        <main className="p-6">{renderContent()}</main>
      </div>
    </div>
  );
}

// Componente del Dashboard principal
function DashboardContent() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <Progress value={45} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              12% menos que ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">RAM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <Progress value={68} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              8% más que ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34%</div>
            <Progress value={34} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Estable desde ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <Progress value={99.8} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Últimos 30 días
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Base de datos PostgreSQL</CardTitle>
            <CardDescription>Rendimiento y estado actual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Conexiones activas</h3>
                <p className="text-2xl font-bold">127</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Consultas/segundo</h3>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Errores recientes</h3>
                <p className="text-2xl font-bold text-red-500">3</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Latencia promedio</h3>
                <p className="text-2xl font-bold">12ms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Experiencia de usuario</CardTitle>
            <CardDescription>
              Métricas de satisfacción y rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">NPS Score</h3>
                <p className="text-2xl font-bold">8.7</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Incidencias</h3>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">
                  Tiempo de respuesta
                </h3>
                <p className="text-2xl font-bold">245ms</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Satisfacción</h3>
                <p className="text-2xl font-bold text-green-500">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Componente de Moderación
function ModerationSection() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reports = [
    {
      id: '1',
      user: 'Carlos Ruiz',
      email: 'carlos.ruiz@email.com',
      type: 'Spam',
      severity: 'Moderada',
      description: 'Usuario enviando mensajes promocionales no solicitados',
      reportedBy: 'María García',
      date: '2024-01-15',
      status: 'Pendiente',
    },
    {
      id: '2',
      user: 'Ana López',
      email: 'ana.lopez@email.com',
      type: 'Lenguaje ofensivo',
      severity: 'Grave',
      description: 'Comentarios inapropiados en reseñas de productos',
      reportedBy: 'Juan Pérez',
      date: '2024-01-14',
      status: 'En revisión',
    },
    {
      id: '3',
      user: 'Pedro Martín',
      email: 'pedro.martin@email.com',
      type: 'Contenido inapropiado',
      severity: 'Leve',
      description: 'Imágenes no relacionadas con productos en reseñas',
      reportedBy: 'Sistema automático',
      date: '2024-01-13',
      status: 'Pendiente',
    },
  ];

  const sanctions = [
    {
      user: 'Luis González',
      action: 'Silenciado',
      duration: '24 horas',
      reason: 'Spam en comentarios',
      date: '2024-01-12',
      appliedBy: 'Admin',
    },
    {
      user: 'Carmen Díaz',
      action: 'Suspendido',
      duration: '7 días',
      reason: 'Lenguaje ofensivo repetido',
      date: '2024-01-10',
      appliedBy: 'Admin',
    },
  ];

  const handleAction = (reportId: string, action: string) => {
    alert(`Acción "${action}" aplicada al reporte ${reportId}`);
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas de moderación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Reportes Pendientes
                </p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Acciones Hoy
                </p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Ban className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Usuarios Sancionados
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Casos Resueltos
                </p>
                <p className="text-2xl font-bold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reportes activos */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Activos</CardTitle>
          <CardDescription>
            Usuarios reportados por infracciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{report.user}</h3>
                      <Badge
                        variant={
                          report.severity === 'Grave'
                            ? 'destructive'
                            : report.severity === 'Moderada'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {report.severity}
                      </Badge>
                      <Badge variant="outline">{report.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {report.email}
                    </p>
                    <p className="text-sm">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Reportado por: {report.reportedBy}</span>
                      <span>Fecha: {report.date}</span>
                      <Badge variant="outline" className="text-xs">
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(report.id, 'Ver detalles')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(report.id, 'Silenciar')}
                    >
                      Silenciar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(report.id, 'Suspender')}
                    >
                      Suspender
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleAction(report.id, 'Banear')}
                    >
                      Banear
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historial de sanciones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Sanciones</CardTitle>
          <CardDescription>Acciones disciplinarias aplicadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sanctions.map((sanction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div>
                  <p className="font-medium">{sanction.user}</p>
                  <p className="text-sm text-muted-foreground">
                    {sanction.reason}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{sanction.action}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sanction.duration} - {sanction.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Logs en Tiempo Real
function RealTimeLogsSection() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const generateRealisticLog = () => {
      const logTypes = {
        authentication: {
          actions: [
            'user_login_success',
            'user_login_failed',
            'user_logout',
            'password_reset_request',
            'account_locked',
            'two_factor_enabled',
            'session_expired',
          ],
          severities: ['info', 'warning', 'error'],
        },
        orders: {
          actions: [
            'order_created',
            'order_payment_processed',
            'order_payment_failed',
            'order_assigned_to_bakery',
            'order_preparation_started',
            'order_ready_for_pickup',
            'order_out_for_delivery',
            'order_delivered',
            'order_cancelled',
            'order_refund_processed',
          ],
          severities: ['info', 'warning', 'error'],
        },
        bakery: {
          actions: [
            'bakery_registered',
            'bakery_status_updated',
            'product_added',
            'product_out_of_stock',
            'inventory_updated',
            'bakery_offline',
            'bakery_online',
            'production_capacity_reached',
          ],
          severities: ['info', 'warning', 'error'],
        },
        system: {
          actions: [
            'database_backup_completed',
            'database_backup_failed',
            'server_restart',
            'memory_usage_high',
            'disk_space_low',
            'api_rate_limit_exceeded',
            'cache_cleared',
            'scheduled_maintenance',
            'ssl_certificate_renewed',
            'security_scan_completed',
          ],
          severities: ['info', 'warning', 'error', 'critical'],
        },
        delivery: {
          actions: [
            'driver_assigned',
            'driver_location_updated',
            'delivery_route_optimized',
            'delivery_delayed',
            'driver_unavailable',
            'gps_tracking_lost',
            'delivery_completed',
            'customer_not_found',
          ],
          severities: ['info', 'warning', 'error'],
        },
        payment: {
          actions: [
            'payment_processed',
            'payment_declined',
            'refund_initiated',
            'refund_completed',
            'chargeback_received',
            'fraud_detected',
            'payment_gateway_timeout',
            'subscription_renewed',
          ],
          severities: ['info', 'warning', 'error', 'critical'],
        },
        security: {
          actions: [
            'suspicious_login_attempt',
            'multiple_failed_logins',
            'ip_address_blocked',
            'admin_access_granted',
            'permission_escalation_detected',
            'data_export_requested',
            'security_policy_updated',
            'vulnerability_scan_completed',
          ],
          severities: ['warning', 'error', 'critical'],
        },
      };

      // Datos compartidos
      const users = [
        'María García',
        'Juan Pérez',
        'Ana López',
        'Carlos Ruiz',
        'Admin',
        'Sistema',
      ];
      const orderIds = ['#1001', '#1002', '#1003', '#1004', '#1005', '#1006'];
      const bakeries = [
        'Panadería Los Molinos',
        'El Horno Dorado',
        'Pan Artesanal',
        'Tradición y Sabor',
        'El Rincón del Pan',
      ];
      const components = [
        'PostgreSQL',
        'Redis',
        'API Gateway',
        'File Storage',
        'Email Service',
      ];
      const drivers = [
        'Miguel Rodríguez',
        'Carmen López',
        'David Martín',
        'Laura Sánchez',
        'Roberto García',
      ];
      const amounts = [
        '€12.50',
        '€8.75',
        '€15.20',
        '€22.30',
        '€6.90',
        '€18.45',
      ];
      const ips = [
        '192.168.1.100',
        '10.0.0.45',
        '172.16.0.23',
        '203.0.113.15',
        '198.51.100.42',
      ];

      // Seleccionar tipo de log aleatoriamente con pesos realistas
      const typeWeights = {
        authentication: 0.25,
        orders: 0.3,
        bakery: 0.15,
        system: 0.1,
        delivery: 0.15,
        payment: 0.2,
        security: 0.05,
      };

      const random = Math.random();
      let cumulative = 0;
      let selectedType = 'system';

      for (const [type, weight] of Object.entries(typeWeights)) {
        cumulative += weight;
        if (random <= cumulative) {
          selectedType = type;
          break;
        }
      }

      const typeData = logTypes[selectedType];
      const action =
        typeData.actions[Math.floor(Math.random() * typeData.actions.length)];

      // Determinar severidad basada en la acción
      let severity = 'info';
      if (
        action.includes('failed') ||
        action.includes('error') ||
        action.includes('declined') ||
        action.includes('cancelled')
      ) {
        severity = 'error';
      } else if (
        action.includes('warning') ||
        action.includes('high') ||
        action.includes('low') ||
        action.includes('delayed') ||
        action.includes('timeout')
      ) {
        severity = 'warning';
      } else if (
        action.includes('fraud') ||
        action.includes('critical') ||
        action.includes('blocked') ||
        action.includes('suspicious')
      ) {
        severity = 'critical';
      }

      // Generar detalles específicos según el tipo
      let details = '';
      let user = 'Sistema';
      let metadata = {};

      switch (selectedType) {
        case 'authentication':
          user = users[Math.floor(Math.random() * users.length)];
          const ip = ips[Math.floor(Math.random() * ips.length)];
          details = `${user} - ${action.replace(/_/g, ' ')} desde IP ${ip}`;
          metadata = {
            ip,
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          };
          break;

        case 'orders':
          const orderId = orderIds[Math.floor(Math.random() * orderIds.length)];
          const customer = users[Math.floor(Math.random() * users.length)];
          const amount = amounts[Math.floor(Math.random() * amounts.length)];
          details = `Pedido ${orderId} - ${action.replace(/_/g, ' ')} - Cliente: ${customer} - Monto: ${amount}`;
          metadata = { order_id: orderId, customer, amount };
          break;

        case 'bakery':
          const bakery = bakeries[Math.floor(Math.random() * bakeries.length)];
          details = `${bakery} - ${action.replace(/_/g, ' ')}`;
          if (action.includes('product')) {
            const products = [
              'Ochío Clásico',
              'Ochío Integral',
              'Ochío con Semillas',
              'Ochío Dulce',
            ];
            const product =
              products[Math.floor(Math.random() * products.length)];
            details += ` - Producto: ${product}`;
            metadata = { bakery, product };
          } else {
            metadata = { bakery };
          }
          break;

        case 'system':
          const component =
            components[Math.floor(Math.random() * components.length)];
          details = `${component} - ${action.replace(/_/g, ' ')}`;
          if (action.includes('usage') || action.includes('space')) {
            const percentage = Math.floor(Math.random() * 40) + 60;
            details += ` - ${percentage}%`;
            metadata = { component, usage: `${percentage}%` };
          } else {
            metadata = { component };
          }
          break;

        case 'delivery':
          const driver = drivers[Math.floor(Math.random() * drivers.length)];
          const orderId2 =
            orderIds[Math.floor(Math.random() * orderIds.length)];
          details = `Repartidor ${driver} - ${action.replace(/_/g, ' ')} - Pedido ${orderId2}`;
          if (action.includes('location')) {
            const coords = `${(40.4 + Math.random() * 0.1).toFixed(4)}, ${(-3.7 + Math.random() * 0.1).toFixed(4)}`;
            details += ` - Ubicación: ${coords}`;
            metadata = { driver, order_id: orderId2, coordinates: coords };
          } else {
            metadata = { driver, order_id: orderId2 };
          }
          break;

        case 'payment':
          const amount2 = amounts[Math.floor(Math.random() * amounts.length)];
          const paymentId = `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          details = `Pago ${paymentId} - ${action.replace(/_/g, ' ')} - Monto: ${amount2}`;
          if (action.includes('fraud')) {
            const riskScore = Math.floor(Math.random() * 30) + 70;
            details += ` - Puntuación de riesgo: ${riskScore}%`;
            metadata = {
              payment_id: paymentId,
              amount: amount2,
              risk_score: riskScore,
            };
          } else {
            metadata = { payment_id: paymentId, amount: amount2 };
          }
          break;

        case 'security':
          const ip2 = ips[Math.floor(Math.random() * ips.length)];
          details = `Seguridad - ${action.replace(/_/g, ' ')} - IP: ${ip2}`;
          if (action.includes('failed')) {
            const attempts = Math.floor(Math.random() * 10) + 3;
            details += ` - ${attempts} intentos`;
            metadata = { ip: ip2, attempts };
          } else {
            metadata = { ip: ip2 };
          }
          break;
      }

      return {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString('es-ES', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        }),
        type: selectedType,
        action: action.replace(/_/g, ' '),
        user,
        details,
        severity,
        metadata,
        source: selectedType === 'system' ? 'server' : 'application',
      };
    };

    // Generar logs con frecuencia variable (más realista)
    const generateLogs = () => {
      const logsToGenerate = Math.floor(Math.random() * 3) + 1; // 1-3 logs por intervalo
      const newLogs = Array.from(
        { length: logsToGenerate },
        generateRealisticLog
      );

      setLogs((prev) => [...newLogs, ...prev.slice(0, 97)]); // Mantener 100 logs máximo
    };

    // Intervalo variable entre 1-4 segundos para simular actividad real
    const scheduleNextLog = () => {
      const delay = Math.random() * 3000 + 1000; // 1-4 segundos
      setTimeout(() => {
        generateLogs();
        scheduleNextLog();
      }, delay);
    };

    // Generar logs iniciales
    const initialLogs = Array.from({ length: 20 }, generateRealisticLog);
    setLogs(initialLogs);

    // Iniciar generación continua
    scheduleNextLog();

    // Cleanup no es necesario ya que usamos setTimeout recursivo
    return () => {};
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || log.type === filter;
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm) ||
      log.user.toLowerCase().includes(searchTerm) ||
      log.action.toLowerCase().includes(searchTerm) ||
      (log.metadata &&
        JSON.stringify(log.metadata).toLowerCase().includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'order':
        return <Package className="h-4 w-4 text-green-500" />;
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 font-bold';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar en logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="user">Usuario</SelectItem>
            <SelectItem value="order">Pedido</SelectItem>
            <SelectItem value="system">Sistema</SelectItem>
            <SelectItem value="security">Seguridad</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Eventos/min
                </p>
                <p className="text-2xl font-bold">30</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Advertencias
                </p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <X className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Errores
                </p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Uptime
                </p>
                <p className="text-2xl font-bold">99.9%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs en tiempo real */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Logs en Tiempo Real
            <Badge variant="outline" className="ml-auto">
              Actualizando cada 2s
            </Badge>
          </CardTitle>
          <CardDescription>
            Actividad del sistema en tiempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 border rounded text-sm hover:bg-gray-50"
              >
                <span className="text-xs text-muted-foreground font-mono min-w-[80px]">
                  {log.timestamp}
                </span>
                {getLogIcon(log.type)}
                <Badge
                  variant="outline"
                  className="text-xs min-w-[80px] justify-center"
                >
                  {log.type}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="truncate">{log.details}</div>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {Object.entries(log.metadata)
                        .slice(0, 2)
                        .map(([key, value]) => (
                          <span key={key} className="mr-3">
                            {key}: {String(value)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs font-medium ${getSeverityColor(log.severity)}`}
                  >
                    {log.severity.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {log.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Estadísticas Demanda/Oferta
function DemandSupplyStatsSection() {
  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Demanda Total
                </p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-green-500">+15% vs ayer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Panaderías Activas
                </p>
                <p className="text-2xl font-bold">15</p>
                <p className="text-xs text-blue-500">3 nuevas esta semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <BarChart2 className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Ratio Promedio
                </p>
                <p className="text-2xl font-bold">83</p>
                <p className="text-xs text-muted-foreground">
                  pedidos/panadería
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  Saturación
                </p>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-orange-500">Capacidad utilizada</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución por zonas */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Demanda por Zonas</CardTitle>
          <CardDescription>Análisis geográfico de pedidos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Centro</span>
                <div className="flex items-center gap-2">
                  <Progress value={45} className="w-24" />
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Norte</span>
                <div className="flex items-center gap-2">
                  <Progress value={25} className="w-24" />
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Sur</span>
                <div className="flex items-center gap-2">
                  <Progress value={20} className="w-24" />
                  <span className="text-sm font-medium">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Este</span>
                <div className="flex items-center gap-2">
                  <Progress value={10} className="w-24" />
                  <span className="text-sm font-medium">10%</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Recomendaciones:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Centro: Zona saturada, limitar nuevas panaderías</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <span>Norte: Equilibrio adecuado, mantener distribución</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Sur: Oportunidad de crecimiento moderado</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <span>
                    Este: Alta oportunidad, incentivar nuevas panaderías
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algoritmo de posicionamiento */}
      <Card>
        <CardHeader>
          <CardTitle>Algoritmo de Posicionamiento Equitativo</CardTitle>
          <CardDescription>
            Configuración del sistema de distribución
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Parámetros Actuales:</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Boost panaderías nuevas:</span>
                  <Badge variant="outline">+40% visibilidad</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Duración del boost:</span>
                  <Badge variant="outline">30 días</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Límite por panadería/zona:</span>
                  <Badge variant="outline">25% máximo</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rotación de destacados:</span>
                  <Badge variant="outline">Cada 6 horas</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Panaderías Beneficiadas:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Panadería El Rincón</span>
                  <Badge variant="secondary">Nuevo +40%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Horno Artesanal</span>
                  <Badge variant="secondary">Nuevo +40%</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">Pan y Tradición</span>
                  <Badge variant="outline">Rotación +15%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de equidad */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Equidad</CardTitle>
          <CardDescription>Indicadores de distribución justa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-green-500">92%</div>
              <div className="text-sm text-muted-foreground">
                Panaderías con pedidos regulares
              </div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-blue-500">3.2</div>
              <div className="text-sm text-muted-foreground">
                Coeficiente de Gini (equidad)
              </div>
            </div>
            <div className="text-center p-4 border rounded">
              <div className="text-2xl font-bold text-purple-500">15%</div>
              <div className="text-sm text-muted-foreground">
                Variación entre panaderías
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
