import { z } from 'zod';

// Validante de cada ítem en el carrito
export const saleItemSchema = z.object({
  product_id: z.string().uuid('ID de producto inválido'),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  unit_price_usd: z.number().min(0, 'El precio no puede ser negativo'),
});

// Esquema opcional para anulación
export const voidSaleSchema = z.object({
  reason: z.string().min(3, 'Indique el motivo de la anulación').max(255),
});


export const salePaymentDetailSchema = z.object({
  method: z.enum(['cash_usd', 'cash_bs', 'pago_movil']),
  amount_usd: z.number().min(0, 'El monto en USD no puede ser negativo'),
  amount_bs: z.number().min(0, 'El monto en Bs. no puede ser negativo'),
  bank_name: z.string().nullable().optional(),
  reference: z.string().nullable().optional(),
});

export const createSaleSchema = z.object({
  exchange_rate: z.number().positive(),
  change_loss_bs: z.number().min(0).default(0),
  payments: z.array(salePaymentDetailSchema).min(1, 'Debe registrar al menos un pago'),
  items: z.array(
    z.object({
      product_id: z.string().uuid(),
      quantity: z.number().int().min(1),
      unit_price_usd: z.number().min(0),
    })
  ).min(1, 'El carrito está vacío'),
});


export type CreateSaleFormData = z.infer<typeof createSaleSchema>;
export type VoidSaleFormData = z.infer<typeof voidSaleSchema>;
export type SaleItemFormData = z.infer<typeof saleItemSchema>;