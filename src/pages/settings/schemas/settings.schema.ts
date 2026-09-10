import { z } from 'zod';

export const businessSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre del negocio es obligatorio'),
  niche: z.string().min(1, 'El nicho del negocio es obligatorio'),
  default_profit_percentage: z.number().min(0).max(100, 'Máximo 100%'),
  default_reinvestment_percentage: z.number().min(0).max(100, 'Máximo 100%'),
  print_ticket_on_sale: z.boolean(),
  ticket_header_notes: z.string().optional().nullable(),
  ticket_footer_notes: z.string().optional().nullable(),
});
  
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
});

export const exchangeRateSchema = z.object({
  id: z.string().optional(),
  rate: z.number().positive('La tasa debe ser mayor a 0'),
  updated_at: z.string().optional(),
  effective_at: z.string().optional(),
  type: z.enum(['bcv']).optional(),  
  source: z.enum(['system_cron', 'system_sync', 'manual']).optional(),    
});

// Tipos inferidos
export type BusinessFormData = z.infer<typeof businessSchema>;
export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;
export type ExchangeRateFormData = z.infer<typeof exchangeRateSchema>;