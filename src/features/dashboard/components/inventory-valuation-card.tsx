import { PackageCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { InventoryValuation } from '../types/analitycs';

interface InventoryValuationCardProps {
  valuation: InventoryValuation;
  lowStockCount: number;
  rotationRate: number;
}

export function InventoryValuationCard({ valuation, lowStockCount, rotationRate }: InventoryValuationCardProps) {
  const formatUsd = (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const marginPercentage = valuation.totalRetailValueUsd > 0
    ? Math.round((valuation.potentialProfitUsd / valuation.totalRetailValueUsd) * 100)
    : 0;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-primary" />
          Valoración & Salud del Inventario
        </CardTitle>
        <CardDescription>Resumen de capital inmovilizado y potencial de retorno</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/20 p-3">
            <span className="text-xs text-muted-foreground font-medium">Inversión (Costo)</span>
            <p className="mt-1 text-lg font-bold text-foreground">{formatUsd(valuation.totalCostUsd)}</p>
            <span className="text-[11px] text-muted-foreground">{valuation.totalItems} ítems almacenados</span>
          </div>

          <div className="rounded-lg border bg-muted/20 p-3">
            <span className="text-xs text-muted-foreground font-medium">Valor de Venta Esperado</span>
            <p className="mt-1 text-lg font-bold text-primary">{formatUsd(valuation.totalRetailValueUsd)}</p>
            <span className="text-[11px] text-emerald-600 font-medium">+{marginPercentage}% Margen Teórico</span>
          </div>
        </div>

        {/* Progresión de Margen Potencial */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Ganancia Bruta Potencial</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatUsd(valuation.potentialProfitUsd)}</span>
          </div>
          <Progress value={marginPercentage} className="h-2" />
        </div>

        {/* Métricas secundarias */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground">{lowStockCount} productos</p>
              <p className="text-[11px] text-muted-foreground">Bajo stock mínimo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-blue-500 shrink-0" />
            <div>
              <p className="font-medium text-foreground">{rotationRate}x / mes</p>
              <p className="text-[11px] text-muted-foreground">Tasa de rotación</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}