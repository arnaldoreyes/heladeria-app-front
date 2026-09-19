import type { SuccessResponse } from "@/interfaces/api.interface";
import type { User } from "./user.interface";

export type ExchangeRateSource = 'system_cron' | 'system_sync' | 'manual';
export type BcvMode = 'auto' | 'manual';
export type RatePolicy = 'strict' | 'immediate' | 'smart_holiday';

export interface ExchangeRate {
  id: string;
  business_id?: string | null;
  user_id?: string | null;
  type: string; //
  rate: number;
  source?: ExchangeRateSource;
  effective_at: string;
  current?: boolean;
  currency: string; 
  created_at: string;
  updated_at: string;
  user?: User | null;
}

export interface ExchangeRateConfig {
  bcv_mode: BcvMode;
  currency_used: string;
  current_rate: ExchangeRate;
  rate_policy: RatePolicy;
  history: ExchangeRate[];
}

export type ExchangeRateConfigApiResponse = SuccessResponse<ExchangeRateConfig>;
export type ExchangeRateApiResponse = SuccessResponse<ExchangeRate>;
export type ExchangeRatesListApiResponse = SuccessResponse<ExchangeRate[]>;