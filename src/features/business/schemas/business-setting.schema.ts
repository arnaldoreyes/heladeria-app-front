import { z } from 'zod';

export const businessSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre del negocio es obligatorio'),
  niche: z.string().min(1, 'El nicho del negocio es obligatorio'),
  settings: z.object({
    default_profit_percentage: z.number().min(0).max(100, 'Máximo 100%'),
    default_reinvestment_percentage: z.number().min(0).max(100, 'Máximo 100%'),
    p2c_fee_percentage: z.number().min(0).max(100, 'Máximo 100%'),
    c2p_fee_percentage: z.number().min(0).max(100, 'Máximo 100%'),
    pago_movil_min_fee_bs: z.number().min(0, 'El fee mínimo debe ser un número positivo'),
    print_ticket_on_sale: z.boolean(),
    ticket_header_notes: z.string().optional().nullable(),
    ticket_footer_notes: z.string().optional().nullable(),
  }),
}).refine(
  (data) => data.settings.default_profit_percentage + data.settings.default_reinvestment_percentage <= 100,
  {
    message: 'La suma de porcentaje de ganancia y reinversión no puede superar el 100%',
}
);
  
export type BusinessFormData = z.infer<typeof businessSchema>;