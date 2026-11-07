import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, AlertTriangle } from 'lucide-react';
import { useWatch } from 'react-hook-form';
import type { UseFormRegister, FieldError, Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatBs, formatUsd } from '@/lib/format';
import type { RestockFormData } from '../schemas/restock.schema';

interface RestockCartRowProps {
  index: number;
  fieldId: string;
  control: Control<RestockFormData>;
  exchangeRate: number;
  register: UseFormRegister<RestockFormData>;
  remove: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  itemErrors?: {
    quantity?: FieldError;
    unit_cost_usd?: FieldError;
    price?: FieldError;
  };
}

export const RestockCartRow = memo(function RestockCartRow({
  index,
  control,
  exchangeRate,
  register,
  remove,
  updateQuantity,
  itemErrors,
}: RestockCartRowProps) {
  const { t } = useTranslation(['restocks', 'common']);

  // Observar los cambios de este ítem en tiempo real en el formulario
  const item = useWatch({
    control,
    name: `items.${index}`,
  });

  const qty = Number(item?.quantity) || 0;
  const unitCostUsd = Number(item?.unit_cost_usd) || 0;
  const originalCostUsd = Number(item?.original_cost) || unitCostUsd; // Costo base anterior
  
  // Detección de subida de precio de costo
  const hasCostIncreased = unitCostUsd > originalCostUsd;

  const subtotalUsd = qty * unitCostUsd;
  const subtotalBs = subtotalUsd * exchangeRate;

  return (
    <div
      className={`p-3 border rounded-xl bg-card hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col gap-2.5 shadow-sm ${
        itemErrors ? 'border-red-400 bg-red-50/20' : ''
      }`}
    >
      {/* Cabecera del Producto y Alerta de Precio */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h4 className="font-extrabold text-xs sm:text-sm uppercase text-slate-900 dark:text-slate-100 truncate">
            {item?.product_name_snapshot || t('common.product', { defaultValue: 'Producto' })}
          </h4>
          
          {/* Mensaje de alerta si el costo subió */}
          {hasCostIncreased && (
            <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>
                {t('restocks.cart.costIncreased', { 
                  defaultValue: '¡Costo subió! Anterior: {{old}} USD', 
                  old: formatUsvSafe(originalCostUsd) 
                })}
              </span>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => remove(index)}
          aria-label={t('common.remove', { defaultValue: 'Eliminar' })}
          className="h-6 w-6 text-slate-400 hover:text-red-600 rounded shrink-0 sm:hidden"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Controles de Precios, Cantidad y Subtotales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center pt-1 border-t border-muted/50">
        
        {/* 1. Input Precio de Costo (USD) */}
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground font-bold">
            {t('restocks.cart.cost', { defaultValue: 'Costo Unit. (USD)' })}
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-xs text-muted-foreground">$</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              className="h-8 pl-6 text-xs font-bold"
              {...register(`items.${index}.unit_cost_usd`, {
                required: true,
                valueAsNumber: true,
                min: { value: 0.01, message: 'Mínimo 0.01' },
              })}
            />
          </div>
          {itemErrors?.unit_cost_usd && (
            <span className="text-[10px] text-red-500">{itemErrors.unit_cost_usd.message}</span>
          )}
        </div>

        {/* 2. Input Precio de Venta / PVP (USD) */}
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground font-bold">
            {t('restocks.cart.sellingPrice', { defaultValue: 'Precio Venta (USD)' })}
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1.5 text-xs text-muted-foreground">$</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              className="h-8 pl-6 text-xs font-bold text-emerald-600 dark:text-emerald-400"
              {...register(`items.${index}.sale_price_usd`, {
                required: true,
                valueAsNumber: true,
                min: { value: 0.01, message: 'Mínimo 0.01' },
              })}
            />
          </div>
          {itemErrors?.sale_price_usd && (
            <span className="text-[10px] text-red-500">{itemErrors.sale_price_usd.message}</span>
          )}
        </div>

        {/* 3. Control de Cantidad */}
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground font-bold">
            {t('restocks.cart.qty', { defaultValue: 'Cantidad' })}
          </label>
          <div className="flex items-center border rounded-lg bg-muted/30 overflow-hidden h-8">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(index, -1)}
              className="h-8 w-7 rounded-none text-slate-600 hover:bg-slate-200/60"
            >
              <Minus className="w-3 h-3" />
            </Button>

            <input
              type="number"
              min="1"
              step="1"
              className="w-full h-8 text-center font-bold text-xs bg-transparent focus:outline-none focus:bg-background appearance-none [moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              {...register(`items.${index}.quantity`, {
                required: true,
                valueAsNumber: true,
                min: { value: 1, message: 'Mín 1' },
              })}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => updateQuantity(index, 1)}
              className="h-8 w-7 rounded-none text-slate-600 hover:bg-slate-200/60"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* 4. Subtotales y Botón Eliminar (Desktop) */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-4 sm:pt-0">
          <div className="text-right">
            <div className="font-black text-xs sm:text-sm text-emerald-700 dark:text-emerald-400">
              {formatUsd(subtotalUsd)}
            </div>
            <div className="text-[9px] text-muted-foreground font-medium">
              {formatBs(subtotalBs)}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
            aria-label={t('common.remove', { defaultValue: 'Eliminar' })}
            className="hidden sm:flex h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </div>
  );
});

// Helper seguro para formatear formato monetario dentro de strings
function formatUsvSafe(val: number): string {
  return formatUsd(val);
}