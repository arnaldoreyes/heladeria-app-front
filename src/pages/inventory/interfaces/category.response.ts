import type { SuccessResponse } from "@/types";

export interface CategoryApiResponse {
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
  parent?: CategoryApiResponse | null;
  children?: CategoryApiResponse[];
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedCategoriesResponse extends SuccessResponse{
  data: CategoryApiResponse[];
}