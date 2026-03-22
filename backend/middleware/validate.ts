const AppError = require('../utils/AppError');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

module.exports = (validator) => (req, res, next) => {
  if (req.body.id && !UUID_REGEX.test(req.body.id)) {
    throw new AppError('Invalid ID format.', 400);
  }

  if (validator) {
    const { error } = validator(req.body);
    if (error) throw new AppError(error.details[0].message, 400);
  }

  next();
};
