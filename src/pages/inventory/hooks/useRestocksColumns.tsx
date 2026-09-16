import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Calendar, Eye} from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type {  RestockApiResponse } from '../interfaces/restock.response';
import { Badge } from '@/components/ui/badge';

interface UseRestockItemsColumnsProps {
  onEdit: (item: RestockApiResponse) => void;
  onDelete: (id: string) => void;
  onComplete: (item: RestockApiResponse) => void;
  onView: (item: RestockApiResponse) => void;
}

export function useRestocksColumns({
  onView,
  onComplete,
  onEdit,
  onDelete,
}: UseRestockItemsColumnsProps): ColumnDef<any, RestockApiResponse>[] {
  const { t } = useTranslation(['restocks', 'common']);

  return useMemo(
    () => [
      {
        accessorKey: 'invoice_number',
        meta: { title: '#' },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={'#'} />
        ),
        cell: ({ row }) => (
          <div className="font-medium font-mono text-xs">
            {row.original.invoice_number ?? '-'}
          </div>
        ),
      },
      {
        accessorKey: 'supplier_name',
        enableSorting: false,
        meta: { title: t('restocks.supplier_name', 'Proveedor') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('restocks.supplier_name', 'Proveedor')} />
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.supplier_name ?? 'N/A'}
          </div>
        ),
      },
      {
        accessorKey: 'user',
        enableSorting: false,
        meta: { title: t('common.user', 'Usuario') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.user', 'Usuario')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="truncate">{row.original.user?.name ?? t('common.system', 'Sistema')}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        enableSorting: false,
        meta: { title: t('restocks.status', 'Estado') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('restocks.status', 'Estado')} />
        ),
        cell: ({ row }) => {
          const isCompleted = row.original.status === 'completed' || row.original.is_completed;
          return (
            <Badge variant={isCompleted ? 'outline' : 'secondary'}>
              {isCompleted
                ? t('common.completed', 'Completado')
                : t('common.draft', 'Cotizado')}
            </Badge>
          );
        },
      },
       {
        accessorKey: 'quantity',
        meta: { title: t('restocks.quantity', 'Cantidad') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('restocks.quantity', 'Cantidad')} />
        ),
        cell: ({ row }) => {
          return <div className="font-medium text-center">{row.original.quantity}</div>;
        },
      },
      {
        accessorKey: 'exchange_rate',
        meta: { title: t('restocks.exchange_rate', 'Tasa de cambio') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('restocks.exchange_rate', 'Tasa de cambio')} />
        ),
        cell: ({ row }) => {
          const amount = Number(row.original.exchange_rate ?? 0);
          return (
            <div className="text-muted-foreground font-mono text-xs">
              Bs. {amount.toFixed(2)}
            </div>
          );
        },
      },
      {
        accessorKey: 'total_usd',
        meta: { title: t('restocks.total_usd', 'Total (USD)') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('restocks.total_usd', 'Total (USD)')} />
        ),
        cell: ({ row }) => {
          const amount = Number(row.original.total_usd ?? 0);
          return (
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">
              ${amount.toFixed(2)}
            </div>
          );
        },
      },
      {
        accessorKey: 'total_bs',
        enableSorting: false,
        meta: { title: t('restocks.total_bs', 'Total (Bs.)') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('restocks.total_bs', 'Total (Bs.)')} />
        ),
        cell: ({ row }) => {
          const amount = Number(row.original.total_bs ?? 0);
          return (
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">
              Bs. {amount.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          );
        },
      },
      {
        accessorKey: 'purchased_at',
        meta: { title: t('common.purchased_at', 'Fecha de compra') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.purchased_at', 'Fecha de compra')} />
        ),
        cell: ({ row }) => {
          const date = row.original.purchased_at;
          return (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{date ? new Date(date).toLocaleDateString() : '-'}</span>
            </div>
          );
        },
      },

      createActionsColumn<RestockApiResponse>(
        [
          {
            label: t('common.view', 'Ver Detalles'),
            icon: <Eye className="h-4 w-4" />,
            show: (row) => row.status == 'completed' && row.is_completed,
            onClick: (row) => onView(row),
          },
          {
            label: t('common.edit', 'Editar'),
            icon: <Edit className="h-4 w-4" />,
            show: (row) => row.status !== 'completed' && !row.is_completed,
            onClick: (row) => onEdit(row),
          },
          {
            label: t('common.delete', 'Eliminar'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            // No permitir eliminar si el reabastecimiento ya está completado
            show: (row) => row.status !== 'completed' && !row.is_completed,
            onClick: (row) => row?.id && onDelete(row.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onView, onEdit, onDelete, t]
  );
}