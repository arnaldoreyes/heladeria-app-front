import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export interface RowAction<TData> {
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  onClick: (row: TData) => void;
  show?: (row: TData) => boolean;
}

export function createActionsColumn<TData>(
  actions: RowAction<TData>[],
  headerLabel = 'Acciones'
): ColumnDef<TData, any> {
  return {
    id: 'actions',
    meta: { hideInGrid: true },
    header: () => <div className="text-right">{headerLabel}</div>,
    cell: ({ row }) => {
      const data = row.original as TData;
      return (
        <div className="flex justify-end space-x-1">
          {actions
            .filter((action) => (action.show ? action.show(data) : true))
            .map((action, idx) => (
              <button
                key={idx}
                type="button"
                className="p-1 hover:bg-accent rounded-md transition-colors"
                onClick={() => action.onClick(data)}
                title={action.label}
              >
                {action.icon || action.label}
              </button>
            ))}
        </div>
      );
    },
  };
}