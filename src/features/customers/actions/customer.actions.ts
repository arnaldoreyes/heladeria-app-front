import { iceApi } from '@/api/iceApi';
import type {
  CustomerApiResponse,
  CustomersListApiResponse,
  CustomerQueryParams,
} from '@/interfaces/customer.interface';
import type { CustomerFormData } from '../schemas/customer.schema';
import type { BulkOperationApiResponse } from '@/interfaces/api.interface';
import { cleanParams } from '@/lib/api.utils';

export const getCustomersAction = async (filters: CustomerQueryParams = {}): Promise<CustomersListApiResponse> => {
  const params = cleanParams(filters);
  const { data } = await iceApi.get<CustomersListApiResponse>('/customers', { params });
  return data;
};

export const getCustomerByIdAction = async (id: string): Promise<CustomerApiResponse> => {
  const { data } = await iceApi.get<CustomerApiResponse>(`/customers/${id}`);
  return data;
};

export const createCustomerAction = async (payload: CustomerFormData): Promise<CustomerApiResponse> => {
  const { data } = await iceApi.post<CustomerApiResponse>('/customers', payload);
  return data;
};

export const updateCustomerAction = async (id: string, payload: CustomerFormData): Promise<CustomerApiResponse> => {
  const { data } = await iceApi.put<CustomerApiResponse>(`/customers/${id}`, payload);
  return data;
};

export const deleteCustomerAction = async (id: string): Promise<CustomerApiResponse> => {
  const { data } = await iceApi.delete<CustomerApiResponse>(`/customers/${id}`);
  return data;
};

export const toggleCustomerStatusAction = async (id: string): Promise<CustomerApiResponse> => {
  const { data } = await iceApi.post<CustomerApiResponse>(`/customers/${id}/toggleStatus`);
  return data;
};

export const bulkDestroyCustomersAction = async (ids: string[]): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/customers/bulk-destroy', { ids });
  return data;
};

export const bulkUpdateStatusCustomersAction = async ( ids: string[],  is_active: boolean = true): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/customers/bulk-status-update', {
    ids,
    is_active,
  });
  return data;
};