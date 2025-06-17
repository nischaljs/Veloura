export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational: boolean,
    details?: any,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this);
  }
}

//NotFoundError
export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", details?: any) {
    super(message, 404, false, details);
  }
}

//ValidationError
export class ValidationError extends AppError {
  constructor(message: string = "Invalid request data", details?: any) {
    super(message, 400, true, details);
  }
}

//AuthenticationError
export class AuthenticationError extends AppError {
  constructor(message: string = "Unauthorized", details?: any) {
    super(message, 401, true, details);
  }
}

// ForbiddenError(insufficient permissions)
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden", details?: any) {
    super(message, 403, true, details);
  }
}

//database error
export class DatabaseError extends AppError {
  constructor(message: string = "Database error", details?: any) {
    super(message, 500, false, details);
  }
}

//rate limit exceeded
export class RateLimitExceededError extends AppError {
  constructor(message: string = "Too many requests", details?: any) {
    super(message, 429, true, details);
  }
}
