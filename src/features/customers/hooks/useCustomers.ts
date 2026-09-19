import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import { customerSchema, type CustomerFormData } from '../schemas/customer.schema';
import {
  createCustomerAction,
  deleteCustomerAction,
  getCustomersAction,
  updateCustomerAction,
  toggleCustomerStatusAction,
  bulkDestroyCustomersAction,
  bulkUpdateStatusCustomersAction,
} from '../actions/customer.actions';
import type { ErrorResponse } from '@/interfaces/api.interface';
import type { Customer, CustomerQueryParams } from '@/interfaces/customer.interface';

const DEFAULT_FORM_VALUES: CustomerFormData = {
  name: '',
  type_document: 'V',
  id_document: '',
  phone: '',
  email: '',
  address: '',
  credit_limit_usd: 0,
  is_active: true,
  notes: '',
};

export function useCustomers(filters: CustomerQueryParams = {}) {
  const { t } = useTranslation(['customers', 'common']);
  const queryClient = useQueryClient();

  // --- 1. ESTADOS LOCALES ---
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  // Guardamos un fingerprint de los filtros para resetear la página si cambian
  const { search, is_active } = filters;
  const [prevFilters, setPrevFilters] = useState({ search, is_active });

  if (
    prevFilters.search !== search ||
    prevFilters.is_active !== is_active
  ) {
    setPrevFilters({ search, is_active });
    setPage(1);
    setBulkDeleteIds([]);
  }

  const handleSetPage = (newPage: number | ((prev: number) => number)) => {
    setPage(newPage);
    setBulkDeleteIds([]);
  };

  const handleSetPerPage = (newPerPage: number | ((prev: number) => number)) => {
    setPerPage(newPerPage);
    setPage(1);
    setBulkDeleteIds([]);
  };

  // Ordenamiento
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  // --- 2. FORMULARIO ---
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { formState: { isSubmitting, isDirty } } = form;

  // --- 3. QUERIES ---
  const { data: customersResponse, isLoading: isLoadingCustomers, isFetching } = useQuery({
    queryKey: ['customers', { search, is_active,  sortBy, sortOrder, page, perPage }],
    queryFn: () =>
      getCustomersAction({
        search,
        is_active,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
    placeholderData: keepPreviousData,
  });

  const customers = customersResponse?.data || [];
  const totalRecords = customersResponse?.meta?.total ?? 0;
  const pageCount = customersResponse?.meta?.last_page ?? 1;

  if (page > pageCount && pageCount > 0) {
    setPage(pageCount);
  }

  // --- 4. MUTACIONES ---
  const saveMutation = useMutation({
    mutationFn: (values: CustomerFormData) => {
      if (editingCustomer?.id) {
        return updateCustomerAction(editingCustomer.id, values);
      }
      return createCustomerAction(values);
    },
    onSuccess: () => {
      toast.success(t('customers.messages.saved_success', 'Cliente guardado correctamente'));
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('customers.messages.saved_error', 'Error al guardar el cliente'));
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => toggleCustomerStatusAction(id),
    onSuccess: () => {
      toast.success(t('customers.messages.status_updated', 'Estado actualizado correctamente'));
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('customers.messages.status_error', 'Error al cambiar el estado'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomerAction(id),
    onSuccess: () => {
      toast.success(t('customers.messages.deleted_success', 'Cliente eliminado'));
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setDeletingId(null);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('customers.messages.deleted_error', 'No se pudo eliminar el cliente'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroyCustomersAction(ids),
    onSuccess: () => {
      toast.success(t('customers.messages.bulk_deleted_success', 'Clientes eliminados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setBulkDeleteIds([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('customers.messages.bulk_deleted_error', 'Error al eliminar los clientes'));
    },
  });

  const bulkStatusMutation = useMutation({
    mutationFn: ({ ids, is_active }: { ids: string[]; is_active: boolean }) =>
      bulkUpdateStatusCustomersAction(ids, is_active),
    onSuccess: () => {
      toast.success(t('customers.messages.bulk_status_success', 'Estados actualizados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setBulkDeleteIds([]);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('customers.messages.bulk_status_error', 'Error al actualizar estados'));
    },
  });

  // --- 5. HANDLERS ---
  const openModal = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      form.reset({
        name: customer.name || '',
        type_document: customer.type_document || 'V',
        id_document: customer.id_document || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        credit_limit_usd: Number(customer.credit_limit_usd) || 0,
        is_active: customer.is_active ?? true,
        notes: customer.notes || '',
      });
    } else {
      setEditingCustomer(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
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
    customers,
    isLoadingCustomers,
    isFetchingCustomers: isFetching,

    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending || isSubmitting,
    isDirty,
    isEditing: !!editingCustomer,

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