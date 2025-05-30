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
) => {
  if (err instanceof AppError) {
    console.log(`Error:${req.method} ${req.url}-->${err.message}`);
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }
  console.log(`Unhandled error:${req.method} ${req.url}-->${err.message}`);
  res.status(500).json({
    message: "Something went wrong",
  });
};
