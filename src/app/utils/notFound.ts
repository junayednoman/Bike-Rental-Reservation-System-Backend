/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const statusCode = 404;
  return res.status(statusCode).json({
    success: false,
    statusCode: 404,
    message: 'Route Not Found!',
  });
};
