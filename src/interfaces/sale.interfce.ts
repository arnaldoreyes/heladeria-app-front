import type { BaseGetFilters, SuccessResponse } from '@/interfaces/api.interface';
import type { PaymentMethod } from './payment-methods.interface';

export type SaleType  = 'debit' | 'credit' | 'cost';
export type SaleStatus = 'completed' | 'voided' | 'draft';
export type PaymentStatus = 'paid' | 'partial' | 'pending';
export type DiscountType = 'percentage' | 'fixed';


export interface SalePayment {
  id?: string;
  payment_method_id: string;
  amount_original: number;
  currency: string;
  amount_usd: number;
  amount_bs: number;
  exchange_rate: number;
  exchange_rate_date?: string;
  reference?: string | null;
  notes?: string | null;
  method: PaymentMethod;
}

export interface SaleItem {
  id?: string;
  product_id: string;
  product_name_snapshot: string;
  quantity: number;
  unit_price_usd: number;
  unit_price_bs: number;
  unit_cost_usd: number;
  unit_cost_bs: number;
  subtotal_usd: number;
  subtotal_bs: number;
  cost_usd: number;
  cost_bs: number;
  margin_usd?: number;
  profit_usd?: number;
  reinvestment_usd?: number;
  max_stock: number;
  sku?: string | null;
}

export interface Sale {
  id: string;
  business_id: string;
  user_id: string;
  customer_id?: string | null;
  ticket_number: string;
  status: SaleStatus;
  sale_type: SaleType;
  payment_status: PaymentStatus;
  total_usd: number;
  total_bs: number;
  paid_usd: number;
  pending_usd: number;
  exchange_rate: number;
  exchange_rate_date: string;
  discount_bs: number;
  change_loss_bs: number;
  cost_usd: number;
  margin_usd: number;
  profit_usd: number;
  reinvestment_usd: number;
  items?: SaleItem[];
  payments?: SalePayment[];
  created_at: string;
  updated_at: string;
}

export interface SaleQueryParams extends BaseGetFilters {
  customer_id?: string;
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
}

export type SaleApiResponse = SuccessResponse<Sale>;
export type SalesListApiResponse = SuccessResponse<Sale[]>;