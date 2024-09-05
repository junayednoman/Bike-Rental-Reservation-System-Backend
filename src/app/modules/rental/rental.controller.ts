import httpStatus from 'http-status';
import config from '../../config';
import { AppError } from '../../errors/AppError';
import catchAsyncError from '../../utils/catchAsyncError';
import handleDataNotFound from '../../utils/dataNotFound';
import successResponse from '../../utils/successResponse';
import { RentalServices } from './rental.service';
import jwt, { JwtPayload } from 'jsonwebtoken';

const createRental = catchAsyncError(async (req, res) => {
  const authHeader = req?.headers?.authorization as string;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
  }
  const token = authHeader.split(' ')[1];

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
  const queryData = req?.query;
  const { myRentals, ...query } = queryData;
  let decoded;
  if (myRentals) {
    const authHeader = req?.headers?.authorization as string;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }
    const token = authHeader.split(' ')[1];

    const decodedInfo = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    decoded = decodedInfo;
  }
console.log(typeof myRentals);

  const result = await RentalServices.getAllRentalsFromDb(
    decoded as JwtPayload,
    query,
    myRentals
  );
  handleDataNotFound(result, res);
  successResponse(res, {
    message: 'Rentals retrieved successfully',
    data: result,
  });
});

export const RentalControllers = { createRental, returnBike, getAllRentals };
