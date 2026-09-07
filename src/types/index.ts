export type Currency = 'USD' | 'BS';

export type RoleName = 'Superadmin' | 'Business Owner' | 'Cashier';

export type PaymentMethod = 'transfer' | 'cash_usd' | 'cash_bs';

export type SaleStatus = 'completed' | 'voided';

export type BudgetStatus = 'active' | 'converted' | 'expired';

export type StockLevel = 'high' | 'low' | 'out';

export interface Business {
  id: string;
  name: string;
  niche: string;
  slug: string;
  status: 'active' | 'inactive';
  settings: BuisinessSettings;
}

export interface BuisinessSettings {
  id: string;
  bcv_mode: boolean;
  default_profit_percentage: number;
  default_reinvestment_percentage: number;
  print_ticket_on_sale: boolean;
  ticket_header_notes: string;
  ticket_footer_notes: string;
}   

export interface Role {
  id: string;
  name: RoleName;
  permissions: Record<string, boolean>;
}