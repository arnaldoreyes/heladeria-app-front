import { z } from 'zod';

export const registerSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  ownerName: z.string().min(2, 'Your name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  nicho: z.string().min(2, 'Nicho is required'),
  baseCurrency: z.enum(['USD', 'BS']),
  businessFundPercent: z.number().min(0).max(100),
  personalProfitPercent: z.number().min(0).max(100),
});

export type RegisterValues = z.infer<typeof registerSchema>;