import type { CategoryApiResponse } from './category.response';

export interface ProductApiResponse {
  id: string;
  business_id: string;
  category_id: string | null;
  sku: string;
  name: string;
  price_usd: number;
  cost_usd: number | null;
  stock: number;
  min_stock_alert: number;
  image: string | null;
  is_active: boolean;
  category?: CategoryApiResponse | null;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedProductsResponse {
  data: ProductApiResponse[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}