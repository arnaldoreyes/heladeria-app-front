import { Coins, CreditCard } from 'lucide-react';
import { formatUsd, formatBs } from '@/lib/format';
import { Button } from '@/components/ui/button';

export type OverpaymentAction = 'change' | 'customer_credit';

interface OverpaymentSectionProps {
  excessUsd: number;
  excessBs: number;
  action: OverpaymentAction;
  onChangeAction: (action: OverpaymentAction) => void;
}

export function OverpaymentSection({
  excessUsd,
  excessBs,
  action,
  onChangeAction,
}: OverpaymentSectionProps) {
  if (excessUsd <= 0) return null;

  return (
    <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 space-y-2 text-xs">
      {/* Encabezado con monto del excedente */}
      <div className="flex justify-between items-center text-emerald-700 dark:text-emerald-400 font-semibold">
        <span className="flex items-center gap-1.5 text-xs">
          <Coins className="h-4 w-4 shrink-0" />
          Excedente Registrado:
        </span>
        <span className="font-mono font-bold text-sm">
          +{formatUsd(excessUsd)} ({formatBs(excessBs)})
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground leading-tight">
        El cliente ha entregado un monto superior al total. Selecciona el destino del excedente:
      </p>

      {/* Selector de Acción de Excedente */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          type="button"
          variant="outline"
          onClick={() => onChangeAction('change')}
          className={`h-auto p-2.5 rounded-lg border text-left flex flex-col items-start justify-start gap-1 whitespace-normal transition-all ${
            action === 'change'
              ? 'border-emerald-600 bg-background shadow-sm text-foreground ring-1 ring-emerald-600/20'
              : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background/80 hover:text-foreground'
          }`}
        >
          <span className="font-semibold text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <Coins className="h-3.5 w-3.5 shrink-0" />
            Vuelto
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight font-normal">
            Vuelto en Bs ({formatBs(excessBs)}) registrado en la venta.
          </span>
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => onChangeAction('customer_credit')}
          className={`h-auto p-2.5 rounded-lg border text-left flex flex-col items-start justify-start gap-1 whitespace-normal transition-all ${
            action === 'customer_credit'
              ? 'border-emerald-600 bg-background shadow-sm text-foreground ring-1 ring-emerald-600/20'
              : 'border-transparent bg-background/50 text-muted-foreground hover:bg-background/80 hover:text-foreground'
          }`}
        >
          <span className="font-semibold text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CreditCard className="h-3.5 w-3.5 shrink-0" />
            Crédito al Cliente
          </span>
          <span className="text-[10px] text-muted-foreground leading-tight font-normal">
            Abonar +{formatUsd(excessUsd)} como saldo a favor en su cuenta.
          </span>
        </Button>
      </div>
    </div>
  );
}