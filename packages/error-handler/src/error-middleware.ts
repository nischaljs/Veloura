import { AppError } from "./AppError";
import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Ensure we have a valid response object
  if (!res || typeof res.status !== 'function') {
    console.error('Invalid response object in error middleware');
    next(err);
    return;
  }

  if (err instanceof AppError) {
    console.log(`Error:${req.method} ${req.url}-->${err.message}`);
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  console.log(`Unhandled error:${req.method} ${req.url}-->${err.message}`);
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
