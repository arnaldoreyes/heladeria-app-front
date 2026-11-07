import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import {
  tagSchema,
  type TagFormData,
} from '../schemas/tag.schema';

import {
  getTagsAction,
  createTagAction,
  updateTagAction,
  deleteTagAction,
  bulkDestroyTagsAction,
  bulkUpdateStatusTagsAction,
  toggleTagStatusAction,
} from '../actions/tag.actions';

import type { ErrorResponse } from '@/interfaces/api.interface';
import type { Tag, TagQueryParams } from '@/interfaces/tag.interface';

export type DistributionRuleMode = 'unchanged' | 'global' | 'custom' | null;

const DEFAULT_FORM_VALUES: TagFormData = {
  name: '',
  color: '',
  is_active: true,
  slug: '',
};

export function useTags(filters: TagQueryParams = {}) {
  const { t } = useTranslation(['tags', 'common']);
  const queryClient = useQueryClient();

  // ==========================================
  // 1. ESTADO LOCAL (Paginación, Selección, Modales)
  // ==========================================
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;
  const parsedIsActive = statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined;

  // ==========================================
  // 2. FORMULARIO PRINCIPAL (Creación / Edición)
  // ==========================================
  const form = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { formState: { isSubmitting, isDirty } } = form;

  // ==========================================
  // 4. TANSTACK QUERIES & MUTATIONS
  // ==========================================
  const { data: TagResponse, isLoading: isLoadingTags } = useQuery({
    queryKey: ['tags', filters.search,  parsedIsActive, sortBy, sortOrder, page, perPage],
    queryFn: () =>
      getTagsAction({
        ...filters,
        page,
         is_active: parsedIsActive,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const tags = TagResponse?.data || [];

  const saveMutation = useMutation({
    mutationFn: (values: TagFormData) => {
      if (editingTag?.id) {
        return updateTagAction(editingTag.id, values);
      }
      return createTagAction(values);
    },
    onSuccess: () => {
      toast.success(
        editingTag
          ? t('tags.messages.updated_success', 'Categoría actualizada correctamente')
          : t('tags.messages.created_success', 'Categoría creada correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('tags.messages.saved_error', 'Error al guardar la categoría'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTagAction(id),
    onSuccess: () => {
      toast.success(t('tags.messages.deleted_success', 'Categoría eliminada'));
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t('tags.messages.deleted_error', 'No se pudo eliminar la categoría'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroyTagsAction(ids),
    onSuccess: () => {
      toast.success(t('tags.messages.bulk_deleted_success', 'Categorías eliminadas exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setBulkDeleteIds([]);
    },
    onError: () => {
      toast.error(t('tags.messages.bulk_deleted_error', 'No se pudieron eliminar las categorías'));
    },
  });

  const bulkStatusMutation = useMutation({
     mutationFn: ({ ids, is_active }: { ids: string[]; is_active: boolean }) =>
       bulkUpdateStatusTagsAction(ids, is_active),
     onSuccess: () => {
       toast.success(t('tags.messages.bulk_status_success', 'Estados actualizados exitosamente'));
       queryClient.invalidateQueries({ queryKey: ['tags'] });
     },
     onError: (error: ErrorResponse) => {
       toast.error(error?.message || t('tags.messages.bulk_status_error', 'No se pudieron actualizar los estados'));
     },
   });

   
     const toggleStatusMutation = useMutation({
       mutationFn: (id: string) => toggleTagStatusAction(id),
       onSuccess: () => {
         toast.success(t('tags.messages.status_updated', 'Estado cambiado correctamente'));
         queryClient.invalidateQueries({ queryKey: ['tags'] });
       },
       onError: (error: ErrorResponse) => {
         toast.error(error?.message || t('tags.messages.status_error', 'Error al cambiar el estado'));
       },
     });
   

  // ==========================================
  // 5. HANDLERS Y LÓGICA DE NEGOCIO
  // ==========================================
  const openModal = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      form.reset({
        name: tag.name || '',
        color: tag.color || '',
        is_active: tag.is_active ?? true,
        slug: tag.slug || '',
      });
    } else {
      setEditingTag(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTag(null);
  };

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const confirmBulkDelete = () => {
    if (bulkDeleteIds.length > 0) bulkDeleteMutation.mutate(bulkDeleteIds);
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

  
  const handleBulkStatus = (ids: string[], is_active: boolean) => {
    bulkStatusMutation.mutate({ ids, is_active });
  };


   const hasActiveFilters =  statusFilter !== 'ALL' ;

  const handleResetFilters = () => {    
    setStatusFilter('ALL');
    setSorting([{ id: 'name', desc: false }]);
    setPage(1);
  };

  const handleResetSort = () => {
    setSorting([{ id: 'name', desc: false }]);
    setPage(1);
  };

  
  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const totalRecords = TagResponse?.meta?.total ?? 0;
  const pageCount = TagResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  // ==========================================
  // 6. RETORNO DE PROPIEDADES Y MÉTODOS
  // ==========================================
  return {
    // Datos
    tags,
    isLoadingTags,

    // Formulario / Modal Principal
    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isEditing: !!editingTag,
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

    // Manejo de Filtros y Ordenamiento
    handleStatusFilterChange,
    handleToggleSort,
    handleBulkStatus,
    hasActiveFilters,
    handleResetFilters,
    handleResetSort,
    handleToggleStatus,

    // Tabla / Paginación / Orden
    sorting,
    setSorting,
    page,
    setPage,
    perPage,
    setPerPage,
    pageCount,
    totalRecords,
    statusFilter,
    setStatusFilter,
  };
}