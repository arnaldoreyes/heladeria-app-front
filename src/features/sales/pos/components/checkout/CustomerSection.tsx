import { User, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomerSelect } from '@/features/customers/components/CustomerSelect';

interface CustomerSectionProps {
  customerId: string;
  requiresCustomer: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectCustomer: (id: string) => void;
  onAddNewCustomer?: () => void;
}

export function CustomerSection({
  customerId,
  requiresCustomer,
  isOpen,
  onToggleOpen,
  onSelectCustomer,
  onAddNewCustomer,
}: CustomerSectionProps) {

  return (
    <div className="border rounded-lg p-2.5 bg-muted/20 space-y-2">
      {/* Cabecera / Botón desplegable */}
      <Button
        variant="ghost"
        type="button"
        className="w-full flex justify-between items-center p-0 h-auto hover:bg-transparent text-xs font-semibold text-muted-foreground"
        onClick={onToggleOpen}
      >
        <span className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>Cliente</span>
          {requiresCustomer && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold flex items-center gap-0.5 ml-1">
              <AlertCircle className="h-3 w-3" /> Requerido
            </span>
          )}
        </span>

        <div className="flex items-center gap-1.5">
          {isOpen ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
      </Button>

      {/* Contenido desplegable con el componente modular CustomerSelect */}
      {isOpen && (
        <div className="pt-1 border-t border-border/50">
          <CustomerSelect
            value={customerId}
            onChange={(id) => onSelectCustomer(id ?? '')}
            onAddNewCustomer={onAddNewCustomer}
            label="" 
          />
        </div>
      )}
    </div>
  );
}