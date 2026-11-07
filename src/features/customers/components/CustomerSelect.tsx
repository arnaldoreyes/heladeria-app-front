import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCustomers } from '../hooks/useCustomers';
import { Plus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CustomerSelectProps {
  value: string | number | null | undefined;
  onChange: (value: string | null) => void;
  onAddNewCustomer?: () => void;
  label?: string;
  placeholder?: string;
  noneOptionLabel?: string;
  showNoneOption?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function CustomerSelect({
  value,
  onChange,
  onAddNewCustomer,
  label,
  placeholder,
  noneOptionLabel,
  showNoneOption = true,
  error,
  disabled = false,
  className = '',
}: CustomerSelectProps) {
  const { t } = useTranslation(['restocks', 'common']);

  const { customers } = useCustomers();

  const stringValue = value !== null && value !== undefined && value !== '' ? String(value) : 'ALL';

  const selectedCustomer = useMemo(() => {
    return customers.find((sup) => String(sup.id) === stringValue);
  }, [customers, stringValue]);

  const defaultLabel = label ?? t('restocks.Customer_name', 'cliente');
  const defaultPlaceholder = placeholder ?? t('restocks.filter_Customer', 'Seleccionar cliente');
  const defaultNoneLabel = noneOptionLabel ?? t('common.all_Customers', 'Todos los clientes');

  return (
    <div className={`space-y-2 ${className}`}>
      {defaultLabel && <Label>{defaultLabel}</Label>}
      
      {/* Contenedor flexible en línea */}
      <div className="flex items-start gap-2 w-full">
        <div className="flex-1">
          <Select
            value={stringValue}
            onValueChange={(val) => onChange(val === 'ALL' ? null : val)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={defaultPlaceholder}>
                {selectedCustomer ? selectedCustomer.name : defaultNoneLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {showNoneOption && (
                <SelectItem value="ALL">{defaultNoneLabel}</SelectItem>
              )}
              {customers.map((sup) => (
                <SelectItem key={sup.id} value={String(sup.id)}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>

        {/* Botón alineado a la derecha del Select */}
        {onAddNewCustomer && (
          <Button
            type="button"
            variant="outline"
            title={t('restock.catalog.addCustomer', { defaultValue: 'Agregar cliente' })}
            onClick={onAddNewCustomer}
            className=""
          >
            <User className="w-3.5 h-3.5" />
            <Plus className="w-2.5 h-2.5 -ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}