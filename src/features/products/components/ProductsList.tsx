import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2, CheckCircle, XCircle, Plus, Edit3 } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { useProducts } from '../hooks/useProducts';
import { useProductsColumns } from '../hooks/useProductsColumns';
import { ProductDialog } from './ProductDialog';
import { ProductGridCard } from './ProductGridCard';
import { ProductFilters } from './ProductFilters';
import { useActiveExchangeRate } from '@/features/exchange-rates/hooks/useActiveExchangeRate';
import { BulkUpdateValuesDialog } from './BulkUpdateProductValuesDialog';

export default function ProductsList() {
  const { t } = useTranslation(['products', 'common']);

  // Estados de Filtros
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState('ALL');

  const [debouncedSearch] = useDebounce(searchValue, 500);
  const { currentRate } = useActiveExchangeRate();

  const {
    products,
    isLoadingProducts,
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
    handleBulkStatus,
    handleToggleStatus,
    page,
    setPage,
    perPage,
    setPerPage,
    pageCount,
    totalRecords,
    bulkEditIds,
    setBulkEditIds,
    handleBulkUpdateValues,
    isBulkUpdatingValues,
  } = useProducts({
    search: debouncedSearch,
    category_id: categoryFilter !== 'ALL' ? categoryFilter : undefined,
    is_active: activeFilter !== 'ALL' ? activeFilter === 'active' : undefined,
    with_stock: stockFilter !== 'ALL' ? stockFilter === 'true' : undefined,
  });

  const handleResetFilters = useCallback(() => {
    setSearchValue('');
    setStockFilter('ALL');
    setActiveFilter('ALL');
    setCategoryFilter('ALL');
  }, []);

  const columns = useProductsColumns({
    onEdit: openModal,
    onDelete: setDeletingId,
    onToggleStatus: handleToggleStatus
  });

  const getRealIds = useCallback(
    (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id),
    []
  );

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
        label: t('common.bulk_edit_values', 'Editar Valores Masivamente'),
        icon: <Edit3 className="h-4 w-4" />,
        onClick: (rows: any[]) => setBulkEditIds(getRealIds(rows)),
      },
      {
        label: t('common.bulk_delete', 'Eliminar Masivo'),
        icon: <Trash2 className="h-4 w-4" />,
        variant: 'destructive' as const,
        onClick: (rows: any[]) => setBulkDeleteIds(getRealIds(rows)),
      },
    ],
    [getRealIds, handleBulkStatus, setBulkDeleteIds, setBulkEditIds, t]
  );

  const isResetDisabled =
    searchValue === '' &&
    activeFilter === 'ALL' &&
    stockFilter === 'ALL' &&
    categoryFilter === 'ALL';

  return (
    <div className="space-y-4">
      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoadingProducts}
        showSearch={true}
        showAdd={true}
        showFilters={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('products.search_placeholder', 'Buscar productos por nombre o SKU...')}
        onAdd={() => openModal()}
        addLabel={t('products.add_button', 'Nuevo Producto')}
        addIcon={<Plus className="mr-2 h-4 w-4" />}
        filterComponents={
          <ProductFilters
            categoryFilter={categoryFilter}
            onCategoryChange={(v) => v && setCategoryFilter(v)}
            activeFilter={activeFilter}
            onActiveChange={(v) => v && setActiveFilter(v)}
            stockFilter={stockFilter}
            onStockChange={(v) => v && setStockFilter(v)}
            onReset={handleResetFilters}
            isResetDisabled={isResetDisabled}
          />
        }
        sorting={sorting}
        onSortingChange={setSorting}
        onBulkActions={bulkActions}
        defaultViewMode="grid"
        renderGridCard={(row) => (
          <ProductGridCard
            row={row}
            exchangeRate={currentRate?.rate}
            onEdit= {openModal}
            onDelete= {setDeletingId}
            onToggleStatus={handleToggleStatus}
          />
        )}
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

      <ProductDialog
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

      <BulkUpdateValuesDialog
        isOpen={bulkEditIds.length > 0}
        onClose={() => setBulkEditIds([])}
        onSubmit={handleBulkUpdateValues}
        isSaving={isBulkUpdatingValues}
        selectedCount={bulkEditIds.length}
      />
    </div>
  );
}