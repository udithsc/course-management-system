/**
 * Integration Tests: Authors routes (/api/authors)
 */
export {};
import request from 'supertest';
import app from '../testApp';

const prisma = require('../../db');

let adminToken: string;
let studentToken: string;
let seededAuthorId: string;

beforeAll(async () => {
  const [aR, sR] = await Promise.all([
    request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'admin123' }),
    request(app)
      .post('/api/auth/login')
      .send({ email: 'student@test.com', password: 'student123' }),
  ]);
  adminToken = aR.body.data.accessToken;
  studentToken = sR.body.data.accessToken;
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/authors', () => {
  it('returns paginated authors with auth', async () => {
    const res = await request(app).get('/api/authors').set('x-auth-token', studentToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});

describe('POST /api/authors', () => {
  it('allows admin to create author', async () => {
    const res = await request(app).post('/api/authors').set('x-auth-token', adminToken).send({
      name: 'Test Author',
      profession: 'Tester',
      email: 'tester@test.com',
      mobile: '123456789',
    });
    expect(res.status).toBe(201);
    seededAuthorId = res.body.data.id;
  });

  it('allows admin to create author with minimal payload and file', async () => {
    const res = await request(app)
      .post('/api/authors')
      .set('x-auth-token', adminToken)
      .send({
        name: `MinAuthor${Date.now()}`,
        profession: 'Tester',
        file: 'icon.png',
      });
    expect(res.status).toBe(201);
  });

  it('rejects student from creating author', async () => {
    const res = await request(app)
      .post('/api/authors')
      .set('x-auth-token', studentToken)
      .send({ name: 'Hacker Author', profession: 'Hacker' });
    expect(res.status).toBe(403);
  });
});

describe('GET /api/authors/:id', () => {
  it('returns single author by id', async () => {
    if (!seededAuthorId) return;
    const res = await request(app)
      .get(`/api/authors/${seededAuthorId}`)
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(seededAuthorId);
  });

  it('returns 404 for invalid author id', async () => {
    const res = await request(app)
      .get('/api/authors/00000000-0000-0000-0000-000000000000')
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/authors/:id', () => {
  it('allows admin to update author', async () => {
    if (!seededAuthorId) return;
    const res = await request(app)
      .put(`/api/authors/${seededAuthorId}`)
      .set('x-auth-token', adminToken)
      .send({
        name: 'Updated Author Name',
        profession: 'Senior Tester',
        email: 'tester@test.com',
        mobile: '123456789',
      });
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Updated Author Name');
  });

  it('returns 404 when updating invalid author', async () => {
    const res = await request(app)
      .put('/api/authors/00000000-0000-0000-0000-000000000000')
      .set('x-auth-token', adminToken)
      .send({ name: 'Updated Author Name', profession: 'Senior Tester' });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/authors/:id', () => {
  it('allows admin to delete author', async () => {
    if (!seededAuthorId) return;
    const res = await request(app)
      .delete(`/api/authors/${seededAuthorId}`)
      .set('x-auth-token', adminToken);
    expect(res.status).toBe(200);
  });

  it('returns 404 when deleting invalid author', async () => {
    const res = await request(app)
      .delete('/api/authors/00000000-0000-0000-0000-000000000000')
      .set('x-auth-token', adminToken);
    expect(res.status).toBe(404);
  });
});
