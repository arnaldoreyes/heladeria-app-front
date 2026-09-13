import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { 
  updateExchangeConfigSchema, 
  type UpdateExchangeConfigPayload 
} from '../schemas/exchange-rate.schema';
import { 
  updateExchangeConfigAction, 
  syncExchangeRateAction 
} from '../actions/exchange-rates.action';
import { QUERY_KEY_EXCHANGE_RATES, useActiveExchangeRate } from './useActiveExchangeRate';

export function useExchangeRates() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { currentRate, bcvMode, currencyUsed, ratePolicy, isLoading, isError, refetch } = useActiveExchangeRate();

  const form = useForm<UpdateExchangeConfigPayload>({
    resolver: zodResolver(updateExchangeConfigSchema),
    defaultValues: {
      bcv_mode: 'auto',
      currency_used: 'USD',
      rate_policy: 'strict',
      rate: undefined,
    },
  });

  useEffect(() => {
    if (currentRate || bcvMode) {
      form.reset({
        bcv_mode: bcvMode,
        currency_used: currencyUsed,
        rate_policy: ratePolicy,
        rate: bcvMode === 'manual' && currentRate ? Number(currentRate.rate) : undefined,
      });
    }
  }, [currentRate, bcvMode, currencyUsed, ratePolicy, form]);

  const configMutation = useMutation({
    mutationFn: updateExchangeConfigAction,
    onSuccess: () => {
      toast.success(t('settings.exchange.manualSuccess', 'Configuración de tasa actualizada'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_EXCHANGE_RATES });
    },
    onError: () => {
      toast.error(t('settings.exchange.error', 'Ocurrió un error al guardar'));
    },
  });

  const syncMutation = useMutation({
    mutationFn: syncExchangeRateAction,
    onSuccess: () => {
      toast.success(t('settings.exchange.syncSuccess', 'Sincronizado con BCV correctamente'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_EXCHANGE_RATES });
    },
    onError: () => {
      toast.error(t('settings.exchange.syncError', 'Error al sincronizar con BCV'));
    },
  });

  const handleSubmitConfig = form.handleSubmit((values) => {
    configMutation.mutate(values);
  });

  const handleSyncBCV = () => {
    toast.info(t('settings.exchange.syncing', 'Sincronizando con BCV...'));
    syncMutation.mutate();
  };

  return {
    form,
    bcvModeValue: form.watch('bcv_mode'),
    currencyUsedValue: form.watch('currency_used'),
    ratePolicyValue: form.watch('rate_policy'),

    isLoading,
    isError,
    isSaving: configMutation.isPending,
    isSyncing: syncMutation.isPending,

    handleSubmitConfig,
    handleSyncBCV,
    refetch,
  };
}