import { type Column, type RowData } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DataTableColumnHeaderProps {
  column: Column<any, RowData>;
  title: string;
}

export function DataTableColumnHeader({
  column,
  title,
}: DataTableColumnHeaderProps) {
  if (!column.getCanSort()) {
    return <span>{title}</span>;
  }

  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => column.toggleSorting(isSorted === 'asc')}
    >
      <span>{title}</span>
      {isSorted === 'desc' ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : isSorted === 'asc' ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
}