import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';

import { SaleHistoryDetailDialog } from './SaleHistoryDetailDialog';
import { SaleHistoryFilters } from './SaleHistoryFilters';
// 1. Importar el nuevo SaleDialog
import { SaleDialog } from './SaleDialog'; 

import { useSalesHistoryColumns } from '../hooks/useSalesHistoryColumns';
import { useSalesHistoryFilterState } from '../hooks/useSalesHistoryFilterState';
import type { Sale } from '@/interfaces/sale.interfce';
import { useSalesHistory } from '../hooks/useSalesHistorory';

export default function SalesHistoryList() {
  const { t } = useTranslation(['sales', 'common']);

  const { filters, setters, handleResetFilters, isResetDisabled } = useSalesHistoryFilterState();
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);

  // 2. Extraer propiedades adicionales del hook useSalesHistory 
  // para controlar el SaleDialog y el formulario.
  const {
    sales,
    isLoadingSales,
    openModal,
    isModalOpen,   // <-- Necesario para el Dialog
    closeModal,    // <-- Necesario para el Dialog
    form,          // <-- UseFormReturn de react-hook-form
    onSubmit,      // <-- Función de envío
    isSaving,      // <-- Estado de guardado
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
  } = useSalesHistory({
    search: filters.debouncedSearch,
    status: filters.statusFilter !== 'ALL' ? filters.statusFilter : undefined,
    payment_status: filters.paymentStatusFilter !== 'ALL' ? filters.paymentStatusFilter : undefined,
    date_from: filters.startDateFilter || undefined,
    date_to: filters.endDateFilter || undefined,
  });

  const handleView = useCallback((item: Sale) => setViewingSale(item), []);
  // Cuando presionan "Editar" en las columnas, se abre el modal y se carga la data
  const handleEdit = useCallback((item: Sale) => openModal(item), [openModal]);
  const handleDelete = useCallback((id: string) => setDeletingId(id), [setDeletingId]);

  const columns = useSalesHistoryColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <div className="space-y-4">
      <DataTable
        data={sales}
        columns={columns}
        isLoading={isLoadingSales}
        showSearch
        showAdd={false}
        showFilters
        enableRowSelection={false}
        searchValue={filters.searchValue}
        onSearchChange={setters.setSearchValue}
        searchPlaceholder={t('sales.search_placeholder', 'Buscar por ticket, cliente...')}
        filterComponents={
          <SaleHistoryFilters
            statusFilter={filters.statusFilter}
            onStatusChange={(v) => setters.setStatusFilter(v || 'ALL')}
            paymentStatusFilter={filters.paymentStatusFilter}
            onPaymentStatusChange={(v) => setters.setPaymentStatusFilter(v || 'ALL')}
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

      <SaleHistoryDetailDialog
        isOpen={!!viewingSale}
        onClose={() => setViewingSale(null)}
        sale={viewingSale}
      />

      <ConfirmDeleteDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      {/* 3. Renderizar el SaleDialog pasándole los estados del form */}
      <SaleDialog
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        isEditing={true} // Como es la vista de historial, siempre estamos editando una venta existente
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
      />
    </div>
  );
}