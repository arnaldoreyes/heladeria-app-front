import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Switch } from '@/components/ui/switch';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type { Customer } from '@/interfaces/customer.interface';

interface UseCustomersColumnsProps {
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function useCustomersColumns({
  onEdit,
  onDelete,
  onToggleStatus,
}: UseCustomersColumnsProps): ColumnDef<Customer>[] {
  const { t } = useTranslation(['customers', 'common']);

  return useMemo(
    () => [
      createSelectColumn<Customer>(),

      {
        accessorKey: 'name',
        meta: { title: t('common.name', 'Nombre') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.name', 'Nombre')} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{row.original.name}</span>
            {row.original.email && (
              <span className="text-xs text-muted-foreground">{row.original.email}</span>
            )}
          </div>
        ),
      },

      {
        accessorKey: 'id_document',
        meta: { title: t('customers.id_document', 'Cédula / RIF') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('customers.id_document', 'Cédula / RIF')} />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-mono">{row.original.id_document || t('common.n_a', 'N/A')}</span>
        ),
      },

      {
        accessorKey: 'phone',
        meta: { title: t('common.phone', 'Teléfono') },
        header: t('common.phone', 'Teléfono'),
        cell: ({ row }) => (
          <span className="text-sm">{row.original.phone || t('common.n_a', 'N/A')}</span>
        ),
      },

      {
        accessorKey: 'is_active',
        header: t('common.status', 'Estado'),
        meta: { title: t('common.status', 'Estado') },
        enableSorting: false,
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={customer.is_active}
                onCheckedChange={() => onToggleStatus(customer.id)}
                aria-label={t('customers.toggle_status', 'Cambiar estado')}
              />
              <span className="text-xs text-muted-foreground">
                {customer.is_active
                  ? t('common.active', 'Activo')
                  : t('common.inactive', 'Inactivo')}
              </span>
            </div>
          );
        },
      },

      createActionsColumn<Customer>(
        [
          {
            label: t('common.edit', 'Editar'),
            icon: <Edit className="h-4 w-4" />,
            onClick: onEdit,
          },
          {
            label: t('common.delete', 'Eliminar'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (customer) => customer?.id && onDelete(customer.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onEdit, onDelete, onToggleStatus, t]
  );
}