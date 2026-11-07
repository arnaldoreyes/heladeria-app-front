import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import {
  createSaleAction,
  deleteSaleAction,
  getSalesAction,
  updateSaleAction,
  voidSaleAction,
} from '../actions/sale-history.action';
import type { ErrorResponse } from '@/interfaces/api.interface';
import { saleSchema, type SaleFormData, type VoidSaleFormData } from '../schemas/sales.schema';
import type { Sale, SaleQueryParams } from '@/interfaces/sale.interfce';

const DEFAULT_FORM_VALUES: SaleFormData = {
  customer_id: null,
  sale_type: 'direct',
  exchange_rate: 1,
  change_loss_bs: 0,
  discount_bs: 0,
  items: [],
  payments: [],
};

export function useSalesHistory(filters: SaleQueryParams = {}) {
  const { t } = useTranslation(['sales', 'common']);
  const queryClient = useQueryClient();

  // Estados de Paginación y Modales
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [voidingSale, setVoidingSale] = useState<Sale | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { search, customer_id, status, payment_status, date_from, date_to } = filters;

  // Resetear paginación al cambiar los filtros de búsqueda
  useEffect(() => {
    setPage(1);
  }, [search, customer_id, status, payment_status, date_from, date_to]);

  const handleSetPage = (newPage: number | ((prev: number) => number)) => {
    setPage(newPage);
  };

  const handleSetPerPage = (newPerPage: number | ((prev: number) => number)) => {
    setPerPage(newPerPage);
    setPage(1);
  };

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { formState: { isSubmitting, isDirty } } = form;

  // Query Principal: Historial de Ventas
  const { data: salesResponse, isLoading: isLoadingSales, isFetching } = useQuery({
    queryKey: [
      'sales',
      search,
      customer_id,
      status,
      payment_status,
      date_from,
      date_to,
      sortBy,
      sortOrder,
      page,
      perPage,
    ],
    queryFn: () =>
      getSalesAction({
        ...filters,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const sales = salesResponse?.data || [];
  const totalRecords = salesResponse?.meta?.total ?? 0;
  const pageCount = salesResponse?.meta?.last_page ?? 1;

  // Ajustar la página actual si excede el límite máximo de páginas disponibles
  useEffect(() => {
    if (page > pageCount && pageCount > 0) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  // Mutación: Guardar / Editar Venta
  const saveMutation = useMutation({
    mutationFn: (values: SaleFormData) => {
      if (editingSale?.id) {
        return updateSaleAction(editingSale.id, values);
      }
      return createSaleAction(values);
    },
    onSuccess: () => {
      toast.success(t('sales.messages.saved_success', 'Venta guardada correctamente'));
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('sales.messages.saved_error', 'Error al guardar'));
    },
  });

  // Mutación: Anular Venta
  const voidSaleMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: VoidSaleFormData }) => voidSaleAction(id, payload),
    onSuccess: () => {
      toast.success(t('sales.messages.voided_success', 'Venta anulada correctamente'));
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setVoidingSale(null);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('sales.messages.voided_error', 'No se pudo anular la venta'));
    },
  });

  // Mutación: Eliminar Registro de Venta
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSaleAction(id),
    onSuccess: () => {
      toast.success(t('sales.messages.deleted_success', 'Venta eliminada'));
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setDeletingId(null);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('sales.messages.deleted_error', 'No se pudo eliminar'));
    },
  });

  const confirmVoidSale = (reason?: string) => {
    if (voidingSale) {
      voidSaleMutation.mutate({
        id: voidingSale.id,
        payload: reason ? { reason } : undefined,
      });
    }
  };

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const openModal = (sale?: Sale) => {
    if (sale) {
      setEditingSale(sale);
      form.reset({
        customer_id: sale.customer_id || null,
        sale_type: (sale.sale_type as 'direct' | 'credit' | 'quote') || 'direct',
        exchange_rate: Number(sale.exchange_rate) || 1,
        change_loss_bs: Number(sale.change_loss_bs) || 0,
        discount_bs: Number(sale.discount_bs) || 0,
        items: sale.items?.map((item) => ({
          product_id: item.product_id,
          product_name_snapshot: item.product_name_snapshot,
          quantity: Number(item.quantity),
          unit_price_usd: Number(item.unit_price_usd),
          unit_price_bs: Number(item.unit_price_bs),
        })) || [],
        payments: sale.payments?.map((payment) => ({
          payment_method_id: payment.payment_method_id,
          amount_original: Number(payment.amount_original),
          currency: payment.currency as 'USD' | 'BS',
          amount_usd: Number(payment.amount_usd),
          exchange_rate: Number(payment.exchange_rate),
          reference: payment.reference || null,
          notes: payment.notes || null,
        })) || [],
      });
    } else {
      setEditingSale(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSale(null);
    form.reset(DEFAULT_FORM_VALUES);
  };

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  return {
    sales,
    isLoadingSales,
    isFetchingSales: isFetching,

    // Modal Crear / Editar
    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending || isSubmitting,
    isDirty,
    isEditing: !!editingSale,

    // Anulación de Venta
    voidingSale,
    setVoidingSale,
    confirmVoidSale,
    isVoiding: voidSaleMutation.isPending,

    // Eliminación
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting: deleteMutation.isPending,

    // Tabla & Paginación
    sorting,
    setSorting,
    page,
    setPage: handleSetPage,
    perPage,
    setPerPage: handleSetPerPage,
    pageCount,
    totalRecords,
  };
}