import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import { paymentMethodSchema, type PaymentMethodFormData } from '../schemas/settings.schema';
import { 
  createPaymentMethodAction, 
  deletePaymentMethodAction, 
  getPaymentMethodsAction, 
  updatePaymentMethodAction,
  bulkDestroyPaymentMethodsAction,
  bulkUpdateStatusPaymentMethodsAction,      
} from '../actions/payment.actions';
import { getPaymentTypesAction } from '../actions/payment-types.actions';
import type { ErrorResponse } from '@/types';

interface FilterParams {
  search?: string;
  currency?: string;
}

const DEFAULT_FORM_VALUES: PaymentMethodFormData = {
  name: '',
  currency: 'VES',
  is_active: true,
  email: '',
  bank_name: '',
  payment_type_id: '',
  account_number: '',
  id_document: '',
};

export function usePaymentMethods(filters: FilterParams = {}) {
  const { t } = useTranslation(['settings', 'common']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);

  // --- 1. ESTADOS LOCALES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethodFormData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  // Estado de Ordenamiento (TanStack Table)
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  // --- 2. FORMULARIO (React Hook Form + Zod) ---
  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  // --- 3. QUERIES (Lectura de datos) ---
  const { data: methodsResponse, isLoading: isLoadingMethods } = useQuery({
    queryKey: ['payment-methods', filters.search, filters.currency, sortBy, sortOrder, page, perPage],
    queryFn: () =>
      getPaymentMethodsAction({
        ...filters,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const { data: typesResponse } = useQuery({
    queryKey: ['payment-types'],
    queryFn: getPaymentTypesAction,
  });

  const methods = methodsResponse?.data || [];
  const paymentTypes = typesResponse?.data || [];

  // --- 4. MUTACIONES (Escritura de datos) ---
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

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePaymentMethodAction(id),
    onSuccess: () => {
      toast.success(t('settings.payments.messages.deleted_success', 'Método de pago eliminado'));
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t('settings.payments.messages.deleted_error', 'No se pudo eliminar'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroyPaymentMethodsAction(ids),
    onSuccess: () => {
      toast.success(t('settings.payments.messages.bulk_deleted_success', 'Registros eliminados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
      setBulkDeleteIds([]);
    },
    onError: () => {
      toast.error(t('settings.payments.messages.bulk_deleted_error', 'No se pudieron eliminar los registros'));
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, is_active }: { ids: string[]; is_active: boolean }) =>
      bulkUpdateStatusPaymentMethodsAction(ids, is_active),
    onSuccess: () => {
      toast.success(t('settings.payments.messages.bulk_status_success', 'Estados actualizados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
    onError: () => {
      toast.error(t('settings.payments.messages.bulk_status_error', 'No se pudieron actualizar los estados'));
    },
  });

  // --- 5. HANDLERS Y CONTROLADORES ---
  const openModal = (method?: PaymentMethodFormData) => {
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

  
  const totalRecords = methodsResponse?.meta?.total ?? 0;
  const pageCount = methodsResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  // --- 6. RETORNO ---
  return {
    // Datos de la API
    methods,
    paymentTypes,
    isLoadingMethods,

    // Modal y Formulario
    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending,
    isEditing: !!editingMethod,

    // Eliminación Individual
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting: deleteMutation.isPending,

    // Operaciones Masivas (Bulk)
    bulkDeleteIds,
    setBulkDeleteIds,
    confirmBulkDelete,
    isBulkDeleting: bulkDeleteMutation.isPending,
    handleBulkStatus,

    // Estado de Ordenamiento
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