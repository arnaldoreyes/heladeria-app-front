import { iceApi } from '@/api/iceApi';
import type { BusinessFormData } from '../schemas/business-setting.schema';
import type { Business } from '@/interfaces/business.interface';

/**
 * Transforma la respuesta cruda de la API al formato plano utilizado por el formulario.
 * Extrae y mapea las propiedades anidadas de `settings`.
 */

/**
 * Obtiene la información general y configuración del negocio actual.
 * 
 * @returns Promesa con los datos mapeados listos para usarse en `react-hook-form`.
 * @throws AxiosError si el usuario no tiene permisos o si la sesión expiró.
 */
export const getBusinessAction = async (): Promise<Business> => {
  const { data } = await iceApi.get<{ data: Business }>('/businesses/current');
  const rawData = data.data || data;
  return rawData;
};

/**
 * Actualiza los parámetros del negocio.
 * 
 * @param formData - Estado plano proveniente de la validación con Zod.
 * @returns La respuesta actualizada confirmada por la API.
 */
export const updateBusinessAction = async (formData: BusinessFormData): Promise<Business> => {
  const { data } = await iceApi.put<{ data: Business }>(`/businesses/${formData.id}`, formData);
  return data.data || data;
};