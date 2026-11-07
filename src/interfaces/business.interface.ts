import type { SuccessResponse } from "./api.interface";

export interface BusinessSetting{
  id: string;
  business_id: string;
  bcv_mode: 'auto' | 'manual';
  default_profit_percentage: number;
  default_reinvestment_percentage: number;
  print_ticket_on_sale: boolean;
  ticket_header_notes: string | null;
  ticket_footer_notes: string | null;
  p2c_fee_percentage: number;
  c2p_fee_percentage: number;
  pago_movil_min_fee_bs: number;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  niche: string;
  status: string;
  logo_url: string | null;
  settings: BusinessSetting
}
export type BusinessApiResponse = SuccessResponse<Business>;

export type BusinesssListApiResponse = SuccessResponse<Business[]>;