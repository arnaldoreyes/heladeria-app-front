import type { BulkAction } from './types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { t } from 'i18next';

interface DataTableBulkActionsProps<TData> {
  selectedRows: TData[];
  onClearSelection: () => void;
  bulkActions?: BulkAction<TData>[];
}

export function DataTableBulkActions<TData>({
  selectedRows,
  onClearSelection,
  bulkActions = [],
}: DataTableBulkActionsProps<TData>) {

  if (selectedRows.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border bg-background p-2 pr-4 shadow-xl animate-in slide-in-from-bottom-8">
      {/* Indicador de cantidad seleccionada */}
      <div className="flex items-center gap-3 pl-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {selectedRows.length}
        </div>
        <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase hidden sm:inline-block">
          {t('common.selected')}
        </span>
      </div>

      {/* Separador vertical */}
      <div className="h-6 w-[1px] bg-border" />

      {/* Acciones */}
      <div className="flex items-center gap-2">
        {bulkActions.map((action, index) => (
          <Button
            key={index}
            variant="secondary"
            size="sm"
            className="rounded-full px-4"
            onClick={() => action.onClick(selectedRows)}
          >
            {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
            {action.label}
          </Button>
        ))}
        
        {/* Botón para limpiar selección */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClearSelection}
          className="ml-1 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          title={t('clean')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}