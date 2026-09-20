import { flexRender, type Row } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface DefaultGridCardProps<TData> {
  row: Row<any, TData>;
  enableRowSelection?: boolean;
}

export function DefaultGridCard<TData>({
  row,
  enableRowSelection = true,
}: DefaultGridCardProps<TData>) {
  const isSelected = row.getIsSelected();

  const actionsCell = row.getAllCells().find((cell) => cell.column.id === 'actions');

  const dataCells = row.getAllCells().filter((cell) => {
    const columnId = cell.column.id;
    if (columnId === 'select' || columnId === 'actions') return false;

    const meta = cell.column.columnDef.meta as Record<string, any> | undefined;
    const isColumnVisible =
      typeof cell.column.getIsVisible === 'function'
        ? cell.column.getIsVisible()
        : cell.column.columnDef.enableHiding !== false;

    return !meta?.hideInGrid && isColumnVisible;
  });

  return (
    <div
      className={cn(
        'p-4 rounded-lg border bg-card space-y-3 transition-colors relative h-full flex flex-col justify-between',
        isSelected && 'border-primary bg-primary/5'
      )}
    >
      <div className="space-y-3">
        {/* Cabecera: ID y Checkbox opcional */}
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-xs text-muted-foreground font-mono">#{row.id}</span>
          {enableRowSelection && (
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => row.toggleSelected(!!checked)}
              aria-label="Seleccionar fila"
            />
          )}
        </div>

        {/* Cuerpo */}
        <div className="space-y-1.5 text-sm">
          {dataCells.map((cell) => {
            const meta = cell.column.columnDef.meta as Record<string, any> | undefined;
            const header = cell.column.columnDef.header;

            const label =
              meta?.title ??
              (typeof header === 'string' ? header : cell.column.id);

            return (
              <div
                key={cell.id}
                className="flex justify-between items-center py-1 border-b border-border/40 last:border-0"
              >
                <span className="text-xs text-muted-foreground font-medium tracking-wider">
                  {label}
                </span>
                <div className="font-medium text-right break-words max-w-[60%]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer: Acciones */}
      {actionsCell && (
        <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
          {flexRender(actionsCell.column.columnDef.cell, actionsCell.getContext())}
        </div>
      )}
    </div>
  );
}