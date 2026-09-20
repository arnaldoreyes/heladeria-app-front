import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBs, formatDate, formatUsd } from '@/lib/format';
import type { Restock, RestockItem } from '@/interfaces/restock.interfce';

interface RestockDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  restock: Restock | null;
}

export function RestockDetailDialog({ isOpen, onClose, restock }: RestockDetailDialogProps) {
  const { t } = useTranslation(['restocks', 'common']);

  if (!restock) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex flex-col gap-1 text-base sm:text-lg">
            <span>{t('restocks.detail_title', 'Detalle de Reposicion')}</span>
            <span className="font-mono text-xs font-medium text-muted-foreground break-all">
              #{restock.invoice_number ?? restock.id}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="p-3.5 rounded-lg bg-muted/40 border divide-y divide-border/60 text-xs sm:text-sm space-y-2.5">
          {/* Proveedor */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="text-muted-foreground font-medium shrink-0">
              {t('restocks.supplier_name', 'Proveedor')}:
            </span>
            <span className="font-semibold text-foreground truncate text-right">
              {restock.supplier_name ?? 'N/A'}
            </span>
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between gap-2 pt-2.5">
            <span className="text-muted-foreground font-medium shrink-0">
              {t('restocks.status', 'Estado')}:
            </span>
            <span className="font-semibold text-foreground">
              {restock.is_completed ? t('common.completed', 'Completado') : t('common.draft', 'Cotizado')}
            </span>
          </div>

          {/* Tasa de cambio */}
          <div className="flex items-center justify-between gap-2 pt-2.5">
            <span className="text-muted-foreground font-medium shrink-0">
              {t('restocks.exchange_rate', 'Tasa de Cambio')}:
            </span>
            <span className="font-semibold text-foreground">
              {formatBs(restock.exchange_rate ?? 0)}
            </span>
          </div>

          {/* Fecha de compra */}
          <div className="flex items-center justify-between gap-2 pt-2.5">
            <span className="text-muted-foreground font-medium shrink-0">
              {t('common.purchased_at', 'Fecha de Compra')}:
            </span>
            <span className="font-semibold text-foreground">
              {restock.purchased_at ? formatDate(restock.purchased_at) : '-'}
            </span>
          </div>
        </div>

        {/* Lista de Productos */}
        <div className="space-y-2.5">
          <h4 className="font-semibold text-sm">{t('restocks.items_list', 'Productos')}</h4>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {restock.items && restock.items.length > 0 ? (
              restock.items.map((item: RestockItem, idx: number) => (
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
                      <span className="text-muted-foreground block text-[10px] uppercase">{t('restocks.uunit_cost_usd', 'Costo Unit.')}</span>
                      <span className="font-medium">{formatUsd(item.unit_cost_usd)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">{t('restocks.subtotal_usd', 'Subtotal ($)')}</span>
                      <span className="font-semibold">{formatUsd(item.subtotal_usd)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-muted-foreground block text-[10px] uppercase">{t('restocks.subtotal_bs', 'Subtotal (Bs.)')}</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                         {formatBs(item.subtotal_bs)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center border border-dashed rounded-lg text-sm text-muted-foreground">
                {t('restocks.no_items', 'No hay ítems en este reabastecimiento')}
              </div>
            )}
          </div>
        </div>

        {/* Resumen de Totales */}
        <div className="flex items-center justify-end p-4 rounded-lg bg-muted/30 border">
          <div className="flex flex-col items-end gap-1.5 text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base text-muted-foreground font-medium">
                {t('restocks.total_usd', 'Total ($)')}:
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatUsd(restock.total_usd ?? 0)}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base text-muted-foreground font-medium">
                {t('restocks.total_bs', 'Total (Bs.)')}:
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {formatBs(restock.total_bs ?? 0)}
              </span>
            </div>
          </div>
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