import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatBs, formatUsd } from '@/lib/format';
import type { SaleItem } from '@/interfaces/sale.interfce';

interface CartProductsProps {
  items: SaleItem[];
  onUpdateQuantity: (product_id: string, quantity: number) => void;
  onRemoveItem: (product_id: string) => void;
}

export function CartProducts({ items, onUpdateQuantity, onRemoveItem }: CartProductsProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          El carrito está vacío. Selecciona productos de la lista para agregarlos.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 w-full">
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-4">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:border-border"
            >
              {/* Fila 1: Nombre del producto y botón de eliminar (Con espacio de sobra) */}
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm ">
                  <span className='font-bold text-foreground leading-snug'>{item.product_name_snapshot}</span>
                  <div className="text-xs text-muted-foreground space-x-1 mt-1">
                    <span className="font-medium text-foreground">{formatUsd(item.unit_price_usd)}</span>
                    <span>({formatBs(item.unit_price_bs)})</span>
                  </div>
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0 -mr-1 -mt-1"
                  onClick={() => onRemoveItem(item.product_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Fila 2: Precios, Controles y Subtotales */}
              <div className="flex items-end justify-between gap-4 pt-2 border-t border-border/40">
                
                {/* Izquierda: Precio Unitario y Controles de Cantidad */}
                <div className="space-y-2">
                  

                  {/* Controles de cantidad con mejor presencia */}
                  <div className="flex items-center gap-1.5 rounded-lg border border-border/50 bg-muted/40 p-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-md bg-background shadow-none hover:bg-muted"
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-bold text-foreground">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-md bg-background shadow-none hover:bg-muted"
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                      disabled={item.quantity >= item.max_stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Derecha: Subtotal destacado */}
                <div className="text-right space-y-0.5">
                  
                  <p className="text-base font-extrabold text-foreground leading-tight">
                    {formatUsd(item.subtotal_usd)}
                  </p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {formatBs(item.subtotal_bs)}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}