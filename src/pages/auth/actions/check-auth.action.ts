import { iceApi } from '@/api/iceApi';
import type { AuthResponse } from '../interfaces/auth.response';
import { useAuthStore } from '@/stores/auth-store';

export const checkAuthAction = async (): Promise<AuthResponse | null> => {
  const token = useAuthStore.getState().token;

  if (!token) {
    useAuthStore.getState().logout();
    return null;
  }

  try {
    const { data } = await iceApi.get<AuthResponse>('/auth/check-status');
    useAuthStore.getState().setSession(data.user, data.token);
    return data;
  } catch (error) {
    useAuthStore.getState().logout();
    return null;
  }
};