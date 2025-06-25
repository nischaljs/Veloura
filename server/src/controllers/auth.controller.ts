import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Email already in use' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
      },
    });
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ 
      message: 'User registered', 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        role: user.role 
      } 
    });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      res.status(400).json({ message: 'Missing identifier or password' });
      return;
    }
    // Find user by email or phone
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Logged out' });
  return;
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // userId is set by auth middleware
    const userId = (req as any).userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

// 🔴 Yet to implement routes
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }
    
    // TODO: Implement refresh token logic
    res.status(501).json({ 
      success: false, 
      message: 'Refresh token functionality yet to be implemented' 
    });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    
    // TODO: Implement forgot password logic
    res.status(501).json({ 
      success: false, 
      message: 'Forgot password functionality yet to be implemented' 
    });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      res.status(400).json({ message: 'Token and new password are required' });
      return;
    }
    
    // TODO: Implement reset password logic
    res.status(501).json({ 
      success: false, 
      message: 'Reset password functionality yet to be implemented' 
    });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ message: 'Verification token is required' });
      return;
    }
    
    // TODO: Implement email verification logic
    res.status(501).json({ 
      success: false, 
      message: 'Email verification functionality yet to be implemented' 
    });
    return;
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
    return;
  }
};
