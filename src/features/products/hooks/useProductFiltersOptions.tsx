import { useMemo, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';
import type { ProductQueryParams } from '@/interfaces/product.interface';
import { useTags } from '@/features/tags/hooks/useTags';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { flattenCategoryTree } from '@/features/categories/utils/category-tree.utils';

export function useProductFilters(initialFilters: ProductQueryParams = {}) {
    const { tags = [] } = useTags();
    const { categories = [] } = useCategories();

    const categoryOptions = useMemo(() => {
        return flattenCategoryTree(categories).map((cat) => ({
        id: cat.id,
        name: cat.name,
        depth: cat.depth,
        }));
    }, [categories]);

    const tagOptions = useMemo(() => {
        return tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        color: tag.color,
        }));
  }, [tags]);

  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');

  const [categoriesFilter, setCategoriesFilter] = useState<string[]>(
    initialFilters.categories 
      ? (Array.isArray(initialFilters.categories) ? initialFilters.categories : [String(initialFilters.categories)]) 
      : []
  );
  
  const [tagsFilter, setTagsFilter] = useState<string[]>(
    initialFilters.tags 
      ? (Array.isArray(initialFilters.tags) ? initialFilters.tags : [String(initialFilters.tags)]) 
      : []
  );

  const [stockFilter, setStockFilter] = useState<string | undefined>(initialFilters.with_stock || 'ALL');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(initialFilters.is_active || 'ALL');

  // Paginación
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(12);

  // Ordenamiento
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  // Normalización para el backend
  const rawSortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortBy = rawSortBy === 'cost' ? 'unit_cost_usd' : rawSortBy;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  const parsedCategories = categoriesFilter.length > 0 ? categoriesFilter : undefined;
  const parsedTags = tagsFilter.length > 0 ? tagsFilter : undefined;
  const parsedStock = stockFilter !== undefined && stockFilter !== 'ALL' ? String(stockFilter) : undefined;
  const parsedStatus = statusFilter !== undefined && statusFilter !== 'ALL' ? String(statusFilter) : undefined;

  // Handlers con reseteo de página
  const handleSearchChange = (query: string) => { setSearchQuery(query); setPage(1); };
  const handleCategoriesChange = (categories: string[]) => { setCategoriesFilter(categories); setPage(1); };
  const handleTagsFilterChange = (tags: string[]) => { setTagsFilter(tags); setPage(1); };
  const handleStockFilterChange = (filter: string | null) => { if (filter === null) return; setStockFilter(filter); setPage(1); };
  const handleStatusFilterChange = (filter: string | null) => { if (filter === null) return; setStatusFilter(filter); setPage(1); };
  const handleResetSort = () => {
    setSorting([{ id: 'name', desc: false }]);
    setPage(1);
  };


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

  const isDefaultSort = sorting.length === 1 && sorting[0].id === 'name' && !sorting[0].desc;

  const hasActiveFilters =
    categoriesFilter.length > 0 ||
    tagsFilter.length > 0 ||
    stockFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    searchQuery !== '' ||
    !isDefaultSort;

  const handleResetFilters = () => {
    setCategoriesFilter([]);
    setTagsFilter([]);
    setStockFilter('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
    setSorting([{ id: 'name', desc: false }]);
    setPage(1);
  };

  const queryParams: ProductQueryParams = {
    search: searchQuery || undefined,
    categories: parsedCategories,
    tags: parsedTags,
    is_active: parsedStatus,
    with_stock: parsedStock,
    page,
    per_page: perPage,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  return {
    categoryOptions,
    tagOptions,
    tags,
    categories,
    searchQuery, setSearchQuery: handleSearchChange,

    
    // Ordenamiento
    sorting,
    setSorting,
    sortField: rawSortBy || 'name',
    sortOrder: sortOrder || 'asc',
    handleToggleSort,
    handleResetSort,

    categoriesFilter, setCategoriesFilter: handleCategoriesChange,
    tagsFilter, setTagsFilter: handleTagsFilterChange,
    stockFilter, setStockFilter: handleStockFilterChange,
    statusFilter, setStatusFilter: handleStatusFilterChange,
    page, setPage,
    perPage, setPerPage,

    hasActiveFilters,
    handleResetFilters,
    queryParams, 
    
  };
}