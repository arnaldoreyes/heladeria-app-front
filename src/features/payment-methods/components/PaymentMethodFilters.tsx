import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ActiveStatusSelect } from '@/components/filters/ActiveStatusSelect';
import { ResetFiltersButton } from '@/components/filters/ResetFiltersButton';
import type { PaymentMethodType } from '@/interfaces/payment-methods.interface';

interface PaymentMethodFiltersProps {
  currencyFilter: string;
  onCurrencyChange: (value: string) => void;
  activeFilter: string;
  onActiveChange: (value: string) => void;
  paymentTypeFilter: string;
  onPaymentTypeChange: (value: string) => void;
  paymentTypes?: PaymentMethodType[]; // Corregido: Debe ser un Array y faltaba un punto y coma
  onReset: () => void;
  isResetDisabled: boolean;
}

export function PaymentMethodFilters({
  currencyFilter,
  onCurrencyChange,
  activeFilter,
  onActiveChange,
  paymentTypeFilter,
  onPaymentTypeChange,
  paymentTypes = [], // Fallback por defecto a array vacío
  onReset,
  isResetDisabled,
}: PaymentMethodFiltersProps) {
  const { t } = useTranslation(['settings', 'common']);

  // Obtener la etiqueta del tipo de pago seleccionado de forma segura
  const selectedPaymentType = paymentTypes.find(
    (type) => String(type.id) === String(paymentTypeFilter)
  );

  const selectedTypeLabel = selectedPaymentType?.name;

  return (
    <div className="w-full items-end gap-3">
      {/* Filtro por Tipo de Pago */}
      <div className="space-y-1.5">
        <Label>{t('settings.payments.payment_type', 'Tipo de Pago')}</Label>
        <Select
          value={String(paymentTypeFilter)}
          onValueChange={(val) => val && onPaymentTypeChange(val)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('settings.payments.payment_type', 'Tipo de Pago')}>
              {paymentTypeFilter === 'ALL'
                ? t('settings.payments.all_types', 'Todos los tipos')
                : selectedTypeLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              {t('settings.payments.all_types', 'Todos los tipos')}
            </SelectItem>
            {paymentTypes.map((type) => (
              <SelectItem key={type.id} value={String(type.id)}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por Moneda */}
      <div className="space-y-1.5">
        <Label>{t('settings.payments.currency', 'Moneda')}</Label>
        <Select value={currencyFilter} onValueChange={(val) => val && onCurrencyChange(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('settings.payments.currency', 'Moneda')}>
              {currencyFilter === 'ALL' && t('settings.payments.currency_all', 'Todas las monedas')}
              {currencyFilter === 'USD' && t('settings.payments.currency_usd', 'USD ($)')}
              {(currencyFilter === 'VES' || currencyFilter === 'BS') && t('settings.payments.currency_ves', 'VES (Bs)')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('settings.payments.currency_all', 'Todas las monedas')}</SelectItem>
            <SelectItem value="USD">{t('settings.payments.currency_usd', 'USD ($)')}</SelectItem>
            <SelectItem value="BS">{t('settings.payments.currency_ves', 'VES (Bs)')}</SelectItem>
          </SelectContent>
        </Select>
      </div>    
      
      {/* Filtro por Estado */}
      <ActiveStatusSelect value={activeFilter} onChange={onActiveChange} />

      {/* Botón Resetear Filtros */}
      <ResetFiltersButton onReset={onReset} isDisabled={isResetDisabled} />
    </div>
  );
}