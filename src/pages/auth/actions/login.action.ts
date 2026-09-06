import { iceApi } from '@/api/iceApi';
import type { AuthResponse } from '../interfaces/auth.response';

export const loginAction = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await iceApi.post<AuthResponse>('/auth/login', {
    email,
    password,
  });

  return data;
};