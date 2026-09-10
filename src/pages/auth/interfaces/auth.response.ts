import type { User } from '@/interfaces/user.interface';
import type { BusinessFormData } from '@/pages/settings/schemas/settings.schema';

export interface AuthResponse {
  user: User;
  business: BusinessFormData;
  access_token: string;
  expires_at: string;
  message: string;
  token_type: string;
}