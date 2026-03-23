/**
 * Custom application error class for operational errors.
 * These are errors we expect and handle gracefully (e.g., 404, 400, 403).
 * Unhandled/programmer errors will still be caught by the global error handler.
 */
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
