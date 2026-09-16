import type { SuccessResponse } from '@/types';

export interface RestockItemApiResponse {
  id: string;
  product_name_snapshot: string;
  product_id: string;
  quantity: number;
  unit_cost_usd: number;
  unit_cost_bs: number;
  subtotal_usd: number;
  subtotal_bs: number;
}

export interface RestockApiResponse {
  id: string;
  business_id: string;
  user_id: string;
  supplier_name: string;
  invoice_number: string | null;
  status: 'draft' | 'completed' ;
  is_completed: boolean,
  exchange_rate: number;
  exchange_rate_date: string | null;
  total_usd: number;
  total_bs: number;
  purchased_at?: string | null;
  notes: string | null;
  user?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  items?: RestockItemApiResponse[];
  quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedRestocksResponse extends SuccessResponse {
  data: RestockApiResponse[];
}