const jwt = require('jsonwebtoken');
const Joi = require('joi');

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    },
    process.env.ACCESS_TOKEN_SECRET
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    },
    process.env.REFRESH_TOKEN_SECRET
  );
}

function validateUser(user) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    mobile: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255)
  };

  return Joi.object().keys(schema).unknown(true).validate(user);
}

exports.validateModel = validateUser;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
