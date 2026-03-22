const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

/**
 * Global error handling middleware.
 * Catches all errors thrown in route handlers (including async ones via express-async-errors).
 */
module.exports = (err, req, res, next) => {
  // Default to 500 for unexpected errors
  let statusCode = err.statusCode || 500;
  let isOperational = err.isOperational || false;
  let errorMsg = err.message || 'Internal Server Error';

  // Handle Prisma Specific Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    isOperational = true;
    if (err.code === 'P2002') {
      statusCode = 409;
      errorMsg = 'Duplicate database entry found.';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      errorMsg = 'Record not found in the database.';
    } else {
      statusCode = 400;
      errorMsg = 'Invalid database request.';
    }
  } else if (err.name === 'PrismaClientValidationError') {
    isOperational = true;
    statusCode = 400;
    errorMsg = 'Database validation failed. Invalid data format.';
  }

  // Log the error
  if (statusCode >= 500) {
    logger.error(`${err.message}\n${err.stack}`);
  } else {
    logger.warn(`${statusCode} - ${err.message} - ${req.method} ${req.originalUrl}`);
  }

  // Send structured error response
  res.status(statusCode).json({
    success: false,
    error: errorMsg,
    ...(process.env.NODE_ENV === 'development' && !isOperational && { stack: err.stack }),
  });
};
