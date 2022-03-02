const mongoose = require('mongoose');
const Joi = require('joi');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 10
    },
    icon: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = {
    name: Joi.string().min(3).max(10).required()
  };

  return Joi.object().keys(schema).unknown(true).validate(category);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validateModel = validateCategory;
