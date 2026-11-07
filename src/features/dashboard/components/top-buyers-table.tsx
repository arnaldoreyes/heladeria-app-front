import { Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { TopBuyerItem } from '../types/analitycs';

interface TopBuyersTableProps {
  buyers: TopBuyerItem[];
}

export function TopBuyersTable({ buyers }: TopBuyersTableProps) {
  const getRfmBadge = (segment?: TopBuyerItem['rfmSegment']) => {
    switch (segment) {
      case 'Champion':
        return <Badge className="text-[10px] bg-emerald-600">VIP / Campeón</Badge>;
      case 'Loyal':
        return <Badge className="text-[10px] bg-blue-600">Frecuente</Badge>;
      case 'At Risk':
        return <Badge variant="destructive" className="text-[10px]">En Riesgo</Badge>;
      case 'New':
        return <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-300">Nuevo</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Clientes Destacados (Top Buyers)
        </CardTitle>
        <CardDescription>Clientes con mayor volumen de compra y recurrencia</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-xs">
                <TableHead>Cliente</TableHead>
                <TableHead>Segmento RFM</TableHead>
                <TableHead className="text-center">Compras</TableHead>
                <TableHead className="text-right">Total Gastado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buyers.slice(0, 5).map((buyer, idx) => (
                <TableRow key={buyer.id} className="text-xs">
                  <TableCell className="font-medium flex items-center gap-2">
                    {idx === 0 && <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                    <span>{buyer.name}</span>
                  </TableCell>
                  <TableCell>{getRfmBadge(buyer.rfmSegment)}</TableCell>
                  <TableCell className="text-center font-medium">{buyer.totalOrders}</TableCell>
                  <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">
                    ${buyer.totalSpentUsd.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}