import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { BulkOperationApiResponse } from '@/interfaces/api.interface';
import type { BulkUpdateCategoryRulesPayload, CategoryApiResponse, CategoryListApiResponse, CategoryQueryParams } from '@/interfaces/category.interface';
import type { CategoryFormData } from '../schemas/category.schema';

export const getCategoriesAction = async (filters: CategoryQueryParams = {}): Promise<CategoryListApiResponse> => {
  const params = cleanParams(filters);

  const { data } = await iceApi.get<CategoryListApiResponse>('/categories', { params });
  return data;
};

export const getCategoryByIdAction = async (id: string): Promise<CategoryApiResponse> => {
  const { data } = await iceApi.get<CategoryApiResponse>(`/categories/${id}`);
  return data;
};

export const createCategoryAction = async (payload: CategoryFormData): Promise<CategoryApiResponse> => {  
  const { data } = await iceApi.post<CategoryApiResponse>('/categories', payload);
  return data;
};

export const updateCategoryAction = async (id: string, payload: CategoryFormData): Promise<CategoryApiResponse> => {
  const { data } = await iceApi.put<CategoryApiResponse>(`/categories/${id}`, payload);
  return data;
};

export const deleteCategoryAction = async (id: string): Promise<CategoryApiResponse> => {
  const { data } = await iceApi.delete<CategoryApiResponse>(`/categories/${id}`);
  return data;
};

export const toggleCategoryStatusAction = async (id: string): Promise<CategoryApiResponse> => {
  const { data } = await iceApi.post<CategoryApiResponse>(`/categories/${id}/toggleStatus`);
  return data;
};

export const bulkDestroyCategoriesAction = async (ids: string[]): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/categories/bulk-destroy', { ids });
  return data;
};

export const bulkUpdateStatusCategoriesAction = async (ids: string[], is_active: boolean = true): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/categories/bulk-status-update', { ids, is_active });
  return data;
};
export const bulkUpdateValuesCategoryiesAction = async (payload: BulkUpdateCategoryRulesPayload): Promise<BulkOperationApiResponse>  => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/categories/bulk-update-values', payload);
  return data;
};
