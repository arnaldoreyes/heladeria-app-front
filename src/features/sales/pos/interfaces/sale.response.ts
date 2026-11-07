export type PaymentMethod = 'cash_usd' | 'cash_bs' | 'pago_movil';
export type SaleStatus = 'completed' | 'voided';

export interface SaleItemResponse {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  product_sku?: string | null;
  quantity: number;
  unit_price_usd: number;
  subtotal_usd: number;
}

export interface SaleApiResponse {
  id: string;
  ticket_number: string;
  total_usd: number;
  total_bs: number;
  exchange_rate: number;
  payment_method: PaymentMethod;
  amount_received_bs: number;
  change_loss_bs: number;
  status: SaleStatus;
  cashier_id: string;
  cashier_name?: string;
  business_id?: string;
  items: SaleItemResponse[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedSalesResponse {
  data: SaleApiResponse[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}


export interface SalePaymentDetail {
  method: PaymentMethod;
  amount_usd: number;
  amount_bs: number;
  bank_name?: string | null;
  reference?: string | null;
}

export interface SaleApiResponse {
  id: string;
  ticket_number: string;
  total_usd: number;
  total_bs: number;
  exchange_rate: number;
  payments: SalePaymentDetail[];
  change_loss_bs: number;
  status: 'completed' | 'voided';
  items: Array<{
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price_usd: number;
    subtotal_usd: number;
  }>;
  created_at: string;
}