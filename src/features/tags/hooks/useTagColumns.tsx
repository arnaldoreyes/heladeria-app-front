import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import { Switch } from '@/components/ui/switch';
import type { TagResponse } from '@/interfaces/tag.interface';

interface UseTagColumnsProps {
  onEdit: (Tag: TagResponse) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function useTagColumns({ onEdit, onDelete, onToggleStatus }: UseTagColumnsProps): ColumnDef<TagResponse>[] {
  const { t } = useTranslation(['tags', 'common']);

  return useMemo(
    () => [
      createSelectColumn(),

      {
        accessorKey: 'name',
        meta: { title: t('tags.name', 'Nombre') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('tags.name', 'Nombre') } />
        ),
        cell: ({ row }) => (
          <Badge variant="outline" style={{ 
              borderColor: row.original.color || undefined,
            }}>
              {row.original.name}
            </Badge>
        ),
      },

      {
        accessorKey: 'products_count',
        meta: { title: t('tags.products', 'Cant. productos') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('tags.products', 'Cant. productos')} />
        ),
        cell: ({ row }) => {
          const profit = row.original.products_count;
          return profit !== null && profit !== undefined ? `${profit}` : '-';
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



      createActionsColumn<TagResponse>(
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
            onClick: (Tag) => Tag?.id && onDelete(Tag.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onEdit, onDelete, onToggleStatus, t]
  );
}