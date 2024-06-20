/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { TErrorSources } from '../interface/error';
import config from '../config';
import { handleZodError } from '../errors/handleZodError';
import handleMongooseValidationError from '../errors/handleMongooseValidationError';
import handleCastError from '../errors/handleCastError';
import { AppError } from '../errors/AppError';
import httpStatus from 'http-status';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err.code === 11000) {
    message = 'Duplicate Error!';
    statusCode = httpStatus.BAD_REQUEST;
    const pathKeys = Object.keys(err.keyValue);
    const regex = /"([^"]+)"/;
    const match = err.message.match(regex);
    const extractedPath = match[1];
    errorSources = [
      {
        path: pathKeys[0],
        message: `${extractedPath} is already taken`,
      },
    ];
  } else if (err instanceof AppError) {
    errorSources = [
      {
        path: err.path ? err.path : '',
        message: err.message,
      },
    ];
    statusCode = err.statusCode;
  } else if (err instanceof Error) {
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
};
