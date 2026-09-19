import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import { paymentMethodSchema, type PaymentMethodFormData } from '../schemas/payment-methods.schema';
import { 
  createPaymentMethodAction, 
  deletePaymentMethodAction, 
  getPaymentMethodsAction, 
  updatePaymentMethodAction,
  togglePaymentMethodStatusAction,
  bulkDestroyPaymentMethodsAction,
  bulkUpdateStatusPaymentMethodsAction,      
} from '../actions/payment.actions';
import { getPaymentTypesAction } from '../actions/payment-types.actions';
import type { ErrorResponse } from '@/interfaces/api.interface';
import type { PaymentMethod, PaymentMethodQueryParams } from '@/interfaces/payment-methods.interface';

const DEFAULT_FORM_VALUES: PaymentMethodFormData = {
  name: '',
  currency: 'VES',
  is_active: true,
  email: '',
  bank_name: '',
  payment_type_id: '',
  account_number: '',
  id_document: '',
  qr_code_url: '',
};

export function usePaymentMethods(filters: PaymentMethodQueryParams = {}) {
  const { t } = useTranslation(['settings', 'common']);
  const queryClient = useQueryClient();

  // --- 1. ESTADOS LOCALES ---
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  // Guardamos un fingerprint de los filtros para resetear la página en render si cambian
  const { search, currency, is_active, payment_type_id } = filters;
  const [prevFilters, setPrevFilters] = useState({ search, currency, is_active, payment_type_id });

  // Si los filtros cambiaron desde el último render, ajustamos el estado inmediatamente (sin useEffect)
  if (
    prevFilters.search !== search ||
    prevFilters.currency !== currency ||
    prevFilters.is_active !== is_active ||
    prevFilters.payment_type_id !== payment_type_id
  ) {
    setPrevFilters({ search, currency, is_active, payment_type_id });
    setPage(1);
    setBulkDeleteIds([]);
  }

  // Wrappers de estado para resetear selecciones al cambiar de página
  const handleSetPage = (newPage: number | ((prev: number) => number)) => {
    setPage(newPage);
    setBulkDeleteIds([]);
  };

  const handleSetPerPage = (newPerPage: number | ((prev: number) => number)) => {
    setPerPage(newPerPage);
    setPage(1);
    setBulkDeleteIds([]);
  };

  // Estado de Ordenamiento
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  // --- 2. FORMULARIO ---
  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const {formState: { isSubmitting, isDirty } } = form;


  // --- 3. QUERIES ---
  const { data: methodsResponse, isLoading: isLoadingMethods, isFetching } = useQuery({
    queryKey: ['payment-methods', { search, currency, is_active, payment_type_id, sortBy, sortOrder, page, perPage }],
    queryFn: () =>
      getPaymentMethodsAction({
        search,
        currency,
        is_active,
        payment_type_id,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
    placeholderData: keepPreviousData,
  });

  const { data: typesResponse } = useQuery({
    queryKey: ['payment-types'],
    queryFn: getPaymentTypesAction,
    staleTime: 1000 * 60 * 60,
  });

  const methods = methodsResponse?.data || [];
  const paymentTypes = typesResponse?.data || [];
  const totalRecords = methodsResponse?.meta?.total ?? 0;
  const pageCount = methodsResponse?.meta?.last_page ?? 1;

  // Ajuste síncrono de página si excede el límite tras borrados
  if (page > pageCount && pageCount > 0) {
    setPage(pageCount);
  }

  // --- 4. MUTACIONES ---
  const saveMutation = useMutation({
    mutationFn: (values: PaymentMethodFormData) => {
      if (editingMethod?.id) {
        return updatePaymentMethodAction(editingMethod.id, values);
      }
      return createPaymentMethodAction(values);
    },
    onSuccess: () => {
      toast.success(t('settings.payments.messages.saved_success', 'Método de pago guardado correctamente'));
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('settings.payments.messages.saved_error', 'Error al guardar'));
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => togglePaymentMethodStatusAction(id),
    onSuccess: () => {
      toast.success(t('settings.payments.messages.status_updated', 'Estado cambiado correctamente'));
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('settings.payments.messages.status_error', 'Error al cambiar el estado'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePaymentMethodAction(id),
    onSuccess: () => {
      toast.success(t('settings.payments.messages.deleted_success', 'Método de pago eliminado'));
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setDeletingId(null);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('settings.payments.messages.deleted_error', 'No se pudo eliminar'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroyPaymentMethodsAction(ids),
    onSuccess: () => {
      toast.success(t('settings.payments.messages.bulk_deleted_success', 'Registros eliminados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setBulkDeleteIds([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('settings.payments.messages.bulk_deleted_error', 'No se pudieron eliminar los registros'));
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, is_active }: { ids: string[]; is_active: boolean }) =>
      bulkUpdateStatusPaymentMethodsAction(ids, is_active),
    onSuccess: () => {
      toast.success(t('settings.payments.messages.bulk_status_success', 'Estados actualizados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setBulkDeleteIds([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('settings.payments.messages.bulk_status_error', 'No se pudieron actualizar los estados'));
    },
  });

  // --- 5. HANDLERS ---
  const openModal = (method?: PaymentMethod) => {
    if (method) {
      setEditingMethod(method);
      form.reset({
        name: method.name || '',
        currency: method.currency || 'VES',
        is_active: method.is_active ?? true,
        email: method.email || '',
        bank_name: method.bank_name || '',
        payment_type_id: method.payment_type_id || '',
        account_number: method.account_number || '',
        id_document: method.id_document || '',
        qr_code_url: method.qr_code_url || '',
      });
    } else {
      setEditingMethod(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMethod(null);
    form.reset(DEFAULT_FORM_VALUES);
  };

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const confirmBulkDelete = () => {
    if (bulkDeleteIds.length > 0) bulkDeleteMutation.mutate(bulkDeleteIds);
  };

  const handleBulkStatus = (ids: string[], is_active: boolean) => {
    bulkStatusMutation.mutate({ ids, is_active });
  };

  // --- 6. RETORNO ---
  return {
    methods,
    paymentTypes,
    isLoadingMethods,
    isFetchingMethods: isFetching,

    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending || isSubmitting,
    isDirty,
    isEditing: !!editingMethod,

    handleToggleStatus,
    isTogglingStatus: toggleStatusMutation.isPending,

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
    setPage: handleSetPage,
    perPage,
    setPerPage: handleSetPerPage,
    pageCount,
    totalRecords,
  };
}