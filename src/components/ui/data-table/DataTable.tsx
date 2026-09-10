import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  flexRender,
  useTable,
  tableFeatures,
  rowSelectionFeature,
  rowSortingFeature,
  
  type RowSelectionState,
  type SortingState,
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
import type { DataTableProps } from './types';

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
}: DataTableProps<TData>) {
  const { t } = useTranslation('datatable');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const table = useTable({
    features,
    data,
    columns,
    state: {
      rowSelection,
      ...(sorting ? { sorting } : {})
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
      />

      
      <DataTableBulkActions
        selectedRows={selectedRows}
        onClearSelection={() => setRowSelection({})}
        bulkActions={onBulkActions}
      />

      <div className="rounded-md border bg-card">
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