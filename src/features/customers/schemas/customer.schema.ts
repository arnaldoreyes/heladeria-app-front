import { z } from 'zod';

export const customerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  type_document: z.string().optional().nullable(),
  id_document: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .nullable()
    .or(z.literal('')),
  address: z.string().optional().nullable(),
  credit_limit_usd: z.coerce
    .number({ invalid_type_error: 'Debe ser un número válido' })
    .min(0, 'El límite de crédito no puede ser negativo')
    .default(0),
  is_active: z.boolean().default(true),
  notes: z.string().optional().nullable(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;