import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { Express } from 'express';

export const configureMiddleware = (app: Express) => {
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000 // limit each IP to 1000 requests per windowMs
  });

  // Apply rate limiting to all routes
  app.use(limiter);

  // Compression middleware
  app.use(compression());
};

// Specific rate limits for auth routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message: 'Too many accounts created from this IP, please try again after an hour'
});
