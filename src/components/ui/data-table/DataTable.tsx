import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  flexRender,
  useTable,
  tableFeatures,
  rowSelectionFeature,
  rowSortingFeature,
  type RowSelectionState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTablePagination } from './DataTablePagination';
import { DataTableBulkActions } from './DataTableBulkActions';
import { DefaultGridCard } from './DefaultGridCard'; // Importamos la nueva tarjeta por defecto
import type { DataTableProps } from './types';
import { cn } from '@/lib/utils';

const features = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
});

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  pagination,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  onAdd,
  addLabel,
  filterComponents,
  showSearch = true,
  showAdd = false,
  showFilters = false,
  onBulkActions,
  sorting,
  onSortingChange,
  defaultViewMode = 'table', // Valor por defecto
  renderGridCard,            // Prop para tarjeta personalizada
}: DataTableProps<TData>) {
  const { t } = useTranslation('datatable');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  
  // Estado para manejar si estamos en modo tabla o grid usando la prop por defecto
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(defaultViewMode);
  
  const table = useTable({
    features,
    data,
    columns,
    state: {
      rowSelection,
      ...(sorting ? { sorting } : {}),
    },
    manualSorting: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange,
  });

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original as TData);

  return (
    <div className="w-full space-y-4">
      <DataTableToolbar
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        onAdd={onAdd}
        addLabel={addLabel}
        filterComponents={filterComponents}
        showSearch={showSearch}
        showAdd={showAdd}
        showFilters={showFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        isAllSelected={table.getIsAllPageRowsSelected()}
        onToggleSelectAll={table.getToggleAllPageRowsSelectedHandler()}
        table={table}
      />

      <DataTableBulkActions
        selectedRows={selectedRows}
        onClearSelection={() => setRowSelection({})}
        bulkActions={onBulkActions}
      />

      {/* VISTA GRID/MÓVIL */}
      <div 
        className={cn(
          "grid gap-4",
          // Responsividad mejorada: de 1 columna en móvil a 2, 3 o 4 según el espacio
          viewMode === 'table' ? "grid-cols-1 md:hidden" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {isLoading ? (
          Array.from({ length: pagination?.pageSize || 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border bg-card space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            return (
              <div key={row.id} className="relative h-full">
                {renderGridCard ? renderGridCard(row) : <DefaultGridCard row={row} />}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card md:col-span-full">
            {t('empty_table')}
          </div>
        )}
      </div>

      {/* VISTA DESKTOP: Tabla Tradicional */}
      <div 
        className={cn(
          "rounded-md border bg-card overflow-x-auto",
          viewMode === 'grid' ? "hidden" : "hidden md:block"
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pagination?.pageSize || 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t('empty_table')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && onPageChange && onPageSizeChange && (
        <DataTablePagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}