import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useActiveExchangeRate } from '@/features/exchange-rates/hooks/useActiveExchangeRate';
import type { RestockFormData } from '../schemas/restock.schema';

export function useRestockExchangeRate(
  form: UseFormReturn<RestockFormData>,
  isEditing: boolean
) {
  const { watch, setValue } = form;
  const { currentRate } = useActiveExchangeRate();

  const activeSystemRate = Number(currentRate?.rate) || 1;
  const activeSystemRateDate = currentRate?.effective_at;

  const formExchangeRate = watch('exchange_rate');
  const rateDate = watch('exchange_rate_date');

  const exchangeRate = useMemo(() => {
    if (isEditing) {
      return formExchangeRate && formExchangeRate !== 0 ? Number(formExchangeRate) : activeSystemRate;
    }
    return activeSystemRate;
  }, [isEditing, formExchangeRate, activeSystemRate]);

  const exchangeRateDate = useMemo(() => {
    if (isEditing) {
      return rateDate ?? activeSystemRateDate;
    }
    return activeSystemRateDate;
  }, [isEditing, activeSystemRateDate, rateDate]);

  const handleUpdateRate = (newRate: number) => {
    setValue('exchange_rate', newRate, { shouldValidate: true, shouldDirty: true });
    setValue('exchange_rate_date', new Date().toISOString(), { shouldDirty: true });

    const currentItems = form.getValues('items') || [];
    currentItems.forEach((item, index) => {
      const costUsd = Number(item.unit_cost_usd) || 0;
      setValue(`items.${index}.unit_cost_bs`, costUsd * newRate, { shouldDirty: true });
    });
  };

  return {
    exchangeRate,
    exchangeRateDate,
    activeSystemRate,
    activeSystemRateDate,
    rateDate,
    handleUpdateRate,
  };
}