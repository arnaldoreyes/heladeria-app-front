import { z } from 'zod';

// --- Esquema de Ítem en el Carrito / Venta ---
export const saleItemSchema = z.object({
  product_id: z.string().min(1, 'Producto inválido'),
  product_name_snapshot: z.string().optional(),
  quantity: z.number().int().min(1, 'La cantidad debe ser al menos 1'),
  unit_price_usd: z.number().min(0, 'El precio no puede ser negativo'),
  unit_price_bs: z.number().min(0).optional(),
});

// --- Esquema de Métodos de Pago Registrados ---
export const salePaymentDetailSchema = z.object({
  payment_method_id: z.string().min(1, 'Seleccione un método de pago'),
  amount_original: z.number().positive('El monto debe ser mayor a 0'),
  currency: z.enum(['USD', 'BS'], {
    errorMap: () => ({ message: 'Moneda inválida (debe ser USD o BS)' }),
  }),
  amount_usd: z.number().min(0, 'El monto equivalente en USD no puede ser negativo'),
  exchange_rate: z.number().positive('La tasa del pago debe ser mayor a 0'),
  exchange_rate_date: z.string().optional(),
  reference: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

// --- Esquema Principal para la Creación de la Venta ---
export const saleSchema = z.object({
  customer_id: z.string().nullable().optional(),
  sale_type: z.enum(['direct', 'credit', 'quote']).default('direct'),
  status: z.enum(['completed', 'draft', 'voided']).default('completed'),
  payment_status: z.enum(['paid', 'partial', 'pending']).default('paid'),
  
  // Tasas y Moneda
  exchange_rate: z.number().positive('La tasa debe ser mayor a 0'),
  exchange_rate_date: z.string().optional(),

  // Ajustes de Caja
  discount_bs: z.number().min(0).default(0),
  change_loss_bs: z.number().min(0).default(0),

  // Colecciones asociadas
  items: z.array(saleItemSchema).min(1, 'El carrito no puede estar vacío'),
  payments: z.array(salePaymentDetailSchema).min(1, 'Debe incluir al menos un pago'),
});

// --- Esquema para Anulación de Venta ---
export const voidSaleSchema = z.object({
  reason: z.string().min(3, 'Indique el motivo de la anulación').max(255),
});

// --- Tipos Inferidos ---
export type SaleFormData = z.infer<typeof saleSchema>;
export type SaleItemFormData = z.infer<typeof saleItemSchema>;
export type SalePaymentDetailFormData = z.infer<typeof salePaymentDetailSchema>;
export type VoidSaleFormData = z.infer<typeof voidSaleSchema>;