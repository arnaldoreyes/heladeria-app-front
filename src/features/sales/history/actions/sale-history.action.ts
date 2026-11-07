import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { SaleFormData, VoidSaleFormData } from '../schemas/sales.schema';
import type { SaleApiResponse, SaleQueryParams, SalesListApiResponse } from '@/interfaces/sale.interfce';

export const getSalesAction = async (filters: SaleQueryParams = {}): Promise<SalesListApiResponse> => {
  const params = cleanParams(filters);
  const { data } = await iceApi.get<SalesListApiResponse>('/sales', { params });
  return data;
};

export const updateSaleAction = async (id: string, payload: SaleFormData): Promise<SaleApiResponse> => {
  const { data } = await iceApi.post<SaleApiResponse>(`/sales/${id}`, payload);
  return data;
};

export const deleteSaleAction = async (id: string): Promise<SaleApiResponse> => {
  const { data } = await iceApi.delete<SaleApiResponse>(`/sales/${id}`);
  return data;
};

export const createSaleAction = async (payload: SaleFormData): Promise<SaleApiResponse> => {
  const { data } = await iceApi.post<SaleApiResponse>('/sales', payload);
  return data;
};

export const voidSaleAction = async (id: string, payload?: VoidSaleFormData): Promise<SaleApiResponse> => {
  const { data } = await iceApi.post<SaleApiResponse>(`/sales/${id}/void`, payload);
  return data;
};