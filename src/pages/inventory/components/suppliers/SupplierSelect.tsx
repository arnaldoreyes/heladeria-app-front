import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface SupplierOption {
  id: string | number;
  name: string;
}

interface SupplierSelectProps {
  suppliers?: SupplierOption[];
  value: string | number | null | undefined;
  onChange: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  noneOptionLabel?: string;
  showNoneOption?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function SupplierSelect({
  suppliers = [],
  value,
  onChange,
  label,
  placeholder,
  noneOptionLabel,
  showNoneOption = true,
  error,
  disabled = false,
  className = '',
}: SupplierSelectProps) {
  const { t } = useTranslation(['restocks', 'common']);

  const stringValue = value !== null && value !== undefined && value !== '' ? String(value) : 'ALL';

  const selectedSupplier = useMemo(() => {
    return suppliers.find((sup) => String(sup.id) === stringValue);
  }, [suppliers, stringValue]);

  const defaultLabel = label ?? t('restocks.supplier_name', 'Proveedor');
  const defaultPlaceholder = placeholder ?? t('restocks.filter_supplier', 'Seleccionar proveedor');
  const defaultNoneLabel = noneOptionLabel ?? t('common.all_suppliers', 'Todos los Proveedores');

  return (
    <div className={`space-y-2 ${className}`}>
      {defaultLabel && <Label>{defaultLabel}</Label>}
      <Select
        value={stringValue}
        onValueChange={(val) => onChange(val === 'ALL' ? null : val)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={defaultPlaceholder}>
            {selectedSupplier ? selectedSupplier.name : defaultNoneLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {showNoneOption && (
            <SelectItem value="ALL">{defaultNoneLabel}</SelectItem>
          )}
          {suppliers.map((sup) => (
            <SelectItem key={sup.id} value={String(sup.id)}>
              {sup.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}