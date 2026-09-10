import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type { PaymentMethodFormData } from '../schemas/settings.schema';

interface UsePaymentColumnsProps {
  onEdit: (method: PaymentMethodFormData) => void;
  onDelete: (id: string) => void;
}

export function usePaymentMethodsColumns({ onEdit, onDelete }: UsePaymentColumnsProps): ColumnDef< PaymentMethodFormData>[] {
  const { t } = useTranslation(['settings', 'common']);

  return useMemo(
    () => [
      createSelectColumn(),
      
      // Columna: Nombre
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.name', 'Nombre')} />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },

      // Columna: Tipo de Pago (Agregada como columna dedicada)
      {
        id: 'type',
        accessorKey: 'type.name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('settings.payments.type', 'Tipo de Pago')} />
        ),
        cell: ({ row }) => {
          const typeName = row.original.type?.name;
          return (
            <Badge variant="outline" className="font-normal">
              {typeName || t('common.n_a', 'N/A')}
            </Badge>
          );
        },
      },

      // Columna: Moneda
      {
        accessorKey: 'currency',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.currency', 'Moneda')} />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.currency === 'USD' ? 'default' : 'secondary'}>
            {row.original.currency}
          </Badge>
        ),
      },

      // Columna: Estado
      {
        accessorKey: 'is_active',
        header: t('common.status', 'Estado'),
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? 'outline' : 'destructive'}>
            {row.original.is_active
              ? t('common.active', 'Activo')
              : t('common.inactive', 'Inactivo')}
          </Badge>
        ),
      },

      // Columna: Acciones
      createActionsColumn<PaymentMethodFormData>(
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
            onClick: (method) => method?.id && onDelete(method.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onEdit, onDelete, t]
  );
}