const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Token expiry constants
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role || 'STUDENT',
      isAdmin: user.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role || 'STUDENT',
      isAdmin: user.isAdmin,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );
}

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    mobile: Joi.string().required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255),
  }).unknown(true);

  return schema.validate(user);
}

function validateLogin(data) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(data);
}

function validateChangePassword(data) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
    newPassword: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(data);
}

exports.validateModel = validateUser;
exports.validateLogin = validateLogin;
exports.validateChangePassword = validateChangePassword;
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
