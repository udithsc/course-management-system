/**
 * Integration Tests: Auth routes (/api/auth)
 * Uses Supertest — hits a real Express app & real DB.
 * Expects the seeded admin@test.com user to exist.
 */
export {};
import request from 'supertest';
import app from '../testApp';

const prisma = require('../../db');

afterAll(async () => {
  await prisma.$disconnect();
});

describe('POST /api/auth/login', () => {
  it('returns 200 + tokens for valid admin credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    // JWT payload should expose role
    expect(res.body.data.accessToken.split('.').length).toBe(3);
  });

  it('returns 200 + tokens for valid student credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'student@test.com', password: 'student123' });

    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });

  it('returns 400 for missing email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ password: 'admin123' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'not-an-email', password: 'admin123' });

    expect(res.status).toBe(400);
  });

  it('returns 401 for non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@nowhere.com', password: 'admin123' });

    expect(res.status).toBe(401);
  });
});

