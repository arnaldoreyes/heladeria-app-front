import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ErrorResponse } from '@/interfaces/api.interface';
import type { AnalyticsFilters, ExportType } from '../types/analitycs';
import { 
  exportAnalyticsCsvAction, 
  getAnalyticsAction, 
  importAnalyticsCsvAction 
} from '../actions/analitycs.action';

export function useAnalytics(filters: AnalyticsFilters = {}) {
  const { t } = useTranslation(['analytics', 'common']);
  const queryClient = useQueryClient();

  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [importData, setImportData] = useState<string>('');

  const {
    data: analyticsResponse,
    isLoading: isLoadingAnalytics,
    refetch,
  } = useQuery({
    queryKey: ['analytics', filters.startDate, filters.endDate, filters.period, filters.categoryId, filters.userId],
    queryFn: () => getAnalyticsAction(filters),
  });

  const analyticsData = analyticsResponse?.data || null;

  const exportMutation = useMutation({
    mutationFn: (type: ExportType) => exportAnalyticsCsvAction(type),
    onSuccess: (blob, type) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte-${type}-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(t('analytics.messages.export_success', 'Reporte exportado exitosamente'));
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('analytics.messages.export_error', 'Error al exportar el reporte'));
    },
  });

  const importMutation = useMutation({
    mutationFn: (csv: string) => importAnalyticsCsvAction({ csv }),
    onSuccess: (res) => {
      toast.success(
        t('analytics.messages.import_success', `Se procesaron ${res.rowsProcessed} filas correctamente`)
      );
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setImportData('');
      setImportOpen(false);
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('analytics.messages.import_error', 'Error al importar los datos CSV'));
    },
  });

  const handleExport = (type: ExportType) => {
    exportMutation.mutate(type);
  };

  const handleImport = () => {
    if (!importData.trim()) {
      toast.error(t('analytics.messages.empty_csv', 'Pega datos CSV válidos antes de importar'));
      return;
    }
    importMutation.mutate(importData);
  };

  return {
    analyticsData,
    isLoadingAnalytics,
    refetch,

    importOpen,
    setImportOpen,
    importData,
    setImportData,

    handleExport,
    isExporting: exportMutation.isPending,
    handleImport,
    isImporting: importMutation.isPending,
  };
}