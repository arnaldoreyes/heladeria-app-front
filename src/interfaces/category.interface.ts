import type { BaseGetFilters, SuccessResponse } from "@/interfaces/api.interface";

export interface Category {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  profit_percentage: number | null;
  reinvestment_percentage: number | null;
  parent_id: string | null;
  is_active: boolean;
  parent?: Category | null;
  children?: Category[];
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryQueryParams extends BaseGetFilters {
  parent_id?: string;
  root_only?: boolean;
}

export interface BulkUpdateCategoryRulesPayload {
  ids: string[];
  parent_id?: string | null;
  profit_percentage?: number | null;
  reinvestment_percentage?: number | null;
}

export type CategoryApiResponse = SuccessResponse<Category>;
export type CategoryListApiResponse = SuccessResponse<Category[]>;