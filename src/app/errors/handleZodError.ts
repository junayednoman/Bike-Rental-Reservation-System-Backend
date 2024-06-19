import { ZodError, ZodIssue } from 'zod';
import { TErrorSources } from '../interface/error';
import { TSimplifiedErrorResponse } from '../interface/errorResponse';

export const handleZodError = (err: ZodError): TSimplifiedErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  return {
    statusCode: 501,
    message: 'Validation Error!',
    errorSources,
  };
};
