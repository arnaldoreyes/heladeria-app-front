import { z } from 'zod';

export const exchangeRateSourceSchema = z.enum(['system_cron', 'system_sync', 'manual']);
export const bcvModeSchema = z.enum(['auto', 'manual']);
export const ratePolicySchema = z.enum(['strict', 'immediate', 'smart_holiday']); 

export const exchangeRateSchema = z.object({
  id: z.string(),
  business_id: z.string().nullable().optional(),
  user_id: z.string().nullable().optional(),
  type: z.string().default('bcv'),
  rate: z.number().positive('La tasa debe ser mayor a 0'),
  source: exchangeRateSourceSchema.optional(),
  effective_at: z.string(),
  current: z.boolean().optional(),
  currency: z.string().default('USD'),
  created_at: z.string(),
  updated_at: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable().optional(),
});

export const updateExchangeConfigSchema = z.object({
  bcv_mode: bcvModeSchema,
  currency_used: z.string().min(1, 'Debe seleccionar una moneda'),
  rate_policy: ratePolicySchema,
  rate: z.number().optional(),
}).refine(
  (data) => {
    if (data.bcv_mode === 'manual') {
      return data.rate !== undefined && data.rate > 0;
    }
    return true;
  },
  {
    message: 'Debe ingresar una tasa manual válida mayor a 0',
    path: ['rate'],
  }
);

export type ExchangeRate = z.infer<typeof exchangeRateSchema>;
export type UpdateExchangeConfigPayload = z.infer<typeof updateExchangeConfigSchema>;
export type BcvMode = z.infer<typeof bcvModeSchema>;
export type RatePolicy = z.infer<typeof ratePolicySchema>;