const mongoose = require('mongoose');
const Joi = require('joi');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    profession: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255
    },
    mobile: {
      type: Number,
      min: 9
    },
    image: String
  },
  {
    timestamps: true
  }
);

const Author = mongoose.model('Author', authorSchema);

function validateAuthor(genre) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    profession: Joi.string().min(3).max(50).required(),
    image: Joi.string(),
    mobile: Joi.number(),
    email: Joi.string().min(5).max(255).email()
  };

  return Joi.object().keys(schema).unknown(true).validate(genre);
}

exports.authorSchema = authorSchema;
exports.Author = Author;
exports.validateModel = validateAuthor;
