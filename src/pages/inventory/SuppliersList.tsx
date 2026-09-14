import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2, CheckCircle, XCircle } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { useSuppliers } from './hooks/useSuppliers';
import { useSuppliersColumns } from './hooks/useSuppliersColumns';
import { SupplierDialog } from './components/suppliers/SupplierDialog';
import { SupplierFilters } from './components/suppliers/SupplierFilters';

export default function SuppliersList() {
  const { t } = useTranslation(['suppliers', 'common']);

  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
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
    handleBulkStatus,

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
    is_active: activeFilter !== 'ALL' ? activeFilter === 'active' : undefined,
  });

  const handleResetFilters = useCallback(() => {
    setSearchValue('');
    setActiveFilter('ALL');
  }, []);

  const columns = useSuppliersColumns({
    onEdit: openModal,
    onDelete: (id) => setDeletingId(id),
  });

  const getRealIds = (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id);


  const bulkActions = useMemo(
    () => [
      {
        label: t('common.bulk_activate', 'Activar Seleccionados'),
        icon: <CheckCircle className="h-4 w-4" />,
        onClick: (rows: any[]) => handleBulkStatus(getRealIds(rows), true),
      },
      {
        label: t('common.bulk_deactivate', 'Desactivar Seleccionados'),
        icon: <XCircle className="h-4 w-4" />,
        onClick: (rows: any[]) => handleBulkStatus(getRealIds(rows), false),
      },
      {
        label: t('common.bulk_delete', 'Eliminar Masivo'),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'destructive' as const,
        onClick: (rows: any[]) => setBulkDeleteIds(getRealIds(rows)),
      },
    ],
    [getRealIds, handleBulkStatus, setBulkDeleteIds, t]
  );

  


  const isResetDisabled =
    searchValue === '' &&
    activeFilter === 'ALL';
    
  return (
    <div className="space-y-4">
      <DataTable
        data={suppliers}
        columns={columns}
        isLoading={isLoadingSuppliers}
        showSearch={true}
        showAdd={true}
        showFilters={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('suppliers.search_placeholder', 'Buscar proveedores por nombre, RIF o contacto...')}
        onAdd={() => openModal()}
        addLabel={t('suppliers.add_button', 'Nuevo Proveedor')}
        sorting={sorting}
        onSortingChange={setSorting}
        onBulkActions={bulkActions}
        filterComponents={
          <SupplierFilters
            activeFilter={activeFilter}
            onActiveChange={(v) => v && setActiveFilter(v)}
            onReset={handleResetFilters}
            isResetDisabled={isResetDisabled}
          />
        }
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