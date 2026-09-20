import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { RestockFormData } from '../schemas/restock.schema';
import type { BulkOperationApiResponse } from '@/interfaces/api.interface';
import type { RestockApiResponse, RestockQueryParams, RestocksListApiResponse } from '@/interfaces/restock.interfce';

export const getRestocksAction = async (filters: RestockQueryParams = {}): Promise<RestocksListApiResponse> => {
  const params = cleanParams(filters);

  const { data } = await iceApi.get<RestocksListApiResponse>('/restocks', { params });
  return data;
};

export const getRestockByIdAction = async (id: string): Promise<RestockApiResponse> => {
  const { data } = await iceApi.get<RestockApiResponse>(`/restocks/${id}`);
  return data;
};

export const createRestockAction = async (payload: RestockFormData): Promise<RestockApiResponse> => {  
  const { data } = await iceApi.post<RestockApiResponse>('/restocks', payload);
  return data;
};

export const updateRestockAction = async (id: string, payload: RestockFormData): Promise<RestockApiResponse> => {
  const { data } = await iceApi.put<RestockApiResponse>(`/restocks/${id}`, payload);
  return data;
};

export const deleteRestockAction = async (id: string): Promise<RestockApiResponse> => {
  const { data } = await iceApi.delete<RestockApiResponse>(`/restocks/${id}`);
  return data;
};

export const toggleRestockStatusAction = async (id: string): Promise<RestockApiResponse> => {
  const { data } = await iceApi.post<RestockApiResponse>(`/restocks/${id}/toggleStatus`);
  return data;
};

export const bulkDestroyRestocksAction = async (ids: string[]): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/restocks/bulk-destroy', { ids });
  return data;
};

export const bulkUpdateStatusRestocksAction = async (ids: string[], is_active: boolean = true): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/restocks/bulk-status-update', { ids, is_active });
  return data;
};