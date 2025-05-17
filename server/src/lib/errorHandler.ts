// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import  AppError  from './AppError';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };

  // Prisma specific errors
  if (err?.code === 'P2002') {
    const message = 'Unique constraint failed';
    error = new AppError(message, 400);
  } else if (err?.code === 'P2025') {
    const message = 'Record not found';
    error = new AppError(message, 404);
  }

  // If not an AppError, convert it
  if (!(error instanceof AppError)) {
    console.error('Unhandled error:', err);
    error = new AppError('Internal server error', 500);
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    statusCode: error.statusCode,
  });
};

export default errorHandler;