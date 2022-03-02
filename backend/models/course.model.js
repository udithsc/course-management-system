const mongoose = require('mongoose');
const Joi = require('joi');
const { authorSchema } = require('./author.model');
const { categorySchema } = require('./category.model');

const Course = mongoose.model(
  'Course',
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50,
        trim: true
      },
      description: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
      },
      fee: {
        type: Number,
        required: true,
        min: 0,
        max: 100000
      },
      author: {
        type: authorSchema,
        required: true
      },
      category: {
        type: categorySchema,
        required: true
      },
      image: String,
      language: {
        type: String,
        minlength: 3,
        maxlength: 10
      },
      subscriptions: { type: Number, default: 0 },
      tokens: [],
      addons: [],
      lessons: [],
      reviews: []
    },
    {
      timestamps: true
    }
  )
);

function validateCourse(course) {
  const schema = {
    name: Joi.string().min(3).max(50).required(),
    description: Joi.objectId().min(3).max(255).required(),
    fee: Joi.number().min(0).max(100000).required(),
    author: Joi.objectId().required(),
    category: Joi.objectId().required(),
    language: Joi.string().min(3).max(10)
  };

  return Joi.object().keys(schema).unknown(true).validate(course);
}

exports.Course = Course;
exports.validateModel = validateCourse;
