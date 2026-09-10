import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { updateExchangeConfigSchema, type UpdateExchangeConfigPayload } from '../schemas/exchange-rate.schema';
import { getExchangeRatesAction, syncExchangeRateAction, updateExchangeConfigAction } from '../actions/exchange-rates.action';

export const QUERY_KEY_EXCHANGE_RATES = ['exchange-rates'];

export function useExchangeRates() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEY_EXCHANGE_RATES,
    queryFn: getExchangeRatesAction,
  });

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
    if (data) {
      form.reset({
        bcv_mode: data.bcv_mode ?? 'auto',
        currency_used: data.currency_used ?? 'USD',
        rate_policy: data.rate_policy ?? 'strict',
        rate: data.bcv_mode === 'manual' ? data.current_rate?.rate : undefined,
      });
    }
  }, [data, form]);

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
    currentRate: data?.current_rate ?? null,
    history: data?.history ?? [],
    bcvMode: data?.bcv_mode ?? 'auto',
    currencyUsed: data?.currency_used ?? 'USD',
    ratePolicy: data?.rate_policy ?? 'smart',
    isLoading,
    isError,

    form,
    bcvModeValue: form.watch('bcv_mode'),
    currencyUsedValue: form.watch('currency_used'),
    ratePolicyValue: form.watch('rate_policy'),

    handleSubmitConfig,
    handleSyncBCV,
    isSaving: configMutation.isPending,
    isSyncing: syncMutation.isPending,
    refetch,
  };
}