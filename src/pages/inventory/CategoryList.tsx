import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { useCategories } from './hooks/useCategories';
import { useCategoriesColumns } from './hooks/useCategoriesColumns';
import { CategoryDialog } from './components/CategoryDialog';
import { CategoryGridCard } from './components/CategoryGridCard';

export default function CategoriesList() {
  const { t } = useTranslation(['categories', 'common']);

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const {
    categories,
    isLoadingCategories,
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
  } = useCategories({
    search: debouncedSearch,
  });

  const columns = useCategoriesColumns({
    onEdit: openModal,
    onDelete: (id) => setDeletingId(id),
  });

  const getRealIds = (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id);

  return (
    <div className="space-y-4">
      <DataTable
        data={categories}
        columns={columns}
        isLoading={isLoadingCategories}
        showSearch={true}
        showAdd={true}
        showFilters={false}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('categories.search_placeholder', 'Buscar categorías...')}
        onAdd={() => openModal()}
        addLabel={t('categories.add_button', 'Nueva Categoría')}
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
            <CategoryGridCard
              row={row}
              onEdit={openModal}
              onDelete={(id) => setDeletingId(id)}
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

      <CategoryDialog
        isOpen={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        isEditing={isEditing}
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
        parentCategories={categories}
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