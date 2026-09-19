import { iceApi } from '@/api/iceApi';
import type {  PaymentMethodTypesListApiResponse } from '@/interfaces/payment-methods.interface';

export const getPaymentTypesAction = async () : Promise<PaymentMethodTypesListApiResponse>=> {
  const { data } = await iceApi.get('/payment-types');
  return data;
};