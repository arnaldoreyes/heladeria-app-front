import { AlertCircle, PackageX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { DeadStockItem } from '../types/analitycs';

interface DeadStockTableProps {
  items: DeadStockItem[];
}

export function DeadStockTable({ items }: DeadStockTableProps) {
  const totalTiedCapital = items.reduce((acc, curr) => acc + curr.tiedCapitalUsd, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PackageX className="h-4 w-4 text-destructive" />
            Stock Muerto / Inmóvil
          </CardTitle>
          <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
            Capital Atrapado: ${totalTiedCapital.toFixed(2)}
          </span>
        </div>
        <CardDescription>Productos sin ventas registradas en los últimos 30 días</CardDescription>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground text-xs">
            <AlertCircle className="h-8 w-8 mb-2 opacity-40" />
            <p>¡Excelente! No tienes stock inmóvil registrado.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 text-xs">
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-right">Capital Atrapado</TableHead>
                  <TableHead className="text-right">Últ. Venta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.slice(0, 5).map((item) => (
                  <TableRow key={item.id} className="text-xs">
                    <TableCell className="font-medium">
                      <div>{item.name}</div>
                      <span className="text-[10px] text-muted-foreground">{item.sku}</span>
                    </TableCell>
                    <TableCell className="text-center font-medium">{item.currentStock}</TableCell>
                    <TableCell className="text-right font-semibold text-destructive">
                      ${item.tiedCapitalUsd.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {item.lastSoldDate}
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