import { 
  QrCode, 
  Banknote, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Send, 
  Wallet,
  type LucideIcon 
} from "lucide-react";

export const PAYMENT_TYPE_ICONS: Record<string, LucideIcon> = {
  binance: QrCode,
  cash_bs: Banknote,
  cash_usd: Banknote,
  pago_movil: Smartphone,
  paypal: CreditCard,
  pos: CreditCard,
  transfer_bs: Building2,
  transfer_usd: Building2,
  zelle: Send,
};

export function getPaymentTypeIcon(code?: string): LucideIcon {
  if (!code) return Wallet;
  return PAYMENT_TYPE_ICONS[code.toLowerCase()] || Wallet;
}