import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { TSimplifiedErrorResponse } from '../interface/errorResponse';

const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): TSimplifiedErrorResponse => {
  const errorSources = Object.values(err.errors).map(
    (error: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: error?.path,
        message: error?.message,
      };
    },
  );
  return {
    errorSources,
    message: 'Validation Error!',
    statusCode: httpStatus.BAD_REQUEST,
  };
};

export default handleMongooseValidationError;
