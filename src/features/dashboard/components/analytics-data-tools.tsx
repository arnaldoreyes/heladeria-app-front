import { Download, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ExportType } from '../types/analitycs';

interface AnalyticsDataToolsProps {
  onExport: (type: ExportType) => void;
  isExporting?: boolean;
  onOpenImport: () => void;
}

export function AnalyticsDataTools({
  onExport,
  isExporting = false,
  onOpenImport,
}: AnalyticsDataToolsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Download className="h-4 w-4" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download reports as CSV for Excel analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={isExporting}
            onClick={() => onExport('sales')}
          >
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export Sales History
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={isExporting}
            onClick={() => onExport('inventory')}
          >
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export Inventory Log
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            disabled={isExporting}
            onClick={() => onExport('financial')}
          >
            {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Export Financial Report
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Upload className="h-4 w-4" />
            Import Data
          </CardTitle>
          <CardDescription>
            Bulk upload products, categories, or past inventory via CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={onOpenImport}>
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV / Excel
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Template columns: SKU, Name, Price USD, Cost USD, Stock, Low Threshold
          </p>
        </CardContent>
      </Card>
    </div>
  );
}