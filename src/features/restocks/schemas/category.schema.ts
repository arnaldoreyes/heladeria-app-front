import { z } from 'zod';

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(255),
  description: z.string().nullable().optional(),
  icon: z.string().nullable().optional(),
  profit_percentage: z.coerce
    .number()
    .min(0, 'El porcentaje debe ser mayor o igual a 0')
    .max(100, 'El porcentaje no puede exceder 100')
    .nullable()
    .optional(),
  reinvestment_percentage: z.coerce
    .number()
    .min(0, 'El porcentaje debe ser mayor o igual a 0')
    .max(100, 'El porcentaje no puede exceder 100')
    .nullable()
    .optional(),
  parent_id: z.string().nullable().optional(),
});

export const bulkUpdateCategoryRulesSchema = z.object({
  parent_id: z.string().nullable().optional(),
  business_percentage: z.number().min(0).max(100).nullable().optional(),
  personal_percentage: z.number().min(0).max(100).nullable().optional(),
}).refine(
  (data) => data.parent_id !== undefined || data.business_percentage !== undefined,
  { message: 'Debe modificar al menos un campo para actualizar' }
);

export type BulkUpdateCategoryRulesFormData = z.infer<typeof bulkUpdateCategoryRulesSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;