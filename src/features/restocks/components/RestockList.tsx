import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';

import { RestockDialog } from './RestockDialog';
import { RestockDetailDialog } from './RestockDetailDialog';
import { RestockFilters } from './RestockFilters';
import { useRestocks } from '../hooks/useRestock';
import { useRestocksColumns } from '../hooks/useRestocksColumns';
import { useRestockFilterState } from '../hooks/useRestockFilterState';
import type { Restock } from '@/interfaces/restock.interfce';
import { ProductDialog } from '@/features/products/components/ProductDialog';
import { useProducts } from '@/features/products/hooks/useProducts';
import { useSuppliers } from '@/features/suppliers/hooks/useSuppliers';
import { SupplierDialog } from '@/features/suppliers/components/SupplierDialog';


export default function RestockList() {
  const { t } = useTranslation(['restocks', 'common']);

  // 1. Manejo encapsulado de filtros
  const { filters, setters, handleResetFilters, isResetDisabled } = useRestockFilterState();

  // 2. Estado local de visualización
  const [viewingRestock, setViewingRestock] = useState<Restock | null>(null);

  // 3. Hooks de datos
  const {
    isLoadingProducts,
    isModalOpen: isProductModalOpen,
    closeModal: closeProductModal,
    openModal: openProductModal,
    form: productForm,
    onSubmit: onProductSubmit,
    isSaving: isProductSaving,
    isEditing: isProductEditing,
  } = useProducts({ search: filters.debouncedSearch });

  const {
    isModalOpen: isSupplierModalOpen,
    closeModal: closeSupplierModal,
    openModal: openSupplierModal,
    form: supplierForm,
    onSubmit: onSupplierSubmit,
    isSaving: isSupplierSaving,
    isDirty: isSupplierDirty,
    isEditing: isSupplierEditing,
  } = useSuppliers();

  

  const {
    restocks,
    isLoadingRestocks,
    isModalOpen: isRestockModalOpen,
    closeModal: closeRestockModal,
    openModal: openRestockModal,
    form: restockForm,
    onSubmit: onRestockSubmit,
    isSaving: isRestockSaving,
    isEditing: isRestockEditing,
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting,
    sorting,
    setSorting,
    page,
    setPage,
    perPage,
    setPerPage,
    pageCount,
    totalRecords,
  } = useRestocks({
    search: filters.debouncedSearch,
    status: filters.statusFilter !== 'ALL' ? filters.statusFilter : undefined,
    supplier_name: filters.supplierFilter !== 'ALL' ? filters.supplierFilter : undefined,
    start_date: filters.startDateFilter || undefined,
    end_date: filters.endDateFilter || undefined,
  });

  // 4. Memoización de callbacks para evitar recrear columnas en cada render
  const handleView = useCallback((item: Restock) => setViewingRestock(item), []);
  const handleEdit = useCallback((item: Restock) => openRestockModal(item), [openRestockModal]);
  const handleDelete = useCallback((id: string) => setDeletingId(id), [setDeletingId]);

  const columns = useRestocksColumns({
    onView: handleView,
    onEdit: handleEdit,
    onComplete: handleEdit,
    onDelete: handleDelete,
  });

  const handleChange = (value: string | null) => {
    if (!value) return ''; // Validación temprana si necesitas el string
    setters.setStatusFilter(value || 'ALL')
    return filters.statusFilter;
  };

  return (
    <div className="space-y-4">
      <DataTable
        data={restocks}
        columns={columns}
        isLoading={isLoadingRestocks}
        showSearch
        showAdd
        showFilters
        enableRowSelection={false}
        searchValue={filters.searchValue}
        onSearchChange={setters.setSearchValue}
        searchPlaceholder={t('restocks.search_placeholder', 'Buscar por N° factura o código...')}
        onAdd={() => openRestockModal()}
        addLabel={t('restocks.add_button', 'Nuevo Reposicion')}
        addIcon={<Plus className="mr-2 h-4 w-4" />}
        filterComponents={
          <RestockFilters
            supplierFilter={filters.supplierFilter}
            onSupplierChange={(v) => setters.setSupplierFilter(v || 'ALL')}
            statusFilter={filters.statusFilter}
            onStatusChange={(v) => handleChange(v)}
            startDate={filters.startDateFilter}
            onStartDateChange={(v) => setters.setStartDateFilter(v || '')}
            endDate={filters.endDateFilter}
            onEndDateChange={(v) => setters.setEndDateFilter(v || '')}
            onReset={handleResetFilters}
            isResetDisabled={isResetDisabled}
          />
        }
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={{
          pageIndex: page,
          pageSize: perPage,
          pageCount,
          total: totalRecords,
        }}
        onPageChange={setPage}
        onPageSizeChange={(newPerPage) => {
          setPerPage(newPerPage);
          setPage(1);
        }}
      />

      {/* Diálogos y Modales */}
      <RestockDialog
        isOpen={isRestockModalOpen}
        onOpenChange={(open) => !open && closeRestockModal()}
        isEditing={isRestockEditing}
        form={restockForm}
        onSubmit={onRestockSubmit}
        isSaving={isRestockSaving}
        isLoadingProducts={isLoadingProducts}
        onOpenCreateProduct={openProductModal}
        onOpenCreateSupplier={openSupplierModal}
      />

      <RestockDetailDialog
        isOpen={!!viewingRestock}
        onClose={() => setViewingRestock(null)}
        restock={viewingRestock}
      />

      <ConfirmDeleteDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <ProductDialog
        isOpen={isProductModalOpen}
        onOpenChange={(open) => !open && closeProductModal()}
        isEditing={isProductEditing}
        form={productForm}
        onSubmit={onProductSubmit}
        isSaving={isProductSaving}
      />

      <SupplierDialog
        isOpen={isSupplierModalOpen}
        onOpenChange={(open) => !open && closeSupplierModal()}
        isEditing={isSupplierEditing}
        form={supplierForm}
        onSubmit={onSupplierSubmit}
        isSaving={isSupplierSaving}
        isDirty={isSupplierDirty}
      />
    </div>
  );
}