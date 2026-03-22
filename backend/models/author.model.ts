const Joi = require('joi');

function validateAuthor(author) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    profession: Joi.string().min(3).max(50).required(),
    image: Joi.string(),
    mobile: Joi.string(),
    email: Joi.string().min(5).max(255).email(),
  };

  return Joi.object().keys(schema).unknown(true).validate(author);
}

exports.validateModel = validateAuthor;
