import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { RestockFormData } from '../schemas/restock.schema';
import type { RestockApiResponse, PaginatedRestocksResponse } from '../interfaces/restock.response';

export interface GetRestockFilters {
  search?: string;
  supplier_name?: string;
  status?: string;
  completed?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
export const getRestocksAction = async (filters: GetRestockFilters = {}): Promise<PaginatedRestocksResponse> => {
  const { data } = await iceApi.get('/restocks', {
    params: cleanParams(filters),
  });
  return data;
};

export const getRestockByIdAction = async (id: string): Promise<RestockApiResponse> => {
  const { data } = await iceApi.get(`/restocks/${id}`);
  return data;
};

export const createRestockAction = async (payload: RestockFormData): Promise<RestockApiResponse> => {
  const { data } = await iceApi.post('/restocks', payload);
  return data;
};

export const updateRestockAction = async (id: string, payload: RestockFormData): Promise<RestockApiResponse> => {
  const { data } = await iceApi.put(`/restocks/${id}`, payload);
  return data;
};

export const deleteRestockAction = async (id: string): Promise<void> => {
  await iceApi.delete(`/restocks/${id}`);
};

export const bulkDestroyRestocksAction = async (ids: string[]): Promise<void> => {
  await iceApi.post('/restocks/bulk-destroy', { ids });
};