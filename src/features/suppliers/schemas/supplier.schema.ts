import { z } from 'zod';

export const supplierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre del proveedor es obligatorio').max(255),
  tax_type: z.enum(['V', 'E', 'J', 'G', 'P']).nullable().optional(),
  tax_id: z.string().max(50, 'El documento de identificación no debe superar 50 caracteres').nullable().optional(),
  contact_name: z.string().max(255).nullable().optional(),
  email: z.string().email('Ingrese un correo electrónico válido').nullable().or(z.literal('')).optional(),
  phone: z.string().max(50).nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().max(100).nullable().optional(),
  notes: z.string().nullable().optional(),
  is_active: z.boolean(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;