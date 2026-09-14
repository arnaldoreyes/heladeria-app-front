import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { PaymentMethodDialog } from './components/PaymentMethodDialog';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { PaymentMethodGridCard } from './components/PaymentMethodGridCard';
import { PaymentMethodFilters } from './components/PaymentMethodFilters';

import { usePaymentMethods } from './hooks/usePaymentMethods';
import { usePaymentMethodsColumns } from './hooks/usePaymentMethodsColumns';

export default function PaymentMethodsConfig() {
  const { t } = useTranslation(['settings', 'common']);

  // Estados de Filtros
  const [searchValue, setSearchValue] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('ALL');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState('ALL');

  const [debouncedSearch] = useDebounce(searchValue, 500);

  const {
    methods,
    paymentTypes,
    isLoadingMethods,
    isModalOpen,
    closeModal,
    openModal,
    form,
    onSubmit,
    isSaving,
    isEditing,
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting,
    bulkDeleteIds,
    setBulkDeleteIds,
    confirmBulkDelete,
    isBulkDeleting,
    sorting,
    setSorting,
    handleBulkStatus,
    page,
    setPage,
    perPage,
    setPerPage,
    pageCount,
    totalRecords,
  } = usePaymentMethods({
    search: debouncedSearch,
    currency: currencyFilter !== 'ALL' ? currencyFilter : undefined,
    is_active: activeFilter !== 'ALL' ? activeFilter === 'active' : undefined,
    payment_type_id: paymentTypeFilter !== 'ALL' ? paymentTypeFilter : undefined,
  });

  const columns = usePaymentMethodsColumns({
    onEdit: openModal,
    onDelete: (id) => setDeletingId(id),
  });

  const handleResetFilters = useCallback(() => {
    setSearchValue('');
    setCurrencyFilter('ALL');
    setActiveFilter('ALL');
    setPaymentTypeFilter('ALL');
  }, []);

  const getRealIds = useCallback(
    (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id),
    []
  );

  const bulkActions = useMemo(
    () => [
      {
        label: t('settings.payments.bulk_activate', 'Activar Seleccionados'),
        icon: <CheckCircle className="h-4 w-4" />,
        onClick: (selectedRows: any[]) => handleBulkStatus(getRealIds(selectedRows), true),
      },
      {
        label: t('settings.payments.bulk_deactivate', 'Desactivar Seleccionados'),
        icon: <XCircle className="h-4 w-4" />,
        onClick: (selectedRows: any[]) => handleBulkStatus(getRealIds(selectedRows), false),
      },
      {
        label: t('settings.payments.bulk_delete', 'Eliminar Masivo'),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'destructive' as const,
        onClick: (selectedRows: any[]) => setBulkDeleteIds(getRealIds(selectedRows)),
      },
    ],
    [getRealIds, handleBulkStatus, setBulkDeleteIds, t]
  );

  const isResetDisabled =
    searchValue === '' &&
    currencyFilter === 'ALL' &&
    activeFilter === 'ALL' &&
    paymentTypeFilter === 'ALL';

  return (
    <div className="space-y-4">
      <DataTable
        data={methods}
        columns={columns}
        isLoading={isLoadingMethods}
        showSearch={true}
        showAdd={true}
        showFilters={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('settings.payments.search', 'Buscar métodos...')}
        onAdd={() => openModal()}
        addLabel={t('settings.payments.add', 'Nuevo Método')}
        filterComponents={
          <PaymentMethodFilters
            currencyFilter={currencyFilter}
            onCurrencyChange={setCurrencyFilter}
            activeFilter={activeFilter}
            onActiveChange={setActiveFilter}
            paymentTypeFilter={paymentTypeFilter}
            onPaymentTypeChange={setPaymentTypeFilter}
            paymentTypes={paymentTypes}
            onReset={handleResetFilters}
            isResetDisabled={isResetDisabled}
          />
        }
        sorting={sorting}
        onSortingChange={setSorting}
        onBulkActions={bulkActions}
        renderGridCard={(row) => (
          <PaymentMethodGridCard
            row={row}
            onEdit={openModal}
            onDelete={(id) => setDeletingId(id)}
          />
        )}
        pagination={{
          pageIndex: page,
          pageSize: perPage,
          pageCount: pageCount,
          total: totalRecords,
        }}
        onPageChange={setPage}
        onPageSizeChange={(newPerPage) => {
          setPerPage(newPerPage);
          setPage(1);
        }}
      />

      <PaymentMethodDialog
        isOpen={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        isEditing={isEditing}
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
        paymentTypes={paymentTypes}
      />

      <ConfirmDeleteDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <ConfirmDeleteDialog
        isOpen={bulkDeleteIds.length > 0}
        onClose={() => setBulkDeleteIds([])}
        onConfirm={confirmBulkDelete}
        isDeleting={isBulkDeleting}
        count={bulkDeleteIds.length}
      />
    </div>
  );
}