'use client';

import { Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrdersTable from './orders-table';
import type { OrdersTableProps } from '@/types/orders-table';

interface OrdersTableSectionProps extends OrdersTableProps {
  title?: string;
  onRefresh?: () => void;
  onExport?: () => void;
  showActions?: boolean;
}

export default function OrdersTableSection({
  title = 'Gestión de Pedidos',
  onRefresh,
  onExport,
  showActions = true,
  ...tableProps
}: OrdersTableSectionProps) {
  return (
    <div className="space-y-4">
      {/* Header con acciones */}
      {showActions && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Tabla */}
      <OrdersTable {...tableProps} />
    </div>
  );
}
