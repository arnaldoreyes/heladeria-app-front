import type { BaseGetFilters, SuccessResponse } from '@/interfaces/api.interface';

export interface Supplier {
  id: string;
  business_id: string;
  name: string;
  tax_type: 'V' | 'E' | 'J' | 'G' | 'P' | null;
  tax_id: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierQueryParams extends BaseGetFilters {
  is_active?: boolean | number;
}

export type SupplierApiResponse = SuccessResponse<Supplier>;
export type SuppliersListApiResponse = SuccessResponse<Supplier[]>;