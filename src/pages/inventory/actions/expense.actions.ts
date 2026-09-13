import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { ExpenseFormData } from '../schemas/expense.schema';
import type { ExpenseApiResponse, PaginatedExpensesResponse } from '../interfaces/expense.response';

export interface GetExpenseFilters {
  search?: string;
  category?: string;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const getExpensesAction = async (filters: GetExpenseFilters = {}): Promise<PaginatedExpensesResponse> => {
  const { data } = await iceApi.get('/expenses', {
    params: cleanParams(filters),
  });
  return data;
};

export const getExpenseByIdAction = async (id: string): Promise<ExpenseApiResponse> => {
  const { data } = await iceApi.get(`/expenses/${id}`);
  return data;
};

export const createExpenseAction = async (payload: ExpenseFormData): Promise<ExpenseApiResponse> => {
  const { data } = await iceApi.post('/expenses', payload);
  return data;
};

export const updateExpenseAction = async (id: string, payload: ExpenseFormData): Promise<ExpenseApiResponse> => {
  const { data } = await iceApi.put(`/expenses/${id}`, payload);
  return data;
};

export const deleteExpenseAction = async (id: string): Promise<void> => {
  await iceApi.delete(`/expenses/${id}`);
};

export const bulkDestroyExpensesAction = async (ids: string[]): Promise<void> => {
  await iceApi.post('/expenses/bulk-destroy', { ids });
};