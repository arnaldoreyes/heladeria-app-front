import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Truck, Mail, Phone } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type { SupplierApiResponse } from '../interfaces/supplier.response';

interface UseSuppliersColumnsProps {
  onEdit: (supplier: SupplierApiResponse) => void;
  onDelete: (id: string) => void;
}

export function useSuppliersColumns({ onEdit, onDelete }: UseSuppliersColumnsProps): ColumnDef<any, SupplierApiResponse>[] {
  const { t } = useTranslation(['suppliers', 'common']);

  return useMemo(
    () => [
      createSelectColumn(),

      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.name', 'Proveedor / Razón Social')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-medium">{row.original.name}</span>
              {row.original.contact_name && (
                <span className="text-xs text-muted-foreground">{row.original.contact_name}</span>
              )}
            </div>
          </div>
        ),
      },

      {
        accessorKey: 'tax_id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('suppliers.tax_id', 'Documento Fiscal')} />
        ),
        cell: ({ row }) => {
          const { tax_type, tax_id } = row.original;
          if (!tax_id) return '-';
          return (
            <Badge variant="outline" className="font-mono">
              {tax_type ? `${tax_type}-${tax_id}` : tax_id}
            </Badge>
          );
        },
      },

      {
        accessorKey: 'phone',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.contact', 'Contacto')} />
        ),
        cell: ({ row }) => {
          const { phone, email } = row.original;
          return (
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
              {phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{email}</span>
                </div>
              )}
              {!phone && !email && '-'}
            </div>
          );
        },
      },

      {
        accessorKey: 'is_active',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.status', 'Estado')} />
        ),
        cell: ({ row }) => (
          <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
            {row.original.is_active ? t('common.active', 'Activo') : t('common.inactive', 'Inactivo')}
          </Badge>
        ),
      },

      createActionsColumn<SupplierApiResponse>(
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
            onClick: (supplier) => supplier?.id && onDelete(supplier.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onEdit, onDelete, t]
  );
}