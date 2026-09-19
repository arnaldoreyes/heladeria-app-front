import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { 
  updateExchangeConfigSchema, 
  type UpdateExchangeConfigPayload 
} from '../schemas/exchange-rate.schema';
import { 
  updateExchangeConfigAction, 
  syncExchangeRateAction,
  getExchangeRatesAction 
} from '../actions/exchange-rate.actions';
import { QUERY_KEY_EXCHANGE_RATES } from './useActiveExchangeRate';

export function useExchangeRates() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEY_EXCHANGE_RATES,
    queryFn: getExchangeRatesAction,
  });

  const bcvMode = data?.bcv_mode ?? 'auto';
  const currencyUsed = data?.currency_used ?? 'USD';
  const ratePolicy = data?.rate_policy ?? 'strict';
  const currentRate = data?.current_rate ?? null;
  const history = data?.history ?? [];

  const initialValues = useMemo<UpdateExchangeConfigPayload>(() => ({
    bcv_mode: bcvMode,
    currency_used: currencyUsed,
    rate_policy: ratePolicy,
    rate: bcvMode === 'manual' && currentRate ? Number(currentRate.rate) : undefined,
  }), [bcvMode, currencyUsed, ratePolicy, currentRate]);

  const form = useForm<UpdateExchangeConfigPayload>({
    resolver: zodResolver(updateExchangeConfigSchema),
    values: initialValues,
    resetOptions: {
      keepDirtyValues: true,
      keepErrors: true,
    },
  });

  const { formState: { isSubmitting, isDirty }, control } = form;

  const bcvModeValue = useWatch({ control, name: 'bcv_mode' }) ?? bcvMode;
  const currencyUsedValue = useWatch({ control, name: 'currency_used' }) ?? currencyUsed;
  const ratePolicyValue = useWatch({ control, name: 'rate_policy' }) ?? ratePolicy;

  const configMutation = useMutation({
    mutationFn: updateExchangeConfigAction,
    onSuccess: () => {
      toast.success(t('settings.exchange.manualSuccess', 'Configuración de tasa actualizada'));
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_EXCHANGE_RATES });
    },
    onError: (err) => {
      console.error('Error al guardar en backend:', err);
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

  const handleSubmitConfig = form.handleSubmit(
    (values) => {
      const payload: UpdateExchangeConfigPayload = {
        ...values,
        rate: values.bcv_mode === 'auto' ? undefined : values.rate,
      };
      configMutation.mutate(payload);
    },
    (errors) => {
      console.error('Errores de validación en formulario:', errors);
    }
  );

  const handleSyncBCV = () => {
    toast.info(t('settings.exchange.syncing', 'Sincronizando con BCV...'));
    syncMutation.mutate();
  };

  return {
    history,
    bcvMode,
    currencyUsed,
    ratePolicy,

    form,
    bcvModeValue,
    currencyUsedValue,
    ratePolicyValue,

    isLoading,
    isError,
    isSaving: configMutation.isPending || isSubmitting,
    isDirty,
    isSyncing: syncMutation.isPending,
    handleSubmitConfig,
    handleSyncBCV,
    refetch,
  };
}