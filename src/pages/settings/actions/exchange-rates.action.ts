import { iceApi } from '@/api/iceApi';
import type { ExchangeRate, UpdateExchangeConfigPayload } from '../schemas/exchange-rate.schema';

export interface ExchangeRatesResponse {
  current_rate: ExchangeRate | null;
  history: ExchangeRate[];
  bcv_mode: 'auto' | 'manual';
  currency_used: string;
  rate_policy: string;
}

// Obtener tasa activa, configuraciones y últimas tasas
export const getExchangeRatesAction = async (): Promise<ExchangeRatesResponse> => {
  const { data } = await iceApi.get('/exchange-rates');
  return data;
};

// Sincronizar tasa mediante disparo manual (System Sync)
export const syncExchangeRateAction = async (): Promise<ExchangeRate> => {
  const { data } = await iceApi.post('/exchange-rates/sync');
  return data;
};

// Actualizar modo de tasa o registrar tasa manual
export const updateExchangeConfigAction = async (payload: UpdateExchangeConfigPayload) => {
  const { data } = await iceApi.post('/exchange-rates/config', payload);
  return data;
};