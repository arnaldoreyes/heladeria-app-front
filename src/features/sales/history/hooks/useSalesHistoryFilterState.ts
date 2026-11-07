import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from 'use-debounce';

export interface SalesFilterState {
  searchValue: string;
  debouncedSearch: string;
  statusFilter: string;
  paymentStatusFilter: string;
  startDateFilter: string;
  endDateFilter: string;
}

export function useSalesHistoryFilterState() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Debounce para evitar llamadas excesivas a la API al escribir en el buscador
  const debouncedSearch = useDebounce(searchValue, 400);

  // Evaluar si el botón de reiniciar filtros debe estar deshabilitado
  const isResetDisabled = useMemo(() => {
    return (
      !searchValue &&
      statusFilter === 'ALL' &&
      paymentStatusFilter === 'ALL' &&
      !startDateFilter &&
      !endDateFilter
    );
  }, [searchValue, statusFilter, paymentStatusFilter, startDateFilter, endDateFilter]);

  // Handler para limpiar todos los filtros a su estado inicial
  const handleResetFilters = useCallback(() => {
    setSearchValue('');
    setStatusFilter('ALL');
    setPaymentStatusFilter('ALL');
    setStartDateFilter('');
    setEndDateFilter('');
  }, []);

  return {
    filters: {
      searchValue,
      debouncedSearch,
      statusFilter,
      paymentStatusFilter,
      startDateFilter,
      endDateFilter,
    },
    setters: {
      setSearchValue,
      setStatusFilter,
      setPaymentStatusFilter,
      setStartDateFilter,
      setEndDateFilter,
    },
    handleResetFilters,
    isResetDisabled,
  };
}