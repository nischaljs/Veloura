export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AuthError extends AppError {
  constructor(message: string = "Authentication failed", details?: any) {
    super(message, 401, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", details?: any) {
    super(message, 404, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", details?: any) {
    super(message, 400, details);
  }
}





export const AppResponse = (res: any, data: any = null, message: string = "Success", statusCode: number = 200) => {
  return res.status(statusCode).json({
    status: true,
    message,
    data
  });
};

export const errorHandler = (err: any, req: any, res: any, next: any) => {
  if (err instanceof AppError) {
    return AppResponse(res, err.details, err.message, err.statusCode);
  }

  console.error(`Unhandled error: ${req.method} ${req.url} --> ${err.message}`);
  return AppResponse(res, null, "Something went wrong", 500);
};
