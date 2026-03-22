const AppError = require('../utils/AppError');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

module.exports = (validator, queryValidator = null, paramsValidator = null) => {
  return (req, res, next) => {
    // 1. Quick sanity check on any incoming ID format in payload
    if (req.body.id && !UUID_REGEX.test(req.body.id)) {
      throw new AppError('Invalid ID format in payload.', 400);
    }
    
    // 2. Validate req.params if schema provided
    if (paramsValidator) {
      const { error } = paramsValidator(req.params);
      if (error) throw new AppError(`Invalid request path: ${error.details[0].message}`, 400);
    }

    // 3. Validate req.query if schema provided
    if (queryValidator) {
      const { error } = queryValidator(req.query);
      if (error) throw new AppError(`Invalid request query: ${error.details[0].message}`, 400);
    }

    // 4. Validate req.body if schema provided
    if (validator) {
      const { error } = validator(req.body);
      if (error) throw new AppError(error.details[0].message, 400);
    }

    next();
  };
};
