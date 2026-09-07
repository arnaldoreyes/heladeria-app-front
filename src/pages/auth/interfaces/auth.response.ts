import type { User } from '@/interfaces/user.interface';
import type { Business } from '@/types';

export interface AuthResponse {
  user: User;
  business: Business;
  access_token: string;
  expires_at: string;
  message: string;
  token_type: string;
}