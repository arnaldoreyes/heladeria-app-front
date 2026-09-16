import { useState, useMemo, useCallback } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  PackagePlus,
  Trash2,
  Hash,
  ArrowUpDown,
  FileText,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from 'lucide-react';

import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { RestockProductCatalog } from './RestockProductCatalog';
import { RestockCartList } from './RestockCartList';
import { ExchangeRateToggle } from './ExchangeRateToggle';
import { SupplierSelect } from '../suppliers/SupplierSelect';

import { useRestockProducts } from '../../hooks/useRestockProducts';
import { useRestockExchangeRate } from '../../hooks/useRestockExchangeRate';
import type { RestockDialogProps } from '../../interfaces/restock-form.types';
import type { ProductApiResponse } from '../../interfaces/product.response';

export function RestockDialog({
  isOpen,
  onOpenChange,
  isEditing = false,
  form,
  onSubmit,
  isSaving,
  isLoadingProducts = false,
  categories = [],
  suppliers = [],
  isLoadingSuppliers = false,
  onOpenCreateProduct,
}: RestockDialogProps) {
  const { t } = useTranslation();
  const { register, control, watch, setValue } = form;
  const [submitMode, setSubmitMode] = useState<'draft' | 'completed'>('completed');

  const catalog = useRestockProducts();
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  // Custom hook para encapsular lógica de tasa
  const {
    exchangeRate,
    exchangeRateDate,
    activeSystemRate,
    activeSystemRateDate,
    rateDate,
    handleUpdateRate,
  } = useRestockExchangeRate(form, isEditing);

  const items = useWatch({ control, name: 'items' });
  const supplierId = watch('supplier_id');

  // Cálculos de totales derivados
  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const qty = Number(item.quantity) || 0;
        const unitCostUsd = Number(item.unit_cost_usd) || 0;
        const subtotalUsd = qty * unitCostUsd;
        const subtotalBs = subtotalUsd * exchangeRate;

        return {
          totalUsd: acc.totalUsd + subtotalUsd,
          totalBs: acc.totalBs + subtotalBs,
        };
      },
      { totalUsd: 0, totalBs: 0 }
    );
  }, [items, exchangeRate]);

  const updateQuantity = useCallback(
  (index: number, delta: number) => {
    const currentItem = items[index];
    if (!currentItem) return;

    const currentQty = Number(currentItem.quantity) || 0;
    const newQty = Math.max(1, currentQty + delta);
    const costUsd = Number(currentItem.unit_cost_usd) || 0;

    setValue(`items.${index}.quantity`, newQty, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue(`items.${index}.unit_cost_bs`, costUsd * exchangeRate, {
      shouldDirty: true,
    });
  },
  [items, exchangeRate, setValue]
);

  const handleSelectProduct = useCallback(
    (product: ProductApiResponse) => {
      const existingIndex = fields.findIndex((f) => String(f.product_id) === String(product.id));

      if (existingIndex >= 0) {
        const currentItem = items[existingIndex];
        const newQty = (Number(currentItem?.quantity) || 0) + 1;
        setValue(`items.${existingIndex}.quantity`, newQty, { shouldDirty: true });
        
      } else {
        const costUsd = product.cost_usd || 0;
        append({
          product_id: product.id,
          product_name_snapshot: product.name,
          quantity: 1,
          unit_cost_usd: costUsd,
          unit_cost_bs: costUsd * exchangeRate,
        });
      }
    },
    [fields, items, exchangeRate, append, setValue]
  );

  const handleFormSubmit = (e: React.FormEvent, mode: 'draft' | 'completed') => {
    e.preventDefault();
    setSubmitMode(mode);

    // Mapeo e inyección limpia de totales consolidados al form
    const updatedItems = items.map((item) => {
      const qty = Number(item.quantity) || 1;
      const costUsd = Number(item.unit_cost_usd) || 0;
      const subtotalUsd = qty * costUsd;

      return {
        ...item,
        quantity: qty,
        unit_cost_usd: costUsd,
        unit_cost_bs: costUsd * exchangeRate,
        subtotal_usd: subtotalUsd,
        subtotal_bs: subtotalUsd * exchangeRate,
      };
    });

    setValue('items', updatedItems, { shouldValidate: true, shouldDirty: true });
    setValue('exchange_rate', exchangeRate);
    setValue('exchange_rate_date', exchangeRateDate);
    setValue('status', mode === 'draft' ? 'draft' : 'completed');
    setValue('total_usd', totals.totalUsd);
    setValue('total_bs', totals.totalBs);

    onSubmit(mode)(e);
  };

  const dialogTitle = isEditing
    ? t('restock.dialog.editTitle', { defaultValue: 'Editar Reabastecimiento' })
    : t('restock.dialog.title', { defaultValue: 'Reposición' });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1080px] w-[98vw] h-[95dvh] md:h-[90vh] p-0 gap-0 overflow-hidden rounded-xl border bg-background flex flex-col">
        <DialogHeader className="p-0 border-0">
          <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => handleFormSubmit(e, submitMode)} className="flex flex-col h-full w-full overflow-hidden min-h-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3 border-b bg-card shrink-0">
            {/* Sección izquierda: Título e ícono */}
            <div className="flex items-center gap-2 min-w-0">
              <PackagePlus className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />
              <h2 className="text-xs sm:text-base font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-400 truncate">
                {dialogTitle}
              </h2>
            </div>

            {/* Sección derecha: Toggle y Botón Vaciar */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              <ExchangeRateToggle
                currentFormRate={exchangeRate}
                activeSystemRate={activeSystemRate}
                activeSystemRateDate={activeSystemRateDate}
                rateDate={rateDate}
                onUpdateToCurrentRate={handleUpdateRate}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setValue('items', [])}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/50 font-bold uppercase text-[10px] sm:text-xs gap-1.5 h-7 sm:h-8 px-2 sm:px-3 shrink-0"
              >
                <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{t('common.actions.clear', { defaultValue: 'Vaciar' })}</span>
              </Button>
            </div>
          </div>

          {/* Barra Superior: Proveedor y Factura */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 sm:px-4 sm:py-2.5 bg-muted/20 border-b shrink-0">
            <div className="gap-2 flex-1">
              <SupplierSelect
                suppliers={suppliers}
                value={supplierId === 'ALL' ? null : supplierId}
                onChange={(val) => {
                  setValue('supplier_id', val, { shouldValidate: true, shouldDirty: true });
                }}
                label=""
                disabled={isLoadingSuppliers}
              />
            </div>

            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                placeholder={t('restock.dialog.invoicePlaceholder', { defaultValue: 'Nº Factura (Opcional)' })}
                className="h-8 text-xs bg-card"
                {...register('invoice_number')}
              />
            </div>
          </div>

          {/* Cuerpo Dividido */}
          <div className="flex flex-col md:grid md:grid-cols-12 flex-1 min-h-0 overflow-hidden divide-y md:divide-y-0 md:divide-x border-b">
            <RestockProductCatalog
              categories={categories}
              isLoading={isLoadingProducts}
              onSelectProduct={handleSelectProduct}
              onAddNewProduct={onOpenCreateProduct}
              catalog={catalog}
            />

            <div className="h-1/2 md:h-full md:col-span-6 flex flex-col min-h-0 bg-background overflow-hidden">
              <RestockCartList
                fields={fields}
                items={items}
                register={register}
                setValue={setValue}
                control={control}
                remove={remove}
                updateQuantity={updateQuantity}
                exchangeRate={exchangeRate}
              />

              {/* Totales y Acciones */}
              <div className="p-2 sm:p-3 border-t bg-slate-50 dark:bg-slate-900 space-y-2 shrink-0 z-10 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <div className="flex-1 flex items-center justify-between bg-card border px-2.5 py-1 sm:py-1.5 rounded-lg shadow-sm">
                    <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-400">$</span>
                    <span className="font-black text-sm sm:text-base text-emerald-950 dark:text-emerald-400">
                      {totals.totalUsd.toFixed(2)}
                    </span>
                  </div>

                  <ArrowUpDown className="w-3 h-3 text-muted-foreground shrink-0 rotate-90" />

                  <div className="flex-1 flex items-center justify-between bg-card border px-2.5 py-1 sm:py-1.5 rounded-lg shadow-sm">
                    <span className="font-black text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate">
                      {totals.totalBs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="font-extrabold text-[10px] text-muted-foreground">Bs</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    type="button"
                    disabled={isSaving || fields.length === 0}
                    onClick={(e) => handleFormSubmit(e, 'draft')}
                    variant="outline"
                  >
                    {isSaving && submitMode === 'draft' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{t('common.actions.save', { defaultValue: 'Guardar' })}</span>
                  </Button>

                  <Button
                    type="button"
                    disabled={isSaving || fields.length === 0}
                    onClick={(e) => handleFormSubmit(e, 'completed')}
                    className="bg-emerald-900 hover:bg-emerald-800"
                  >
                    {isSaving && submitMode === 'completed' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        {isEditing ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{t('common.actions.save', { defaultValue: 'Guardar' })}</span>
                          </>
                        ) : (
                          <>
                            <span className="truncate">{t('restock.dialog.actions.checkout', { defaultValue: 'Facturar' })}</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}