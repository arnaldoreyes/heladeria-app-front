import { z } from 'zod';

export const paymentMethodSchema = z.object({
  id: z.string().optional(),
  payment_type_id: z.string().min(1, 'El tipo de pago es requerido'),
  name: z.string().min(3, 'El nombre es requerido'),
  currency: z.string().min(1, 'La moneda es requerida'),
  bank_name: z.string().optional().nullable(),
  account_number: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
  id_document: z.string().optional().nullable(),
  email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
  is_active: z.boolean(),
  qr_code_url: z
    .union([
      z.string(),
      z.instanceof(File),
      z.custom<FileList>((val) => val instanceof FileList),
      z.null(),
    ])
    .optional(),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;