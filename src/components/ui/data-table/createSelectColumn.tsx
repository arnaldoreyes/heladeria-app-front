import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

export function createSelectColumn<TData extends Record<string, any>>(): ColumnDef<any, TData> {
  return {
    id: 'select',
    meta: { hideInGrid: true },
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.getToggleAllPageRowsSelectedHandler()({ target: { checked: !!value } })}
        aria-label="Seleccionar todo"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.getToggleSelectedHandler()({ target: { checked: !!value } })}
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}