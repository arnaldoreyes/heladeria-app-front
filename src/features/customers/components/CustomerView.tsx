import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { CustomerDialog } from './CustomerDialog';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { CustomerGridCard } from './CustomerGridCard';
import { CustomerFilters } from './CustomerFilters';

import { useCustomers } from '../hooks/useCustomers';
import { useCustomersColumns } from '../hooks/useCustomersColumns';

export default function CustomersView() {
  const { t } = useTranslation(['customers', 'common']);

  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const [debouncedSearch] = useDebounce(searchValue, 500);

  const {
    customers,
    isLoadingCustomers,
    isModalOpen,
    closeModal,
    openModal,
    form,
    onSubmit,
    isSaving,
    isDirty,
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
    handleToggleStatus,
    handleBulkStatus,
    page,
    setPage,
    perPage,
    setPerPage,
    pageCount,
    totalRecords,
  } = useCustomers({
    search: debouncedSearch,
    is_active: activeFilter !== 'ALL' ? activeFilter === 'active' : undefined,
  });

  const columns = useCustomersColumns({
    onEdit: (customer) => openModal(customer),
    onDelete: (id) => setDeletingId(id),
    onToggleStatus: (id) => handleToggleStatus(id),
  });

  const handleResetFilters = useCallback(() => {
    setSearchValue('');
    setActiveFilter('ALL');
  }, []);

  const getRealIds = useCallback(
    (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id),
    []
  );

  const bulkActions = useMemo(
    () => [
      {
        label: t('customers.bulk_activate', 'Activar Seleccionados'),
        icon: <CheckCircle className="h-4 w-4" />,
        onClick: (selectedRows: any[]) => handleBulkStatus(getRealIds(selectedRows), true),
      },
      {
        label: t('customers.bulk_deactivate', 'Desactivar Seleccionados'),
        icon: <XCircle className="h-4 w-4" />,
        onClick: (selectedRows: any[]) => handleBulkStatus(getRealIds(selectedRows), false),
      },
      {
        label: t('customers.bulk_delete', 'Eliminar Masivo'),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'destructive' as const,
        onClick: (selectedRows: any[]) => setBulkDeleteIds(getRealIds(selectedRows)),
      },
    ],
    [getRealIds, handleBulkStatus, setBulkDeleteIds, t]
  );

  const isResetDisabled = searchValue === '' && activeFilter === 'ALL';

  return (
    <div className="space-y-4">
      <DataTable
        data={customers}
        columns={columns}
        isLoading={isLoadingCustomers}
        showSearch={true}
        showAdd={true}
        showFilters={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('customers.search', 'Buscar clientes...')}
        onAdd={() => openModal()}
        addLabel={t('customers.add', 'Nuevo Cliente')}
        filterComponents={
          <CustomerFilters
            activeFilter={activeFilter}
            onActiveChange={setActiveFilter}
            onReset={handleResetFilters}
            isResetDisabled={isResetDisabled}
          />
        }
        sorting={sorting}
        onSortingChange={setSorting}
        onBulkActions={bulkActions}
        renderGridCard={(row) => (
          <CustomerGridCard
            row={row}
            onEdit={() => openModal(row.original)}
            onDelete={(id) => setDeletingId(id)}
            onToggleStatus={(id) => handleToggleStatus(id)}
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

      <CustomerDialog
        isOpen={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        isEditing={isEditing}
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
        isDirty={isDirty}
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