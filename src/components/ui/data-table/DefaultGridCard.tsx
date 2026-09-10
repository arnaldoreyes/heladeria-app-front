import { flexRender, type Row } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

interface DefaultGridCardProps<TData> {
  row: Row<TData>;
}

export function DefaultGridCard<TData>({ row }: DefaultGridCardProps<TData>) {
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
        <input
          type="checkbox"
          checked={isSelected}
          onChange={row.getToggleSelectedHandler()}
          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
        />
      </div>

      <div className="space-y-1.5 text-sm flex-1">
        {row.getAllCells()
          .filter((cell) => !(cell.column.columnDef.meta as any)?.hideInGrid)
          .map((cell) => (
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
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}