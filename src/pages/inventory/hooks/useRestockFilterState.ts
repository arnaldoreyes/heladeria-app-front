import { useState, useCallback } from 'react';
import { useDebounce } from 'use-debounce';

export function useRestockFilterState() {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [supplierFilter, setSupplierFilter] = useState('ALL');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  const [debouncedSearch] = useDebounce(searchValue, 500);

  const handleResetFilters = useCallback(() => {
    setSearchValue('');
    setStatusFilter('ALL');
    setSupplierFilter('ALL');
    setStartDateFilter('');
    setEndDateFilter('');
  }, []);

  const isResetDisabled =
    statusFilter === 'ALL' &&
    supplierFilter === 'ALL' &&
    !startDateFilter &&
    !endDateFilter &&
    !searchValue;

  return {
    filters: {
      searchValue,
      debouncedSearch,
      statusFilter,
      supplierFilter,
      startDateFilter,
      endDateFilter,
    },
    setters: {
      setSearchValue,
      setStatusFilter,
      setSupplierFilter,
      setStartDateFilter,
      setEndDateFilter,
    },
    handleResetFilters,
    isResetDisabled,
  };
}