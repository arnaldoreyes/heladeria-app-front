import { iceApi } from '@/api/iceApi';

export const getPaymentTypesAction = async () => {
  const { data } = await iceApi.get('/payment-types');
  return data;
};