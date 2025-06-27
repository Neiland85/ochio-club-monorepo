'use client';

import {
  Euro,
  ShoppingBag,
  Package,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { DashboardStats } from '@/types/bakery-dashboard';

interface StatsCardsProps {
  stats: DashboardStats;
  className?: string;
}

export default function StatsCards({ stats, className = '' }: StatsCardsProps) {
  // Asegurarse de que stats y sus propiedades existan
  if (!stats || !stats.sales || !stats.orders || !stats.products) {
    return (
      <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) =>
    `${amount.toFixed(2)}${stats.sales.currency}`;

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />;
    return null;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {/* Ventas Totales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.sales.total)}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            {getTrendIcon(stats.sales.percentageChange)}
            <span
              className={`ml-1 ${getTrendColor(stats.sales.percentageChange)}`}
            >
              {Math.abs(stats.sales.percentageChange)}% desde el mes pasado
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pedidos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.orders.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.orders.pending} pendientes, {stats.orders.completed}{' '}
            completados
          </p>
        </CardContent>
      </Card>

      {/* Productos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.products.total}</div>
          <p className="text-xs text-muted-foreground">
            {stats.products.active} activos, {stats.products.outOfStock}{' '}
            agotados
          </p>
        </CardContent>
      </Card>

      {/* Ventas de Hoy */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas de Hoy</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.sales.today)}
          </div>
          <p className="text-xs text-muted-foreground">
            Esta semana: {formatCurrency(stats.sales.thisWeek)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
