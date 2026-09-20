import { iceApi } from '@/api/iceApi';
import type { ProductApiResponse, ProductBulkUpdateValuesPayload, ProductQueryParams, ProductsListApiResponse } from '@/interfaces/product.interface';
import { cleanParams } from '@/lib/api.utils';
import type { ProductFormData } from '../schemas/product.schema';
import type { BulkOperationApiResponse } from '@/interfaces/api.interface';

export const getProductsAction = async (filters: ProductQueryParams = {}): Promise<ProductsListApiResponse> => {
  const params = cleanParams(filters);

  const { data } = await iceApi.get<ProductsListApiResponse>('/products', { params });
  return data;
};

export const getProductByIdAction = async (id: string): Promise<ProductApiResponse> => {
  const { data } = await iceApi.get<ProductApiResponse>(`/products/${id}`);
  return data;
};

export const createProductAction = async (payload: ProductFormData): Promise<ProductApiResponse> => {  
  const { data } = await iceApi.post<ProductApiResponse>('/products', payload);
  return data;
};

export const updateProductAction = async (id: string, payload: ProductFormData): Promise<ProductApiResponse> => {
  const { data } = await iceApi.put<ProductApiResponse>(`/products/${id}`, payload);
  return data;
};

export const deleteProductAction = async (id: string): Promise<ProductApiResponse> => {
  const { data } = await iceApi.delete<ProductApiResponse>(`/products/${id}`);
  return data;
};

export const toggleProductStatusAction = async (id: string): Promise<ProductApiResponse> => {
  const { data } = await iceApi.post<ProductApiResponse>(`/products/${id}/toggleStatus`);
  return data;
};

export const bulkDestroyProductsAction = async (ids: string[]): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/products/bulk-destroy', { ids });
  return data;
};

export const bulkUpdateStatusProductsAction = async (ids: string[], is_active: boolean = true): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/products/bulk-status-update', { ids, is_active });
  return data;
};
export const bulkUpdateValuesProductsAction = async (payload: ProductBulkUpdateValuesPayload): Promise<BulkOperationApiResponse>  => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/products/bulk-update-values', payload);
  return data;
};