const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');

/**
 * Custom middleware to recursively clean strings in req.body, req.query, and req.params from XSS
 */
const xssClean = (req, res, next) => {
  const clean = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [], // Strip all HTML tags entirely
          allowedAttributes: {},
        });
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        clean(obj[key]);
      }
    }
  };

  clean(req.body);
  clean(req.query);
  clean(req.params);

  next();
};

module.exports = (app) => {
  // 1. Set Security HTTP Headers
  app.use(helmet());

  // 2. Data Sanitization against XSS
  app.use(xssClean);

  // 3. Prevent HTTP Parameter Pollution
  const hpp = require('hpp');
  app.use(hpp());

  // 4. Rate Limiting (General API)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 100 requests per 15m
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', apiLimiter);

  // 4. Strict Rate Limiting for Auth Endpoints
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 login/signup attempts per hour
    message: 'Too many authentication attempts, please try again after an hour',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/signup', authLimiter);
  app.use('/api/auth/forgotPassword', authLimiter);
};
