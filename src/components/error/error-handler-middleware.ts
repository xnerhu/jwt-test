import { NextFunction, Request, Response } from 'express';
import { AppError } from './app-error';

import { ErrorHandler } from './error-handler';

interface IDeps {
  errorHandler: ErrorHandler;
}

export const withErrorHandler = ({ errorHandler }: IDeps) => (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message, statusCode = 500 } = err as AppError;
  const trusted = errorHandler.isTrusted(err);

  errorHandler.handle(err);

  res.status(statusCode).json({
    success: false,
    error: trusted ? message : 'Internal error',
    errorCode: statusCode,
  });
};
