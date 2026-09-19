import { useMemo, useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { PaymentMethodType } from '@/interfaces/payment-methods.interface';
import type { PaymentMethodFormData } from '../schemas/payment-methods.schema';

interface UsePaymentMethodDialogProps {
  form: UseFormReturn<PaymentMethodFormData>;
  paymentTypes?: PaymentMethodType[];
}

export function usePaymentMethodDialog({
  form,
  paymentTypes = [],
}: UsePaymentMethodDialogProps) {
  const { watch, setValue, formState: { errors } } = form;

  // Suscripciones a React Hook Form
  const currencyValue = watch('currency');
  const paymentTypeIdValue = watch('payment_type_id');
  const isActiveValue = watch('is_active');
  const qrImageValue = watch('qr_code_url');

  // Tipo y código de pago seleccionado
  const selectedPaymentType = useMemo(
    () => paymentTypes.find((type) => type.id === paymentTypeIdValue),
    [paymentTypes, paymentTypeIdValue]
  );
  const paymentCode = selectedPaymentType?.code ?? '';

  // Banderas de visibilidad
  const isCash = ['cash_bs', 'cash_usd'].includes(paymentCode);
  const showEmailField = ['binance', 'paypal', 'zelle'].includes(paymentCode);
  const showBankFields = ['pago_movil', 'transfer_bs', 'transfer_usd'].includes(paymentCode);
  const showQrField = !isCash && !!paymentCode;

  // URL del QR Preview
  const qrPreviewUrl = useMemo(() => {
    if (!qrImageValue) return null;

    if (qrImageValue instanceof File) {
      return URL.createObjectURL(qrImageValue);
    }

    if (qrImageValue instanceof FileList && qrImageValue.length > 0) {
      return URL.createObjectURL(qrImageValue[0]);
    }

    if (typeof qrImageValue === 'string') {
      if (qrImageValue.startsWith('http://') || qrImageValue.startsWith('https://') || qrImageValue.startsWith('data:')) {
        return qrImageValue;
      }
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const cleanPath = qrImageValue.startsWith('/') ? qrImageValue : `/${qrImageValue}`;
      return `${baseUrl}${cleanPath}`;
    }

    return null;
  }, [qrImageValue]);

  // Limpieza de memoria (blob URLs)
  useEffect(() => {
    return () => {
      if (qrPreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(qrPreviewUrl);
      }
    };
  }, [qrPreviewUrl]);

  // Handlers para archivos
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('qr_code_url', file, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleClearQr = () => {
    setValue('qr_code_url', null, { shouldValidate: true, shouldDirty: true });
  };

  const handleSelectPaymentType = (val: string) => {
    if (val) setValue('payment_type_id', val, { shouldValidate: true });
  };

  const handleSelectCurrency = (val: string) => {
    if (val) setValue('currency', val, { shouldValidate: true });
  };

  const handleToggleActive = (checked: boolean) => {
    setValue('is_active', checked, { shouldValidate: true });
  };

  return {
    values: {
      currencyValue,
      paymentTypeIdValue,
      isActiveValue,
      selectedPaymentType,
      qrPreviewUrl,
    },
    flags: {
      showEmailField,
      showBankFields,
      showQrField,
    },
    errors,
    handlers: {
      handleFileChange,
      handleClearQr,
      handleSelectPaymentType,
      handleSelectCurrency,
      handleToggleActive,
    },
  };
}