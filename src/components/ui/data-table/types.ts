import type { ColumnDef, OnChangeFn, SortingState, Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface BulkAction<TData> {
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  onClick: (selectedRows: TData[]) => void;
}

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;

  // Visibilidad de bloques
  showSearch?: boolean;
  showAdd?: boolean;
  showFilters?: boolean;
  showBulkActions?: boolean;

  // Búsqueda
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Botón Añadir (al lado del buscador)
  onAdd?: () => void;
  addLabel?: string;
  addIcon?: ReactNode;

  // Filtros dinámicos (Custom React Elements / Selects / Dropdowns)
  filterComponents?: ReactNode;

  // Acciones Masivas totalmente genéricas
  onBulkActions?: BulkAction<TData>[];

  // Paginación (opcional)
  pagination?: PaginationState;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  defaultViewMode?: 'table' | 'grid';
  renderGridCard?: (row: Row<TData>) => ReactNode;
}