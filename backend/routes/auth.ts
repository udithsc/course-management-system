import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import validate from '../middleware/validate';
import auth from '../middleware/auth';
import logger from '../utils/logger';
import AppError from '../utils/AppError';
import { success } from '../utils/response';
import {
  validateModel,
  validateLogin,
  validateChangePassword,
  generateAccessToken,
  generateRefreshToken,
} from '../models/user.model';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import prisma from '../db';

/**
 * Helper to create a verification token.
 */
async function createVerificationToken(userId: string) {
  return await prisma.token.create({
    data: {
      userId,
      token: crypto.randomBytes(32).toString('hex'),
    },
  });
}

// Login
router.post('/login', validate(validateLogin), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  if (!user) throw new AppError('Invalid email or password.', 401);

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) throw new AppError('Invalid email or password.', 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { token: refreshToken },
  });

  logger.info(`login|${user.username}`);

  return success(res, { accessToken, refreshToken });
});

// Signup
router.post('/signup', validate(validateModel), async (req, res) => {
  const { username, email, firstName, lastName, mobile, password } = req.body;

  if (!password) throw new AppError('Password is required.', 400);

  const existingUser = await prisma.user.findUnique({ where: { username } });
  if (existingUser) throw new AppError('Username already taken.', 409);

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) throw new AppError('Email already registered.', 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      firstName,
      lastName,
      mobile: mobile.toString(),
      password: hashedPassword,
    },
  });

  const tokenRecord = await createVerificationToken(user.id);

  // Send verification email
  await sendVerificationEmail(user, tokenRecord.token, req.headers.host!);

  return success(
    res,
    {
      message: `A verification email has been sent to ${user.email}.`,
    },
    201,
  );
});


// Email Confirmation
router.get('/confirmation/:email/:token', async (req, res) => {
  const token = await prisma.token.findFirst({
    where: { token: req.params.token },
  });
  if (!token) {
    throw new AppError('Verification link has expired or is invalid.', 404);
  }

  const user = await prisma.user.findFirst({
    where: { id: token.userId, email: req.params.email },
  });
  if (!user) throw new AppError('User not found.', 404);
  if (user.isVerified) {
    return success(res, {
      message: 'Account is already verified. Please login.',
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
  });

  return success(res, {
    message: 'Your account has been successfully verified.',
  });
});

// Resend Verification Link
router.get('/resendLink/:email', async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { email: req.params.email },
  });
  if (!user) throw new AppError('No user found with that email.', 404);
  if (user.isVerified) {
    throw new AppError('Account is already verified. Please login.', 400);
  }

  const tokenRecord = await createVerificationToken(user.id);

  await sendVerificationEmail(user, tokenRecord.token, req.headers.host!);

  return success(res, {
    message: `A verification email has been sent to ${user.email}.`,
  });
});


// Forgot Password (sends reset token instead of changing password)
router.post('/forgotPassword', async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError('Email is required.', 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // Don't reveal whether user exists — return same response
    return success(res, {
      message: 'If that email is registered, a reset code has been sent.',
    });
  }

  // Generate a 6-character reset code
  const resetCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  const resetCodeHash = await bcrypt.hash(resetCode, 10);

  // Store the reset code as a token
  await prisma.token.create({
    data: {
      userId: user.id,
      token: resetCodeHash,
    },
  });

  await sendPasswordResetEmail(user, resetCode);

  return success(res, {
    message: 'If that email is registered, a reset code has been sent.',
  });
});


// Change Password (authenticated)
router.post('/changePassword', [auth, validate(validateChangePassword)], async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) throw new AppError('User not found.', 404);

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) throw new AppError('Current password is incorrect.', 400);

  const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  logger.info(`password_changed|${user.username}`);

  return success(res, { message: 'Password changed successfully.' });
});

// Refresh Token
router.get('/tokens/:token', async (req, res) => {
  const token = req.params.token;
  if (!token) throw new AppError('Refresh token is required.', 400);

  const user = await prisma.user.findFirst({ where: { token } });
  if (!user) throw new AppError('Invalid refresh token.', 401);

  try {
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new AppError('Refresh token has expired. Please login again.', 403);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await prisma.user.update({
    where: { id: user.id },
    data: { token: refreshToken },
  });

  return success(res, { accessToken, refreshToken });
});

export default router;
