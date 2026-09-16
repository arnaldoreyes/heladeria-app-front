import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PackagePlus, ShoppingBag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RestockCartRow } from './RestockCartRow';
import type { RestockCartListProps } from '../../interfaces/cart.types';

export function RestockCartList({
  fields,
  register,
  remove,
  updateQuantity,
  control,
  exchangeRate,
  errors,
}: RestockCartListProps) {
  const { t } = useTranslation(['restocks', 'common']);
  const itemsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fields.length > 0) {
      itemsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [fields.length]);

  return (
    <div className="h-1/2 md:h-full md:col-span-6 flex flex-col min-h-0 bg-background overflow-hidden">
      {/* Header del Carrito */}
      <div className="px-3 py-1.5 bg-muted/40 border-b flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider shrink-0">
        <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-700" />
          {t('restocks.cart.title', { defaultValue: 'Cotización' })} ({fields.length})
        </span>
        <span className="hidden sm:inline">
          {t('common.subtotal', { defaultValue: 'Subtotal' })}
        </span>
      </div>

      {/* Lista de Ítems */}
      <ScrollArea className="flex-1 min-h-0 p-2 sm:p-3">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[120px] text-center text-muted-foreground p-4">
            <PackagePlus className="w-8 h-8 stroke-1 mb-1 opacity-40" />
            <p className="text-xs font-medium">
              {t('restocks.cart.empty_message', { defaultValue: 'Haz clic en productos para agregarlos.' })}
            </p>
          </div>
        ) : (
          <div className="space-y-2 pb-2">
            {fields.map((field, index) => (
              <RestockCartRow
                key={field.id}
                fieldId={field.id}
                index={index}
                exchangeRate={exchangeRate}
                control={control}
                register={register}
                remove={remove}
                updateQuantity={updateQuantity}
                itemErrors={errors?.items?.[index]}
              />
            ))}
            <div ref={itemsEndRef} className="h-1" />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}