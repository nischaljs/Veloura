
import logger from './logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, operational = true) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = operational;

    logger.error(`${this.message} | Status: ${this.statusCode}`);

    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError;