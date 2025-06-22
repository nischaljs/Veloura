import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    if (decoded.role !== 'ADMIN') {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};

export const authenticateVendor = (req: Request, res: Response, next: NextFunction): void => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    if (decoded.role !== 'VENDOR' && decoded.role !== 'ADMIN') {
      res.status(403).json({ message: 'Vendor or admin access required' });
      return;
    }
    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
