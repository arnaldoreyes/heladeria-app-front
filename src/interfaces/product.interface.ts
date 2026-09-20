import type { BaseGetFilters, SuccessResponse } from "./api.interface";
import type { Category } from "./category.interface";


export interface Product {
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
  category?: Category | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProductBulkUpdateValuesPayload {
  ids: string[];
  price_usd?: number | null;
  cost_usd?: number | null;
  stock?: number | null;
  min_stock_alert?: number | null;
}

export interface ProductQueryParams extends BaseGetFilters {
  category_id?: string;
  is_active?: boolean | string;
  with_stock?: boolean;
}

export type ProductApiResponse = SuccessResponse<Product>;
export type ProductsListApiResponse = SuccessResponse<Product[]>;