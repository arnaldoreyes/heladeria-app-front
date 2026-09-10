
export interface PaymentMethodApiResponse {
  id?: string;
  payment_type_id?: string;
  name?: string;
  currency?: string;
  bank_name: string | null;
  account_number: string | null;
  phone_number: string | null;
  id_document: string | null;
  email: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}