import { iceApi } from '@/api/iceApi';

export const logoutAction = async (): Promise<void> => {
  await iceApi.post('/auth/logout');
};