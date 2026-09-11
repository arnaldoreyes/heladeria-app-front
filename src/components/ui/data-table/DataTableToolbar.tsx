import type { ReactNode } from 'react';
import { 
  Search, Plus, Filter, LayoutGrid, Table as TableIcon, 
  CheckSquare, ArrowUpDown, ArrowUp, ArrowDown 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Table } from '@tanstack/react-table';
interface DataTableToolbarProps<TData> {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  showAdd?: boolean;
  onAdd?: () => void;
  addLabel?: string;
  addIcon?: ReactNode;

  showFilters?: boolean;
  filterComponents?: ReactNode;
  
  viewMode?: 'table' | 'grid';
  onViewModeChange?: (mode: 'table' | 'grid') => void;

  isAllSelected?: boolean;
  onToggleSelectAll?: (event: unknown) => void;
  table?: Table<TData, any>;
}

export function DataTableToolbar<TData>({
  showSearch = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  showAdd = false,
  onAdd,
  addLabel,
  addIcon = <Plus className="mr-2 h-4 w-4" />,
  showFilters = false,
  filterComponents,
  viewMode = 'table',
  onViewModeChange,
  isAllSelected,
  onToggleSelectAll,
  table, 
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation('datatable');

  const sortableColumns = table 
  ? table.getAllLeafColumns().filter((col: any) => col.getCanSort?.() ?? col.columnDef.enableSorting) 
  : [];

  console.log(sortableColumns);

  return (
    <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
      {/* Buscador */}
      <div className="flex flex-1 items-center min-w-[200px] max-w-sm">
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder || t('search')}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex items-center space-x-2">
        
        {/* Controles para Móvil / Grid */}
        <div className={cn("flex items-center space-x-2", viewMode === 'table' ? "md:hidden" : "")}>
          {onToggleSelectAll && (
            <Button
              variant={isAllSelected ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={onToggleSelectAll}
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
          )}

          {/* Menú desplegable para Ordenar dinámicamente usando las columnas de TanStack */}
          {sortableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortableColumns.map((column) => {
                  const isSorted = column.getIsSorted();
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={() => column.toggleSorting(isSorted === 'asc')}
                      className="flex items-center justify-between min-w-[150px]"
                    >
                      <span>
                        {typeof column.columnDef.header === 'string'
                          ? column.columnDef.header
                          : column.id}
                      </span>
                      {isSorted === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4" />
                      ) : isSorted === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Toggle de vistas */}
        {onViewModeChange && (
          <Button
            variant="outline"
            size="icon"
            className="hidden md:flex h-9 w-9"
            onClick={() => onViewModeChange(viewMode === 'table' ? 'grid' : 'table')}
          >
            {viewMode === 'table' ? <LayoutGrid className="h-4 w-4" /> : <TableIcon className="h-4 w-4" />}
          </Button>
        )}

        {/* Filtros */}
        {showFilters && filterComponents && (
          <Dialog>
            <DialogTrigger className={buttonVariants({ variant: 'outline', size: 'sm', className: 'h-9' })}>
              <Filter className="mr-2 h-4 w-4" />
              <span className="hidden lg:block">{t('common.filters')}</span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('common.filters')}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {filterComponents}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Agregar */}
        {showAdd && onAdd && (
          <Button onClick={onAdd} variant="default" size="sm" className="h-9">
            {addIcon}
            <span className="hidden lg:block">
              {addLabel || t('add')}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}