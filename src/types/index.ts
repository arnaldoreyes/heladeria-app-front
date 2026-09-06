export type Currency = 'USD' | 'BS';

export type RoleName = 'Superadmin' | 'Business Owner' | 'Cashier';

export type PaymentMethod = 'transfer' | 'cash_usd' | 'cash_bs';

export type SaleStatus = 'completed' | 'voided';

export type BudgetStatus = 'active' | 'converted' | 'expired';

export type StockLevel = 'high' | 'low' | 'out';

export interface Business {
  id: string;
  name: string;
  nicho: string;
  baseCurrency: Currency;
  ownerName: string;
  ownerEmail: string;
  active: boolean;
  totalSalesVolumeUsd: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  businessId: string | null;
  active: boolean;
}

export interface Role {
  id: string;
  name: RoleName;
  permissions: Record<string, boolean>;
}