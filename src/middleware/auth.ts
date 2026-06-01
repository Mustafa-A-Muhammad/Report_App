import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Missing Authorization header' });
  const parts = (header as string).split(' ');
  if (parts.length !== 2) return res.status(401).json({ message: 'Invalid Authorization header' });
  const token = parts[1];
  const secret = process.env.JWT_ACCESS_SECRET || 'dev_access_secret';
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
