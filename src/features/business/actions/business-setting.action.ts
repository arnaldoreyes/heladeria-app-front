import { iceApi } from '@/api/iceApi';
import type { BusinessFormData } from '../schemas/business-setting.schema';
import type { Business } from '@/interfaces/business.interface';

/**
 * Transforma la respuesta cruda de la API al formato plano utilizado por el formulario.
 * Extrae y mapea las propiedades anidadas de `settings`.
 */
export const mapApiToFormData = (apiData: Business): BusinessFormData => {
  const settings = apiData.settings || {};

  return {
    id: apiData.id,
    name: apiData.name ?? '',
    niche: apiData.niche ?? '',
    default_profit_percentage: Number(settings.default_profit_percentage ?? 40),
    default_reinvestment_percentage: Number(settings.default_reinvestment_percentage ?? 60),
    print_ticket_on_sale: Boolean(settings.print_ticket_on_sale),
    ticket_header_notes: settings.ticket_header_notes ?? '',
    ticket_footer_notes: settings.ticket_footer_notes ?? '',
  };
};

/**
 * Obtiene la información general y configuración del negocio actual.
 * 
 * @returns Promesa con los datos mapeados listos para usarse en `react-hook-form`.
 * @throws AxiosError si el usuario no tiene permisos o si la sesión expiró.
 */
export const getBusinessAction = async (): Promise<BusinessFormData> => {
  const { data } = await iceApi.get<{ data: Business }>('/businesses/current');
  const rawData = data.data || data;
  return mapApiToFormData(rawData);
};

/**
 * Actualiza los parámetros del negocio.
 * 
 * @param formData - Estado plano proveniente de la validación con Zod.
 * @returns La respuesta actualizada confirmada por la API.
 */
export const updateBusinessAction = async (formData: BusinessFormData): Promise<Business> => {
  const payload = {
    name: formData.name,
    niche: formData.niche,
    settings: {
      default_profit_percentage: formData.default_profit_percentage,
      default_reinvestment_percentage: formData.default_reinvestment_percentage,
      print_ticket_on_sale: formData.print_ticket_on_sale,
      ticket_header_notes: formData.ticket_header_notes,
      ticket_footer_notes: formData.ticket_footer_notes,
    },
  };

  const { data } = await iceApi.put<{ data: Business }>(`/businesses/${formData.id}`, payload);
  return data.data || data;
};