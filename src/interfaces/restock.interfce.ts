import type { BaseGetFilters, SuccessResponse } from '@/interfaces/api.interface';
import type { User } from '@/interfaces/user.interface';

export interface RestockItem {
  id: string;
  product_name_snapshot: string;
  product_id: string;
  quantity: number;
  unit_cost_usd: number;
  unit_cost_bs: number;
  subtotal_usd: number;
  subtotal_bs: number;
}

export interface Restock{
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
  user?: User | null;
  items?: RestockItem[];
  quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RestockQueryParams extends BaseGetFilters {
  supplier_name?: string;
  status?: string;
  completed?: boolean;
  start_date?: string;
  end_date?: string;
}

export type RestockApiResponse = SuccessResponse<Restock>;
export type RestocksListApiResponse = SuccessResponse<Restock[]>;