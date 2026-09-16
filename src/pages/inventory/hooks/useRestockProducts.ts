import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SortingState } from '@tanstack/react-table';

import { getCategoriesAction } from '../actions/category.actions';
import { getProductsAction, type GetProductFilters } from '../actions/product.action';
import type { ProductApiResponse } from '../interfaces/product.response';

export function useRestockProducts(initialFilters: GetProductFilters = {}) {
  // Estados de Filtros locales
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFilters.category_id ? String(initialFilters.category_id) : 'ALL'
  );
  const [stockFilter, setStockFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Paginación
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(12);

  // Ordenamiento (TanStack Table Compatible)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const rawSortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortBy = rawSortBy === 'cost' ? 'unit_cost_usd' : rawSortBy;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  // Normalización de valores para Backend
  const parsedCategoryId = selectedCategory !== 'ALL' ? selectedCategory : undefined;
  const parsedIsActive = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;
  const parsedWithStock =
    stockFilter === 'true' || stockFilter === 'in_stock'
      ? true
      : stockFilter === 'false' || stockFilter === 'out_of_stock'
      ? false
      : undefined;

  // Query Server-Side
  const { data: productsResponse, isLoading: isLoadingProducts, isFetching } = useQuery({
    queryKey: [
      'restock-products',
      searchQuery,
      parsedCategoryId,
      parsedIsActive,
      parsedWithStock,
      sortBy,
      sortOrder,
      page,
      perPage,
    ],
    queryFn: () =>
      getProductsAction({
        search: searchQuery || undefined,
        category_id: parsedCategoryId,
        is_active: parsedIsActive,
        with_stock: parsedWithStock,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategoriesAction(),
  });

  const rawProducts = productsResponse?.data || [];
  const paginatedProducts: ProductApiResponse[] = rawProducts;

  const categories = categoriesResponse?.data || [];
  const totalProductsCount = productsResponse?.meta?.total ?? 0;
  const totalPages = productsResponse?.meta?.last_page ?? Math.ceil(totalProductsCount / perPage) ?? 1;

  // Handlers con reseteo de paginación
  const handleSearchChange = (query: string ) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleStockFilterChange = (filter: string | null) => {
    if(!filter) return;
    setStockFilter(filter);
    setPage(1);
  };

  const handleStatusFilterChange = (filter: string | null) => {
    if(!filter) return;
    setStatusFilter(filter);
    setPage(1);
    return statusFilter;
  };

  // Helper para alternar ordenamiento según columna
  const handleToggleSort = (fieldId: string) => {
    setSorting((prev) => {
      const current = prev[0];
      if (current && current.id === fieldId) {
        return [{ id: fieldId, desc: !current.desc }];
      }
      return [{ id: fieldId, desc: false }];
    });
    setPage(1);
  };

  const isDefaultSort =
    sorting.length === 1 && sorting[0].id === 'name' && !sorting[0].desc;

  const hasActiveFilters =
    selectedCategory !== 'ALL' ||
    stockFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    searchQuery !== '' ||
    !isDefaultSort;

  const handleResetFilters = () => {
    setSelectedCategory('ALL');
    setStockFilter('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
    setSorting([{ id: 'name', desc: false }]);
    setPage(1);
  };

  const handleResetSort = () => {
    setSorting([{ id: 'name', desc: false }]);
    setPage(1);
  };

  return {
    paginatedProducts,
    categories,
    isLoadingProducts,
    isFetching,

    // Filtros
    searchQuery,
    setSearchQuery: handleSearchChange,
    selectedCategory,
    setSelectedCategory: handleCategoryChange,
    stockFilter,
    setStockFilter: handleStockFilterChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    hasActiveFilters,
    handleResetFilters,

    // Orden
    sorting,
    setSorting,
    sortField: rawSortBy || 'name',
    sortOrder: sortOrder || 'asc',
    handleToggleSort,
    handleResetSort,

    // Paginación
    currentPage: page,
    setCurrentPage: setPage,
    itemsPerPage: perPage,
    setItemsPerPage: setPerPage,
    totalPages,
    totalProductsCount,
  };
}