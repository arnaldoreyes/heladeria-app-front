import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2, Plus } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { useSuppliers } from './hooks/useSuppliers';
import { useSuppliersColumns } from './hooks/useSuppliersColumns';
import { SupplierDialog } from './components/SupplierDialog';
import { SupplierGridCard } from './components/SupplierGridCard';

export default function SuppliersList() {
  const { t } = useTranslation(['suppliers', 'common']);

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const {
    suppliers,
    isLoadingSuppliers,
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
  } = useSuppliers({
    search: debouncedSearch,
  });

  const columns = useSuppliersColumns({
    onEdit: openModal,
    onDelete: (id) => setDeletingId(id),
  });

  const getRealIds = (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id);

  return (
    <div className="space-y-4">
      <DataTable
        data={suppliers}
        columns={columns}
        isLoading={isLoadingSuppliers}
        showSearch={true}
        showAdd={true}
        showFilters={false}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('suppliers.search_placeholder', 'Buscar proveedores por nombre, RIF o contacto...')}
        onAdd={() => openModal()}
        addLabel={t('suppliers.add_button', 'Nuevo Proveedor')}
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
          <SupplierGridCard
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

      <SupplierDialog
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