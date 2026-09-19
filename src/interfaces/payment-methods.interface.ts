import type { BaseGetFilters, SuccessResponse } from "@/interfaces/api.interface";

export interface PaymentMethodType {
  id: string;
  name: string;
  code: string;
  requires_reference: boolean;
}

export interface PaymentMethod {
  id: string;
  payment_type_id: string;
  name: string;
  currency: string;
  bank_name: string | null;
  account_number: string | null;
  phone_number: string | null;
  id_document: string | null;
  email: string | null;
  qr_code_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  type?: PaymentMethodType;
}

export interface PaymentMethodQueryParams extends BaseGetFilters {
  currency?: string;
  payment_type_id?: string;
  is_active?: boolean | number;
  'type.name'?: string;
}

export type PaymentMethodApiResponse = SuccessResponse<PaymentMethod>;
export type PaymentMethodTypeApiResponse = SuccessResponse<PaymentMethodType>;
export type PaymentMethodsListApiResponse = SuccessResponse<PaymentMethod[]>;
export type PaymentMethodTypesListApiResponse = SuccessResponse<PaymentMethodType[]>;