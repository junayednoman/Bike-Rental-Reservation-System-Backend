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

const returnBike = catchAsyncError(async (req, res) => {
  const id = req?.params?.id;
  const result = await RentalServices.returnBike(id);
  successResponse(res, {
    message: 'Bike returned successfully',
    data: result,
  });
});

const getAllRentals = catchAsyncError(async (req, res) => {
  const token = req?.headers?.authorization as string;
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  const result = await RentalServices.getAllRentalsFromDb(decoded);
  successResponse(res, {
    message: 'Rentals retrieved successfully',
    data: result,
  });
});

export const RentalControllers = { createRental, returnBike, getAllRentals };
