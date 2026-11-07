import { z } from 'zod';

/**
 * Helper para validar números coercionados permitiendo strings vacíos en formularios
 * (evita NaN cuando el input está vacío).
 */
const numericSchema = (minMsg: string, invalidMsg: string, minValue = 0) =>
  z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : val),
    z.coerce
      .number({ invalid_type_error: invalidMsg, required_error: invalidMsg })
      .min(minValue, minMsg)
  );

export const restockItemSchema = z
  .object({
    id: z.string().optional(),
    product_id: z.string().min(1, 'restock.errors.productRequired'),
    product_name_snapshot: z.string().min(1, 'restock.errors.productNameRequired'),
    quantity: numericSchema(
      'restock.errors.quantityMin',
      'restock.errors.quantityInvalid',
      0.001
    ),
    unit_cost_usd: numericSchema(
      'restock.errors.costUsdMin',
      'restock.errors.costUsdInvalid',
      0
    ),
    unit_cost_bs: numericSchema(
      'restock.errors.costBsMin',
      'restock.errors.costBsInvalid',
      0
    ),
    subtotal_usd: z.coerce.number().default(0),
    subtotal_bs: z.coerce.number().default(0),
  })
  .transform((item) => ({
    ...item,
    subtotal_usd: Number((item.quantity * item.unit_cost_usd).toFixed(2)),
    subtotal_bs: Number((item.quantity * item.unit_cost_bs).toFixed(2)),
  }));

export const restockSchema = z
  .object({
    id: z.string().optional(),
    supplier_id: z.string().nullable().optional(),
    invoice_number: z.string().nullable().optional(),
    status: z.enum(['draft', 'completed']).default('draft'),
    exchange_rate: numericSchema(
      'restock.errors.exchangeRateMin',
      'restock.errors.exchangeRateInvalid',
      0.0001
    ),
    exchange_rate_date: z.string().nullable().optional(),
    purchased_at: z.string().min(1, 'restock.errors.dateRequired'),
    notes: z.string().nullable().optional(),
    items: z.array(restockItemSchema).min(1, 'restock.errors.itemsMin'),
    total_usd: z.coerce.number().default(0),
    total_bs: z.coerce.number().default(0),
  })
  .transform((data) => {
    const total_usd = data.items.reduce((acc, item) => acc + item.subtotal_usd, 0);
    const total_bs = data.items.reduce((acc, item) => acc + item.subtotal_bs, 0);

    return {
      ...data,
      total_usd: Number(total_usd.toFixed(2)),
      total_bs: Number(total_bs.toFixed(2)),
    };
  });

export type RestockItemFormData = z.input<typeof restockItemSchema>;
export type RestockItemOutputData = z.output<typeof restockItemSchema>;

export type RestockFormData = z.input<typeof restockSchema>;
export type RestockOutputData = z.output<typeof restockSchema>;