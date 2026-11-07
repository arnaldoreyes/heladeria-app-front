import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { BulkOperationApiResponse } from '@/interfaces/api.interface';
import type {  TagApiResponse, TagListApiResponse, TagQueryParams } from '@/interfaces/tag.interface';
import type { TagFormData } from '../schemas/tag.schema';

export const getTagsAction = async (filters: TagQueryParams = {}): Promise<TagListApiResponse> => {
  const params = cleanParams(filters);

  const { data } = await iceApi.get<TagListApiResponse>('/tags', { params });
  return data;
};

export const getTagByIdAction = async (id: string): Promise<TagApiResponse> => {
  const { data } = await iceApi.get<TagApiResponse>(`/tags/${id}`);
  return data;
};

export const createTagAction = async (payload: TagFormData): Promise<TagApiResponse> => {  
  const { data } = await iceApi.post<TagApiResponse>('/tags', payload);
  return data;
};

export const updateTagAction = async (id: string, payload: TagFormData): Promise<TagApiResponse> => {
  const { data } = await iceApi.put<TagApiResponse>(`/tags/${id}`, payload);
  return data;
};

export const deleteTagAction = async (id: string): Promise<TagApiResponse> => {
  const { data } = await iceApi.delete<TagApiResponse>(`/tags/${id}`);
  return data;
};

export const toggleTagStatusAction = async (id: string): Promise<TagApiResponse> => {
  const { data } = await iceApi.post<TagApiResponse>(`/tags/${id}/toggleStatus`);
  return data;
};

export const bulkDestroyTagsAction = async (ids: string[]): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/tags/bulk-destroy', { ids });
  return data;
};

export const bulkUpdateStatusTagsAction = async (ids: string[], is_active: boolean = true): Promise<BulkOperationApiResponse> => {
  const { data } = await iceApi.post<BulkOperationApiResponse>('/tags/bulk-status-update', { ids, is_active });
  return data;
};