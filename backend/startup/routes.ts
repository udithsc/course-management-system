import express from 'express';
import auth from '../routes/auth';
import users from '../routes/users';
import courses from '../routes/courses';
import categories from '../routes/categories';
import authors from '../routes/authors';
import auditLogs from '../routes/auditLogs';
import error from '../middleware/error';
import AppError from '../utils/AppError';

export default (app: any) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req: any, res: any) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() }),
  );

  // API routes
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/courses', courses);
  app.use('/api/categories', categories);
  app.use('/api/authors', authors);
  app.use('/api/audit-logs', auditLogs);

  // Catch-all utility for unhandled API routes (404)
  app.use((req: any, res: any, next: any) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
  });

  // Global error handler (must be last)
  app.use(error);
};
