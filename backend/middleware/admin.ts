const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  if (process.env.REQUIRES_AUTH === 'false') return next();

  if (!req.user.isAdmin) {
    throw new AppError('Access denied. Admin privileges required.', 403);
  }

  next();
};
