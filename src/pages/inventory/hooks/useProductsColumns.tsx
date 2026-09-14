import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, AlertTriangle, Package } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { createSelectColumn } from '@/components/ui/data-table/createSelectColumn';
import { createActionsColumn } from '@/components/ui/data-table/createActionsColumn';
import { DataTableColumnHeader } from '@/components/ui/data-table/DataTableColumnHeader';
import type { ProductApiResponse } from '../interfaces/product.response';
import { useActiveExchangeRate } from '@/pages/settings/hooks/useActiveExchangeRate';

interface UseProductsColumnsProps {
  onEdit: (product: ProductApiResponse) => void;
  onDelete: (id: string) => void;
}

export function useProductsColumns({ onEdit, onDelete }: UseProductsColumnsProps): ColumnDef<any, ProductApiResponse>[] {
  const { t } = useTranslation(['products', 'common']);
  const {convertUsdToBs} = useActiveExchangeRate();

  return useMemo(
    () => [
      createSelectColumn(),
        {
        accessorKey: 'name',
        meta: { title: t('product.name', 'Nombre') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('common.name', 'Nombre')} />
        ),
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div className="flex items-center gap-3">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-9 w-9 rounded-md object-cover border"
                />
              ) : (
                <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center border">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-medium text-sm">{product.name}</span>
                <span className="text-xs text-muted-foreground">
                  {product.category?.name || t('common.no_category', 'Sin Categoría')}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'sku',
        meta: { title: t('product.sku', 'SKU') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('products.sku', 'SKU')} />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">
            {row.original.sku ?? '-'}
          </span>
        ),
      },

    

      {
        accessorKey: 'price_usd',
        meta: { title: t('products.price', 'Precio (USD)') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('products.price', 'Precio (USD)')} />
        ),
        cell: ({ row }) => (
          <span className="font-semibold text-sm">
            ${Number(row.original.price_usd).toFixed(2)}
          </span>
        ),
      },
      {
        accessorKey: 'price_bs',
        enableSorting: false,
        meta: { title: t('products.price', 'Precio (Bs)') },
        header:t('products.price', 'Precio (Bs)'),
        cell: ({ row }) => (
          <span className="font-semibold text-sm">
            {convertUsdToBs(row.original.price_usd)}Bs.
          </span>
        ),
      },

      {
        accessorKey: 'stock',
        meta: { title: t('products.stock', 'Stock') },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('products.stock', 'Stock')} />
        ),
        cell: ({ row }) => {
          const stock = Number(row.original.stock);
          const minStock = Number(row.original.min_stock_alert);
          const isLow = stock <= minStock;

          return (
            <div className="flex items-center gap-1.5">
              <span className={`font-medium ${isLow ? 'text-destructive font-semibold' : ''}`}>
                {stock}
              </span>
              {isLow && (
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              )}
            </div>
          );
        },
      },

      {
        accessorKey: 'is_active',
        meta: { title: t('common.status', 'Estado') },
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

      createActionsColumn<ProductApiResponse>(
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
            onClick: (product) => product?.id && onDelete(product.id),
          },
        ],
        t('common.actions', 'Acciones')
      ),
    ],
    [onEdit, onDelete, t]
  );
}

