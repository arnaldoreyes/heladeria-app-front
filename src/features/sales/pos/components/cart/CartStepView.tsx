import { SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CartTotals } from "./CartTotals";
import { CartProducts } from "./CartProducts";
import type { SaleItem } from "@/interfaces/sale.interfce";

interface CartStepViewProps {
  items: SaleItem[];
  totalUsd: number;
  totalBs: number;
  exchangeRate: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export function CartStepView({
  items,
  totalUsd,
  totalBs,
  exchangeRate,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}: CartStepViewProps) {
  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-1 flex-col h-full">
      <SheetHeader className="border-b border-border/60 px-5 py-4">
        <SheetTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <span>Carrito de Compras</span>
        </SheetTitle>
        <SheetDescription>
          {totalItemsCount} ítem{totalItemsCount !== 1 ? 's' : ''} seleccionado(s)
        </SheetDescription>
      </SheetHeader>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
          <ShoppingCart className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            El carrito está vacío. Selecciona productos de la lista para agregarlos.
          </p>
        </div>
      ) : (
        <>
          <CartProducts
            items={items}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />

          <div className="border-t border-border/60 p-4 bg-background">
            <CartTotals
              totalUsd={totalUsd}
              totalBs={totalBs}
              exchangeRate={exchangeRate}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onClearCart();
                  toast.success('Carrito vaciado');
                }}
              >
                Vaciar
              </Button>
              <Button className="flex-1" onClick={onProceedToCheckout}>
                Procesar Pago
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
