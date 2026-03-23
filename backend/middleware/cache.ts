import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 60 }); // Default Cache for 60 seconds

export const routeCache =
  (durationInSeconds = 60) =>
  (req: any, res: any, next: any) => {
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
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(key, body, durationInSeconds);
      // Call the original res.json
      return originalJson(body);
    };

    next();
  };

export const clearCachePrefix =
  (prefix = '/api/') =>
  (req: any, res: any, next: any) => {
    // Clear cache AFTER the mutation finishes successfully
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
