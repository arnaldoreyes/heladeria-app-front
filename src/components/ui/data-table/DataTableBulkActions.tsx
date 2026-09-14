import type { BulkAction } from './types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, X, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

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
  const { t } = useTranslation(['common']);

  if (selectedRows.length === 0) return null;

  return (
    <div className="fixed bottom-4 md:bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 md:gap-3 rounded-full border bg-background/95 backdrop-blur-md p-1.5 md:p-2 pr-2 md:pr-3 shadow-xl animate-in slide-in-from-bottom-8">
      {/* Indicador de cantidad seleccionada */}
      <div className="flex items-center gap-2 pl-1 md:pl-2 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {selectedRows.length}
        </div>
        <span className="text-xs md:text-sm font-semibold tracking-wider text-muted-foreground uppercase hidden sm:inline-block">
          {t('common.selected', 'seleccionados')}
        </span>
      </div>

      {/* Separador vertical */}
      <div className="h-5 w-[1px] bg-border shrink-0" />

      {/* Menú Desplegable de Acciones */}
      <div className="flex items-center gap-1.5 shrink-0">
        {bulkActions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="rounded-full px-3 md:px-4 h-8 text-xs md:text-sm gap-1.5 font-medium shadow-sm cursor-pointer"
              >
                <Layers className="h-4 w-4 shrink-0" />
                <span>{t('common.actions', 'Acciones')}</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 z-[60]">
              {bulkActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(selectedRows)}
                  className={cn(
                    'cursor-pointer flex items-center gap-2 rounded-lg text-xs md:text-sm py-2 px-2.5 font-medium transition-colors',
                    action.variant === 'destructive' && 'text-destructive focus:text-destructive focus:bg-destructive/10'
                  )}
                >
                  {action.icon && (
                    <span className="h-4 w-4 flex items-center justify-center shrink-0">
                      {action.icon}
                    </span>
                  )}
                  <span className="truncate">{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Botón para limpiar selección */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground shrink-0"
          title={t('common.clear', 'Limpiar')}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}