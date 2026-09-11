import { type Row } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, MoreVertical, Package, Tag } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface CategoryData {
  id?: string;
  business_id?: string;
  parent_id?: string | null;
  name?: string;
  description?: string | null;
  icon?: string | null;
  profit_percentage?: number | null;
  reinvestment_percentage?: number | null;
}

export interface ProductItemData {
  id: string;
  business_id?: string;
  category_id?: string;
  sku?: string | null;
  name: string;
  image_url?: string | null;
  is_active?: boolean;
  price_usd: number;
  cost_usd: number;
  price_bs?: number;
  stock: number;
  min_stock_alert?: number;
  is_low_stock?: boolean;
  category?: CategoryData | string | null;
  created_at?: string;
  updated_at?: string;
}

interface ProductGridCardProps<TData> {
  row: Row<TData>;
  exchangeRate?: number;
  onEdit?: (product: ProductItemData) => void;
  onDelete?: (id: string) => void;
  onClick?: (product: ProductItemData) => void;
}

export function ProductGridCard<TData>({
  row,
  exchangeRate = 1,
  onEdit,
  onDelete,
  onClick,
}: ProductGridCardProps<TData>) {
  const { t } = useTranslation(['products', 'common']);
  const product = row.original as unknown as ProductItemData;
  const isSelected = row.getIsSelected();

  // Métricas de Stock
  const stock = product.stock ?? 0;
  const minStockAlert = product.min_stock_alert ?? 5;
  const isOutOfStock = stock <= 0;
  const isLowStock = product.is_low_stock ?? (stock > 0 && stock <= minStockAlert);

  // Precios y Costos
  const priceUsd = product.price_usd ?? (product as unknown as Record<string, number>).price ?? 0;
  const costUsd = product.cost_usd ?? (product as unknown as Record<string, number>).cost ?? 0;

  // Precio en Bs
  const priceBs = product.price_bs ?? priceUsd * exchangeRate;

  // Datos de Categoría
  const categoryName =
    typeof product.category === 'object'
      ? product.category?.name
      : typeof product.category === 'string'
      ? product.category
      : t('common.uncategorized', 'Sin categoría');

  const categoryIcon =
    typeof product.category === 'object' && product.category?.icon
      ? product.category.icon
      : null;

  // Estilos de fondo e icono según el nivel de stock
  const heroBgStyle = isOutOfStock
    ? 'bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-900/40'
    : isLowStock
    ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40'
    : 'bg-sky-50/70 dark:bg-sky-950/20 border-sky-100 dark:border-sky-900/30';

  const iconColorStyle = isOutOfStock
    ? 'text-red-500 dark:text-red-400'
    : isLowStock
    ? 'text-amber-500 dark:text-amber-400'
    : 'text-sky-400 dark:text-sky-500/80';

  return (
    <Card
      onClick={() => onClick?.(product)}
      className={cn(
        'relative h-full group cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between border overflow-hidden bg-card p-3 rounded-2xl',
        // Sin Stock
        isOutOfStock && 'border-red-500 border-l-[6px]',
        // Stock Crítico
        !isOutOfStock && isLowStock && 'border-amber-500 border-l-[6px]',
        // Stock Normal
        !isOutOfStock &&
          !isLowStock &&
          (isSelected
            ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
            : 'border-border hover:border-primary/50')
      )}
    >
      {/* SECCIÓN SUPERIOR: HERO / IMAGEN / ICONO */}
      <div
        className={cn(
          'relative w-full h-40 rounded-xl border flex items-center justify-center overflow-hidden p-3 transition-colors duration-200',
          heroBgStyle
        )}
      >
        <div
          className="absolute top-3 left-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => row.toggleSelected(!!checked)}
            aria-label="Seleccionar producto"
            className="bg-background/80 backdrop-blur-sm data-[state=checked]:bg-primary h-5 w-5 rounded-md border-muted-foreground/40 cursor-pointer"
          />
        </div>

        {/* Badge de Estado + Menú Opciones */}
        <div
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Badge
            variant={product.is_active !== false ? 'outline' : 'destructive'}
            className={cn(
              'text-[10px] px-2 py-0.5 font-medium backdrop-blur-sm',
              product.is_active !== false
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-400'
                : 'bg-destructive/10 text-destructive border-destructive/30'
            )}
          >
            {product.is_active !== false
              ? t('common.active', 'Activo')
              : t('common.inactive', 'Inactivo')}
          </Badge>

          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground rounded-md cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">{t('common.actions', 'Acciones')}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {onEdit && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t('common.edit', 'Editar')}
                  </DropdownMenuItem>
                )}
                {onDelete && product.id && (
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('common.delete', 'Eliminar')}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Imagen o Icono de Categoría Reducido */}
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain p-2 transition-transform duration-200 group-hover:scale-105"
          />
        ) : categoryIcon ? (
          <span
            className={cn(
              'material-symbols-outlined text-4xl select-none transition-transform duration-200 group-hover:scale-110',
              iconColorStyle
            )}
          >
            {categoryIcon}
          </span>
        ) : (
          <Package
            className={cn(
              'w-10 h-10 transition-transform duration-200 group-hover:scale-110',
              iconColorStyle
            )}
          />
        )}
      </div>

      {/* DETALLES: CATEGORÍA, NOMBRE Y STOCK */}
      <CardContent className="p-1 pt-3 space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Nombre de la Categoría */}
          {categoryName && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
              <Tag className="w-3 h-3 text-muted-foreground/70" />
              <span className="truncate">{categoryName}</span>
            </div>
          )}

          {/* Nombre del Producto */}
          <h3
            className="text-base font-bold text-foreground tracking-tight leading-snug line-clamp-2 uppercase group-hover:text-primary transition-colors duration-150"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Stock */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              STOCK:
            </span>
            <span
              className={cn(
                'font-bold text-sm',
                isOutOfStock
                  ? 'text-red-600 dark:text-red-400'
                  : isLowStock
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-foreground'
              )}
            >
              {stock}
            </span>
          </div>
          {/* Costo USD */}
            <div className="text-xs text-muted-foreground font-medium pb-0.5">
              Costo: ${Number(costUsd).toFixed(2)}
            </div>
        </div>

        {/* PIE DE PÁGINA: PRECIOS Y COSTO */}
        <div className="pt-2">
          <div className="h-[1px] w-full bg-border/60 mb-2.5" />

          <div className="flex items-end justify-between">
            {/* Precio USD y Bs */}
            <div className="flex flex-col">
              <span className="text-xl font-black text-teal-700 dark:text-teal-400 leading-none">
                ${Number(priceUsd).toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-muted-foreground mt-1">
                {Number(priceBs).toLocaleString('es-VE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                Bs
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}