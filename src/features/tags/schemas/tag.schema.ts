import { z } from 'zod';

export const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es obligatorio').max(255),
  slug: z.string().optional().nullable(), // <- Cambiado a opcional y nullable
  is_active: z.boolean().optional(),
  color: z.string().optional().nullable(),
});

export type TagFormData = z.infer<typeof tagSchema>;