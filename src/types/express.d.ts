// express.d.ts (or custom.d.ts)
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      context?: {
        user: { userId: number; email: string }; // Customize based on your decoded token structure
      };
    }
  }
}
