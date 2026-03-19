/**
 * Standardized response helpers.
 * Every API response follows the same shape for consistency.
 */

const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

const created = (res, data) => {
  return success(res, data, 201);
};

const paginated = (res, { data, totalElements, pageNo, totalPages }) => {
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

const message = (res, msg, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message: msg,
  });
};

module.exports = { success, created, paginated, message };
