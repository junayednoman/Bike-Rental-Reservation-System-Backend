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

  const { rentalData, paymentInfo } = req.body;
  const result = await RentalServices.createRentalIntoDb(
    rentalData,
    decoded,
    paymentInfo,
  );
  successResponse(res, {
    message: 'Rental created successfully',
    status: 201,
    data: result,
  });
});

const returnBike = catchAsyncError(async (req, res) => {
  const id = req?.params?.id;
  const { rentalEndTime } = req.body;
  const result = await RentalServices.returnBike(id, rentalEndTime);
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

  const result = await RentalServices.getAllRentalsFromDb(
    decoded as JwtPayload,
    query,
    myRentals as string,
  );
  handleDataNotFound(result, res);
  successResponse(res, {
    message: 'Rentals retrieved successfully',
    data: result,
  });
});

const advancePaymentSuccess = catchAsyncError(async (req, res) => {
  const transactionId = req?.params?.transactionId;
  await RentalServices.makeAdvancePaymentSuccess(transactionId);
  res.redirect(
    `http://localhost:5173/dashboard/user/my-rentals?booking=confirmed`,
  );
});

const advancePaymentFail = catchAsyncError(async (req, res) => {
  const transactionId = req?.params?.transactionId;
  await RentalServices.makeAdvancePaymentFail(transactionId);
  res.redirect(`http://localhost:5173/advance-payment-failure`);
});

const getSingleRental = catchAsyncError(async (req, res) => {
  const id = req?.params?.id;
  const result = await RentalServices.getSingleRentalFromDb(id);
  successResponse(res, {
    message: 'Rental retrieved successfully',
    data: result,
  });
});

const makePayment = catchAsyncError(async (req, res) => {
  const id = req?.params?.id;
  const paymentInfo = req.body;
  const result = await RentalServices.makePayment(id, paymentInfo);
  successResponse(res, {
    message: result.message || 'Payment initiated successfully',
    data: result,
  });
});

const paymentSuccess = catchAsyncError(async (req, res) => {
  const transactionId = req?.params?.transactionId;
  const rentalId = req?.params?.rentalId;
  await RentalServices.paymentSuccess(transactionId, rentalId);
  res.redirect(`http://localhost:5173/payment-success/${transactionId}`);
});

const paymentFail = catchAsyncError(async (req, res) => {
  const transactionId = req?.params?.transactionId;
  await RentalServices.paymentFail(transactionId);
  res.redirect(`http://localhost:5173/payment-failure`);
});

export const RentalControllers = {
  createRental,
  returnBike,
  getAllRentals,
  advancePaymentSuccess,
  advancePaymentFail,
  getSingleRental,
  makePayment,
  paymentSuccess,
  paymentFail,
};
