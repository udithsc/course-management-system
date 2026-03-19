const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

/**
 * Global error handling middleware.
 * Catches all errors thrown in route handlers (including async ones via express-async-errors).
 */
module.exports = (err, req, res, next) => {
  // Default to 500 for unexpected errors
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${err.message}\n${err.stack}`);
  } else {
    logger.warn(`${statusCode} - ${err.message} - ${req.method} ${req.originalUrl}`);
  }

  // Send structured error response
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && !isOperational && { stack: err.stack }),
  });
};
