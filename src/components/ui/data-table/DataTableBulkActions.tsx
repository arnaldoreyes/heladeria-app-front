import type { BulkAction } from './types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { X, ChevronDown } from 'lucide-react';

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
  const { t } = useTranslation('datatable');

  if (selectedRows.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between rounded-lg border bg-muted/50 p-3 gap-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">          
          {selectedRows.length} {t('selected_other')}
        </span>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="mr-1 h-3.5 w-3.5" />
          {t('clean')}
        </Button>
      </div>

      {/* Acciones masivas movidas a un DropdownMenu para mejor responsive */}
      {bulkActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              {t('actions')} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            {bulkActions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(selectedRows)}
                className="cursor-pointer"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}