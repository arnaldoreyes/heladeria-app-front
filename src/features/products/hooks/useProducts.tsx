import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';
import { productSchema, type ProductFormData } from '../schemas/product.schema';
import type { ErrorResponse } from '@/interfaces/api.interface';
import { 
  bulkDestroyProductsAction,
  bulkUpdateStatusProductsAction,
  bulkUpdateValuesProductsAction,
  createProductAction,
  deleteProductAction,
  getProductsAction,
  toggleProductStatusAction,
  updateProductAction,
} from '../actions/product.action';
import type { Product, ProductBulkUpdateValuesPayload, ProductQueryParams } from '@/interfaces/product.interface';

const DEFAULT_FORM_VALUES: ProductFormData = {
  sku: '',
  name: '',
  category_id: null,
  price_usd: 0,
  cost_usd: null,
  stock: 0,
  min_stock_alert: 0,
  image: '',
  is_active: true,
};

export function useProducts(initialFilters: ProductQueryParams = {}) {
  const { t } = useTranslation(['products', 'common']);
  const queryClient = useQueryClient();

  // --- ESTADOS DE FILTROS LOCALES ---
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialFilters.category_id ? String(initialFilters.category_id) : 'ALL'
  );
  const [stockFilter, setStockFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // --- PAGINACIÓN ---
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(12);

  // --- ORDENAMIENTO (TanStack Table Compatible) ---
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  // --- ESTADOS DE ACCIONES Y MODALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [bulkEditIds, setBulkEditIds] = useState<string[]>([]);

  // --- NORMALIZACIÓN DE PARÁMETROS PARA BACKEND ---
  const rawSortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortBy = rawSortBy === 'cost' ? 'unit_cost_usd' : rawSortBy;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  const parsedCategoryId = selectedCategory !== 'ALL' ? selectedCategory : undefined;
  const parsedIsActive =
    statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;
  const parsedWithStock =
    stockFilter === 'true' || stockFilter === 'in_stock'
      ? true
      : stockFilter === 'false' || stockFilter === 'out_of_stock'
      ? false
      : undefined;

  // --- FORMULARIO DE PRODUCTO ---
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { formState: { isSubmitting, isDirty } } = form;

  // --- QUERIES SERVER-SIDE ---
  const { data: productsResponse, isLoading: isLoadingProducts, isFetching } = useQuery({
    queryKey: [
      'products',
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
        ...initialFilters,
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

  const products = productsResponse?.data || [];
  const totalRecords = productsResponse?.meta?.total ?? 0;
  const totalPages =
    productsResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  // --- MUTACIONES ---
  const saveMutation = useMutation({
    mutationFn: (values: ProductFormData) => {
      if (editingProduct?.id) {
        return updateProductAction(editingProduct.id, values);
      }
      return createProductAction(values);
    },
    onSuccess: () => {
      toast.success(
        editingProduct
          ? t('products.messages.updated_success', 'Producto actualizado correctamente')
          : t('products.messages.created_success', 'Producto creado correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['products'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('products.messages.saved_error', 'Error al guardar el producto'));
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => toggleProductStatusAction(id),
    onSuccess: () => {
      toast.success(t('products.messages.status_updated', 'Estado cambiado correctamente'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('products.messages.status_error', 'Error al cambiar el estado'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductAction(id),
    onSuccess: () => {
      toast.success(t('products.messages.deleted_success', 'Producto eliminado'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeletingId(null);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('products.messages.deleted_error', 'No se pudo eliminar el producto'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroyProductsAction(ids),
    onSuccess: () => {
      toast.success(t('products.messages.bulk_deleted_success', 'Productos eliminados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setBulkDeleteIds([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('products.messages.bulk_deleted_error', 'No se pudieron eliminar los productos'));
    },
  });

  const bulkUpdateValuesMutation = useMutation({
    mutationFn: (payload: ProductBulkUpdateValuesPayload) => bulkUpdateValuesProductsAction(payload),
    onSuccess: () => {
      toast.success(t('products.messages.bulk_values_success', 'Valores actualizados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setBulkEditIds([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('products.messages.bulk_values_error', 'No se pudieron actualizar los valores'));
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, is_active }: { ids: string[]; is_active: boolean }) =>
      bulkUpdateStatusProductsAction(ids, is_active),
    onSuccess: () => {
      toast.success(t('products.messages.bulk_status_success', 'Estados actualizados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('products.messages.bulk_status_error', 'No se pudieron actualizar los estados'));
    },
  });

  // --- HANDLERS DE FILTROS CON RESETEO DE PAGINACIÓN ---
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleStockFilterChange = (filter: string | null) => {
    if (!filter) return;
    setStockFilter(filter);
    setPage(1);
  };

  const handleStatusFilterChange = (filter: string | null) => {
    if (!filter) return;
    setStatusFilter(filter);
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

  // --- HANDLERS DE MODALES Y ACCIONES ---
  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      form.reset({
        sku: product.sku || '',
        name: product.name || '',
        category_id: product.category_id || null,
        price_usd: product.price_usd ?? 0,
        cost_usd: product.cost_usd ?? null,
        stock: product.stock ?? 0,
        min_stock_alert: product.min_stock_alert ?? 0,
        image: product.image || '',
        is_active: product.is_active ?? true,
      });
    } else {
      setEditingProduct(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    form.reset(DEFAULT_FORM_VALUES);
  };

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const confirmBulkDelete = () => {
    if (bulkDeleteIds.length > 0) bulkDeleteMutation.mutate(bulkDeleteIds);
  };

  const handleBulkStatus = (ids: string[], is_active: boolean) => {
    bulkStatusMutation.mutate({ ids, is_active });
  };

  const handleBulkUpdateValues = (values: Omit<ProductBulkUpdateValuesPayload, 'ids'>) => {
    if (bulkEditIds.length > 0) {
      bulkUpdateValuesMutation.mutate({ ids: bulkEditIds, ...values });
    }
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  return {
    // Datos
    products,
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

    // Ordenamiento
    sorting,
    setSorting,
    sortField: rawSortBy || 'name',
    sortOrder: sortOrder || 'asc',
    handleToggleSort,
    handleResetSort,

    // Paginación
    page,
    setPage,
    perPage,
    setPerPage,
    totalPages,
    totalRecords,

    // Modal y Formulario
    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending || isSubmitting,
    isDirty,
    isEditing: !!editingProduct,

    // Acciones de eliminación
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting: deleteMutation.isPending,

    // Acciones masivas
    bulkDeleteIds,
    setBulkDeleteIds,
    confirmBulkDelete,
    isBulkDeleting: bulkDeleteMutation.isPending,
    handleBulkStatus,

    bulkEditIds,
    setBulkEditIds,
    handleBulkUpdateValues,
    isBulkUpdatingValues: bulkUpdateValuesMutation.isPending,

    // Cambio de estado individual
    handleToggleStatus,
    isTogglingStatus: toggleStatusMutation.isPending,
  };
}