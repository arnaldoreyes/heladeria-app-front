import type { BaseGetFilters, SuccessResponse } from "./api.interface";


export interface Customer {
  id: string;
  name: string;
  type_document: string | null;
  id_document: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  credit_limit_usd: number;
  is_active: boolean;
  notes: string | null;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerQueryParams extends BaseGetFilters {
    with_credit?: boolean | number;
    is_active?: boolean | number;
    name?: string;
    id_document?: string;
  }


export type CustomerApiResponse = SuccessResponse<Customer>;
export type CustomersListApiResponse = SuccessResponse<Customer>;

