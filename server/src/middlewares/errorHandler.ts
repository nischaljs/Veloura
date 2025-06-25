import { Request, Response, NextFunction } from 'express';

// Global error handler middleware
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log the error (could be enhanced with a logger)
  console.error(err);

  // Set status code (default to 500 if not set)
  const status = err.status || 500;

  // Send sanitized error response
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Optionally, add a code or type for frontend to handle specific errors
    // code: err.code || undefined
  });
} 