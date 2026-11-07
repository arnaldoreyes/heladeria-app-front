import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatUsd } from '@/lib/format';

export interface TopProductItem {
  name: string;
  qty: number;
  revenue: number;
}

interface AnalyticsTopProductsProps {
  products: TopProductItem[];
}

export function AnalyticsTopProducts({ products }: AnalyticsTopProductsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top 5 Best-Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Units Sold</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p, i) => (
              <TableRow key={p.name}>
                <TableCell>
                  <Badge
                    variant={i === 0 ? 'default' : 'secondary'}
                    className="h-6 w-6 justify-center p-0"
                  >
                    {i + 1}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell className="text-right font-mono">{p.qty}</TableCell>
                <TableCell className="text-right font-mono font-bold">
                  {formatUsd(p.revenue)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}