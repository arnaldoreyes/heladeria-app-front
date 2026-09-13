import type { SuccessResponse } from "@/types";

export interface ExpenseUser {
  id: string;
  name: string;
  email: string;
}

export interface ExpenseApiResponse {
  id: string;
  business_id: string;
  user_id: string;
  concept: string;
  category: string;
  amount_usd: number;
  amount_bs: number;
  exchange_rate: number;
  exchange_rate_date: string;
  payment_method: string;
  expense_date: string;
  notes: string | null;
  user?: ExpenseUser | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedExpensesResponse extends SuccessResponse {
  data: ExpenseApiResponse[];
}