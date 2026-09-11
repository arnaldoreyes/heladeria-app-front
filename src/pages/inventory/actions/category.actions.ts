import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { CategoryFormData } from '../schemas/category.schema';
import type { CategoryApiResponse, PaginatedCategoriesResponse } from '../interfaces/category.response';

export interface GetCategoryFilters {
  search?: string;
  parent_id?: string;
  root_only?: boolean;
  page?: number;
  perPage?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const getCategoriesAction = async (filters: GetCategoryFilters = {}): Promise<PaginatedCategoriesResponse> => {
  const { data } = await iceApi.get('/categories', {
    params: cleanParams(filters),
  });
  return data;
};

export const getCategoryByIdAction = async (id: string): Promise<CategoryApiResponse> => {
  const { data } = await iceApi.get(`/categories/${id}`);
  return data;
};

export const createCategoryAction = async (payload: CategoryFormData): Promise<CategoryApiResponse> => {
  const { data } = await iceApi.post('/categories', payload);
  return data;
};

export const updateCategoryAction = async (id: string, payload: CategoryFormData): Promise<CategoryApiResponse> => {
  const { data } = await iceApi.put(`/categories/${id}`, payload);
  return data;
};

export const deleteCategoryAction = async (id: string): Promise<void> => {
  await iceApi.delete(`/categories/${id}`);
};

export const bulkDestroyCategoriesAction = async (ids: string[]): Promise<void> => {
  await iceApi.post('/categories/bulk-destroy', { ids });
};
