/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken';
import { TRental } from './rental.interface';
import { RentalModel } from './rental.model';
import { UserModel } from '../auth/auth.model';
import mongoose, { Types } from 'mongoose';
import { BikeModel } from '../bike/bike.model';
import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import initiatePayment from '../payment/payment.utils';
import QueryBuilder from '../../builder/QueryBuilder';

export const BikeSearchableFields = ['name', 'brand', 'cc', 'price'];

const createRentalIntoDb = async (
  payload: TRental,
  decodedInfo: JwtPayload,
) => {
  initiatePayment();
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

    const result = await RentalModel.create([payload], { session });

    // await BikeModel.findOneAndUpdate(
    //   { _id: payload.bikeId },
    //   { isAvailable: false },
    //   { new: true, session },
    // );

    await session.commitTransaction();
    return result;
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

const returnBike = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // set return time
    const currentTime = new Date();
    const returnTime = currentTime.toISOString().split('.')[0] + 'Z';

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

    // calculate cost based on time
    const startTime = new Date(rental?.startTime) as any;
    const timeDifference = (new Date(returnTime) as any) - startTime;
    const totalHours = timeDifference / (1000 * 60 * 60);

    const totalCost = bike.pricePerHour * totalHours;
    const updateDoc = {
      isReturned: true,
      returnTime,
      totalCost: totalCost.toFixed(2),
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

export const RentalServices = {
  createRentalIntoDb,
  returnBike,
  getAllRentalsFromDb,
};
