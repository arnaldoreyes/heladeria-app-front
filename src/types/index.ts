// Interface para respuestas de error de la API
export interface ErrorResponse {
  success?: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Interface genérica para respuestas exitosas de la API
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

