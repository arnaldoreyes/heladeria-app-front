import type { ReactNode } from 'react';
import { 
  Search, Plus, Filter, LayoutGrid, Table as TableIcon, 
  CheckSquare, ArrowUpDown, ArrowUp, ArrowDown 
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
  addIcon = <Plus className="mr-2 h-4 w-4" />,
  showFilters = false,
  filterComponents,
  viewMode = 'table',
  onViewModeChange,
  isAllSelected,
  onToggleSelectAll,
  table, 
}: DataTableToolbarProps<TData>) {
  const { t } = useTranslation(['datatable', 'common']);

  // En v9, filtramos columnas que permiten ordenamiento
  const sortableColumns = table 
    ? table.getAllLeafColumns().filter((col:any) => col.getCanSort?.() ?? false) 
    : [];

  // Helper para obtener el título legible de la columna
  const getColumnTitle = (column: any): string => {
    const metaTitle = (column.columnDef.meta as any)?.title || (column.columnDef.meta as any)?.label;
    if (metaTitle) return metaTitle;
    if (typeof column.columnDef.header === 'string') return column.columnDef.header;
    
    // Capitalizar ID de la columna como fallback limpio (ej: "price_usd" -> "Price Usd")
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
        
        {/* Controles móviles / Vista Grid */}
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

          {/* Menú desplegable para Ordenamiento dinámico en v9 */}
          {sortableColumns.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortableColumns.map((column:any) => {
                  const isSorted = column.getIsSorted();
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      onClick={() => column.toggleSorting(isSorted === 'asc')}
                      className="flex items-center justify-between min-w-[160px]"
                    >
                      <span>{getColumnTitle(column)}</span>
                      {isSorted === 'desc' ? (
                        <ArrowDown className="ml-2 h-4 w-4 text-primary" />
                      ) : isSorted === 'asc' ? (
                        <ArrowUp className="ml-2 h-4 w-4 text-primary" />
                      ) : null}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Alternate de vistas (Desktop) */}
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

        {/* Filtros ligeros en Popover (no bloquea pantalla con Dialog) */}
        {showFilters && filterComponents && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                <span className='d-none md:d-block'>{t('common.filters', 'Filtros')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              align="end" 
              sideOffset={8}
              collisionPadding={16}
              className="w-[calc(100vw-32px)] sm:w-80 p-4 space-y-3"
            >
              <div className="hidden lg:block">
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
          <Button onClick={onAdd} variant="default" size="sm" className="h-9">
            {addIcon}
            <span className="hidden lg:block">
              {addLabel || t('common.add', 'Agregar')}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}