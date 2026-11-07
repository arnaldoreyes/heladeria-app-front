import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
import { useProductFilters } from './useProductFiltersOptions';

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
  tags: [],
};

export function useProducts(initialFilters: ProductQueryParams = {}) {
  const { t } = useTranslation(['products', 'common']);
  const queryClient = useQueryClient();

  // 1. Consumimos toda la lógica de filtrado, paginación y ordenamiento
  const filters = useProductFilters(initialFilters);

  // 2. Estados locales exclusivos de modales y acciones de productos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [bulkEditIds, setBulkEditIds] = useState<string[]>([]);
  const [isFetchingForCopy] = useState(false);

  // 3. Formulario de producto (React Hook Form)
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { formState: { isSubmitting, isDirty } } = form;

  // 4. Queries Server-Side usando los parámetros centralizados del hook de filtros
  const { data: productsResponse, isLoading: isLoadingProducts, isFetching } = useQuery({
    queryKey: ['products', filters.queryParams],
    queryFn: () => getProductsAction(filters.queryParams),
  });

  // 5. Función para obtener productos para el diálogo o exportación
  const fetchCategoryProducts = async () => {
    const response = await getProductsAction({
      categories: filters.queryParams.categories,
      tags: filters.queryParams.tags,
      is_active: 'true',
      with_stock: 'true',
      sort_by: 'price_usd',
      per_page: -1, 
    });
    return response?.data || [];
  };

  const products = productsResponse?.data || [];
  const totalRecords = productsResponse?.meta?.total ?? 0;
  const totalPages =
    productsResponse?.meta?.last_page ?? Math.ceil(totalRecords / filters.perPage) ?? 1;

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
        tags: product.tags ? product.tags.map(t => t.id) : [],
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
    // Datos de la query
    products,
    isLoadingProducts,
    isFetching,

    // Exponemos todas las propiedades y métodos del hook de filtros directamente
    ...filters,

    // Copiar catálogo a WhatsApp
    handleCopyWhatsAppCatalog: async () => {},
    isFetchingForCopy,
    fetchCategoryProducts,

    // Paginación calculada
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

    // Acciones de eliminación e individuales
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    handleToggleStatus,
    isTogglingStatus: toggleStatusMutation.isPending,

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
  };
}