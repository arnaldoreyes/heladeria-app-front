import { iceApi } from '@/api/iceApi';
import type { AuthResponse } from '../interfaces/auth.response';
import type { RegisterValues } from '../schemas/register.schema';

export const registerAction = async (
  data: RegisterValues
): Promise<AuthResponse> => {
  const { data: response } = await iceApi.post<AuthResponse>('/auth/register', data);
  return response;
};