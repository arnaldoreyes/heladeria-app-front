import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExchangeRatesAction } from '../actions/exchange-rate.actions';

export const QUERY_KEY_EXCHANGE_RATES = ['exchange-rates'];

export function useActiveExchangeRate() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: QUERY_KEY_EXCHANGE_RATES,
    queryFn: getExchangeRatesAction,
    staleTime: 1000 * 60 * 15, // 15 minutos
    gcTime: 1000 * 60 * 60,    // 1 hora
  });

  const currentRate = data?.current_rate ?? null;
  const rateNumber = useMemo(() => Number(currentRate?.rate ?? 0), [currentRate?.rate]);
  const currency = currentRate?.currency ?? 'VES';

  const convertUsdToBs = useCallback(
    (amountUsd: number): number => Number((amountUsd * rateNumber).toFixed(2)),
    [rateNumber]
  );

  const convertBsToUsd = useCallback(
    (amountBs: number): number => {
      if (rateNumber === 0) return 0;
      return Number((amountBs / rateNumber).toFixed(2));
    },
    [rateNumber]
  );

  
  return {
    currentRate,
    rateNumber,
    currency,
    isLoading,
    isError,
    refetch,
    convertUsdToBs,
    convertBsToUsd,
  };
}