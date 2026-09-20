import { iceApi } from '@/api/iceApi';
import type { SupplierApiResponse, SupplierQueryParams, SuppliersListApiResponse } from '@/interfaces/supplier.interface';
import { cleanParams } from '@/lib/api.utils';
import type { SupplierFormData } from '../schemas/supplier.schema';
import type { BulkOperationApiResponse } from '@/interfaces/api.interface';

export const getSuppliersAction = async (filters: SupplierQueryParams = {}): Promise<SuppliersListApiResponse> => {
  const params = cleanParams(filters);

  const { data } = await iceApi.get<SuppliersListApiResponse>('/suppliers', { params });
  return data;
};

export const getSupplierByIdAction = async (id: string): Promise<SupplierApiResponse> => {
  const { data } = await iceApi.get<SupplierApiResponse>(`/suppliers/${id}`);
  return data;
};

export const createSupplierAction = async (payload: SupplierFormData): Promise<SupplierApiResponse> => {  
  const { data } = await iceApi.post<SupplierApiResponse>('/suppliers', payload);
  return data;
};

export const updateSupplierAction = async (id: string, payload: SupplierFormData): Promise<SupplierApiResponse> => {
  const { data } = await iceApi.put<SupplierApiResponse>(`/suppliers/${id}`, payload);
  return data;
};

export const deleteSupplierAction = async (id: string): Promise<SupplierApiResponse> => {
  const { data } = await iceApi.delete<SupplierApiResponse>(`/suppliers/${id}`);
  return data;
};

export const toggleSupplierStatusAction = async (id: string): Promise<SupplierApiResponse> => {
  const { data } = await iceApi.post<SupplierApiResponse>(`/suppliers/${id}/toggleStatus`);
  return data;
};

export const bulkDestroySuppliersAction = async (ids: string[]): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/suppliers/bulk-destroy', { ids });
  return data;
};

export const bulkUpdateStatusSuppliersAction = async (ids: string[], is_active: boolean = true): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/suppliers/bulk-status-update', { ids, is_active });
  return data;
};