import mongoose from 'mongoose';
import { TSimplifiedErrorResponse } from '../interface/errorResponse';
import { TErrorSources } from '../interface/error';

const handleCastError = (
  err: mongoose.Error.CastError,
): TSimplifiedErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  return {
    message: 'Cast Error!',
    errorSources,
  };
};

export default handleCastError;
