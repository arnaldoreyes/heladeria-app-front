import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2, Plus } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { useExpenses } from './hooks/useExpenses';
import { useExpensesColumns } from './hooks/useExpensesColumns';
import { ExpenseDialog } from './components/ExpenseDialog';
import { ExpenseGridCard } from './components/ExpenseGridCard';

export default function ExpensesList() {
  const { t } = useTranslation(['expenses', 'common']);

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const {
    expenses,
    isLoadingExpenses,
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
    page,
    setPage,
    perPage,
    setPerPage,
    pageCount,
    totalRecords,
  } = useExpenses({
    search: debouncedSearch,
  });

  const columns = useExpensesColumns({
    onEdit: openModal,
    onDelete: (id) => setDeletingId(id),
  });

  const getRealIds = (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id);

  return (
    <div className="space-y-4">
      <DataTable
        data={expenses}
        columns={columns}
        isLoading={isLoadingExpenses}
        showSearch={true}
        showAdd={true}
        showFilters={false}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('expenses.search_placeholder', 'Buscar gastos por concepto o notas...')}
        onAdd={() => openModal()}
        addLabel={t('expenses.add_button', 'Nuevo Gasto')}
        addIcon={<Plus className="mr-2 h-4 w-4" />}
        sorting={sorting}
        onSortingChange={setSorting}
        onBulkActions={[
          {
            label: t('common.bulk_delete', 'Eliminar Masivo'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (selectedRows) => setBulkDeleteIds(getRealIds(selectedRows)),
          },
        ]}
        renderGridCard={(row) => (
          <ExpenseGridCard
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

      <ExpenseDialog
        isOpen={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        isEditing={isEditing}
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
      />

      <ConfirmDeleteDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        t={t}
      />

      <ConfirmDeleteDialog
        isOpen={bulkDeleteIds.length > 0}
        onClose={() => setBulkDeleteIds([])}
        onConfirm={confirmBulkDelete}
        isDeleting={isBulkDeleting}
        count={bulkDeleteIds.length}
        t={t}
      />
    </div>
  );
}