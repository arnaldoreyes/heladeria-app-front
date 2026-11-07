import type { UseFormReturn } from 'react-hook-form';
import type { ProductApiResponse } from './product.response';
import type { CategoryApiResponse } from './category.response';
import type { SupplierApiResponse } from './supplier.response';

export interface RestockItemFormValue {
  product_id: number | string;
  product_name_snapshot: string;
  quantity: number;
  unit_cost_usd: number;
  unit_cost_bs: number;
  subtotal_usd?: number;
  subtotal_bs?: number;
}

export interface RestockFormValues {
  supplier_id: number | string | null;
  invoice_number?: string;
  exchange_rate: number;
  exchange_rate_date?: string;
  status: 'draft' | 'completed' | 'pending';
  total_usd: number;
  total_bs: number;
  items: RestockItemFormValue[];
}

export interface RestockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
  form: UseFormReturn<RestockFormValues>;
  onSubmit: (mode?: 'draft' | 'completed') => (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSaving: boolean;
  isLoadingProducts?: boolean;
  products?: ProductApiResponse[];
  categories?: CategoryApiResponse[];
  suppliers?: SupplierApiResponse[];
  isLoadingSuppliers?: boolean;
  onOpenCreateProduct?: () => void;
}