import { z } from 'zod';

export const exchangeRateSourceSchema = z.enum(['system_cron', 'system_sync', 'manual']);
export const bcvModeSchema = z.enum(['auto', 'manual']);
export const ratePolicySchema = z.enum(['strict', 'immediate', 'smart_holiday']);

export const updateExchangeConfigSchema = z
  .object({
    bcv_mode: bcvModeSchema,
    currency_used: z.string().min(1, 'Debe seleccionar una moneda'),
    rate_policy: ratePolicySchema,
    rate: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined || (typeof val === 'number' && Number.isNaN(val))) {
        return undefined;
      }
      const parsed = Number(val);
      return Number.isNaN(parsed) ? undefined : parsed;
    }, z.number().positive('La tasa debe ser un número positivo mayor a 0').optional()),
  })
  .superRefine((data, ctx) => {
    if (data.bcv_mode === 'manual' && (data.rate === undefined || data.rate <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Debe ingresar una tasa manual válida mayor a 0',
        path: ['rate'],
      });
    }
  });

export type UpdateExchangeConfigPayload = z.infer<typeof updateExchangeConfigSchema>;