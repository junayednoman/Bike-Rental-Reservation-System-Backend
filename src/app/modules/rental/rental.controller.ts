import config from '../../config';
import catchAsyncError from '../../utils/catchAsyncError';
import successResponse from '../../utils/successResponse';
import { RentalServices } from './rental.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

const createRental = catchAsyncError(async (req, res) => {
  const token = req.headers.authorization as string;
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;
  const rentalData = req.body;
  const result = await RentalServices.createRentalIntoDb(rentalData, decoded);
  successResponse(res, {
    message: 'Rental created successfully',
    status: 201,
    data: result,
  });
});

export const RentalControllers = { createRental };
