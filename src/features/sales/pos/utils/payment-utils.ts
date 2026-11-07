// lib/payment-utils.ts o dentro del mismo CheckoutStep
import type { PaymentItemDetail } from '@/components/ShareOrderWhatsAppDialog';
import type { PaymentMethod, PaymentItem } from '@/components/PaymentSection';

interface GetFormattedPaymentsParams {
  isMixed: boolean;
  selectedSingleMethod?: PaymentMethod;
  singleAmountInput: string;
  singleRef: string;
  payments: PaymentItem[];
  exchangeRate: number;
}

export function getFormattedPaymentsForWhatsApp({
  isMixed,
  selectedSingleMethod,
  singleAmountInput,
  singleRef,
  payments,
  exchangeRate,
}: GetFormattedPaymentsParams): PaymentItemDetail[] {
  const isBsCurrency = (currency?: string) => currency === 'VES' || currency === 'BS';

  if (!isMixed) {
    if (!selectedSingleMethod || !singleAmountInput) return [];
    
    const isSingleBs = isBsCurrency(selectedSingleMethod.currency);
    const amount = Number(singleAmountInput) || 0;

    return [
      {
        methodName: selectedSingleMethod.name,
        amountUsd: isSingleBs ? (exchangeRate > 0 ? amount / exchangeRate : 0) : amount,
        amountBs: isSingleBs ? amount : (exchangeRate > 0 ? amount * exchangeRate : 0),
        reference: singleRef || undefined,
      },
    ];
  }

  return payments.map((p) => {
    const isBs = isBsCurrency(p.currency);
    return {
      methodName: p.method,
      amountUsd: isBs ? (exchangeRate > 0 ? p.amount_original / exchangeRate : 0) : p.amount_original,
      amountBs: isBs ? p.amount_original : (exchangeRate > 0 ? p.amount_original * exchangeRate : 0),
      reference: p.reference,
    };
  });
}