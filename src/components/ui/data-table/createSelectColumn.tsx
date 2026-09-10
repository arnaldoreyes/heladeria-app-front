import type { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';

export function createSelectColumn<TData>(): ColumnDef<TData, any> {
  return {
    id: 'select',
    meta: { hideInGrid: true },
    header: ({ table }) => {
      const t = table as any; // Casteo de seguridad si los tipos de v9 son muy restrictivos
      return (
        <Checkbox
          checked={t.getIsAllPageRowsSelected?.() ?? false}
          onCheckedChange={(value) => t.toggleAllPageRowsSelected?.(!!value)}
          aria-label="Seleccionar todo"
        />
      );
    },
    cell: ({ row }) => {
      const r = row as any;
      return (
        <Checkbox
          checked={r.getIsSelected?.() ?? false}
          onCheckedChange={(value) => r.toggleSelected?.(!!value)}
          aria-label="Seleccionar fila"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  };
}