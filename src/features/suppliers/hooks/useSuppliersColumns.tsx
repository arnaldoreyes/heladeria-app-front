import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Mail } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type { Supplier } from '@/interfaces/supplier.interface';
import { Switch } from '@/components/ui/switch';

interface UseSuppliersColumnsProps {
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function useSuppliersColumns({ onEdit, onDelete, onToggleStatus }: UseSuppliersColumnsProps): ColumnDef<any, Supplier>[] {
  const { t } = useTranslation(['suppliers', 'common']);

  return useMemo(
    () => [
      createSelectColumn(),

      {
        accessorKey: 'name',
        meta: { title: t('suppliers.name', 'Proveedor / Razón Social')},
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('suppliers.name', 'Proveedor / Razón Social')} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
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
        meta: { title: t('suppliers.tax_id', 'Documento Fiscal') },
        enableSorting: false,
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
        meta: { title: t('suppliers.contact', 'Contacto') },
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('suppliers.contact', 'Contacto')} />
        ),
        cell: ({ row }) => {
          const { phone, email } = row.original;
          return (
            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
              {phone && (
                <div className="flex items-center gap-1">
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
        meta: { title: t('common.status', 'Estado') },
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={ t('common.status', 'Estado')} />
        ),
        cell: ({ row }) => {
          const method = row.original;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={method.is_active}
                onCheckedChange={() => onToggleStatus(method.id)}
                aria-label={t('settings.payments.toggle_status', 'Cambiar estado')}
              />
              <span className="text-xs text-muted-foreground">
                {method.is_active
                  ? t('common.active', 'Activo')
                  : t('common.inactive', 'Inactivo')}
              </span>
            </div>
          );
        },
      },


      createActionsColumn<Supplier>(
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
    [onEdit, onDelete, onToggleStatus, t]
  );
}