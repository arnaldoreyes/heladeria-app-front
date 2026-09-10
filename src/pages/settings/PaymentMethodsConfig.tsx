import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { Download, Trash2, CheckCircle, XCircle, Plus } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table/DataTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethodDialog } from './components/PaymentMethodDialog';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';

import { usePaymentMethods } from './hooks/usePaymentMethods';
import { usePaymentMethodsColumns } from './hooks/usePaymentMethodsColumns';

export default function PaymentMethodsConfig() {
  const { t } = useTranslation(['settings', 'common']);
  
  const [searchValue, setSearchValue] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('ALL');
  const [debouncedSearch] = useDebounce(searchValue, 500);

  const { 
    methods, 
    paymentTypes,
    isLoadingMethods, 
    isModalOpen,
    closeModal,
    openModal, 
    form,
    onSubmit,
    isSaving,
    isEditing,
    
    // Eliminación individual
    deletingId,
    setDeletingId,
    confirmDelete,
    isDeleting,

    // Eliminación masiva
    bulkDeleteIds,
    setBulkDeleteIds,
    confirmBulkDelete,
    isBulkDeleting,

    sorting, 
    setSorting,
    handleBulkStatus,
  } = usePaymentMethods({
    search: debouncedSearch,
    currency: currencyFilter !== 'ALL' ? currencyFilter : undefined
  });

  const columns = usePaymentMethodsColumns({
    onEdit: openModal,
    onDelete: (id) => setDeletingId(id), 
  });

  const filterComponents = (
    <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder={t('settings.payments.currency', 'Moneda')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">{t('common.all', 'Todas')}</SelectItem>
        <SelectItem value="USD">USD</SelectItem>
        <SelectItem value="VES">VES</SelectItem>
      </SelectContent>
    </Select>
  );

  const getRealIds = (selectedRows: any[]) => selectedRows.map(row => row.id || row.original?.id);

  return (
    <div className="space-y-4">
      <DataTable
        data={methods}
        columns={columns}
        isLoading={isLoadingMethods}
        
        showSearch={true}
        showAdd={true}
        showFilters={true}

        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder={t('settings.payments.search', 'Buscar métodos...')}
        
        onAdd={() => openModal()}
        addLabel={t('settings.payments.add', 'Nuevo Método')}
        addIcon={<Plus className="mr-2 h-4 w-4" />} 

        filterComponents={filterComponents}
        sorting={sorting}
        onSortingChange={setSorting}

        onBulkActions={[
          {
            label: t('settings.payments.bulk_activate', 'Activar Seleccionados'),
            icon: <CheckCircle className="h-4 w-4" />,
            onClick: (selectedRows) => handleBulkStatus(getRealIds(selectedRows), true),
          },
          {
            label: t('settings.payments.bulk_deactivate', 'Desactivar Seleccionados'),
            icon: <XCircle className="h-4 w-4" />,
            onClick: (selectedRows) => handleBulkStatus(getRealIds(selectedRows), false),
          },
          {
            label: t('settings.payments.bulk_export', 'Exportar CSV'),
            icon: <Download className="h-4 w-4" />,
            onClick: (selectedRows) => console.log('Exportar', getRealIds(selectedRows)),
          },
          {
            label: t('settings.payments.bulk_delete', 'Eliminar Masivo'),
            icon: <Trash2 className="h-4 w-4" />,
            variant: 'destructive', 
            onClick: (selectedRows) => setBulkDeleteIds(getRealIds(selectedRows)),
          },
        ]}
      />

      {/* --- MODAL CREAR / EDITAR --- */}
      <PaymentMethodDialog
        isOpen={isModalOpen}
        onOpenChange={(open) => !open && closeModal()}
        isEditing={isEditing}
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
        paymentTypes={paymentTypes}
      />

      {/* --- DIÁLOGO ELIMINACIÓN INDIVIDUAL --- */}
      <ConfirmDeleteDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        t={t}
      />

      {/* --- DIÁLOGO ELIMINACIÓN MASIVA --- */}
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