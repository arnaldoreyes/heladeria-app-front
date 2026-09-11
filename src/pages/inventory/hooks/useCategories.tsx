import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import { categorySchema, type CategoryFormData } from '../schemas/category.schema';
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  bulkDestroyCategoriesAction,
  type GetCategoryFilters,
} from '../actions/category.actions';
import type { CategoryApiResponse } from '../interfaces/category.response';
import type { ErrorResponse } from '@/types';

const DEFAULT_FORM_VALUES: CategoryFormData = {
  name: '',
  description: '',
  icon: '',
  profit_percentage: 40,
  reinvestment_percentage: 60,
  parent_id: null,
};

export function useCategories(filters: GetCategoryFilters = {}) {
  const { t } = useTranslation(['categories', 'common']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryApiResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories', filters.search, filters.parent_id, sortBy, sortOrder, page, perPage],
    queryFn: () =>
      getCategoriesAction({
        ...filters,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const categories = categoriesResponse?.data || [];

  const saveMutation = useMutation({
    mutationFn: (values: CategoryFormData) => {
      if (editingCategory?.id) {
        return updateCategoryAction(editingCategory.id, values);
      }
      return createCategoryAction(values);
    },
    onSuccess: () => {
      toast.success(
        editingCategory
          ? t('categories.messages.updated_success', 'Categoría actualizada correctamente')
          : t('categories.messages.created_success', 'Categoría creada correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('categories.messages.saved_error', 'Error al guardar la categoría'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCategoryAction(id),
    onSuccess: () => {
      toast.success(t('categories.messages.deleted_success', 'Categoría eliminada'));
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t('categories.messages.deleted_error', 'No se pudo eliminar la categoría'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroyCategoriesAction(ids),
    onSuccess: () => {
      toast.success(t('categories.messages.bulk_deleted_success', 'Categorías eliminadas exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setBulkDeleteIds([]);
    },
    onError: () => {
      toast.error(t('categories.messages.bulk_deleted_error', 'No se pudieron eliminar las categorías'));
    },
  });


  const openModal = (category?: CategoryApiResponse) => {
    if (category) {
      setEditingCategory(category);
      form.reset({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '',
        profit_percentage: category.profit_percentage ?? null,
        reinvestment_percentage: category.reinvestment_percentage ?? null,
        parent_id: category.parent_id || null,
      });
    } else {
      setEditingCategory(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const confirmBulkDelete = () => {
    if (bulkDeleteIds.length > 0) bulkDeleteMutation.mutate(bulkDeleteIds);
  };

  const totalRecords = categoriesResponse?.meta?.total ?? 0;
  const pageCount = categoriesResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  return {
    categories,
    isLoadingCategories,

    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending,
    isEditing: !!editingCategory,

    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting: deleteMutation.isPending,

    bulkDeleteIds,
    setBulkDeleteIds,
    confirmBulkDelete,
    isBulkDeleting: bulkDeleteMutation.isPending,

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