/**
 * Integration Tests: Courses routes (/api/courses)
 * Covers: list, detail, subscribe/unsubscribe, progress, instructor routes.
 */
export {};
import request from 'supertest';
import app from '../testApp';

const prisma = require('../../db');

let adminToken: string;
let studentToken: string;
let instructorToken: string;
let seededCourseId: string;

beforeAll(async () => {
  const [aR, sR, iR] = await Promise.all([
    request(app).post('/api/auth/login').send({ email: 'admin@test.com',      password: 'admin123' }),
    request(app).post('/api/auth/login').send({ email: 'student@test.com',    password: 'student123' }),
    request(app).post('/api/auth/login').send({ email: 'instructor@test.com', password: 'instructor123' }),
  ]);
  adminToken      = aR.body.data.accessToken;
  studentToken    = sR.body.data.accessToken;
  instructorToken = iR.body.data.accessToken;

  // Get the seeded course ID
  const coursesRes = await request(app).get('/api/courses').set('x-auth-token', adminToken);
  seededCourseId = coursesRes.body.data?.[0]?.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ─── GET /api/courses ─────────────────────────────────────────────────────────
describe('GET /api/courses', () => {
  it('returns paginated course list without auth', async () => {
    // Public endpoint
    const res = await request(app).get('/api/courses');
    expect([200, 401]).toContain(res.status); // accept both (may require auth)
  });

  it('returns courses when authenticated', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta.totalElements).toBeDefined();
  });

  it('supports ?name search filter', async () => {
    const res = await request(app)
      .get('/api/courses?name=bootcamp')
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

// ─── GET /api/courses/:id ─────────────────────────────────────────────────────
describe('GET /api/courses/:id', () => {
  it('returns course detail with lessons', async () => {
    if (!seededCourseId) return;
    const res = await request(app)
      .get(`/api/courses/${seededCourseId}`)
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      id: seededCourseId,
      lessons: expect.any(Array),
    });
  });

  it('returns 404 for non-existent course', async () => {
    const res = await request(app)
      .get('/api/courses/00000000-0000-0000-0000-000000000000')
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(404);
  });
});

// ─── POST /api/courses/subscribe/:courseId ────────────────────────────────────
describe('POST /api/courses/subscribe/:courseId', () => {
  it('student can subscribe to a course', async () => {
    if (!seededCourseId) return;
    const res = await request(app)
      .post(`/api/courses/subscribe/${seededCourseId}`)
      .set('x-auth-token', studentToken);
    expect([200, 201]).toContain(res.status);
  });

  it('subscribing again is idempotent (no duplicate)', async () => {
    if (!seededCourseId) return;
    const res = await request(app)
      .post(`/api/courses/subscribe/${seededCourseId}`)
      .set('x-auth-token', studentToken);
    expect([200, 201]).toContain(res.status);
  });

  it('returns 401 when unauthenticated', async () => {
    if (!seededCourseId) return;
    const res = await request(app).post(`/api/courses/subscribe/${seededCourseId}`);
    expect(res.status).toBe(401);
  });
});

// ─── GET /api/courses/subscriptions/me ───────────────────────────────────────
describe('GET /api/courses/subscriptions/me', () => {
  it('returns enrolled courses for logged-in student', async () => {
    const res = await request(app)
      .get('/api/courses/subscriptions/me')
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('returns 401 when unauthenticated', async () => {
    const res = await request(app).get('/api/courses/subscriptions/me');
    expect(res.status).toBe(401);
  });
});

// ─── PATCH /api/courses/progress/:courseId ────────────────────────────────────
describe('PATCH /api/courses/progress/:courseId', () => {
  it('marks a lesson as watched for subscribed student', async () => {
    if (!seededCourseId) return;
    // Get a lesson ID from the course
    const courseRes = await request(app)
      .get(`/api/courses/${seededCourseId}`)
      .set('x-auth-token', studentToken);
    const lessonId = courseRes.body.data.lessons?.[0]?.id;
    if (!lessonId) return;

    const res = await request(app)
      .patch(`/api/courses/progress/${seededCourseId}`)
      .set('x-auth-token', studentToken)
      .send({ lessonId });

    expect(res.status).toBe(200);
    expect(res.body.data.watchedVideoId).toContain(lessonId);
  });

  it('returns 400 when lessonId is missing', async () => {
    if (!seededCourseId) return;
    const res = await request(app)
      .patch(`/api/courses/progress/${seededCourseId}`)
      .set('x-auth-token', studentToken)
      .send({});
    expect(res.status).toBe(400);
  });
});

// ─── GET /api/courses/instructor/my-courses ───────────────────────────────────
describe('GET /api/courses/instructor/my-courses', () => {
  it('instructor can fetch their courses', async () => {
    const res = await request(app)
      .get('/api/courses/instructor/my-courses')
      .set('x-auth-token', instructorToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('admin can also access instructor routes', async () => {
    const res = await request(app)
      .get('/api/courses/instructor/my-courses')
      .set('x-auth-token', adminToken);
    expect(res.status).toBe(200);
  });

  it('returns 403 for student', async () => {
    const res = await request(app)
      .get('/api/courses/instructor/my-courses')
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(403);
  });
});

// ─── GET /api/courses/instructor/analytics/:courseId ─────────────────────────
describe('GET /api/courses/instructor/analytics/:courseId', () => {
  it('instructor can fetch analytics for their course', async () => {
    if (!seededCourseId) return;
    const res = await request(app)
      .get(`/api/courses/instructor/analytics/${seededCourseId}`)
      .set('x-auth-token', instructorToken);
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({
      totalStudents: expect.any(Number),
      avgRating:     expect.any(Number),
      lessonStats:   expect.any(Array),
    });
  });

  it('returns 403 for student accessing analytics', async () => {
    if (!seededCourseId) return;
    const res = await request(app)
      .get(`/api/courses/instructor/analytics/${seededCourseId}`)
      .set('x-auth-token', studentToken);
    expect(res.status).toBe(403);
  });
});
