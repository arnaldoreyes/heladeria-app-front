import { useMemo, useCallback } from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart,
  Trash2,
  Save,
  CheckCircle2,
  Loader2,
  CreditCard,
  Package
} from 'lucide-react';

import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Asumimos que tienes componentes similares a los de Restock para Ventas
import { ProductCatalog } from '@/features/products/components/ProductCatalog';

// IMPORTAMOS LOS NUEVOS COMPONENTES
// import { CustomerSelect } from '@/features/customers/components/CustomerSelect';
// import { SalePaymentsList } from './SalePaymentsList';

import type { SaleFormData } from '../schemas/sales.schema';
import type { Product } from '@/interfaces/product.interface';
import { formatBs } from '@/lib/format';
import { CartProducts } from '../../pos/components/cart/CartProducts';
import { CartTotals } from '../../pos/components/cart/CartTotals';

export interface SaleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
  form: UseFormReturn<SaleFormData>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSaving: boolean;
  isLoadingProducts?: boolean;
}

export function SaleDialog({
  isOpen,
  onOpenChange,
  isEditing = false,
  form,
  onSubmit,
  isSaving,
  isLoadingProducts = false,
}: SaleDialogProps) {
  const { t } = useTranslation(['sales', 'common']);
  const {  control, watch, setValue, handleSubmit } = form;

  // Manejo del carrito de productos
  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({ control, name: 'items' });

  const items = useWatch({ control, name: 'items' }) || [];
  const payments = useWatch({ control, name: 'payments' }) || [];
  
  // TASA DE CAMBIO FIJA (Viene de la BD al editar, o es la actual al crear)
  const exchangeRate = watch('exchange_rate') || 1;

  // Cálculos de totales derivados
  const totals = useMemo(() => {
    const itemsTotalUsd = items.reduce((acc, item) => {
      const qty = Number(item.quantity) || 0;
      const unitPriceUsd = Number(item.unit_price_usd) || 0;
      return acc + (qty * unitPriceUsd);
    }, 0);

    const itemsTotalBs = itemsTotalUsd * exchangeRate;

    const paymentsTotalUsd = payments.reduce((acc, pay) => {
      return acc + (Number(pay.amount_usd) || 0);
    }, 0);

    return {
      totalUsd: itemsTotalUsd,
      totalBs: itemsTotalBs,
      paymentsTotalUsd,
      balanceUsd: itemsTotalUsd - paymentsTotalUsd
    };
  }, [items, payments, exchangeRate]);

  // Adaptadores de eventos para interactuar con CartProducts usando los IDs de producto
  const handleUpdateCartItemQuantity = useCallback((productId: string, newQuantity: number) => {
    const index = items.findIndex((item) => String(item.product_id) === String(productId));
    if (index >= 0) {
      setValue(`items.${index}.quantity`, newQuantity, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  }, [items, setValue]);

  const handleRemoveCartItem = useCallback((productId: string) => {
    const index = items.findIndex((item) => String(item.product_id) === String(productId));
    if (index >= 0) {
      removeItem(index);
    }
  }, [items, removeItem]);

  // Mapeamos los items del formulario a la interfaz que espera CartProducts
  const cartProductsItems = useMemo(() => {
    return items.map((item) => ({
      productId: String(item.product_id),
      name: String(item.product_name_snapshot),
      priceUsd: Number(item.unit_price_usd) || 0,
      quantity: Number(item.quantity) || 0,
      maxStock: 9999, // Idealmente esto vendría de tu base de datos (item.stock) si validas inventario
    }));
  }, [items]);

  // Seleccionar producto del catálogo
  const handleSelectProduct = useCallback((product: Product) => {
    const existingIndex = itemFields.findIndex((f) => String(f.product_id) === String(product.id));

    if (existingIndex >= 0) {
      // Si existe, sumar 1
      const currentItem = items[existingIndex];
      const newQty = (Number(currentItem?.quantity) || 0) + 1;
      setValue(`items.${existingIndex}.quantity`, newQty, { shouldDirty: true });
    } else {
      // Si no existe, agregarlo usando el precio base y la tasa de cambio FIJA de esta venta
      const priceUsd = product.price_usd || 0; 
      appendItem({
        product_id: product.id,
        product_name_snapshot: product.name,
        quantity: 1,
        unit_price_usd: priceUsd,
        unit_price_bs: priceUsd * exchangeRate, // Conserva la tasa de esta venta
      });
    }
  }, [itemFields, items, exchangeRate, appendItem, setValue]);

  const dialogTitle = isEditing
    ? t('sales.dialog.editTitle', { defaultValue: 'Editar Venta' })
    : t('sales.dialog.createTitle', { defaultValue: 'Nueva Venta' });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1080px] w-[98vw] h-[95dvh] md:h-[90vh] p-0 gap-0 overflow-hidden rounded-xl border bg-background flex flex-col">
        <DialogHeader className="p-0 border-0">
          <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full w-full overflow-hidden min-h-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3 border-b bg-card shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />
              <h2 className="text-xs sm:text-base font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-400 truncate">
                {dialogTitle}
              </h2>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
              <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 border-amber-200">
                Tasa Venta: {formatBs(exchangeRate)}
              </Badge>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue('items', [])}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 font-bold uppercase text-[10px] sm:text-xs gap-1.5 h-7 sm:h-8 px-2 shrink-0"
              >
                <Trash2 className="w-3 h-3" />
                <span className="hidden sm:inline">{t('common.actions.clear', { defaultValue: 'Vaciar' })}</span>
              </Button>
            </div>
          </div>

          {/* Cuerpo Dividido */}
          <div className="flex flex-col md:grid md:grid-cols-12 flex-1 min-h-0 overflow-hidden divide-y md:divide-y-0 md:divide-x border-b">
            
            {/* Lado Izquierdo: Catálogo */}
            <div className="h-1/2 md:h-full md:col-span-6 lg:col-span-7 flex flex-col min-h-0 bg-background overflow-hidden">
              <ProductCatalog
                isLoading={isLoadingProducts}
                onSelectProduct={handleSelectProduct}
              />
            </div>

            {/* Lado Derecho: Pestañas de Carrito y Pagos */}
            <div className="h-1/2 md:h-full md:col-span-6 lg:col-span-5 flex flex-col min-h-0 bg-background overflow-hidden">
              <Tabs defaultValue="cart" className="flex flex-col h-full w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-muted/20 h-10 px-2 shrink-0">
                  <TabsTrigger value="cart" className="gap-2 text-xs">
                    <Package className="w-3.5 h-3.5" />
                    Productos ({items.length})
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="gap-2 text-xs">
                    <CreditCard className="w-3.5 h-3.5" />
                    Pagos
                  </TabsTrigger>
                </TabsList>

                {/* Tab: Carrito de Productos */}
                <TabsContent value="cart" className="flex-1 overflow-y-auto p-0 m-0 data-[state=active]:flex flex-col">
                  {/* SE INSERTA EL NUEVO COMPONENTE CartProducts AQUÍ */}
                  <CartProducts
                    items={cartProductsItems}
                    onUpdateQuantity={handleUpdateCartItemQuantity}
                    onRemoveItem={handleRemoveCartItem}
                  />
                </TabsContent>

                {/* Tab: Métodos de Pago */}
                <TabsContent value="payments" className="flex-1 overflow-y-auto p-0 m-0 data-[state=active]:flex flex-col bg-slate-50/50">
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    Renderiza la lista y formulario de pagos aquí.
                  </div>
                </TabsContent>
              </Tabs>

              {/* Footer Derecho: Totales y Acciones */}
              <div className="p-3 sm:p-4 border-t bg-slate-50 dark:bg-slate-900 space-y-3 shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                
                {/* SE INSERTA EL NUEVO COMPONENTE CartTotals AQUÍ */}
                <CartTotals
                  totalUsd={totals.totalUsd}
                  totalBs={totals.totalBs}
                  exchangeRate={exchangeRate}
                  paymentsTotalUsd={totals.paymentsTotalUsd}
                  balanceUsd={totals.balanceUsd}
                />

                {/* Botón de Guardar */}
                <Button
                  type="submit"
                  disabled={isSaving || itemFields.length === 0}
                  className="w-full bg-emerald-900 hover:bg-emerald-800 h-10"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : isEditing ? (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t('common.actions.save', { defaultValue: 'Guardar Cambios' })}
                </Button>
              </div>
            </div>

          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}