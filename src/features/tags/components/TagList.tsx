import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Trash2 } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { useTags } from '../hooks/useTags';
import { useTagColumns } from '../hooks/useTagColumns';
import { TagDialog } from './TagDialog';
import { TagFilters } from './TagFilters';

export default function TagsList() {
  const { t } = useTranslation(['Tags', 'common']);

  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const TagsHook = useTags({
    search: debouncedSearch,
  });

  const {
    tags,
    isLoadingTags,
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
    page,
    setPage,
    perPage,
    setPerPage,
    pageCount,
    totalRecords,
    statusFilter,
    setStatusFilter,
    hasActiveFilters,
    handleResetFilters,
    handleToggleStatus,
  } = TagsHook;

  const columns = useTagColumns({
    onEdit: openModal,
    onDelete: (id) => setDeletingId(id),
    onToggleStatus: handleToggleStatus
  });

  const getRealIds = (selectedRows: any[]) => selectedRows.map((row) => row.id || row.original?.id);

  return (
    <div className="space-y-4">
      <DataTable
        data={tags}
        columns={columns}
        isLoading={isLoadingTags}
        showSearch={true}
        showAdd={true}
        showFilters={true}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('Tags.search_placeholder', 'Buscar etiquetas...')}
        onAdd={() => openModal()}
        addLabel={t('Tags.add_button', 'Nueva Etiqueta')}
        sorting={sorting}
        defaultViewMode="grid"
        onSortingChange={setSorting}
        filterComponents={
          <TagFilters      
              activeFilter={statusFilter}
              onActiveChange={(v) => v && setStatusFilter(v)}
              onReset={handleResetFilters}
              isResetDisabled={hasActiveFilters}
            />
        }
        onBulkActions={[
          {
            label: t('common.bulk_delete', 'Eliminar Masivo'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive',
            onClick: (selectedRows) => setBulkDeleteIds(getRealIds(selectedRows)),
          },
        ]}
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

      <TagDialog
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