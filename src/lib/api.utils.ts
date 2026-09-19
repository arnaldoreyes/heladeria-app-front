export const cleanParams = (params: Record<string, any>) => {
  const { sort, sort_by, sort_order, page, per_page, include, ...filters } = params;

  // 1. Convertir ordenamiento al formato de Spatie (-campo o campo)
  let finalSort: string | undefined = undefined;

  if (typeof sort === 'string' && sort.length > 0) {
    if (sort.includes(':')) {
      const [field, order] = sort.split(':');
      finalSort = order === 'desc' ? `-${field}` : field;
    } else {
      finalSort = sort;
    }
  } else if (sort_by) {
    finalSort = sort_order === 'desc' ? `-${sort_by}` : sort_by;
  }

  // 2. Parámetros base estructurados
  const queryParams: Record<string, any> = {
    page,
    per_page,
    sort: finalSort,
    include,
  };

  // 3. Convertir dinámicamente cualquier filtro arbitrario a filter[key]
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key.startsWith('filter[')) {
        queryParams[key] = value;
      } else {
        queryParams[`filter[${key}]`] = value;
      }
    }
  });

  // 4. Filtrar propiedades base vacías
  return Object.fromEntries(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ''
    )
  );
};

/**
 * Convierte un objeto genérico a FormData para soportar el envío de archivos (multipart/form-data).
 * Maneja booleanos (0/1), instancias de File/FileList y soporte para '_method' de Laravel.
 */
export const objectToFormData = <T extends Record<string, any>>(
  payload: T,
  methodOverride?: 'PUT' | 'PATCH'
): FormData => {
  const formData = new FormData();

  if (methodOverride) {
    formData.append('_method', methodOverride);
  }

  Object.entries(payload).forEach(([key, value]) => {
    // Ignorar nulos o indefinidos
    if (value === null || value === undefined) return;

    // Manejo de archivos (File y FileList)
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (value instanceof FileList) {
      if (value.length > 0) {
        formData.append(key, value[0]);
      }
      return;
    }

    // Conversión de booleanos para compatibilidad con Laravel
    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
      return;
    }

    // Si es una string (p. ej. una URL de imagen previa) o un primitivo estándar
    formData.append(key, String(value));
  });

  return formData;
};