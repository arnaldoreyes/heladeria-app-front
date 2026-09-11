import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { useProducts } from './hooks/useProducts';
import { useProductsColumns } from './hooks/useProductsColumns';
import { ProductDialog } from './components/ProductDialog';
import { ProductGridCard } from './components/ProductGridCard';
import { useExchangeRates } from '../settings/hooks/useExchgeRates';

export default function ProductsList() {
  const { t } = useTranslation(['products', 'common']);

  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [debouncedSearch] = useDebounce(searchValue, 500);
  const { currentRate } = useExchangeRates();
  const {
    products,
    categories,
    isLoadingProducts,
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
  } = useProducts({
    search: debouncedSearch,
    category_id: categoryFilter !== 'ALL' ? categoryFilter : undefined,
  });

  const columns = useProductsColumns({
    onEdit: openModal,
    onDelete: (id) => setDeletingId(id),
  });

  const filterComponents = (
    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={t('products.category', 'Categoría')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">{t('common.all_categories', 'Todas las Categorías')}</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const getRealIds = (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id);

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
        filterComponents={filterComponents}
        sorting={sorting}
        onSortingChange={setSorting}
        onBulkActions={[
          {
            label: t('common.bulk_activate', 'Activar Seleccionados'),
            icon: <CheckCircle className="h-4 w-4" />,
            onClick: (selectedRows) => handleBulkStatus(getRealIds(selectedRows), true),
          },
          {
            label: t('common.bulk_deactivate', 'Desactivar Seleccionados'),
            icon: <XCircle className="h-4 w-4" />,
            onClick: (selectedRows) => handleBulkStatus(getRealIds(selectedRows), false),
          },
          {
            label: t('common.bulk_delete', 'Eliminar Masivo'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (selectedRows) => setBulkDeleteIds(getRealIds(selectedRows)),
          },
        ]}
        defaultViewMode="grid"
        renderGridCard={(row) => (
          <ProductGridCard
            row={row}
            onEdit={openModal}
            onDelete={(id) => setDeletingId(id)}
            exchangeRate={currentRate?.rate }
          />
        )}
        /* Props de Paginación */
        pagination={{
          pageIndex: page,
          pageSize: perPage,
          pageCount: pageCount,
          total: totalRecords, // o total: totalRecords según la interfaz de tu DataTablePagination
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
        categories={categories}
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