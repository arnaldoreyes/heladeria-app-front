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