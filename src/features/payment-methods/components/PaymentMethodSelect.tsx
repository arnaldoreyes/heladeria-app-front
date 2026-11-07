import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { usePaymentMethods } from '../hooks/usePaymentMethods';
import { CreditCard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentMethodQrDialog, type PaymentItemDetail } from './PaymentMethodQrDialog';
import type { SaleTypeMode } from '@/features/sales/pos/components/checkout/SaleTypeSelector';
import { ShareOrderWhatsAppDialog } from '@/features/sales/pos/components/checkout/ShareOrderWhatsAppDialog';

interface PaymentMethodSelectProps {
  value: string | number | null | undefined;
  onChange: (value: string | null) => void;
  onAddNewPaymentMethod?: () => void;
  label?: string;
  placeholder?: string;
  noneOptionLabel?: string;
  showNoneOption?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
  totalBs?: number;
  totalUsd?: number;
  
  // Props opcionales para habilitar compartir por WhatsApp
  showShareWhatsApp?: boolean;
  items?: any[];
  exchangeRate?: number;
  saleType?: SaleTypeMode; // 'credito' | 'debito' | 'al_costo' | 'contado'
  multiplePayments?: PaymentItemDetail[]; // En caso de que sean múltiples pagos acumulados
}

export function PaymentMethodSelect({
  value,
  onChange,
  onAddNewPaymentMethod,
  label,
  placeholder,
  noneOptionLabel,
  showNoneOption = true,
  error,
  disabled = false,
  className = '',
  totalBs,
  totalUsd,
  showShareWhatsApp = false,
  items = [],
  exchangeRate = 0,
  saleType,
  multiplePayments,
}: PaymentMethodSelectProps) {
  const { t } = useTranslation(['restocks', 'common']);
  const { methods } = usePaymentMethods();

  const stringValue = value !== null && value !== undefined && value !== '' ? String(value) : 'ALL';

  const selectedPaymentMethod = useMemo(() => {
    return methods.find((sup) => String(sup.id) === stringValue);
  }, [methods, stringValue]);

  // Normalización de propiedades del método seleccionado
  const qrCodeUrl = (selectedPaymentMethod as any)?.qr_code_url ?? (selectedPaymentMethod as any)?.qrCodeUrl;
  const bankName = (selectedPaymentMethod as any)?.bank_name ?? (selectedPaymentMethod as any)?.bankName;
  const idDocument = (selectedPaymentMethod as any)?.id_document ?? (selectedPaymentMethod as any)?.idDocument;
  const accountNumber = (selectedPaymentMethod as any)?.account_number ?? (selectedPaymentMethod as any)?.accountNumber;
  const accountHolder = (selectedPaymentMethod as any)?.account_holder ?? (selectedPaymentMethod as any)?.accountHolder;
  const phoneNumber = (selectedPaymentMethod as any)?.phone_number ?? (selectedPaymentMethod as any)?.phoneNumber;

  const hasQrOrInfo = Boolean(qrCodeUrl || bankName || idDocument || accountNumber || phoneNumber);

  const defaultLabel = label ?? t('restocks.PaymentMethod_name', 'Método de pago');
  const defaultPlaceholder = placeholder ?? t('restocks.filter_PaymentMethod', 'Seleccionar método de pago');
  const defaultNoneLabel = noneOptionLabel ?? t('common.all_PaymentMethods', 'Todos los métodos de pago');

  // Construcción del detalle del pago para WhatsApp
  const currentPaymentDetail: PaymentItemDetail[] = useMemo(() => {
    if (multiplePayments && multiplePayments.length > 0) {
      return multiplePayments;
    }
    if (!selectedPaymentMethod) return [];
    
    return [{
      methodName: selectedPaymentMethod.name,
      amountUsd: totalUsd,
      amountBs: totalBs,
      bankName,
      idDocument,
      accountNumber,
      accountHolder,
      phoneNumber,
    }];
  }, [multiplePayments, selectedPaymentMethod, totalUsd, totalBs, bankName, idDocument, accountNumber, accountHolder, phoneNumber]);

  return (
    <div className={`space-y-2 ${className}`}>
      {defaultLabel && <Label>{defaultLabel}</Label>}
      
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <Select
            value={stringValue}
            onValueChange={(val) => onChange(val === 'ALL' ? null : val)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={defaultPlaceholder}>
                {selectedPaymentMethod ? selectedPaymentMethod.name : defaultNoneLabel}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {showNoneOption && (
                <SelectItem value="ALL">{defaultNoneLabel}</SelectItem>
              )}
              {methods.map((sup) => (
                <SelectItem key={sup.id} value={String(sup.id)}>
                  {sup.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>

        {/* Acciones adjuntas al Select */}
        <div className="flex items-center gap-1.5 shrink-0">
          {hasQrOrInfo && (
            <PaymentMethodQrDialog
              qrCodeUrl={qrCodeUrl}
              bankName={bankName}
              idDocument={idDocument}
              accountNumber={accountNumber}
              totalBs={totalBs}
              totalUsd={totalUsd}
            />
          )}

          {onAddNewPaymentMethod && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              title={t('restock.catalog.addPaymentMethod', { defaultValue: 'Agregar método de pago' })}
              onClick={onAddNewPaymentMethod}
              className="h-9 px-2.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <Plus className="w-2.5 h-2.5 -ml-1" />
            </Button>
          )}

          {showShareWhatsApp && (
            <ShareOrderWhatsAppDialog
              items={items}
              totalUsd={totalUsd}
              totalBs={totalBs}
              exchangeRate={exchangeRate}
              saleType={saleType}
              payments={currentPaymentDetail}
            />
          )}
        </div>
      </div>
    </div>
  );
}