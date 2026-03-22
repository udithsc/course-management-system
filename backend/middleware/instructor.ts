const AppError = require('../utils/AppError');

/**
 * Middleware that allows access only for INSTRUCTOR or ADMIN roles.
 * Must be used AFTER the `auth` middleware.
 */
function instructor(req, res, next) {
  const role = req.user?.role;
  if (role === 'INSTRUCTOR' || role === 'ADMIN') return next();
  throw new AppError('Access denied. Instructor or Admin role required.', 403);
}

module.exports = instructor;
