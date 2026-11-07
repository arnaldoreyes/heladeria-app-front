import { iceApi } from '@/api/iceApi';
import { cleanParams } from '@/lib/api.utils';
import type { 
  AnalyticsApiResponse, 
  AnalyticsFilters, 
  ExportType, 
  ImportCsvPayload,
  ImportCsvResponse,
} from '../types/analitycs';

export const getAnalyticsAction = async (filters: AnalyticsFilters = {}): Promise<AnalyticsApiResponse> => {
  const { data } = await iceApi.get<AnalyticsApiResponse>('/analytics', {
    params: cleanParams(filters),
  });
  return data;
};

export const exportAnalyticsCsvAction = async (type: ExportType): Promise<Blob> => {
  const { data } = await iceApi.get<Blob>('/analytics/export', {
    params: { type },
    responseType: 'blob',
  });
  return data;
};

export const importAnalyticsCsvAction = async (payload: ImportCsvPayload): Promise<ImportCsvResponse> => {
  const { data } = await iceApi.post<ImportCsvResponse>('/analytics/import', payload);
  return data;
};