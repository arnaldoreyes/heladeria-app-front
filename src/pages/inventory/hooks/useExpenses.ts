import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { SortingState } from '@tanstack/react-table';

import { expenseSchema, type ExpenseFormData } from '../schemas/expense.schema';
import {
  getExpensesAction,
  createExpenseAction,
  updateExpenseAction,
  deleteExpenseAction,
  bulkDestroyExpensesAction,
  type GetExpenseFilters,
} from '../actions/expense.actions';
import type { ExpenseApiResponse } from '../interfaces/expense.response';
import type { ErrorResponse } from '@/types';

const DEFAULT_FORM_VALUES: ExpenseFormData = {
  concept: '',
  category: 'general',
  amount_usd: 0,
  amount_bs: 0,
  exchange_rate: 1,
  payment_method: 'cash_usd',
  expense_date: new Date().toISOString().split('T')[0],
  notes: '',
};

export function useExpenses(filters: GetExpenseFilters = {}) {
  const { t } = useTranslation(['expenses', 'common']);
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseApiResponse | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'expense_date', desc: true },
  ]);

  const sortBy = sorting.length > 0 ? sorting[0].id : undefined;
  const sortOrder = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined;

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { data: expensesResponse, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', filters.search, filters.category, filters.payment_method, filters.start_date, filters.end_date, sortBy, sortOrder, page, perPage],
    queryFn: () =>
      getExpensesAction({
        ...filters,
        page,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
      }),
  });

  const expenses = expensesResponse?.data || [];

  const saveMutation = useMutation({
    mutationFn: (values: ExpenseFormData) => {
      if (editingExpense?.id) {
        return updateExpenseAction(editingExpense.id, values);
      }
      return createExpenseAction(values);
    },
    onSuccess: () => {
      toast.success(
        editingExpense
          ? t('expenses.messages.updated_success', 'Gasto actualizado correctamente')
          : t('expenses.messages.created_success', 'Gasto registrado correctamente')
      );
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      closeModal();
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('expenses.messages.saved_error', 'Error al guardar el gasto'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExpenseAction(id),
    onSuccess: () => {
      toast.success(t('expenses.messages.deleted_success', 'Gasto eliminado'));
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setDeletingId(null);
    },
    onError: () => {
      toast.error(t('expenses.messages.deleted_error', 'No se pudo eliminar el gasto'));
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => bulkDestroyExpensesAction(ids),
    onSuccess: () => {
      toast.success(t('expenses.messages.bulk_deleted_success', 'Gastos eliminados exitosamente'));
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setBulkDeleteIds([]);
    },
    onError: () => {
      toast.error(t('expenses.messages.bulk_deleted_error', 'No se pudieron eliminar los gastos'));
    },
  });

  const openModal = (expense?: ExpenseApiResponse) => {
    if (expense) {
      setEditingExpense(expense);
      form.reset({
        concept: expense.concept || '',
        category: expense.category || 'general',
        amount_usd: expense.amount_usd ?? 0,
        amount_bs: expense.amount_bs ?? 0,
        exchange_rate: expense.exchange_rate ?? 1,
        payment_method: expense.payment_method || 'cash_usd',
        expense_date: expense.expense_date ? expense.expense_date.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: expense.notes || '',
      });
    } else {
      setEditingExpense(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const onSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  const confirmDelete = () => {
    if (deletingId) deleteMutation.mutate(deletingId);
  };

  const confirmBulkDelete = () => {
    if (bulkDeleteIds.length > 0) bulkDeleteMutation.mutate(bulkDeleteIds);
  };

  const totalRecords = expensesResponse?.meta?.total ?? 0;
  const pageCount = expensesResponse?.meta?.last_page ?? Math.ceil(totalRecords / perPage) ?? 1;

  return {
    expenses,
    isLoadingExpenses,

    isModalOpen,
    setIsModalOpen,
    openModal,
    closeModal,
    form,
    onSubmit,
    isSaving: saveMutation.isPending,
    isEditing: !!editingExpense,

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