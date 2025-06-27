'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import StatsCards from './dashboard/stats-cards';
import OrdersTable from './dashboard/orders-table';
import ProductsSection from './dashboard/products-section';
import type { BakeryDashboardProps } from '@/types/bakery-dashboard';

export default function BakeryDashboard({
  stats,
  recentOrders = [],
  products = [],
  onAddProduct = () => {},
  onEditProduct = () => {},
  onDeleteProduct = () => {},
  onUpdateOrderStatus = () => {},
  onViewOrderDetails = () => {},
  isLoading = false,
  className = '',
}: BakeryDashboardProps) {
  if (isLoading || !stats) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Encabezado */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Control de Stock - Ochío Club
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu panadería artesanal de ochíos desde Úbeda con amor y
          tradición
        </p>
      </div>

      {/* Estadísticas */}
      <StatsCards stats={stats} />

      {/* Contenido principal con pestañas */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="orders">Pedidos Recientes</TabsTrigger>
          <TabsTrigger value="products">Gestión de Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <OrdersTable
            orders={recentOrders}
            onUpdateStatus={onUpdateOrderStatus}
            onViewDetails={onViewOrderDetails}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsSection
            products={products}
            onAddProduct={onAddProduct}
            onEditProduct={onEditProduct}
            onDeleteProduct={onDeleteProduct}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
