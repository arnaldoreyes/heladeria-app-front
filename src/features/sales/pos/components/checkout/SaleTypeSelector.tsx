import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SaleTypeMode = 'retail' | 'credit' | 'employee';

interface SaleTypeSelectorProps {
  value: SaleTypeMode;
  onChange: (mode: SaleTypeMode) => void;
  onSelectEmployee?: () => void;
}

export function SaleTypeSelector({ value, onChange, onSelectEmployee }: SaleTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-1 p-1 bg-muted rounded-lg text-xs">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-1.5 text-xs font-semibold rounded-md transition-all truncate",
          value === 'retail'
            ? "bg-background text-foreground shadow-sm hover:bg-background"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        onClick={() => onChange('retail')}
      >
        Venta al Detal
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-1.5 text-xs font-semibold rounded-md transition-all truncate",
          value === 'credit'
            ? "bg-background text-foreground shadow-sm hover:bg-background"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        onClick={() => onChange('credit')}
      >
        Venta a Crédito
      </Button>

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-1.5 text-xs font-semibold rounded-md transition-all truncate",
          value === 'employee'
            ? "bg-background text-foreground shadow-sm hover:bg-background"
            : "text-muted-foreground hover:text-foreground hover:bg-transparent"
        )}
        onClick={() => {
          onChange('employee');
          onSelectEmployee?.();
        }}
      >
        Consumo al Costo
      </Button>
    </div>
  );
}