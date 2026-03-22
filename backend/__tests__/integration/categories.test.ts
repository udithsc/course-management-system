/**
 * Integration Tests: Categories routes (/api/categories)
 */
export {};
import request from 'supertest';
import app from '../testApp';

const prisma = require('../../db');

let adminToken: string;
let studentToken: string;
let seededCategoryId: string;

beforeAll(async () => {
  const [aR, sR] = await Promise.all([
    request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'admin123' }),
    request(app).post('/api/auth/login').send({ email: 'student@test.com', password: 'student123' }),
  ]);
  adminToken = aR.body.data.accessToken;
  studentToken = sR.body.data.accessToken;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/categories', () => {
  it('returns paginated categories with auth', async () => {
    const res = await request(app).get('/api/categories').set('x-auth-token', studentToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

describe('POST /api/categories', () => {
  it('allows admin to create category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('x-auth-token', adminToken)
      .send({ name: 'Test Cat' });
    expect(res.status).toBe(201);
    seededCategoryId = res.body.data.id;
  });

  it('allows admin to create category with file string', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('x-auth-token', adminToken)
      .send({ name: `IC${Math.floor(Math.random() * 99999)}`, file: 'icon.png' });
    expect(res.status).toBe(201);
  });

  it('rejects student from creating category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('x-auth-token', studentToken)
      .send({ name: 'Hacker Category' });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/categories/:id', () => {
  it('returns single category by id', async () => {
    if (!seededCategoryId) return;
    const res = await request(app)
      .get(`/api/categories/${seededCategoryId}`)
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(seededCategoryId);
  });

  it('returns 404 for invalid category', async () => {
    const res = await request(app)
      .get('/api/categories/00000000-0000-0000-0000-000000000000')
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/categories/:id', () => {
  it('allows admin to update category', async () => {
    if (!seededCategoryId) return;
    const res = await request(app)
      .put(`/api/categories/${seededCategoryId}`)
      .set('x-auth-token', adminToken)
      .send({ name: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated');
  });

  it('returns 404 when updating invalid category', async () => {
    const res = await request(app)
      .put('/api/categories/00000000-0000-0000-0000-000000000000')
      .set('x-auth-token', adminToken)
      .send({ name: 'Updated' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/categories/:id', () => {
  it('allows admin to delete category', async () => {
    if (!seededCategoryId) return;
    const res = await request(app)
      .delete(`/api/categories/${seededCategoryId}`)
      .set('x-auth-token', adminToken);
    expect(res.status).toBe(200);
  });

  it('returns 404 when deleting invalid category', async () => {
    const res = await request(app)
      .delete('/api/categories/00000000-0000-0000-0000-000000000000')
      .set('x-auth-token', adminToken);
    expect(res.status).toBe(404);
  });
});
