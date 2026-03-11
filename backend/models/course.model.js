const Joi = require('joi');

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(255).required(),
    fee: Joi.number().min(0).max(100000).required(),
    author: Joi.string().required(),
    category: Joi.string().required(),
    language: Joi.string().min(3).max(10)
  };

  return Joi.object().keys(schema).unknown(true).validate(course);
}

exports.validateModel = validateCourse;
