import type { UseFormRegister, FieldErrors, UseFormSetValue, Control, FieldArrayWithId } from 'react-hook-form';
import type { RestockFormValues } from './restock-form.types';

export interface RestockCartItem {
  product_id: string | number;
  product_name_snapshot?: string;
  quantity: number;
  unit_cost_usd: number;
  unit_cost_bs?: number;
}

export interface RestockCartListProps {
  fields: FieldArrayWithId<RestockFormValues, 'items'>[]; // ✅ Tipo exacto devuelto por useFieldArray
  items: RestockCartItem[];
  register: UseFormRegister<RestockFormValues>;
  setValue: UseFormSetValue<RestockFormValues>;
  remove: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  exchangeRate: number;
  control: Control<RestockFormValues, any>; // ✅ Añadir 'any' para resolver el descalce de TContext
  errors?: FieldErrors<RestockFormValues>;
}