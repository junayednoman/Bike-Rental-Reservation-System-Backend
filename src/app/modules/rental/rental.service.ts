/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TRental } from './rental.interface';
import { RentalModel } from './rental.model';
import { UserModel } from '../auth/auth.model';
import mongoose, { Types } from 'mongoose';
import { BikeModel } from '../bike/bike.model';
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { TPaymentInfo } from '../payment/payment.interface';
import { initiatePayment } from '../payment/payment.utils';

export const BikeSearchableFields = ['name', 'brand', 'cc', 'price'];

const createRentalIntoDb = async (
  payload: TRental,
  decodedInfo: JwtPayload,
  paymentInfo: TPaymentInfo,
) => {
  paymentInfo.success_url = `http://localhost:5000/api/rentals/advance-payment-success`;
  paymentInfo.fail_url = `http://localhost:5000/api/rentals/advance-payment-fail`;
  const paymentInit = await initiatePayment(paymentInfo);
  if (!paymentInit?.url) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Payment initiation failed!');
  }

  const { email, role } = decodedInfo;
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const user = await UserModel.findOne({ email, role }).select('_id');
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }
    const userId = user._id as Types.ObjectId;
    payload.userId = userId;
    payload.isAdvancePaid = false;
    payload.advanceTransactionId = paymentInit?.transactionId;

    const result = await RentalModel.create([payload], { session });

    await session.commitTransaction();
    return { result, paymentInitUrl: paymentInit?.url };
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || 'Failed to create rental',
    );
  } finally {
    session.endSession();
  }
};

const makeAdvancePaymentSuccess = async (transactionId: string) => {
  const result = await RentalModel.findOneAndUpdate(
    {
      advanceTransactionId: transactionId,
    },
    { isAdvancePaid: true },
  );

  if (result) {
    await BikeModel.findOneAndUpdate(
      { _id: result?.bikeId },
      {
        isAvailable: false,
      },
    );
  }
  return result;
};

const makeAdvancePaymentFail = async (transactionId: string) => {
  const result = await RentalModel.findOneAndDelete({
    advanceTransactionId: transactionId,
  });
  return result;
};

const returnBike = async (id: string, rentalEndTime: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const rental = await RentalModel.findOne({ _id: id }).select(
      'startTime bikeId',
    );

    if (!rental) {
      throw new AppError(httpStatus.NOT_FOUND, 'Invalid rental ID!', 'id');
    }

    // throw error if bike is not available
    const bike = await BikeModel.findOne({ _id: rental.bikeId });
    if (!bike) {
      throw new AppError(httpStatus.NOT_FOUND, 'Invalid bike ID!', 'id');
    }

    // calculate rental cost based on time
    const startTime = new Date(`1970-01-01T${rental?.startTime}:00`);
    const endTime = new Date(`1970-01-01T${rentalEndTime}:00`);

    if (endTime <= startTime) {
      {
        throw new AppError(
          httpStatus.CONFLICT,
          'End time must be later than start time!',
        );
      }
    }

    const diffInMilliseconds = endTime.getTime() - startTime.getTime();
    const rentalTimeInHours = diffInMilliseconds / (1000 * 60 * 60);
    const totalCost = rentalTimeInHours * bike?.pricePerHour;

    const updateDoc = {
      isReturned: true,
      returnTime: rentalEndTime,
      totalCost: totalCost.toFixed(3),
    };
    const result = await RentalModel.findOneAndUpdate({ _id: id }, updateDoc, {
      new: true,
      session,
    });

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update rental!');
    }

    // update bike availability
    await BikeModel.findOneAndUpdate(
      { _id: rental.bikeId },
      { isAvailable: true },
      { session },
    );

    await session.commitTransaction();
    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || 'Something went wrong!',
    );
  } finally {
    await session.endSession();
  }
};

const getAllRentalsFromDb = async (
  decoded: JwtPayload,
  query: Record<string, unknown>,
  myRentals?: string,
) => {
  if (myRentals === 'true') {
    const { email, role } = decoded;
    const userInfo = await UserModel.findOne({ email, role });

    if (!userInfo) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized!');
    }
    query.userId = userInfo?._id;
  }
  const bikeQuery = new QueryBuilder(
    RentalModel.find()
      .select('-createdAt -updatedAt -__v')
      .populate('userId')
      .populate('bikeId'),
    query,
  )
    .search(BikeSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await bikeQuery.modelQuery;
  const meta = await bikeQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleRentalFromDb = async (id: string) => {
  const result = await RentalModel.findById(id)
    .select('-createdAt -updatedAt -__v')
    .populate('userId')
    .populate('bikeId');
  return result;
};

const makePayment = async (rentalId: string, paymentInfo: TPaymentInfo) => {
  const rental = await RentalModel.findById(rentalId);

  if (!rental) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid rental Id!');
  }

  // initiate payment
  if (paymentInfo.total_amount < 100) {
    const extraAmount = 100 - paymentInfo?.total_amount;
    const result = await RentalModel.findByIdAndUpdate(rentalId, {
      isPaid: true,
    });
    return {
      result,
      message: `Extra ৳${extraAmount} is refunded to your account. 😀`,
    };
  } else if (paymentInfo?.total_amount === 100) {
    const result = await RentalModel.findByIdAndUpdate(rentalId, {
      isPaid: true,
    });
    return {
      result,
      message: `Total cost and advance amount is equal! So, payment is done! 😀`,
    };
  } else {
    paymentInfo.success_url = `http://localhost:5000/api/rentals/payment-success/${rentalId}`;
    paymentInfo.fail_url = `http://localhost:5000/api/rentals/payment-fail`;
    const paymentInit = await initiatePayment(paymentInfo);
    if (!paymentInit?.url) {
      throw new AppError(httpStatus.BAD_GATEWAY, 'Payment initiation failed!');
    }

    return { result: rental, paymentInitUrl: paymentInit?.url };
  }
};

const paymentSuccess = async (transactionId: string, rentalId: string) => {
  const result = await RentalModel.findByIdAndUpdate(rentalId, {
    isPaid: true,
    transactionId,
  });
  return result;
};

const paymentFail = async (transactionId: string) => {
  const result = await RentalModel.findOneAndUpdate(
    {
      transactionId,
    },
    { isPaid: false, transactionId: null },
  );
  return result;
};

export const RentalServices = {
  createRentalIntoDb,
  returnBike,
  getAllRentalsFromDb,
  makeAdvancePaymentSuccess,
  makeAdvancePaymentFail,
  getSingleRentalFromDb,
  makePayment,
  paymentSuccess,
  paymentFail,
};
