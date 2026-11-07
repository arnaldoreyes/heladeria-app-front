import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { ShrinkageItem } from '../types/analitycs';

interface ShrinkageSummaryCardProps {
  items: ShrinkageItem[];
  totalLossUsd: number;
}

export function ShrinkageSummaryCard({ items, totalLossUsd }: ShrinkageSummaryCardProps) {
  const getReasonBadge = (reason: ShrinkageItem['reason']) => {
    switch (reason) {
      case 'expired':
        return <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-200">Vencido</Badge>;
      case 'damaged':
        return <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-600 border-red-200">Dañado</Badge>;
      case 'lost':
        return <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-600 border-purple-200">Extraviado</Badge>;
      case 'internal_use':
        return <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-200">Uso Interno</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">Otro</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            Control de Mermas y Pérdidas
          </CardTitle>
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full">
            Total Pérdida: ${totalLossUsd.toFixed(2)}
          </span>
        </div>
        <CardDescription>Registro de insumos/productos desincorporados</CardDescription>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">No hay mermas registradas en este período.</p>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 text-xs">
                  <TableHead>Producto</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-center">Cant.</TableHead>
                  <TableHead className="text-right">Costo Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.slice(0, 4).map((item) => (
                  <TableRow key={item.id} className="text-xs">
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell>{getReasonBadge(item.reason)}</TableCell>
                    <TableCell className="text-center font-medium">{item.quantity}</TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      ${item.costUsd.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}