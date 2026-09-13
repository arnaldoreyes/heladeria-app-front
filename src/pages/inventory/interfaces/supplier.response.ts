import type { SuccessResponse } from '@/types';

export interface SupplierApiResponse {
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
  restocks_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedSuppliersResponse extends SuccessResponse {
  data: SupplierApiResponse[];
}