import { iceApi } from '@/api/iceApi';
import type { PaymentMethodFormData } from '../schemas/settings.schema';
import type { PaymentMethodApiResponse } from '../interfaces/payment.response';
import { cleanParams } from '@/lib/api.utils';


export interface GetFilters {
  search?: string;
  currency?: string;
  page?: number;
  perPage?: number;
  limit?: number; 
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  sort?: string;
}

export const getPaymentMethodsAction = async (filters: GetFilters = {}) => {
  const {data} = await iceApi.get('/payment-methods', {
    params: cleanParams(filters)
  });
  
  return data;
};

export const getPaymentMethodByIdAction = async (id: number | string): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.get(`/payment-methods/${id}`);
  return data;
};

export const createPaymentMethodAction = async (payload: PaymentMethodFormData): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.post('/payment-methods', payload);
  return data;
};

export const updatePaymentMethodAction = async (id: number | string, payload: PaymentMethodFormData): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.put(`/payment-methods/${id}`, payload);
  return data;
};

export const deletePaymentMethodAction = async (id: number | string): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.delete(`/payment-methods/${id}`);
  return data;
};

export const bulkDestroyPaymentMethodsAction = async (ids: (number | string)[]): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.post('/payment-methods/bulk-destroy', { ids });
  return data;
};

export const bulkUpdateStatusPaymentMethodsAction = async (ids: (number | string)[], is_active: boolean = true): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.post('/payment-methods/bulk-status-update', { ids, is_active } );
  return data;
};

export const togglePaymentMethodStatusAction = async (id: number | string): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.post(`/payment-methods/${id}/toggleStatus`);
  return data;
};
