import { formatUsd, formatBs } from '@/lib/format';

interface CartTotalsProps {
  totalUsd: number;
  totalBs: number;
  exchangeRate: number;
  paymentsTotalUsd?: number;
  balanceUsd?: number;
  showSubtotal?: boolean; 
}

export function CartTotals({
  totalUsd,
  totalBs,
  exchangeRate,
  paymentsTotalUsd,
  balanceUsd,
  showSubtotal = false,
}: CartTotalsProps) {
  const showPayments = paymentsTotalUsd !== undefined && balanceUsd !== undefined;
  const safeBalance = balanceUsd !== undefined ? Math.max(0, balanceUsd) : totalUsd;
  const balanceBs = safeBalance * exchangeRate;

  return (
    <div className="divide-y divide-border/60 text-xs space-y-2">
      {/* 1. Desglose en USD */}
      <div className="space-y-1 pb-1">
        {showSubtotal && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal Venta:</span>
            <span className="font-semibold">{formatUsd(totalUsd)}</span>
          </div>
        )}

        {showPayments && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Pagado:</span>
            <span className="font-semibold text-emerald-600">{formatUsd(paymentsTotalUsd)}</span>
          </div>
        )}

        {/* Total / Resta USD */}
        <div className="flex justify-between text-sm font-bold pt-1">
          <span>{showPayments ? 'Resta por Pagar (USD):' : 'Total (USD):'}</span>
          <span className={showPayments && safeBalance > 0 ? 'text-red-500' : ''}>
            {formatUsd(safeBalance)}
          </span>
        </div>
      </div>

      {/* 2. Equivalencia en Bs. */}
      <div className="pt-2 space-y-1">
        {/* Total / Resta Bs. del MISMO TAMAÑO que el USD (text-sm font-bold) */}
        <div className="flex justify-between text-sm font-bold">
          <span>{showPayments ? 'Resta en Bs.:' : 'Total (Bs.):'}</span>
          <span className="text-primary">
            {formatBs(showPayments ? balanceBs : totalBs)}
          </span>
        </div>

        {/* Referencia secundaria del Total de la Venta en Bs. cuando hay abonos */}
        {showPayments && (
          <div className="flex justify-between text-[11px] text-muted-foreground/70">
            <span>Total Venta (Bs.):</span>
            <span>{formatBs(totalBs)}</span>
          </div>
        )}

        <div className="flex justify-between text-[11px] text-muted-foreground/70 mb-4">
          <span>Tasa de cambio:</span>
          <span className="font-mono"> {formatBs(exchangeRate)}</span>
        </div>
      </div>
    </div>
  );
}