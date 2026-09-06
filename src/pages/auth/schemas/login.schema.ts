import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, { message: 'auth.errors.emailRequired' }).email({ message: 'auth.errors.invalidEmail' }),
  password: z.string().min(6, { message: 'auth.errors.passwordMinLength' }),
});

export type LoginValues = z.infer<typeof loginSchema>;