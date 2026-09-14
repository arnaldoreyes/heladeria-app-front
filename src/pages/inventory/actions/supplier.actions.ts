import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { SupplierFormData } from '../schemas/supplier.schema';
import type { SupplierApiResponse, PaginatedSuppliersResponse } from '../interfaces/supplier.response';

export interface GetSupplierFilters {
  search?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
  perPage?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const getSuppliersAction = async (filters: GetSupplierFilters = {}): Promise<PaginatedSuppliersResponse> => {
  const { data } = await iceApi.get('/suppliers', {
    params: cleanParams(filters),
  });
  return data;
};

export const getSupplierByIdAction = async (id: string): Promise<SupplierApiResponse> => {
  const { data } = await iceApi.get(`/suppliers/${id}`);
  return data;
};

export const createSupplierAction = async (payload: SupplierFormData): Promise<SupplierApiResponse> => {
  const { data } = await iceApi.post('/suppliers', payload);
  return data;
};

export const updateSupplierAction = async (id: string, payload: SupplierFormData): Promise<SupplierApiResponse> => {
  const { data } = await iceApi.put(`/suppliers/${id}`, payload);
  return data;
};

export const deleteSupplierAction = async (id: string): Promise<void> => {
  await iceApi.delete(`/suppliers/${id}`);
};

export const bulkDestroySuppliersAction = async (ids: string[]): Promise<void> => {
  await iceApi.post('/suppliers/bulk-destroy', { ids });
};

export const bulkUpdateStatusSuppliersAction = async (ids: string[], is_active: boolean = true): Promise<void> => {
  await iceApi.post('/suppliers/bulk-status-update', { ids, is_active });
};