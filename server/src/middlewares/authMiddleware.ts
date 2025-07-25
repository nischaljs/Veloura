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
  console.log('authenticateVendor middleware entered');
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
    console.log('Token found in Authorization header');
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token found in cookies');
  }
  if (!token) {
    console.log('No token provided');
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  console.log('Token:', token);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    console.log('Token decoded:', decoded);
    if (decoded.role !== 'VENDOR' && decoded.role !== 'ADMIN') {
      console.log('Access denied: Incorrect role', decoded.role);
      res.status(403).json({ message: 'Vendor or admin access required' });
      return;
    }
    (req as any).userId = decoded.userId;
    (req as any).role = decoded.role;
    // Look up vendorId for this user
    if (decoded.role === 'VENDOR' || decoded.role === 'ADMIN') {
      const prisma = require('../utils/prisma').default;
      prisma.vendor.findFirst({ where: { userId: decoded.userId } }).then((vendor: any) => {
        if (vendor) {
          (req as any).vendorId = vendor.id;
        }
        next();
      }).catch((err: any) => {
        res.status(500).json({ message: 'Error looking up vendor profile' });
      });
      return;
    }
    console.log('Authentication successful, calling next()');
    next();
  } catch (err) {
    console.log('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
};
