import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBs, formatDate, formatUsd } from '@/lib/format';
import type { Sale, SaleItem, SalePayment } from '@/interfaces/sale.interface';

interface SaleHistoryDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export function SaleHistoryDetailDialog({ isOpen, onClose, sale }: SaleHistoryDetailDialogProps) {
  const { t } = useTranslation(['sales', 'common']);

  if (!sale) return null;

  const getStatusBadge = (status: Sale['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">{t('sales.status.completed', 'Completada')}</Badge>;
      case 'voided':
        return <Badge variant="destructive">{t('sales.status.voided', 'Anulada')}</Badge>;
      case 'draft':
        return <Badge variant="secondary">{t('sales.status.draft', 'Borrador/Cotización')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: Sale['payment_status']) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">{t('sales.payment_status.paid', 'Pagado')}</Badge>;
      case 'partial':
        return <Badge className="bg-amber-500 hover:bg-amber-600">{t('sales.payment_status.partial', 'Parcial')}</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-600">{t('sales.payment_status.pending', 'Pendiente')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex flex-col gap-1 text-base sm:text-lg">
            <span>{t('sales.detail_title', 'Detalle de Venta')}</span>
            <span className="font-mono text-xs font-medium text-muted-foreground break-all">
              Ticket: #{sale.ticket_number ?? sale.id}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Información General */}
        <div className="p-3.5 rounded-lg bg-muted/40 border divide-y divide-border/60 text-xs sm:text-sm space-y-2.5">
          {/* Cliente */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-muted-foreground font-medium shrink-0">
              {t('sales.customer', 'Cliente')}:
            </span>
            <span className="font-semibold text-foreground truncate text-right">
              {sale.customer_id ?? t('common.general_public', 'Público General')}
            </span>
          </div>

          {/* Tipo de Venta y Estado */}
          <div className="flex items-center justify-between gap-2 pt-2.5">
            <span className="text-muted-foreground font-medium shrink-0">
              {t('sales.status_title', 'Estado / Tipo')}:
            </span>
            <div className="flex items-center gap-1.5">
              {getStatusBadge(sale.status)}
              {getPaymentStatusBadge(sale.payment_status)}
            </div>
          </div>

          {/* Tasa de cambio */}
          <div className="flex items-center justify-between gap-2 pt-2.5">
            <span className="text-muted-foreground font-medium shrink-0">
              {t('sales.exchange_rate', 'Tasa de Cambio')}:
            </span>
            <span className="font-semibold text-foreground">
              {formatBs(sale.exchange_rate ?? 0)}
            </span>
          </div>

          {/* Fecha de Emisión */}
          <div className="flex items-center justify-between gap-2 pt-2.5">
            <span className="text-muted-foreground font-medium shrink-0">
              {t('common.created_at', 'Fecha de Venta')}:
            </span>
            <span className="font-semibold text-foreground">
              {sale.created_at ? formatDate(sale.created_at) : '-'}
            </span>
          </div>
        </div>

        {/* Lista de Productos / Ítems */}
        <div className="space-y-2.5">
          <h4 className="font-semibold text-sm">{t('sales.items_list', 'Productos Vendidos')}</h4>
          
          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            {sale.items && sale.items.length > 0 ? (
              sale.items.map((item: SaleItem, idx: number) => (
                <div
                  key={item.id ?? idx}
                  className="p-3 border rounded-lg bg-card text-card-foreground space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm leading-tight">
                      {item.product_name_snapshot ?? item.product_id}
                    </p>
                    <Badge variant="outline" className="text-xs shrink-0 font-normal">
                      Cant: {Number(item.quantity).toLocaleString()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">
                        {t('sales.unit_price_usd', 'Precio Unit. ($)')}
                      </span>
                      <span className="font-medium">{formatUsd(item.unit_price_usd)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">
                        {t('sales.subtotal_usd', 'Subtotal ($)')}
                      </span>
                      <span className="font-semibold">{formatUsd(item.subtotal_usd)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px] uppercase">
                        {t('sales.subtotal_bs', 'Subtotal (Bs.)')}
                      </span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                         {formatBs(item.subtotal_bs)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center border border-dashed rounded-lg text-sm text-muted-foreground">
                {t('sales.no_items', 'No hay productos registrados en esta venta')}
              </div>
            )}
          </div>
        </div>

        {/* Lista de Pagos Realizados */}
        {sale.payments && sale.payments.length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className="font-semibold text-sm">{t('sales.payments_list', 'Pagos Recibidos')}</h4>
            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
              {sale.payments.map((payment: SalePayment, idx: number) => (
                <div key={payment.id ?? idx} className="p-2.5 rounded-md border bg-muted/20 text-xs flex justify-between items-center">
                  <div>
                    <span className="font-semibold block">{payment.currency} ({payment.currency === 'USD' ? formatUsd(payment.amount_original) : formatBs(payment.amount_original)})</span>
                    {payment.reference && <span className="text-[11px] text-muted-foreground">Ref: {payment.reference}</span>}
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono block">
                      {formatUsd(payment.amount_usd)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">Tasa: {formatBs(payment.exchange_rate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen Financiero y Totales */}
        <div className="p-4 rounded-lg bg-muted/30 border space-y-2 text-xs sm:text-sm">
          {(Number(sale.discount_bs) > 0 || Number(sale.change_loss_bs) > 0) && (
            <div className="border-b pb-2 space-y-1 text-muted-foreground">
              {Number(sale.discount_bs) > 0 && (
                <div className="flex justify-between">
                  <span>{t('sales.discount_bs', 'Descuento aplicado')}:</span>
                  <span className="font-mono text-foreground">{formatBs(sale.discount_bs)}</span>
                </div>
              )}
              {Number(sale.change_loss_bs) > 0 && (
                <div className="flex justify-between">
                  <span>{t('sales.change_loss_bs', 'Pérdida por Cambio/Vuelto')}:</span>
                  <span className="font-mono text-foreground">{formatBs(sale.change_loss_bs)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between font-bold pt-0.5">
            <span className="text-muted-foreground">{t('sales.total_usd', 'Total USD')}:</span>
            <span className="text-base text-emerald-600 dark:text-emerald-400 font-mono">
              {formatUsd(sale.total_usd ?? 0)}
            </span>
          </div>

          <div className="flex items-center justify-between font-bold">
            <span className="text-muted-foreground">{t('sales.total_bs', 'Total Bolívares')}:</span>
            <span className="text-base text-emerald-600 dark:text-emerald-400 font-mono">
              {formatBs(sale.total_bs ?? 0)}
            </span>
          </div>

          {sale.pending_usd > 0 && (
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-semibold pt-1 border-t">
              <span>{t('sales.pending_usd', 'Monto Pendiente')}:</span>
              <span className="font-mono">{formatUsd(sale.pending_usd)}</span>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            {t('common.close', 'Cerrar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}