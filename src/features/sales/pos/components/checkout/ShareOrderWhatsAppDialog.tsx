import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Send, Copy, Check, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { formatUsd, formatBs } from '@/lib/format';
import type { SaleType } from '@/interfaces/sale.interface';

interface ShareOrderWhatsAppDialogProps {
  items?: any[];
  maxVisibleItems?: number;
  totalUsd?: number;
  totalBs?: number;
  pendingUsd?: number;
  pendingBs?: number;
  paidUsd?: number;
  paidBs?: number;
  exchangeRate?: number;
  saleType?: SaleType;
  payments?: any[];
  customerPhone?: string | null;
  disabled?: boolean;
  className?: string;
}

export function ShareOrderWhatsAppDialog({
  items = [],
  maxVisibleItems = 4,
  totalUsd = 0,
  totalBs = 0,
  pendingUsd = 0,
  pendingBs = 0,
  paidUsd,
  paidBs,
  exchangeRate = 0,
  payments = [],
  customerPhone = null,
  disabled = false,
  className = '',
}: ShareOrderWhatsAppDialogProps) {
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Mensaje de Saludo Inicial en Textarea
  const [greeting, setGreeting] = useState(
    '¡Hola! Buen día. Te anexo el resumen de tu orden y los datos de pago:'
  );

  // Toggle Principal "Mostrar todo"
  const [showAllSections, setShowAllSections] = useState(true);

  // Toggles / Checkboxes individuales (Se muestran si showAllSections es false)
  const [showProductDetails, setShowProductDetails] = useState(true);
  const [showPaymentMethods, setShowPaymentMethods] = useState(true);
  const [showTotals, setShowTotals] = useState(true);
  const [showExchangeRate, setShowExchangeRate] = useState(true);
  const [showPendingStatus, setShowPendingStatus] = useState(true);

  // Auto-completar el teléfono si viene por prop
  useEffect(() => {
    if (customerPhone) {
      setPhone(customerPhone);
    }
  }, [customerPhone]);

  const buildPayload = () => {
    let text = '';

    // 1. Saludo Inicial
    if (greeting.trim()) {
      text += `${greeting.trim()}\n\n`;
    }

    text += `*RESUMEN DE ORDEN*\n`;

    // Visibilidad de secciones según el Toggle general o individuales
    const includeProducts = showAllSections || showProductDetails;
    const includePayments = showAllSections || showPaymentMethods;
    const includeTotals = showAllSections || showTotals;
    const includeExchangeRate = showAllSections || showExchangeRate;
    const includePendingStatus = showAllSections || showPendingStatus;

    // 2. Listado de productos
    if (includeProducts && items.length > 0) {
      text += `--------------------------\n`;
      text += `*PRODUCTOS (${items.length}):*\n`;
      
      const visibleItems = items.slice(0, maxVisibleItems);
      const remainingCount = items.length - maxVisibleItems;

      visibleItems.forEach((item) => {
        const qty = item.quantity || item.qty || 1;
        const name = item.name || item.product?.name || 'Producto';
        text += `• ${qty}x ${name}\n`;
      });

      if (remainingCount > 0) {
        text += `• _... y +${remainingCount} producto${remainingCount > 1 ? 's' : ''} más_\n`;
      }
    }

    // 3. Desglose de Métodos de Pago
    if (includePayments && payments.length > 0) {
      const isMultiple = payments.length > 1;
      text += `--------------------------\n`;
      text += `*${isMultiple ? `MÉTODOS DE PAGO (${payments.length})` : 'DATOS DE PAGO'}:*\n`;

      payments.forEach((pay) => {
        const rawPay = pay as Record<string, any>;
        const nestedMethod = rawPay.payment_method || rawPay.paymentMethod || {};

        const name =
          rawPay.methodName ||
          rawPay.method ||
          nestedMethod.name ||
          rawPay.name ||
          'Método de Pago';

        const amountUsd = rawPay.amountUsd ?? rawPay.amount_usd;
        const amountBs = rawPay.amountBs ?? rawPay.amount_bs;

        const bankName = rawPay.bankName || rawPay.bank_name || nestedMethod.bank_name;
        const idDocument = rawPay.idDocument || rawPay.id_document || nestedMethod.id_document || rawPay.cedula || rawPay.rif;
        const phoneNumber = rawPay.phoneNumber || rawPay.phone_number || nestedMethod.phone_number || rawPay.phone || rawPay.telefono;
        const accountNumber = rawPay.accountNumber || rawPay.account_number || nestedMethod.account_number;
        const accountHolder = rawPay.accountHolder || rawPay.account_holder || nestedMethod.account_holder || rawPay.titular;
        const email = rawPay.email || nestedMethod.email;
        const reference = rawPay.reference;
        const notes = rawPay.notes;

        text += `*${name}*`;

        const hasAmount = amountUsd !== undefined || amountBs !== undefined;
        if (hasAmount && (Number(amountUsd) > 0 || Number(amountBs) > 0)) {
          text += `: ${formatUsd(amountUsd || 0)} / ${formatBs(amountBs || 0)}`;
        } else if (rawPay.currency) {
          text += ` [${rawPay.currency}]`;
        }
        text += `\n`;

        if (bankName) text += `   - Banco: ${bankName}\n`;
        if (idDocument) text += `   - C.I. / RIF: ${idDocument}\n`;
        if (phoneNumber) text += `   - Teléfono: ${phoneNumber}\n`;
        if (accountHolder) text += `   - Titular: ${accountHolder}\n`;
        if (accountNumber) text += `   - N° Cuenta: ${accountNumber}\n`;
        if (email) text += `   - Correo: ${email}\n`;
        if (reference) text += `   - Ref: ${reference}\n`;
        if (notes && !notes.startsWith('Banco:')) text += `   - Nota: ${notes}\n`;
      });
    }

    // 4. Monto Total
    if (includeTotals) {
      text += `------------------------------\n`;
      text += `*MONTO TOTAL:* ${formatUsd(totalUsd)} / ${formatBs(totalBs)}\n`;
    }

    // 5. Tasa de Cambio
    if (includeExchangeRate && exchangeRate > 0) {
      if (!includeTotals) text += `------------------------------\n`;
      text += `*TASA DE CAMBIO:* ${formatBs(exchangeRate)}\n`;
    }

    // 6. Desglose de Saldo Pendiente
    if (includePendingStatus && pendingUsd > 0) {
      const computedPaidUsd = paidUsd ?? Math.max(0, totalUsd - pendingUsd);
      const computedPaidBs = paidBs ?? (exchangeRate > 0 ? computedPaidUsd * exchangeRate : Math.max(0, totalBs - pendingBs));
      text += `------------------------------\n`;
      text += `*ESTADO DE PAGO:*\n`;
      text += `• *Abonado:* ${formatUsd(computedPaidUsd)} / ${formatBs(computedPaidBs)}\n`;
      text += `• *Resta:* ${formatUsd(pendingUsd)} / ${formatBs(pendingBs)}\n`;
    }

    return text;
  };

  const textPayload = buildPayload();

  const handleCopy = () => {
    navigator.clipboard.writeText(textPayload);
    setCopied(true);
    toast.success('Resumen copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    let cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('0')) {
      cleanPhone = '58' + cleanPhone.substring(1);
    } else if (cleanPhone && !cleanPhone.startsWith('58') && cleanPhone.length === 10) {
      cleanPhone = '58' + cleanPhone;
    }

    const encodedText = encodeURIComponent(textPayload);
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;

    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className={`gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 ${className}`}
        >
          <Share2 className="h-4 w-4" />
          <span>Compartir por WhatsApp</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Enviar Resumen por WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-1 max-h-[80vh] overflow-y-auto pr-1">
          {/* Mensaje de saludo editable en Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              Mensaje de saludo inicial:
            </label>
            <Textarea
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="Ej: Hola buen día, te anexo el resumen..."
              rows={2}
              className="text-xs resize-none min-h-[60px]"
            />
          </div>

          {/* Selector de Secciones con Toggle 'Mostrar Todo' */}
          <div className="space-y-2 bg-muted/30 p-2.5 rounded-lg border border-border/50 text-xs">
            <div className="flex items-center justify-between">
              <label htmlFor="showAllToggle" className="font-semibold text-foreground cursor-pointer select-none">
                Incluir todas las secciones
              </label>
              <input
                type="checkbox"
                id="showAllToggle"
                checked={showAllSections}
                onChange={(e) => setShowAllSections(e.target.checked)}
                className="h-4 w-4 rounded border-input text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Muestra los checks individuales únicamente cuando "Mostrar todo" está desactivado */}
            {!showAllSections && (
              <div className="pt-2 border-t border-border/40 grid grid-cols-2 gap-2 animate-in fade-in-50 duration-200">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showProductDetails}
                    onChange={(e) => setShowProductDetails(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-input text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span>Productos ({items.length})</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showPaymentMethods}
                    onChange={(e) => setShowPaymentMethods(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-input text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span>Datos de Pago</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showTotals}
                    onChange={(e) => setShowTotals(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-input text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span>Monto Total</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showExchangeRate}
                    onChange={(e) => setShowExchangeRate(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-input text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                  />
                  <span>Tasa de Cambio</span>
                </label>

                {pendingUsd > 0 && (
                  <label className="flex items-center gap-1.5 cursor-pointer select-none col-span-2">
                    <input
                      type="checkbox"
                      checked={showPendingStatus}
                      onChange={(e) => setShowPendingStatus(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-input text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                    />
                    <span>Estado de Pago (Abono / Resta)</span>
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Vista previa del mensaje dinámico */}
          <div className="bg-muted/60 p-3 rounded-md text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border border-border/80">
            {textPayload}
          </div>

          {/* Teléfono de destino */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Número de destino (WhatsApp):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Ej: 04121234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 h-9 text-xs font-mono"
                />
              </div>
              <Button
                type="button"
                onClick={handleSendWhatsApp}
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 gap-1.5 px-4"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Enviar</span>
              </Button>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="w-full h-8 text-xs gap-1.5"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}