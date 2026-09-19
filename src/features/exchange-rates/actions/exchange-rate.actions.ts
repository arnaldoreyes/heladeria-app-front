import { iceApi } from '@/api/iceApi';
import type { ExchangeRateConfig } from '@/interfaces/exchange-rates.interface';
import type { UpdateExchangeConfigPayload } from '../schemas/exchange-rate.schema';

// Obtener tasa activa, configuraciones y últimas tasas
export const getExchangeRatesAction = async (): Promise<ExchangeRateConfig> => {
  const { data } = await iceApi.get('/exchange-rates');
  return data;
};

// Sincronizar tasa mediante disparo manual (System Sync)
export const syncExchangeRateAction = async (): Promise<ExchangeRateConfig> => {
  const { data } = await iceApi.post('/exchange-rates/sync');
  return data;
};

// Actualizar modo de tasa o registrar tasa manual
export const updateExchangeConfigAction = async (payload: UpdateExchangeConfigPayload): Promise<ExchangeRateConfig> => {
  const { data } = await iceApi.post('/exchange-rates/config', payload);
  return data;
};