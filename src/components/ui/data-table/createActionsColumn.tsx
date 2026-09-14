import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { Button } from '../button';

export interface RowAction<TData> {
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: (row: TData) => void;
  show?: (row: TData) => boolean;
}

export function createActionsColumn<TData extends Record<string, any>>(
  actions: RowAction<TData>[],
  headerLabel = 'Acciones'
): ColumnDef<any, TData> {
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
              <Button
                key={idx}
                variant={action.variant}
                type="button"
                className=""
                onClick={() => action.onClick(data)}
                title={action.label}
              >
                {action.icon || action.label}
              </Button>
            ))}
        </div>
      );
    },
  };
}