const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 60 }); // Default Cache for 60 seconds

/**
 * Middleware to cache GET responses in memory.
 * Intercepts res.json() to save payloads to cache before emitting.
 */
const routeCache = (durationInSeconds = 60) => (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  // Cache key is the full URL (including query string)
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`[Cache] HIT for ${key}`);
    return res.json(cachedResponse);
  }

  // Intercept res.json
  const originalJson = res.json;
  res.json = (body) => {
    cache.set(key, body, durationInSeconds);
    // Call the original res.json
    originalJson.call(res, body);
  };
  
  next();
};

/**
 * Helper to manually invalidate cache prefixes on mutations (POST/PUT/DELETE)
 */
const clearCachePrefix = (prefix = '/api/') => (req, res, next) => {
  // Clear cache AFTER the mutation finishes successfully
  // so hook into res.on('finish') or just clear it now.
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      const keys = cache.keys();
      for (const key of keys) {
        if (key.startsWith(prefix)) {
          cache.del(key);
        }
      }
      console.log(`[Cache] CLEARED prefix ${prefix} due to ${req.method}`);
    }
  });
  next();
};

module.exports = { routeCache, clearCachePrefix };
