import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { ProductFormData } from '../schemas/product.schema';
import type { ProductApiResponse, PaginatedProductsResponse } from '../interfaces/product.response';

export interface GetProductFilters {
  search?: string;
  category_id?: string;
  is_active?: boolean | string;
  low_stock?: boolean;
  page?: number;
  perPage?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const getProductsAction = async (filters: GetProductFilters = {}): Promise<PaginatedProductsResponse> => {
  const { data } = await iceApi.get('/products', {
    params: cleanParams(filters),
  });
  return data;
};

export const getProductByIdAction = async (id: string): Promise<ProductApiResponse> => {
  const { data } = await iceApi.get(`/products/${id}`);
  return data;
};

export const createProductAction = async (payload: ProductFormData): Promise<ProductApiResponse> => {
  const { data } = await iceApi.post('/products', payload);
  return data;
};

export const updateProductAction = async (id: string, payload: ProductFormData): Promise<ProductApiResponse> => {
  const { data } = await iceApi.put(`/products/${id}`, payload);
  return data;
};

export const deleteProductAction = async (id: string): Promise<void> => {
  await iceApi.delete(`/products/${id}`);
};

export const bulkDestroyProductsAction = async (ids: string[]): Promise<void> => {
  await iceApi.post('/products/bulk-destroy', { ids });
};

export const bulkUpdateStatusProductsAction = async (ids: string[], is_active: boolean = true): Promise<void> => {
  await iceApi.post('/products/bulk-status-update', { ids, is_active });
};

export const toggleProductStatusAction = async (id: string): Promise<ProductApiResponse> => {
  const { data } = await iceApi.post(`/products/${id}/toggleStatus`);
  return data;
};