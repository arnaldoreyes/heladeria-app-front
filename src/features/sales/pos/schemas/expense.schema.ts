import { z } from 'zod';

export const expenseSchema = z.object({
  id: z.string().optional(),
  concept: z.string().min(1, 'El concepto es obligatorio').max(255),
  category: z.string().min(1, 'La categoría es obligatoria'),
  amount_usd: z.coerce.number().min(0, 'El monto en USD debe ser positivo'),
  amount_bs: z.coerce.number().min(0, 'El monto en Bs debe ser positivo').optional().default(0),
  exchange_rate: z.coerce.number().min(0.0001, 'La tasa debe ser mayor a 0'),
  payment_method: z.string().min(1, 'El método de pago es obligatorio'),
  expense_date: z.string().min(1, 'La fecha del gasto es obligatoria'),
  notes: z.string().nullable().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;