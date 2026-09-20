import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import {
  categorySchema,
  bulkUpdateCategoryRulesSchema,
  type CategoryFormData,
  type BulkUpdateCategoryRulesFormData,
} from '../schemas/category.schema';
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  bulkDestroyCategoriesAction,
  bulkUpdateValuesCategoryiesAction,
} from '../actions/category.actions';

import type { ErrorResponse } from '@/interfaces/api.interface';
import type { BulkUpdateCategoryRulesPayload, Category, CategoryQueryParams } from '@/interfaces/category.interface';

export type DistributionRuleMode = 'unchanged' | 'global' | 'custom' | null;

const DEFAULT_FORM_VALUES: CategoryFormData = {
  name: '',
  description: '',
  icon: '',
  profit_percentage: 40,
  reinvestment_percentage: 60,
  parent_id: null,
};

export function useCategories(filters: CategoryQueryParams = {}) {
  const { t } = useTranslation(['categories', 'common']);
  const queryClient = useQueryClient();

  // ==========================================
  // 1. ESTADO LOCAL (Paginación, Selección, Modales)
  // ==========================================
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [bulkEditRulesIds, setBulkEditRulesIds] = useState<string[]>([]);
  const [ruleMode, setRuleMode] = useState<DistributionRuleMode>('unchanged');

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  // ==========================================
  // 2. FORMULARIO PRINCIPAL (Creación / Edición)
  // ==========================================
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { formState: { isSubmitting, isDirty } } = form;

  // ==========================================
  // 3. FORMULARIO DE EDICIÓN MASIVA DE REGLAS
  // ==========================================
  const bulkRulesForm = useForm<BulkUpdateCategoryRulesFormData>({
    resolver: zodResolver(bulkUpdateCategoryRulesSchema),
    shouldUnregister: true,
    defaultValues: {
      parent_id: undefined,
      business_percentage: undefined,
      personal_percentage: undefined,
    },
  });

  const parentIdValue = bulkRulesForm.watch('parent_id');
  const businessFundPercent = bulkRulesForm.watch('business_percentage') ?? 60;
  const personalProfitPercent = bulkRulesForm.watch('personal_percentage') ?? 40;

  // Resetea el formulario masivo al abrir/cerrar el diálogo de edición masiva
  useEffect(() => {
    if (bulkEditRulesIds.length > 0) {
      bulkRulesForm.reset({
        parent_id: undefined,
        business_percentage: undefined,
        personal_percentage: undefined,
      });
      setRuleMode('unchanged');
    }
  }, [bulkEditRulesIds, bulkRulesForm]);

  // ==========================================
  // 4. TANSTACK QUERIES & MUTATIONS
  // ==========================================
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

  const bulkUpdateRulesMutation = useMutation({
    mutationFn: (payload: BulkUpdateCategoryRulesPayload) => bulkUpdateValuesCategoryiesAction(payload),
    onSuccess: () => {
      toast.success(t('categories.messages.bulk_rules_success', 'Categorías actualizadas exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setBulkEditRulesIds([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('categories.messages.bulk_rules_error', 'Error al actualizar las categorías'));
    },
  });

  // ==========================================
  // 5. HANDLERS Y LÓGICA DE NEGOCIO
  // ==========================================
  const openModal = (category?: Category) => {
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

  const handleRuleModeChange = (mode: DistributionRuleMode):DistributionRuleMode => {
    setRuleMode(mode);
    if (mode === 'unchanged') {
      bulkRulesForm.setValue('business_percentage', undefined, { shouldValidate: true, shouldDirty: true });
      bulkRulesForm.setValue('personal_percentage', undefined, { shouldValidate: true, shouldDirty: true });
    } else if (mode === 'global') {
      bulkRulesForm.setValue('business_percentage', null, { shouldValidate: true, shouldDirty: true });
      bulkRulesForm.setValue('personal_percentage', null, { shouldValidate: true, shouldDirty: true });
    } else if (mode === 'custom') {
      bulkRulesForm.setValue('business_percentage', 60, { shouldValidate: true, shouldDirty: true });
      bulkRulesForm.setValue('personal_percentage', 40, { shouldValidate: true, shouldDirty: true });
    }
    return mode;
  };

  const handleBulkRulesSubmit = bulkRulesForm.handleSubmit((data) => {
    if (bulkEditRulesIds.length === 0) return;

    const payload: BulkUpdateCategoryRulesPayload = {
      ids: bulkEditRulesIds,
    };

    if (data.parent_id !== undefined) {
      payload.parent_id = data.parent_id;
    }

    if (ruleMode === 'global') {
      payload.profit_percentage = null;
      payload.reinvestment_percentage = null;
    } else if (ruleMode === 'custom') {
      payload.reinvestment_percentage = data.business_percentage;
      payload.profit_percentage = data.personal_percentage;
    }

    bulkUpdateRulesMutation.mutate(payload);
  });

  const totalRecords = categoriesResponse?.meta?.total ?? 0;
  const pageCount = categoriesResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  // ==========================================
  // 6. RETORNO DE PROPIEDADES Y MÉTODOS
  // ==========================================
  return {
    // Datos
    categories,
    isLoadingCategories,

    // Formulario / Modal Principal
    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isEditing: !!editingCategory,
    isSaving: saveMutation.isPending || isSubmitting,
    isDirty,

    // Eliminación Individual
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting: deleteMutation.isPending,

    // Eliminación Masiva
    bulkDeleteIds,
    setBulkDeleteIds,
    confirmBulkDelete,
    isBulkDeleting: bulkDeleteMutation.isPending,

    // Edición Masiva de Reglas
    bulkEditRulesIds,
    setBulkEditRulesIds,
    bulkRulesForm,
    ruleMode,
    handleRuleModeChange,
    handleBulkRulesSubmit,
    parentIdValue,
    businessFundPercent,
    personalProfitPercent,
    isBulkUpdatingRules: bulkUpdateRulesMutation.isPending,

    // Tabla / Paginación / Orden
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