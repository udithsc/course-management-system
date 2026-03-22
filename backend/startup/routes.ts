const express = require('express');
const auth = require('../routes/auth');
const users = require('../routes/users');
const courses = require('../routes/courses');
const categories = require('../routes/categories');
const authors = require('../routes/authors');
const error = require('../middleware/error');

module.exports = (app) => {
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', (req, res) =>
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  );

  // API routes
  app.use('/api/auth', auth);
  app.use('/api/users', users);
  app.use('/api/courses', courses);
  app.use('/api/categories', categories);
  app.use('/api/authors', authors);

  // Catch-all utility for unhandled API routes (404)
  const AppError = require('../utils/AppError');
  app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
  });

  // Global error handler (must be last)
  app.use(error);
};
