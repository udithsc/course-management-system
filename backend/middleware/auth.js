const jwt = require('jsonwebtoken');
const config = require('config');
const AppError = require('../utils/AppError');

module.exports = (req, res, next) => {
  if (!config.get('requiresAuth')) return next();

  const token = req.header('x-auth-token');
  if (!token) throw new AppError('Access denied. No token provided.', 401);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    throw new AppError('Invalid or expired token.', 401);
  }
};
