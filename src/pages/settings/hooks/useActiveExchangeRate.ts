import { useQuery } from '@tanstack/react-query';
import { getExchangeRatesAction } from '@/pages/settings/actions/exchange-rates.action';

export const QUERY_KEY_EXCHANGE_RATES = ['exchange-rates'];

export function useActiveExchangeRate() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEY_EXCHANGE_RATES,
    queryFn: getExchangeRatesAction,
    staleTime: 1000 * 60 * 15, // Mantiene los datos frescos por 15 minutos sin re-peticiones
    gcTime: 1000 * 60 * 60,    // Mantiene la caché guardada 1 hora
  });

  const currentRate = data?.current_rate ?? null;
  const rateNumber = Number(currentRate?.rate ?? 0);
  const currency = currentRate?.currency ?? 'VES';

  // Helpers de conversión reutilizables
  const convertUsdToBs = (amountUsd: number): number => {
    return Number((amountUsd * rateNumber).toFixed(2));
  };

  const convertBsToUsd = (amountBs: number): number => {
    if (rateNumber === 0) return 0;
    return Number((amountBs / rateNumber).toFixed(2));
  };

  return {
    currentRate,
    rateNumber,
    currency,
    history: data?.history ?? [],
    bcvMode: data?.bcv_mode ?? 'auto',
    currencyUsed: data?.currency_used ?? 'USD',
    ratePolicy: data?.rate_policy ?? 'strict',
    isLoading,
    isError,
    refetch,
    convertUsdToBs,
    convertBsToUsd,
  };
}