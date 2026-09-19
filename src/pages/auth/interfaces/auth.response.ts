import type { Business } from '@/interfaces/business.interface';
import type { User } from '@/interfaces/user.interface';

export interface AuthResponse {
  user: User;
  business: Business;
  access_token: string;
  expires_at: string;
  message: string;
  token_type: string;
}