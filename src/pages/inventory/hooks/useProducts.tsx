import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import { productSchema, type ProductFormData } from '../schemas/product.schema';

import { getCategoriesAction } from '../actions/category.actions';
import type { ProductApiResponse } from '../interfaces/product.response';
import type { ErrorResponse } from '@/types';
import { 
  bulkDestroyProductsAction,
  bulkUpdateStatusProductsAction,
  createProductAction,
  deleteProductAction,
  getProductsAction,
  updateProductAction,
  type GetProductFilters,
   } from '../actions/product.action';

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

export function useProducts(filters: GetProductFilters = {}) {
  const { t } = useTranslation(['products', 'common']);
  const queryClient = useQueryClient();

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductApiResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', filters.search, filters.category_id, filters.is_active, filters.low_stock, sortBy, sortOrder, page, perPage],
    queryFn: () =>
      getProductsAction({
        ...filters,
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

  const products = productsResponse?.data || [];
  const categories = categoriesResponse?.data || [];

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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProductAction(id),
    onSuccess: () => {
      toast.success(t('products.messages.deleted_success', 'Producto eliminado'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t('products.messages.deleted_error', 'No se pudo eliminar el producto'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroyProductsAction(ids),
    onSuccess: () => {
      toast.success(t('products.messages.bulk_deleted_success', 'Productos eliminados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setBulkDeleteIds([]);
    },
    onError: () => {
      toast.error(t('products.messages.bulk_deleted_error', 'No se pudieron eliminar los productos'));
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, is_active }: { ids: string[]; is_active: boolean }) =>
      bulkUpdateStatusProductsAction(ids, is_active),
    onSuccess: () => {
      toast.success(t('products.messages.bulk_status_success', 'Estados actualizados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: () => {
      toast.error(t('products.messages.bulk_status_error', 'No se pudieron actualizar los estados'));
    },
  });

  const openModal = (product?: ProductApiResponse) => {
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

  const totalRecords = productsResponse?.meta?.total  ?? 0;
  const pageCount = productsResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  return {
    products,
    categories,
    isLoadingProducts,

    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending,
    isEditing: !!editingProduct,

    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting: deleteMutation.isPending,

    bulkDeleteIds,
    setBulkDeleteIds,
    confirmBulkDelete,
    isBulkDeleting: bulkDeleteMutation.isPending,
    handleBulkStatus,

    sorting,
    setSorting,

    page,
    setPage,
    perPage,
    setPerPage,
    pageCount,
    totalRecords,
  };
}