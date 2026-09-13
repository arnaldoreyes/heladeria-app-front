import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  tableFeatures,
  rowSelectionFeature,
  rowSortingFeature,
  useTable,
  type RowSelectionState,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableToolbar } from './DataTableToolbar'
import { DataTablePagination } from './DataTablePagination'
import { DataTableBulkActions } from './DataTableBulkActions'
import { DefaultGridCard } from './DefaultGridCard'
import { cn } from '@/lib/utils'

// 1. Definir las features que utilizará la tabla
const features = tableFeatures({
  rowSelectionFeature,
  rowSortingFeature,
})

// 2. Extender los tipos globales de TanStack Table para reconocer las features registradas
declare module '@tanstack/react-table' {
  interface Register {
    tableFeatures: typeof features
  }
}

interface DataTableProps<TData extends Record<string, any>> {
  // Ajuste clave: Permitir que ColumnDef acepte tanto las features de v9 como TData
  columns: ColumnDef<typeof features, TData>[]
  data: TData[]
  isLoading?: boolean
  pagination?: {
    pageIndex: number
    pageSize: number
    pageCount: number
    total?: number
  }
  onPageChange?: (page: number) => void
  onPageSizeChange?: (pageSize: number) => void
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  onAdd?: () => void
  addLabel?: string
  filterComponents?: React.ReactNode
  showSearch?: boolean
  showAdd?: boolean
  showFilters?: boolean
  onBulkActions?: Array<{
    label: string
    icon?: React.ReactNode
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    onClick: (selectedRows: TData[]) => void
  }>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  defaultViewMode?: 'table' | 'grid'
  renderGridCard?: (row: any) => React.ReactNode
}

// 3. Añadir el constraint `extends Record<string, any>` al componente genérico
export function DataTable<TData extends Record<string, any>>({
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
  defaultViewMode = 'table',
  renderGridCard,
}: DataTableProps<TData>) {
  const { t } = useTranslation('datatable')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [viewMode, setViewMode] = useState<'table' | 'grid'>(defaultViewMode)

  const table = useTable(
    {
      features,
      data,
      columns,
      state: {
        rowSelection,
        ...(sorting ? { sorting } : {}),
      },
      enableRowSelection: true,
      manualSorting: true,
      onRowSelectionChange: setRowSelection,
      onSortingChange,
    },
    (state) => state
  )

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original as TData)

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
          'grid gap-4',
          viewMode === 'table'
            ? 'grid-cols-1 md:hidden'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
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
          table.getRowModel().rows.map((row) => (
            <div key={row.id} className="relative h-full">
              {renderGridCard ? renderGridCard(row) : <DefaultGridCard row={row} />}
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card md:col-span-full">
            {t('datatable.empty_table')}
          </div>
        )}
      </div>

      {/* VISTA DESKTOP: Tabla Tradicional */}
      <div
        className={cn(
          'rounded-md border bg-card overflow-x-auto',
          viewMode === 'grid' ? 'hidden' : 'hidden md:block'
        )}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
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
                      <table.FlexRender cell={cell} />
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
                  {t('datatable.empty_table')}
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
  )
}