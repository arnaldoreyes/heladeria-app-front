import { DollarSign, Wallet, CreditCard, AlertTriangle, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CurrencyBalance } from '../types/analitycs';

interface CurrencyBalanceCardProps {
  balance: CurrencyBalance;
}

export function CurrencyBalanceCard({ balance }: CurrencyBalanceCardProps) {
  const formatUsd = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatVes = (val: number) => `Bs. ${val.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            Balance Bimonetario & Flujo de Caja
          </CardTitle>
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <ArrowRightLeft className="h-3 w-3" />
            Tasa: {balance.exchangeRate} Bs/$
          </Badge>
        </div>
        <CardDescription>Distribución de liquidez por tipo de divisa e instrumento</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {/* Efectivo USD */}
          <div className="rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Efectivo USD</span>
              <DollarSign className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-2 text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatUsd(balance.usdCash)}
            </p>
          </div>

          {/* Zelle / Digital USD */}
          <div className="rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Zelle / Digital USD</span>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </div>
            <p className="mt-2 text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatUsd(balance.zelleUsd)}
            </p>
          </div>

          {/* Efectivo Bs */}
          <div className="rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Efectivo Bs.</span>
              <Wallet className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-1 text-base font-bold text-foreground">
              {formatVes(balance.vesCash)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              ≈ {formatUsd(balance.vesCash / (balance.exchangeRate || 1))}
            </p>
          </div>

          {/* Pago Móvil / Punto Bs */}
          <div className="rounded-lg border bg-card p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">Pago Móvil / Punto</span>
              <CreditCard className="h-4 w-4 text-purple-500" />
            </div>
            <p className="mt-1 text-base font-bold text-foreground">
              {formatVes(balance.vesDigital)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              ≈ {formatUsd(balance.vesDigital / (balance.exchangeRate || 1))}
            </p>
          </div>
        </div>

        {/* Alerta de Descuadres o Fugas Cambiarias */}
        {balance.discrepancies > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <div className="flex-1">
              <span className="font-semibold">Fugas/Descuadres Cambiarios:</span> {formatUsd(balance.discrepancies)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}