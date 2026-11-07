import type { BaseGetFilters, SuccessResponse } from "@/interfaces/api.interface";

export interface Tag {
  id: string;
  business_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  color?: string | null;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}
export interface TagQueryParams extends BaseGetFilters {
  is_active?: boolean | string;
}
export type TagResponse = SuccessResponse<Tag>;
export type TagListResponse = SuccessResponse<Tag[]>;