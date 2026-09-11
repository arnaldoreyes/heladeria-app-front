import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  category_id: z.string().nullable().optional(),
  sku: z.string().max(100, 'SKU inválido').optional(),
  name: z.string().min(1, 'El nombre del producto es obligatorio').max(255),
  price_usd: z.coerce
    .number({ invalid_type_error: 'Ingrese un precio válido' })
    .min(0, 'El precio no puede ser negativo'),
  cost_usd: z.coerce
    .number({ invalid_type_error: 'Ingrese un costo válido' })
    .min(0, 'El costo no puede ser negativo')
    .nullable()
    .optional(),
  stock: z.coerce
    .number({ invalid_type_error: 'Ingrese un stock válido' })
    .min(0, 'El stock no puede ser negativo')
    .default(0),
  min_stock_alert: z.coerce
    .number({ invalid_type_error: 'Ingrese un valor válido' })
    .min(0, 'La alerta no puede ser negativa')
    .default(0),
  image: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productSchema>;