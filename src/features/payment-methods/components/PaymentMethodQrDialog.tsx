import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QrCode, Copy, Check, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatUsd } from '@/lib/format';

interface PaymentMethodQrDialogProps {
  idDocument?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  qrCodeUrl?: string | null;
  totalBs?: number;
  totalUsd?: number;
}

export function PaymentMethodQrDialog({
  idDocument = '',
  accountNumber = '',
  bankName = '',
  qrCodeUrl,
  totalBs = 0,
  totalUsd = 0,
}: PaymentMethodQrDialogProps) {
  const { t } = useTranslation(['settings', 'common']);
  const [copied, setCopied] = useState(false);

  const formattedAmount = totalBs.toFixed(2);

  // Garantiza que la URL sea absoluta si viene de la API
  const resolvedQrUrl = useMemo(() => {
    if (!qrCodeUrl) return null;
    if (qrCodeUrl.startsWith('http://') || qrCodeUrl.startsWith('https://') || qrCodeUrl.startsWith('data:') || qrCodeUrl.startsWith('blob:')) {
      return qrCodeUrl;
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const cleanPath = qrCodeUrl.startsWith('/') ? qrCodeUrl : `/${qrCodeUrl}`;
    return `${baseUrl}${cleanPath}`;
  }, [qrCodeUrl]);

  // Verifica si hay al menos un dato relevante para mostrar en la tarjeta inferior
  const hasInfo = Boolean(
    bankName ||
    idDocument ||
    accountNumber ||
    (totalBs && totalBs > 0) ||
    (totalUsd && totalUsd > 0)
  );

  // Cadena legible para copiar al portapapeles
  const textPayload = [
    bankName && `${t('settings.payments.form.bank', 'Banco')}: ${bankName}`,
    idDocument && `${t('settings.payments.form.document', 'C.I./RIF')}: ${idDocument}`,
    accountNumber && `${t('settings.payments.form.account', 'Nro. Cuenta / Teléfono')}: ${accountNumber}`,
    totalBs > 0 && `${t('common.amount', 'Monto')}: Bs. ${formattedAmount}`,
  ]
    .filter(Boolean)
    .join('\n');

  const handleCopy = () => {
    if (!textPayload) return;
    navigator.clipboard.writeText(textPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger >
        <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:w-auto sm:px-2.5 gap-2 text-xs">
          <QrCode className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">{t('settings.payments.view_qr', 'Ver QR')}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xs text-center flex flex-col items-center">
        <DialogHeader className="items-center">
          <DialogTitle className="text-base">
            {t('settings.payments.qr_title', 'Código QR de Pago')}
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white p-3 rounded-xl border shadow-inner my-2 flex items-center justify-center min-h-[190px] w-[190px]">
          {resolvedQrUrl ? (
            <img 
              src={resolvedQrUrl} 
              alt={t('settings.payments.form.qr_code', 'Código QR')} 
              className="max-h-[170px] max-w-[170px] object-contain rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground gap-1">
              <ImageOff className="h-8 w-8" />
              <span className="text-xs">{t('settings.payments.no_qr_image', 'Sin imagen QR')}</span>
            </div>
          )}
        </div>

        {/* Solo se muestra si hay información bancaria o montos */}
        {hasInfo && (
          <div className="w-full text-xs space-y-1 bg-muted/50 p-2.5 rounded-lg border text-left font-mono">
            {totalBs > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('common.amount_bs', 'Monto Bs:')}</span>
                <span className="font-bold text-primary">Bs. {formattedAmount}</span>
              </div>
            )}
            {totalUsd > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('common.amount_usd', 'Monto USD:')}</span>
                <span className="font-bold">{formatUsd(totalUsd)}</span>
              </div>
            )}
            
            {bankName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('settings.payments.form.bank', 'Banco')}:</span>
                <span className="truncate max-w-[150px]">{bankName}</span>
              </div>
            )}
            {idDocument && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('settings.payments.form.document', 'C.I./RIF')}:</span>
                <span>{idDocument}</span>
              </div>
            )}
            {accountNumber && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('settings.payments.form.account', 'Nro. Cuenta / Teléfono')}:</span>
                <span>{accountNumber}</span>
              </div>
            )}
          </div>
        )}

        {textPayload && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full gap-1.5 text-xs mt-1"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied 
              ? t('common.copied_to_clipboard', '¡Datos copiados!') 
              : t('common.copy_text_data', 'Copiar datos en texto')}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}