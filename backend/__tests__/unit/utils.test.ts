/**
 * Unit Tests: Middleware & Utility functions
 * These run in pure Node.js without HTTP — no DB needed.
 */
export {};

// // 1. AppError utility
// const AppError = require('../../utils/AppError');
describe('AppError', () => {
  it('creates an error with message and status', () => {
    const err = new AppError('Not found', 404);
    expect(err.message).toBe('Not found');
    expect(err.statusCode).toBe(404);
    expect(err instanceof Error).toBe(true);
  });

  it('keeps status undefined if not provided but sets isOperational', () => {
    const err = new AppError('Oops');
    expect(err.statusCode).toBeUndefined();
    expect(err.isOperational).toBe(true);
  });
});

// // 2. Response helpers
// const { success, created, paginated, message } = require('../../utils/response');
function mockRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('response helpers', () => {
  it('success() sends 200 with data', () => {
    const res = mockRes();
    success(res, { id: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { id: 1 } }));
  });

  it('created() sends 201 with data', () => {
    const res = mockRes();
    created(res, { id: 2 });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { id: 2 } }));
  });

  it('message() sends 200 with message string', () => {
    const res = mockRes();
    message(res, 'Done!');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Done!' }));
  });

  it('paginated() includes pagination metadata', () => {
    const res = mockRes();
    paginated(res, { data: [], totalElements: 10, pageNo: 0, totalPages: 2 });
    expect(res.status).toHaveBeenCalledWith(200);
    const arg = res.json.mock.calls[0][0];
    expect(arg.meta).toMatchObject({
      totalElements: 10,
      pageNo: 0,
      totalPages: 2,
    });
  });
});

// // 3. Admin middleware
// const adminMiddleware = require('../../middleware/admin');
describe('admin middleware', () => {
  it('calls next() when user.isAdmin is true', () => {
    const req: any = { user: { isAdmin: true } };
    const res: any = {};
    const next = jest.fn();
    adminMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('throws AppError when user.isAdmin is false', () => {
    const req: any = { user: { isAdmin: false } };
    const res: any = {};
    const next = jest.fn();
    expect(() => adminMiddleware(req, res, next)).toThrow();
  });
});

// // 4. Instructor middleware
// const instructorMiddleware = require('../../middleware/instructor');
describe('instructor middleware', () => {
  it('allows INSTRUCTOR role', () => {
    const req: any = { user: { role: 'INSTRUCTOR' } };
    const next = jest.fn();
    instructorMiddleware(req, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('allows ADMIN role', () => {
    const req: any = { user: { role: 'ADMIN' } };
    const next = jest.fn();
    instructorMiddleware(req, {} as any, next);
    expect(next).toHaveBeenCalled();
  });

  it('throws for STUDENT role', () => {
    const req: any = { user: { role: 'STUDENT' } };
    expect(() => instructorMiddleware(req, {} as any, jest.fn())).toThrow();
  });
});

// // 5. User model validation helper
// const { validateModel } = require('../../models/user.model');
describe('user validateModel', () => {
  it('passes with valid user data', () => {
    const { error } = validateModel({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      mobile: '1234567890',
    });
    expect(error).toBeUndefined();
  });

  it('fails when email is missing', () => {
    const { error } = validateModel({
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
    });
    expect(error).toBeDefined();
  });

  it('fails when email is invalid', () => {
    const { error } = validateModel({
      username: 'testuser',
      email: 'not-an-email',
      firstName: 'Test',
      lastName: 'User',
    });
    expect(error).toBeDefined();
  });
});
