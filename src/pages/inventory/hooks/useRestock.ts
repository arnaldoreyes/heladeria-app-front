import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import { restockSchema, type RestockFormData } from '../schemas/restock.schema';
import {
  createRestockAction,
  updateRestockAction,
  deleteRestockAction,
  type GetRestockFilters,
  getRestocksAction,
} from '../actions/restock.action';
import type { RestockApiResponse } from '../interfaces/restock.response';
import type { ErrorResponse } from '@/types';

const DEFAULT_FORM_VALUES: RestockFormData = {
  invoice_number: '',
  status: 'completed',
  exchange_rate: 1,
  exchange_rate_date: new Date().toISOString(),
  purchased_at: new Date().toISOString().slice(0, 10),
  notes: '',
  items: [],
  total_usd: 0,
  total_bs: 0,
};

export function useRestocks(filters: GetRestockFilters = {}) {
  const { t } = useTranslation(['restocks', 'common']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRestock, setEditingRestock] = useState<RestockApiResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'purchased_at', desc: true },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  const form = useForm<RestockFormData>({
    resolver: zodResolver(restockSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { data: restocksResponse, isLoading: isLoadingRestocks } = useQuery({
    queryKey: [
      'restocks',
      filters.search,
      filters.supplier_name,
      filters.status,
      filters.start_date,
      filters.end_date,
      sortBy,
      sortOrder,
      page,
      perPage,
    ],
    queryFn: () =>
      getRestocksAction({
        ...filters,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const restocks = restocksResponse?.data || [];

  const saveMutation = useMutation({
    mutationFn: (values: RestockFormData) => {
      if (editingRestock?.id) {
        return updateRestockAction(editingRestock.id, values);
      }
      return createRestockAction(values);
    },
    onSuccess: () => {
      toast.success(
        editingRestock
          ? t('restocks.messages.updated_success', 'Reabastecimiento actualizado correctamente')
          : t('restocks.messages.created_success', 'Reabastecimiento registrado correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['restocks'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('restocks.messages.saved_error', 'Error al guardar el reabastecimiento'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRestockAction(id),
    onSuccess: () => {
      toast.success(t('restocks.messages.deleted_success', 'Registro de compra eliminado'));
      queryClient.invalidateQueries({ queryKey: ['restocks'] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t('restocks.messages.deleted_error', 'No se pudo eliminar el registro'));
    },
  });

  const openModal = (restock?: RestockApiResponse) => {
    if (restock) {
      setEditingRestock(restock);
      form.reset({
        invoice_number: restock.invoice_number || '',
        status: restock.status || 'completed',
        exchange_rate: Number(restock.exchange_rate) || 1,
        exchange_rate_date: restock.exchange_rate_date || new Date().toISOString(),
        purchased_at: restock.purchased_at ? new Date(restock.purchased_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        notes: restock.notes || '',
        total_usd: Number(restock.total_usd) || 0,
        total_bs: Number(restock.total_bs) || 0,
        items: restock.items?.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          product_name_snapshot: item.product_name_snapshot,
          quantity: Number(item.quantity),
          unit_cost_usd: Number(item.unit_cost_usd),
          unit_cost_bs: Number(item.unit_cost_bs),
          subtotal_usd: Number(item.subtotal_usd),
          subtotal_bs: Number(item.subtotal_bs),
        })) || [],
      });
    } else {
      setEditingRestock(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRestock(null);
  };

  const handleSubmitMode = (mode: 'draft' | 'completed' = 'completed') =>
  form.handleSubmit(
    (values) => {
      const isQuote = mode === 'draft';
      const payload: RestockFormData = {
        ...values,
        status: isQuote ? 'draft' : 'completed',
      };

      saveMutation.mutate(payload);
    },
    (errors) => {
      console.error('Errores de validación en el formulario:', errors);
      toast.error(t('common.errors.form_validation', 'Por favor verifica los campos obligatorios.'));
    }
  );

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const totalRecords = restocksResponse?.meta?.total ?? 0;
  const pageCount = restocksResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  return {
    restocks,
    isLoadingRestocks,
    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit: handleSubmitMode,
    isSaving: saveMutation.isPending,
    isEditing: !!editingRestock,
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
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