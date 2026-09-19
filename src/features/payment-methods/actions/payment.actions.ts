import { iceApi } from '@/api/iceApi';
import type { 
  PaymentMethodApiResponse, 
  PaymentMethodsListApiResponse,
  PaymentMethodQueryParams,
} from '@/interfaces/payment-methods.interface';
import { cleanParams, objectToFormData } from '@/lib/api.utils';
import type { PaymentMethodFormData } from '../schemas/payment-methods.schema';
import type { BulkOperationApiResponse } from '@/interfaces/api.interface';

export const getPaymentMethodsAction = async (filters: PaymentMethodQueryParams = {}): Promise<PaymentMethodsListApiResponse> => {
  const params = cleanParams({
    include: 'type', 
    ...filters,
  });

  const { data } = await iceApi.get<PaymentMethodsListApiResponse>('/payment-methods', { params });
  return data;
};

export const getPaymentMethodByIdAction = async (id: string): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.get<PaymentMethodApiResponse>(`/payment-methods/${id}`);
  return data;
};

export const createPaymentMethodAction = async (payload: PaymentMethodFormData): Promise<PaymentMethodApiResponse> => {
  const formData = objectToFormData(payload);
  const { data } = await iceApi.post<PaymentMethodApiResponse>('/payment-methods', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updatePaymentMethodAction = async (id: string, payload: PaymentMethodFormData): Promise<PaymentMethodApiResponse> => {
  const formData = objectToFormData(payload, 'PUT');
  const { data } = await iceApi.post<PaymentMethodApiResponse>(`/payment-methods/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deletePaymentMethodAction = async (id: string): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.delete<PaymentMethodApiResponse>(`/payment-methods/${id}`);
  return data;
};

export const togglePaymentMethodStatusAction = async (id: string): Promise<PaymentMethodApiResponse> => {
  const { data } = await iceApi.post<PaymentMethodApiResponse>(`/payment-methods/${id}/toggleStatus`);
  return data;
};

export const bulkDestroyPaymentMethodsAction = async (ids: string[]): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/payment-methods/bulk-destroy', { ids });
  return data;
};

export const bulkUpdateStatusPaymentMethodsAction = async (ids: string[], is_active: boolean = true): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/payment-methods/bulk-status-update', { ids, is_active });
  return data;
};