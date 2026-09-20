import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useWatch } from 'react-hook-form'; // 👈 Importar useWatch
import type { UseFormRegister, FieldError, Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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

  
  const item = useWatch({
    control,
    name: `items.${index}`,
  });

  const qty = Number(item?.quantity) || 0;
  const unitCostUsd = Number(item?.unit_cost_usd) || 0;
  const subtotalUsd = qty * unitCostUsd;
  const subtotalBs = subtotalUsd * exchangeRate;

  return (
    <div
      className={`p-2 border rounded-xl bg-card hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 shadow-sm ${
        itemErrors ? 'border-red-400 bg-red-50/20' : ''
      }`}
    >
      <div className="flex-1 min-w-0 flex items-center justify-between sm:block">
        <h4 className="font-extrabold text-[11px] sm:text-xs uppercase text-slate-900 dark:text-slate-100 truncate pr-1">
          {item?.product_name_snapshot || t('common.product', { defaultValue: 'Producto' })}
        </h4>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => remove(index)}
          aria-label={t('common.remove', { defaultValue: 'Eliminar' })}
          className="sm:hidden h-5 w-5 text-slate-400 hover:text-red-600 rounded shrink-0"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] text-muted-foreground font-bold">{formatUsd(unitCostUsd)}</span>
        </div>

        {/* Input Cantidad */}
        <div
          className={`flex items-center border rounded-lg bg-muted/30 overflow-hidden shrink-0 ${
            itemErrors?.quantity ? 'border-red-500' : ''
          }`}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(index, -1)}
            aria-label={t('common.decrease', { defaultValue: 'Disminuir' })}
            className="h-6 w-6 rounded-none text-slate-600 hover:bg-slate-200/60"
          >
            <Minus className="w-2.5 h-2.5" />
          </Button>

          <input
            type="number"
            min="1"
            step="1"
            className="w-8 sm:w-10 h-6 text-center font-bold text-xs bg-transparent focus:outline-none focus:bg-background appearance-none [moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            {...register(`items.${index}.quantity`, {
              required: true,
              valueAsNumber: true,
              min: { value: 1, message: t('restocks.cart.errors.minQty', { defaultValue: 'Mínimo 1 unidad' }) },
            })}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => updateQuantity(index, 1)}
            aria-label={t('common.increase', { defaultValue: 'Aumentar' })}
            className="h-6 w-6 rounded-none text-slate-600 hover:bg-slate-200/60"
          >
            <Plus className="w-2.5 h-2.5" />
          </Button>
        </div>

        {/* Subtotales en vivo */}
        <div className="text-right shrink-0 min-w-[60px] sm:w-20">
          <div className="font-black text-xs text-emerald-700 dark:text-emerald-400">
            {formatUsd(subtotalUsd)}
          </div>
          <div className="text-[8px] sm:text-[9px] text-muted-foreground font-medium">
            {formatBs(subtotalBs)}
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => remove(index)}
          aria-label={t('common.remove', { defaultValue: 'Eliminar' })}
          className="hidden sm:flex h-6 w-6 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
});