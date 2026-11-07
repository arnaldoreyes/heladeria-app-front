import { ShoppingCart, Package, Plus, Minus, Trash2, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatUsd, formatBs } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Row } from '@tanstack/react-table';

export interface ProductSalesCardProps<TData extends Record<string, any> = any> {
  row: Row<TData>;
  exchangeRate?: number;
  inCartQuantity?: number;
  onAddToCart?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  onSelectMaxStock?: () => void;
}

export function ProductSalesCard({
  row,
  exchangeRate = 1,
  inCartQuantity = 0,
  onAddToCart,
  onDecrement,
  onRemove,
  onSelectMaxStock,
}: ProductSalesCardProps) {
  const product = row.original;

  const priceUsd = Number(product.price_usd || product.priceUsd || 0);
  const priceBs = priceUsd * exchangeRate;
  const stock = Number(product.stock || 0);
  const isOutOfStock = stock <= 0;
  const isMaxReached = inCartQuantity >= stock;

  const renderStockBadge = () => {
    if (isOutOfStock) {
      return (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5 whitespace-nowrap">
          Agotado
        </Badge>
      );
    }
    if (stock <= 5) {
      return (
        <Badge
          variant="outline"
          className="text-[10px] px-1.5 py-0.5 border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10 whitespace-nowrap"
        >
          Bajo ({stock})
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 text-muted-foreground whitespace-nowrap">
        {stock} disp.
      </Badge>
    );
  };

  return (
    <div
      onClick={() => !isOutOfStock && onAddToCart?.()}
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border bg-card p-3 sm:p-3.5 transition-all hover:shadow-md select-none w-full min-w-0',
        inCartQuantity > 0 ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.02]' : 'cursor-pointer',
        isOutOfStock && 'opacity-60 cursor-not-allowed hover:shadow-none'
      )}
    >
      {/* Cabecera de la Tarjeta */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div
          className={cn(
            'flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary',
            inCartQuantity > 0 && 'border-primary/40 bg-primary/10 text-primary'
          )}
        >
          <Package className="h-4 w-4" />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-1 max-w-[calc(100%-2.5rem)]">
          {inCartQuantity > 0 && (
            <Badge className="bg-primary text-primary-foreground font-bold text-[10px] px-1.5 py-0.5 whitespace-nowrap">
              {inCartQuantity} en carrito
            </Badge>
          )}
          {renderStockBadge()}
        </div>
      </div>

      {/* Información del Producto */}
      <div className="space-y-1 mb-3 min-w-0">
        <p className="line-clamp-2 text-xs sm:text-sm font-semibold leading-snug group-hover:text-primary transition-colors break-words">
          {product.name}
        </p>
        {product.sku && (
          <p className="font-mono text-[10px] sm:text-[11px] text-muted-foreground truncate">
            SKU: {product.sku}
          </p>
        )}
      </div>

      {/* Precios y Controles de Carrito */}
      <div className="pt-2 border-t flex flex-col gap-2 mt-auto min-w-0">
        <div className="flex items-baseline justify-between gap-1 flex-wrap">
          <span className="text-sm sm:text-base font-bold text-foreground shrink-0">
            {formatUsd(priceUsd)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground truncate max-w-[110px] text-right">
            {formatBs(priceBs)}
          </span>
        </div>

        {/* Barra de Acciones / Controles de Cantidad */}
        {inCartQuantity > 0 ? (
          <div className="flex items-center justify-between gap-1 pt-1 min-w-0">
            {/* Eliminar */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
              title="Eliminar del carrito"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>

            {/* Restar Unidad */}
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
              title="Restar 1 unidad"
              onClick={(e) => {
                e.stopPropagation();
                onDecrement?.();
              }}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>

            {/* Sumar Unidad */}
            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={isMaxReached}
              className="h-7 w-7 sm:h-8 sm:w-8 shrink-0"
              title="Sumar 1 unidad"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>

            {/* Seleccionar Todo el Stock (MAX) */}
            <Button
              type="button"
              size="sm"
              variant={isMaxReached ? 'secondary' : 'default'}
              disabled={isMaxReached}
              className="h-7 sm:h-8 px-1.5 sm:px-2 text-[10px] sm:text-[11px] font-bold gap-1 flex-1 min-w-0 shrink"
              title="Seleccionar todo el stock disponible"
              onClick={(e) => {
                e.stopPropagation();
                onSelectMaxStock?.();
              }}
            >
              <Zap className="h-3 w-3 fill-current shrink-0" />
              <span className="truncate">
                MAX <span className="hidden xs:inline">({stock})</span>
              </span>
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="h-8 w-full gap-1.5 text-xs font-medium mt-1"
          >
            <ShoppingCart className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Agregar al Carrito</span>
          </Button>
        )}
      </div>
    </div>
  );
}