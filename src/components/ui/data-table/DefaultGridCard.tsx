import type { Row } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface DefaultGridCardProps<TData extends Record<string, any>> {
  row: Row<any, TData>;
}

export function DefaultGridCard<TData extends Record<string, any>>({ row }: DefaultGridCardProps<TData>) {
  const isSelected = row.getIsSelected();

  return (
    <div
      className={cn(
        'p-4 rounded-lg border bg-card space-y-3 transition-colors relative h-full flex flex-col',
        isSelected && 'border-primary bg-primary/5'
      )}
    >
      <div className="flex items-center justify-between border-b pb-2">
        <span className="text-xs text-muted-foreground font-mono">#{row.id}</span>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          aria-label="Seleccionar fila"
        />
      </div>

      <div className="space-y-1.5 text-sm flex-1">
        {row.getAllCells()
          .filter((cell) => !(cell.column.columnDef.meta as any)?.hideInGrid)
          .map((cell) => {
            // Renderizado seguro en v9
            const cellContext = cell.getContext();
            const CellContent = cell.column.columnDef.cell;

            return (
              <div
                key={cell.id}
                className="flex justify-between items-center py-1 border-b border-border/40 last:border-0"
              >
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {typeof cell.column.columnDef.header === 'string'
                    ? cell.column.columnDef.header
                    : cell.column.id}
                </span>
                <div className="font-medium text-right break-words max-w-[60%]">
                  {typeof CellContent === 'function'
                    ? (CellContent as any)(cellContext)
                    : CellContent}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}