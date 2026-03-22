const Joi = require('joi');

function validateCategory(category) {
  const schema = {
    name: Joi.string().min(3).max(10).required(),
  };

  return Joi.object().keys(schema).unknown(true).validate(category);
}

exports.validateModel = validateCategory;
