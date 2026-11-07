import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ImportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importData: string;
  onImportDataChange: (data: string) => void;
  onImport: () => void;
  isImporting?: boolean;
}

export function ImportDataDialog({
  open,
  onOpenChange,
  importData,
  onImportDataChange,
  onImport,
  isImporting = false,
}: ImportDataDialogProps) {
  const rowCount = importData.trim() ? importData.trim().split('\n').length - 1 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Data</DialogTitle>
          <DialogDescription>
            Paste your CSV data below. A preview will be validated before import.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label>CSV Data</Label>
          <textarea
            className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="SKU,Name,Price USD,Cost USD,Stock,Low Threshold&#10;POP-004,Watermelon Popsicle,1.50,0.60,80,20"
            value={importData}
            disabled={isImporting}
            onChange={(e) => onImportDataChange(e.target.value)}
          />
          {importData.trim() && (
            <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-xs">
              <p className="font-medium text-muted-foreground">
                Preview: {rowCount} {rowCount === 1 ? 'row' : 'rows'} detected
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" disabled={isImporting} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onImport} disabled={isImporting}>
            {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}