/**
 * Standardized response helpers.
 * Every API response follows the same shape for consistency.
 */

export const success = (res: any, data: any, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const created = (res: any, data: any) => {
  return success(res, data, 201);
};

export const paginated = (res: any, { data, totalElements, pageNo, totalPages }: any) => {
  return res.status(200).json({
    success: true,
    data,
    meta: {
      totalElements,
      pageNo,
      totalPages,
    },
  });
};

export const message = (res: any, msg: string, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message: msg,
  });
};
