import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import { supplierSchema, type SupplierFormData } from '../schemas/supplier.schema';
import {
  getSuppliersAction,
  createSupplierAction,
  updateSupplierAction,
  deleteSupplierAction,
  bulkDestroySuppliersAction,
  type GetSupplierFilters,
  bulkUpdateStatusSuppliersAction,
} from '../actions/supplier.actions';
import type { SupplierApiResponse } from '../interfaces/supplier.response';
import type { ErrorResponse } from '@/types';

const DEFAULT_FORM_VALUES: SupplierFormData = {
  name: '',
  tax_type: 'J',
  tax_id: '',
  contact_name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  notes: '',
  is_active: true,
};

export function useSuppliers(filters: GetSupplierFilters = {}) {
  const { t } = useTranslation(['suppliers', 'common']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<SupplierApiResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { data: suppliersResponse, isLoading: isLoadingSuppliers } = useQuery({
    queryKey: ['suppliers', filters.search, filters.is_active, sortBy, sortOrder, page, perPage],
    queryFn: () =>
      getSuppliersAction({
        ...filters,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const suppliers = suppliersResponse?.data || [];

  const saveMutation = useMutation({
    mutationFn: (values: SupplierFormData) => {
      if (editingSupplier?.id) {
        return updateSupplierAction(editingSupplier.id, values);
      }
      return createSupplierAction(values);
    },
    onSuccess: () => {
      toast.success(
        editingSupplier
          ? t('suppliers.messages.updated_success', 'Proveedor actualizado correctamente')
          : t('suppliers.messages.created_success', 'Proveedor creado correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('suppliers.messages.saved_error', 'Error al guardar el proveedor'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSupplierAction(id),
    onSuccess: () => {
      toast.success(t('suppliers.messages.deleted_success', 'Proveedor eliminado'));
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setDeletingId(null);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('suppliers.messages.deleted_error', 'No se pudo eliminar el proveedor'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroySuppliersAction(ids),
    onSuccess: () => {
      toast.success(t('suppliers.messages.bulk_deleted_success', 'Proveedores eliminados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setBulkDeleteIds([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('suppliers.messages.bulk_deleted_error', 'No se pudieron eliminar los proveedores'));
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, is_active }: { ids: string[]; is_active: boolean }) =>
      bulkUpdateStatusSuppliersAction(ids, is_active),
    onSuccess: () => {
      toast.success(t('suppliers.messages.bulk_status_success', 'Estados actualizados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: () => {
      toast.error(t('suppliers.messages.bulk_status_error', 'No se pudieron actualizar los estados'));
    },
  });

  const openModal = (supplier?: SupplierApiResponse) => {
    if (supplier) {
      setEditingSupplier(supplier);
      form.reset({
        name: supplier.name || '',
        tax_type: supplier.tax_type || 'J',
        tax_id: supplier.tax_id || '',
        contact_name: supplier.contact_name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        city: supplier.city || '',
        notes: supplier.notes || '',
        is_active: supplier.is_active ?? true,
      });
    } else {
      setEditingSupplier(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
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

  const totalRecords = suppliersResponse?.meta?.total ?? 0;
  const pageCount = suppliersResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  return {
    suppliers,
    isLoadingSuppliers,

    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending,
    isEditing: !!editingSupplier,

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