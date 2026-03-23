import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { validateSchema } from '../utils/validation';

// Token expiry constants
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export function generateAccessToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role || 'STUDENT',
      isAdmin: user.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );
}

export function generateRefreshToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role || 'STUDENT',
      isAdmin: user.isAdmin,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );
}

export function validateUser(user: any) {
  const schema = z
    .object({
      username: z.string().min(3).max(50),
      firstName: z.string().min(2).max(50),
      lastName: z.string().min(2).max(50),
      mobile: z.string(),
      email: z.string().min(5).max(255).email(),
      password: z.string().min(5).max(255).optional(),
    })
    .passthrough();

  return validateSchema(schema, user);
}

export function validateLogin(data: any) {
  const schema = z.object({
    email: z.string().min(5).max(255).email(),
    password: z.string().min(5).max(255),
  });

  return validateSchema(schema, data);
}

export function validateChangePassword(data: any) {
  const schema = z.object({
    password: z.string().min(5).max(255),
    newPassword: z.string().min(5).max(255),
  });

  return validateSchema(schema, data);
}

export const validateModel = validateUser;

