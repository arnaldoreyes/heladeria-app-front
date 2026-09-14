import type { ReactNode } from 'react';
import { 
  Search, Plus, Filter, LayoutGrid, Table as TableIcon, 
  CheckSquare, ArrowUpDown, ArrowUp, ArrowDown, Check, RotateCcw 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { Table } from '@tanstack/react-table';

interface DataTableToolbarProps<TData extends Record<string, any>> {
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
  table?: Table<any, any>;
}

export function DataTableToolbar<TData extends Record<string, any>>({
  showSearch = true,
  searchValue = '',
  onSearchChange,
  searchPlaceholder,
  showAdd = false,
  onAdd,
  addLabel,
  addIcon = <Plus className="h-4 w-4" />,
  showFilters = false,
  filterComponents,
  viewMode = 'table',
  onViewModeChange,
  isAllSelected,
  onToggleSelectAll,
  table, 
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation(['datatable', 'common']);

  const sortableColumns = table 
    ? table.getAllLeafColumns().filter((col: any) => col.getCanSort?.() ?? false) 
    : [];

  const sortedColumn = sortableColumns.find((col: any) => col.getIsSorted());
  const currentSortDirection = sortedColumn ? sortedColumn.getIsSorted() : null;

  const getColumnTitle = (column: any): string => {
    const metaTitle = (column.columnDef.meta as any)?.title || (column.columnDef.meta as any)?.label;
    if (metaTitle) return metaTitle;
    if (typeof column.columnDef.header === 'string') return column.columnDef.header;
    
    return column.id.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Buscador */}
      <div className="flex flex-1 items-center min-w-[200px] max-w-sm">
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder || t('datatable.search', 'Buscar...')}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        )}
      </div>

      {/* Acciones principales */}
      <div className="flex items-center space-x-2">
        {onToggleSelectAll && (
          <Button
            variant={isAllSelected ? "default" : "outline"}
            size="icon"
            className={cn("flex items-center h-9 w-9", viewMode === 'table' ? "md:hidden" : "")}
            onClick={onToggleSelectAll}
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
        )}

        {/* Menú desplegable para Ordenamiento */}
        {sortableColumns.length > 0 && (
          <div className={cn("flex items-center", viewMode === 'table' ? "md:hidden" : "")}>
            <DropdownMenu> 
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={sortedColumn ? "secondary" : "outline"} 
                  size="sm" 
                  className="h-9 gap-1.5 px-2.5 text-xs font-medium cursor-pointer"
                >
                  {currentSortDirection === 'asc' ? (
                    <ArrowUp className="h-4 w-4 text-primary" />
                  ) : currentSortDirection === 'desc' ? (
                    <ArrowDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="hidden sm:inline">
                    {sortedColumn ? getColumnTitle(sortedColumn) : t('datatable.sort', 'Ordenar')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1 z-50">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal px-2 py-1.5">
                    {t('datatable.sortBy', 'Ordenar por')}
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />

                  {sortableColumns.map((column: any) => {
                    const isSorted = column.getIsSorted();
                    const isActive = !!isSorted;

                    return (
                      <DropdownMenuItem
                        key={column.id}
                        onClick={() => {
                          if (isSorted === 'asc') {
                            column.toggleSorting(true); // Cambia a DESC
                          } else if (isSorted === 'desc') {
                            column.clearSorting(); // Al hacer clic en DESC, resetea la columna
                          } else {
                            column.toggleSorting(false); // Inicia en ASC
                          }
                        }}
                        className="flex items-center justify-between cursor-pointer text-xs py-2 px-2 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <Check 
                            className={cn(
                              "h-4 w-4 text-primary transition-opacity",
                              isActive ? "opacity-100" : "opacity-0"
                            )} 
                          />
                          <span className={cn(isActive && "font-bold text-primary")}>
                            {getColumnTitle(column)}
                          </span>
                        </div>

                        {isSorted === 'desc' && (
                          <span className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-bold">
                            DESC <ArrowDown className="h-3 w-3" />
                          </span>
                        )}
                        {isSorted === 'asc' && (
                          <span className="flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono font-bold">
                            ASC <ArrowUp className="h-3 w-3" />
                          </span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}

                  {/* Botón para resetear todo el ordenamiento si hay algo ordenado */}
                  {sortedColumn && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => table?.resetSorting()}
                        className="flex items-center justify-center gap-2 cursor-pointer text-xs py-2 text-muted-foreground hover:text-foreground font-medium"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>{t('datatable.resetSort', 'Restablecer orden')}</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Alternar vistas (Desktop) */}
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4" />
                <span className="hidden lg:block">{t('common.filters', 'Filtros')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              align="end" 
              sideOffset={8}
              collisionPadding={16}
              className="w-[calc(100vw-32px)] sm:w-80 p-4 space-y-3"
            >
              <div className="hidden lg:block font-semibold">
                {t('common.filters', 'Filtros')}
              </div>
              <div className="space-y-3">
                {filterComponents}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Botón Agregar */}
        {showAdd && onAdd && (  
          <Button onClick={onAdd} variant="default" size="sm" className="h-9 flex items-center justify-center">
            {addIcon}
            <span className="hidden lg:block ml-1.5">
              {addLabel || t('common.add', 'Agregar')}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}