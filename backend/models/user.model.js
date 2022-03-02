const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255
    },
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50
    },
    mobile: {
      type: Number,
      required: true,
      min: 9
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 1024
    },
    dob: Date,
    image: String,
    token: String,
    subscriptions: [],
    bookmarks: [],
    isVerified: Boolean,
    isAdmin: Boolean
  },
  {
    timestamps: true
  }
);

userSchema.methods.generateAccessToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.username,
      email: this.email,
      isAdmin: this.isAdmin
    },
    process.env.ACCESS_TOKEN_SECRET
  );
  return token;
};

userSchema.methods.generateRefreshToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin
    },
    process.env.REFRESH_TOKEN_SECRET
  );
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    mobile: Joi.number().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255)
  };

  return Joi.object().keys(schema).unknown(true).validate(user);
}

exports.User = User;
exports.validateModel = validateUser;
