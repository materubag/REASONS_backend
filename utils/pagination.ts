interface PaginationParams {
  page?: number | string;
  limit?: number | string;
}

interface PaginationResult {
  limit: number;
  offset: number;
  page: number;
}

/**
 * Calcular limit, offset y page para paginación
 */
export const calculatePagination = (
  params: PaginationParams,
  defaultLimit: number = 10
): PaginationResult => {
  const page = Math.max(parseInt(String(params.page || 1), 10), 1);
  const limit = Math.max(
    Math.min(parseInt(String(params.limit || defaultLimit), 10), 100),
    1
  );
  const offset = (page - 1) * limit;

  return {
    limit,
    offset,
    page,
  };
};

/**
 * Construir metadata de paginación para respuestas
 */
export const buildPaginationMeta = (
  page: number,
  limit: number,
  total: number
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};
