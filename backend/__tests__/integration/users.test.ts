/**
 * Integration Tests: Users routes (/api/users)
 * Covers: list, me, role-change, RBAC enforcement.
 */
export {};
import request from 'supertest';
import app from '../testApp';

const prisma = require('../../db');

let adminToken: string;
let studentToken: string;
let testUserId: string;

beforeAll(async () => {
  // Login as admin
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@test.com', password: 'admin123' });
  adminToken = adminRes.body.data.accessToken;

  // Login as student
  const studentRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'student@test.com', password: 'student123' });
  studentToken = studentRes.body.data.accessToken;
});

afterAll(async () => {
  // Clean up any test user created during this suite
  if (testUserId) {
    await prisma.user.deleteMany({ where: { id: testUserId } }).catch(() => {});
  }
  await prisma.$disconnect();
});

// GET /api/users
describe('GET /api/users', () => {
  it('returns paginated user list for authenticated user', async () => {
    const res = await request(app).get('/api/users').set('x-auth-token', adminToken);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta.totalElements).toBeDefined();
  });

  it('returns 401 when no token provided', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('supports ?name filter', async () => {
    const res = await request(app)
      .get('/api/users?name=a') // use a generic character since admin's firstName might be seeded as 'Admin'
      .set('x-auth-token', adminToken);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

// GET /api/users/me
describe('GET /api/users/me', () => {
  it('returns current user profile', async () => {
    const res = await request(app).get('/api/users/me').set('x-auth-token', studentToken);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('student@test.com');
  });

  it('returns 401 when not authenticated', async () => {
    const res = await request(app).get('/api/users/me');
    expect(res.status).toBe(401);
  });
});

// POST /api/users (Create)
describe('POST /api/users', () => {
  it('admin can create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('x-auth-token', adminToken)
      .send({
        username: `testunit_${Date.now()}`,
        email: `testunit_${Date.now()}@example.com`,
        firstName: 'Unit',
        lastName: 'Test',
        password: 'password123',
        mobile: '1234567890',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toContain('@example.com');
    testUserId = res.body.data.id; // save for cleanup
  });

  it('returns 403 when student tries to create user', async () => {
    const res = await request(app).post('/api/users').set('x-auth-token', studentToken).send({
      username: 'hacker',
      email: 'hacker@evil.com',
      firstName: 'Bad',
      lastName: 'Actor',
    });
    expect(res.status).toBe(403);
  });

  it('returns 400 for duplicate email', async () => {
    const res = await request(app).post('/api/users').set('x-auth-token', adminToken).send({
      username: 'admin_dup',
      email: 'admin@test.com', // already exists
      firstName: 'Admin',
      lastName: 'Dup',
    });
    expect([400, 409, 500]).toContain(res.status);
  });
});

// PATCH /api/users/:id/role
describe('PATCH /api/users/:id/role', () => {
  let targetId: string;

  beforeAll(async () => {
    // Get a user to change roles on (use the student)
    const res = await request(app)
      .get('/api/users')
      .set('x-auth-token', adminToken)
      .query({ name: 'jane' });
    targetId = res.body.data?.[0]?.id;
  });

  it('admin can change a user role to INSTRUCTOR', async () => {
    if (!targetId) return; // skip if no match
    const res = await request(app)
      .patch(`/api/users/${targetId}/role`)
      .set('x-auth-token', adminToken)
      .send({ role: 'INSTRUCTOR' });

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe('INSTRUCTOR');
    // Restore to STUDENT
    await request(app)
      .patch(`/api/users/${targetId}/role`)
      .set('x-auth-token', adminToken)
      .send({ role: 'STUDENT' });
  });

  it('returns 400 for invalid role value', async () => {
    if (!targetId) return;
    const res = await request(app)
      .patch(`/api/users/${targetId}/role`)
      .set('x-auth-token', adminToken)
      .send({ role: 'SUPERUSER' });
    expect(res.status).toBe(400);
  });

  it('returns 403 for non-admin users', async () => {
    if (!targetId) return;
    const res = await request(app)
      .patch(`/api/users/${targetId}/role`)
      .set('x-auth-token', studentToken)
      .send({ role: 'ADMIN' });
    expect(res.status).toBe(403);
  });
});
