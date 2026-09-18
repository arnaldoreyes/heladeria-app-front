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
  
export type BusinessFormData = z.infer<typeof businessSchema>;