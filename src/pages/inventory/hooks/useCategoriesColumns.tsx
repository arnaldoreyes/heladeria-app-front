import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, FolderTree } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type { CategoryApiResponse } from '../interfaces/category.response';

interface UseCategoriesColumnsProps {
  onEdit: (category: CategoryApiResponse) => void;
  onDelete: (id: string) => void;
}

export function useCategoriesColumns({ onEdit, onDelete }: UseCategoriesColumnsProps): ColumnDef<CategoryApiResponse>[] {
  const { t } = useTranslation(['categories', 'common']);

  return useMemo(
    () => [
      createSelectColumn(),

      {
        accessorKey: 'name',
        meta: { title: t('categories.name', 'Nombre') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('categories.name', 'Nombre') } />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },

      {
        id: 'parent',
        accessorKey: 'parent.name',
        enableSorting: false,
        meta: { title: t('categories.parent', 'Categoría Padre')},
        header: t('categories.parent', 'Categoría Padre'),
        cell: ({ row }) => {
          const parentName = row.original.parent?.name;
          return (
            <Badge variant="outline" className="font-normal">
              {parentName || t('common.root_category', 'Principal')}
            </Badge>
          );
        },
      },

      {
        accessorKey: 'profit_percentage',
        meta: { title: t('categories.profit', '% Ganancia')},
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('categories.profit', '% Ganancia')} />
        ),
        cell: ({ row }) => {
          const profit = row.original.profit_percentage;
          return profit !== null && profit !== undefined ? `${profit}%` : '-';
        },
      },

      {
        accessorKey: 'reinvestment_percentage',
        meta: { title: t('categories.reinvestment', '% Reinversión') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('categories.reinvestment', '% Reinversión')} />
        ),
        cell: ({ row }) => {
          const reinvestment = row.original.reinvestment_percentage;
          return reinvestment !== null && reinvestment !== undefined ? `${reinvestment}%` : '-';
        },
      },


      createActionsColumn<CategoryApiResponse>(
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
            onClick: (category) => category?.id && onDelete(category.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onEdit, onDelete, t]
  );
}