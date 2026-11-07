import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Edit, Trash2, Calendar } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import { Badge } from '@/components/ui/badge';
import { formatBs, formatDate, formatUsd } from '@/lib/format';
import type { Sale } from '@/interfaces/sale.interfce';

interface UseSalesHistoryColumnsProps {
  onView: (item: Sale) => void;
  onEdit: (item: Sale) => void;
  onDelete: (id: string) => void;
}

export function useSalesHistoryColumns({
  onView,
  onEdit,
  onDelete,
}: UseSalesHistoryColumnsProps): ColumnDef<Sale>[] {
  const { t } = useTranslation(['sales', 'common']);

  return useMemo(
    () => [
      {
        accessorKey: 'ticket_number',
        meta: { title: t('sales.ticket', 'Ticket') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('sales.ticket', 'Ticket')} />
        ),
        cell: ({ row }) => (
          <div className="font-medium font-mono text-xs">
            #{row.original.ticket_number ?? row.original.id}
          </div>
        ),
      },
      {
        accessorKey: 'customer_id',
        enableSorting: false,
        meta: { title: t('sales.customer', 'Cliente') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('sales.customer', 'Cliente')} />
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.customer_id ?? t('common.general_public', 'Público General')}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        enableSorting: false,
        meta: { title: t('sales.status_label', 'Estado') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('sales.status_label', 'Estado')} />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          if (status === 'completed') {
            return <Badge variant="default">{t('sales.status.completed', 'Completada')}</Badge>;
          }
          if (status === 'voided') {
            return <Badge variant="destructive">{t('sales.status.voided', 'Anulada')}</Badge>;
          }
          return <Badge variant="secondary">{t('sales.status.draft', 'Cotización')}</Badge>;
        },
      },
      {
        accessorKey: 'payment_status',
        enableSorting: false,
        meta: { title: t('sales.payment_status_label', 'Pago') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('sales.payment_status_label', 'Pago')} />
        ),
        cell: ({ row }) => {
          const status = row.original.payment_status;
          if (status === 'paid') {
            return <Badge className="bg-emerald-600 hover:bg-emerald-700">{t('sales.payment_status.paid', 'Pagado')}</Badge>;
          }
          if (status === 'partial') {
            return <Badge className="bg-amber-500 hover:bg-amber-600">{t('sales.payment_status.partial', 'Parcial')}</Badge>;
          }
          return <Badge variant="outline" className="border-amber-500 text-amber-600">{t('sales.payment_status.pending', 'Pendiente')}</Badge>;
        },
      },
      {
        accessorKey: 'total_usd',
        meta: { title: t('sales.total_usd', 'Total ($)') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('sales.total_usd', 'Total ($)')} />
        ),
        cell: ({ row }) => (
          <div className="font-semibold text-emerald-600 dark:text-emerald-400">
            {formatUsd(row.original.total_usd)}
          </div>
        ),
      },
      {
        accessorKey: 'total_bs',
        enableSorting: false,
        meta: { title: t('sales.total_bs', 'Total (Bs.)') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('sales.total_bs', 'Total (Bs.)')} />
        ),
        cell: ({ row }) => (
          <div className="font-semibold font-mono text-xs text-emerald-600 dark:text-emerald-400">
            {formatBs(row.original.total_bs)}
          </div>
        ),
      },
      {
        accessorKey: 'created_at',
        meta: { title: t('common.created_at', 'Fecha') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.created_at', 'Fecha')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{row.original.created_at ? formatDate(row.original.created_at) : '-'}</span>
          </div>
        ),
      },

      createActionsColumn<Sale>(
        [
          {
            label: t('common.view', 'Ver Detalles'),
            icon: <Eye className="h-4 w-4" />,
            show: () => true,
            onClick: (row) => onView(row),
          },
          {
            label: t('common.edit', 'Editar'),
            icon: <Edit className="h-4 w-4" />,
            variant: 'secondary',
            show: () => true,
            onClick: (row) => onEdit(row),
          },
          {
            label: t('common.delete', 'Anular / Eliminar'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (row) => row?.id && onDelete(row.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onView, onEdit, onDelete, t]
  );
}