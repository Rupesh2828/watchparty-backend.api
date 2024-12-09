// src/types/express.d.ts or your preferred location
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
        user?: { id: number }; // Adjust the type based on what you expect like string, object
    }
  }
}
