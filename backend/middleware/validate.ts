const { validate: isUuid } = require('uuid');
const AppError = require('../utils/AppError');

module.exports = (validator) => (req, res, next) => {
  if (req.body.id && !isUuid(req.body.id)) {
    throw new AppError('Invalid ID format.', 400);
  }

  if (validator) {
    const { error } = validator(req.body);
    if (error) throw new AppError(error.details[0].message, 400);
  }

  next();
};
