
/**
 * Interface genérica para respuestas de error de la API
 */
export interface ErrorResponse {
  success?: false;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Interface genérica para respuestas exitosas de la API
 */
export interface SuccessResponse<T = any> {
  success?: true;
  message?: string;
  data: T;
  meta?: {
    current_page?: number;
    from?: number;
    last_page?: number;
    links?: 
      {
          url?: string,
          label?: string;
          page?: number;
          active?: boolean;
      }[];
    path?: string;
    per_page?: number;
    to?: number;
    total?: number;

  };
  links?: {
    first?: string;
    last?:string;
    next?:string;
    prev?:string;
  };
}

// Para operaciones en lote (bulkDestroy, bulkStatusUpdate)
export type BulkOperationApiResponse = SuccessResponse<{
  deleted_count?: number;
  updated_count?: number;
}>;

/**
 * Parámetros base para cualquier petición paginada/filtrada a la API
 */
export interface BaseGetFilters {
  search?: string;
  page?: number;
  per_page?: number;
  sort?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  include?: string;
}

/**
 * Tipo genérico para extender filtros específicos por entidad.
 * Permite pasar cualquier propiedad personalizada de filtro dinámicamente.
 */
export type CustomFilters<T = Record<string, unknown>> = BaseGetFilters & T;
