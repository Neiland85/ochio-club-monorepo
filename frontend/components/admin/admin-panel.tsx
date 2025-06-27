'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import UsersTable from './admin/users-table';
import BakeriesTable from './admin/bakeries-table';
import ProductsTable from './admin/products-table';
import OrdersTable from './admin/orders-table';
import type { AdminPanelProps } from '@/types/admin-panel';

export default function AdminPanel({
  users = [],
  bakeries = [],
  products = [],
  orders = [],
  onUserEdit = () => {},
  onUserDelete = () => {},
  onUserStatusChange = () => {},
  onBakeryEdit = () => {},
  onBakeryDelete = () => {},
  onBakeryStatusChange = () => {},
  onProductEdit = () => {},
  onProductDelete = () => {},
  onProductStatusChange = () => {},
  onOrderEdit = () => {},
  onOrderDelete = () => {},
  onOrderStatusChange = () => {},
  onOrderViewDetails = () => {},
  isLoading = false,
  className = '',
}: AdminPanelProps) {
  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Encabezado */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Gestiona usuarios, panaderías, productos y pedidos desde un solo lugar
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{users.length}</div>
          <p className="text-xs text-muted-foreground">Usuarios totales</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{bakeries.length}</div>
          <p className="text-xs text-muted-foreground">
            Panaderías registradas
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{products.length}</div>
          <p className="text-xs text-muted-foreground">Productos disponibles</p>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-bold">{orders.length}</div>
          <p className="text-xs text-muted-foreground">Pedidos realizados</p>
        </div>
      </div>

      {/* Contenido principal con pestañas */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="bakeries">Panaderías</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UsersTable
            users={users}
            onEdit={onUserEdit}
            onDelete={onUserDelete}
            onStatusChange={onUserStatusChange}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="bakeries" className="space-y-4">
          <BakeriesTable
            bakeries={bakeries}
            onEdit={onBakeryEdit}
            onDelete={onBakeryDelete}
            onStatusChange={onBakeryStatusChange}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsTable
            products={products}
            onEdit={onProductEdit}
            onDelete={onProductDelete}
            onStatusChange={onProductStatusChange}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <OrdersTable
            orders={orders}
            onEdit={onOrderEdit}
            onDelete={onOrderDelete}
            onStatusChange={onOrderStatusChange}
            onViewDetails={onOrderViewDetails}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
