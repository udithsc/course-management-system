const config = require('config');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  if (!config.get('requiresAuth')) return next();

  if (!req.user.isAdmin) {
    throw new AppError('Access denied. Admin privileges required.', 403);
  }

  next();
};
