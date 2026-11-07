import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { SaleApiResponse, PaginatedSalesResponse } from '../interfaces/sale.response';
import type { CreateSaleFormData, VoidSaleFormData } from '../schemas/sales.schema';

export interface GetSalesFilters {
  search?: string;
  status?: 'completed' | 'voided' | 'ALL';
  payment_method?: string;
  date_from?: string; // YYYY-MM-DD
  date_to?: string;   // YYYY-MM-DD
  cashier_id?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Obtener listado de ventas paginadas con filtros
 */
export const getSalesAction = async (filters: GetSalesFilters = {}): Promise<PaginatedSalesResponse> => {
  const { data } = await iceApi.get('/sales', {
    params: cleanParams(filters),
  });
  return data;
};

/**
 * Obtener detalle de un ticket/venta por su UUID
 */
export const getSaleByIdAction = async (id: string): Promise<SaleApiResponse> => {
  const { data } = await iceApi.get(`/sales/${id}`);
  return data;
};

/**
 * Registrar nueva venta en la BDD
 * (El backend debe ejecutar esto dentro de una Transacción DB para descontar stock)
 */
export const createSaleAction = async (payload: CreateSaleFormData): Promise<SaleApiResponse> => {
  const { data } = await iceApi.post('/sales', payload);
  return data;
};

/**
 * Anular venta por su ID
 * (El backend reincrusta/restaura el stock automáticamente en BDD)
 */
export const voidSaleAction = async (id: string, payload?: VoidSaleFormData): Promise<SaleApiResponse> => {
  const { data } = await iceApi.post(`/sales/${id}/void`, payload);
  return data;
};

/**
 * Obtener resumen de caja / ventas del día actual
 */
export const getTodaySalesSummaryAction = async (): Promise<{
  total_usd: number;
  total_bs: number;
  sales_count: number;
  change_loss_bs: number;
}> => {
  const { data } = await iceApi.get('/sales/summary/today');
  return data;
};